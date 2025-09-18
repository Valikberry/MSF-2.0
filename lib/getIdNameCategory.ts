import { google } from 'googleapis';


async function getAuthClient() {
    const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_ENCODED!;
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const credentials = JSON.parse(decoded);
    credentials.private_key = credentials.private_key.replace(/\\n/g, '\n');

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    return await auth.getClient();
}


class SheetCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes in milliseconds

  constructor() {
    // Clear cache on page reload/beforeunload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.clearAll();
      });

      // Also clear on page visibility change (when tab becomes hidden)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.clearExpired();
        }
      });

      // Periodic cleanup every 2 minutes
      setInterval(() => {
        this.clearExpired();
      }, 2 * 60 * 1000);
    }
  }

  set<T>(key: string, data: T): void {
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expires: now + this.CACHE_DURATION
    };
    
    this.cache.set(key, entry);
    console.log(`📦 Cached data for key: ${key} (expires in ${Math.round(this.CACHE_DURATION / 60000)} minutes)`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    
    if (now > entry.expires) {
      console.log(`⏰ Cache expired for key: ${key}`);
      this.cache.delete(key);
      return null;
    }

    const remainingTime = Math.round((entry.expires - now) / 60000);
    console.log(`✅ Cache hit for key: ${key} (expires in ${remainingTime} minutes)`);
    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
    console.log(`🗑️ Deleted cache for key: ${key}`);
  }

  clearExpired(): void {
    const now = Date.now();
    let expiredCount = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
        expiredCount++;
      }
    }
    
    if (expiredCount > 0) {
      console.log(`🧹 Cleared ${expiredCount} expired cache entries`);
    }
  }

  clearAll(): void {
    const count = this.cache.size;
    this.cache.clear();
    console.log(`🧹 Cleared all cache entries (${count} items)`);
  }

  getStats(): { size: number; entries: Array<{ key: string; age: number; remaining: number }> } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      age: Math.round((now - entry.timestamp) / 60000),
      remaining: Math.round((entry.expires - now) / 60000)
    }));

    return {
      size: this.cache.size,
      entries
    };
  }
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires: number;
}

// Global cache instance
const sheetNamesCache = new SheetCache();

// Helper function to generate cache keys for sheet names
function getSheetNamesCacheKey(spreadsheetId: string, range?: string): string {
  return `sheetNames:${spreadsheetId}:${range || 'cities!F2:G'}`;
}

// Enhanced function with caching
export async function getSheetNamesWithJ2Values(spreadsheetId: string): Promise<Array<{ id: string; name: string }>> {
  const cacheKey = getSheetNamesCacheKey(spreadsheetId);
  
  // Check cache first
  const cachedData = sheetNamesCache.get<Array<{ id: string; name: string }>>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  console.log(`🌐 Fetching fresh sheet names data for spreadsheet: ${spreadsheetId}`);

  try {
    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });

    // Verify spreadsheet exists
    await sheets.spreadsheets.get({ 
      spreadsheetId, 
      fields: 'sheets.properties.title' 
    });

    // Get the actual data
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'cities!F2:G',
    });

    const rows = res.data.values || [];
    const formatted = rows.map(([id, name]) => ({ 
      id: id || '', 
      name: name || '' 
    }));

    // Cache the result
    sheetNamesCache.set(cacheKey, formatted);

    console.log(`📊 Fetched ${formatted.length} sheet names and cached successfully`);
    return formatted;

  } catch (error) {
    console.error(`❌ Error fetching sheet names for spreadsheet ${spreadsheetId}:`, error);
    throw new Error(`Failed to fetch sheet names: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Enhanced version with custom range support
export async function getSheetNamesWithJ2ValuesCustomRange(
  spreadsheetId: string, 
  range: string = 'cities!F2:G'
): Promise<Array<{ id: string; name: string }>> {
  const cacheKey = getSheetNamesCacheKey(spreadsheetId, range);
  
  // Check cache first
  const cachedData = sheetNamesCache.get<Array<{ id: string; name: string }>>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  console.log(`🌐 Fetching fresh sheet names data for range: ${range} in spreadsheet: ${spreadsheetId}`);

  try {
    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient as any });

    // Verify spreadsheet exists
    await sheets.spreadsheets.get({ 
      spreadsheetId, 
      fields: 'sheets.properties.title' 
    });

    // Get the actual data
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = res.data.values || [];
    const formatted = rows.map(([id, name]) => ({ 
      id: id || '', 
      name: name || '' 
    }));

    // Cache the result
    sheetNamesCache.set(cacheKey, formatted);

    console.log(`📊 Fetched ${formatted.length} sheet names from range ${range} and cached successfully`);
    return formatted;

  } catch (error) {
    console.error(`❌ Error fetching sheet names for range ${range} in spreadsheet ${spreadsheetId}:`, error);
    throw new Error(`Failed to fetch sheet names from range ${range}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Batch function to get sheet names from multiple spreadsheets
export async function getBatchSheetNamesWithJ2Values(
  spreadsheetConfigs: Array<{ spreadsheetId: string; range?: string }>
): Promise<Record<string, Array<{ id: string; name: string }>>> {
  if (!Array.isArray(spreadsheetConfigs) || spreadsheetConfigs.length === 0) {
    return {};
  }

  const results: Record<string, Array<{ id: string; name: string }>> = {};
  const uncachedConfigs: Array<{ spreadsheetId: string; range?: string; cacheKey: string }> = [];

  // Check cache for each config
  for (const config of spreadsheetConfigs) {
    const cacheKey = getSheetNamesCacheKey(config.spreadsheetId, config.range);
    const cachedData = sheetNamesCache.get<Array<{ id: string; name: string }>>(cacheKey);
    
    if (cachedData) {
      results[config.spreadsheetId] = cachedData;
    } else {
      uncachedConfigs.push({ ...config, cacheKey });
    }
  }

  // Only fetch uncached data
  if (uncachedConfigs.length > 0) {
    console.log(`🔄 Fetching ${uncachedConfigs.length} uncached spreadsheets out of ${spreadsheetConfigs.length} total`);
    
    const fetchResults = await Promise.allSettled(
      uncachedConfigs.map(async (config): Promise<[string, Array<{ id: string; name: string }>]> => {
        try {
          const data = await getSheetNamesWithJ2ValuesCustomRange(config.spreadsheetId, config.range);
          return [config.spreadsheetId, data];
        } catch (error) {
          console.error(`Failed to fetch sheet names for spreadsheet "${config.spreadsheetId}":`, error);
          return [config.spreadsheetId, []];
        }
      })
    );

    // Process results
    fetchResults.forEach((result, index) => {
      const config = uncachedConfigs[index];
      
      if (result.status === 'fulfilled') {
        const [spreadsheetId, data] = result.value;
        results[spreadsheetId] = data;
      } else {
        console.error(`Promise rejected for spreadsheet "${config.spreadsheetId}":`, result.reason);
        results[config.spreadsheetId] = [];
      }
    });
  }

  return results;
}

// Export cache utilities for sheet names
export const sheetNamesCacheUtils = {
  // Clear all cached data
  clearAll: () => sheetNamesCache.clearAll(),
  
  // Clear expired entries
  clearExpired: () => sheetNamesCache.clearExpired(),
  
  // Clear specific spreadsheet data
  clearSpreadsheet: (spreadsheetId: string, range?: string) => {
    const key = getSheetNamesCacheKey(spreadsheetId, range);
    sheetNamesCache.delete(key);
  },
  
  // Get cache statistics
  getStats: () => sheetNamesCache.getStats(),
  
  // Check if spreadsheet data is cached
  isSpreadsheetCached: (spreadsheetId: string, range?: string) => {
    const key = getSheetNamesCacheKey(spreadsheetId, range);
    return sheetNamesCache.has(key);
  },

  // Preload spreadsheet data (useful for critical data)
  preload: async (spreadsheetId: string, range?: string) => {
    const key = getSheetNamesCacheKey(spreadsheetId, range);
    if (!sheetNamesCache.has(key)) {
      console.log(`🚀 Preloading sheet names for spreadsheet: ${spreadsheetId}`);
      return await getSheetNamesWithJ2ValuesCustomRange(spreadsheetId, range);
    }
    return sheetNamesCache.get<Array<{ id: string; name: string }>>(key);
  }
};


