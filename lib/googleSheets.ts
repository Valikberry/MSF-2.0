// Types
interface GoogleSheetCell {
  v: string | number | null;
}

interface GoogleSheetRow {
  c: Array<GoogleSheetCell | null>;
}

interface GoogleSheetResponse {
  table: {
    rows: GoogleSheetRow[];
  };
}

interface CategoryData {
  allTitle: string | number | null;
  allDescription: string | number | null;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expires: number;
}

// Cache management
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

// Global cache instance
const sheetCache = new SheetCache();

// Helper function to generate cache keys
function getCacheKey(sheetName: string, spreadsheetId?: string, operation?: string): string {
  const id = spreadsheetId || process.env.NEXT_PUBLIC_GOOGLESHEETS_ID || 'default';
  return `${operation || 'sheet'}:${id}:${sheetName}`;
}

// Core function to fetch raw sheet data with caching
async function fetchGoogleSheetRaw(
  sheetName: string, 
  spreadsheetId?: string
): Promise<(string | number | null)[][]> {
  // Check cache first
  const cacheKey = getCacheKey(sheetName, spreadsheetId, 'raw');
  const cachedData = sheetCache.get<(string | number | null)[][]>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  const sheetId = spreadsheetId || process.env.NEXT_PUBLIC_GOOGLESHEETS_ID;
  if (!sheetId) {
    throw new Error('Spreadsheet ID not configured');
  }

  if (!sheetName?.trim()) {
    throw new Error('Sheet name is required');
  }

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  try {
    console.log(`🌐 Fetching fresh data for sheet: ${sheetName}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json, text/plain, */*'
      }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: Sheet "${sheetName}" not found or inaccessible`);
    }

    const text = await res.text();

    if (!text.startsWith('/*O_o*/')) {
      throw new Error(`Invalid response format for sheet "${sheetName}"`);
    }

    const jsonText = text.substring(47, text.length - 2);
    let json: GoogleSheetResponse;
    
    try {
      json = JSON.parse(jsonText);
    } catch (parseError) {
      throw new Error(`Failed to parse response for sheet "${sheetName}"`);
    }

    if (!json?.table?.rows) {
      throw new Error(`Invalid data structure for sheet "${sheetName}"`);
    }

    const rows = json.table.rows.map(row => 
      row?.c?.map(cell => cell?.v ?? null) ?? []
    );

    if (rows.length === 0) {
      throw new Error(`Sheet "${sheetName}" is empty`);
    }

    // Cache the result
    sheetCache.set(cacheKey, rows);

    return rows;

  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout while fetching sheet "${sheetName}"`);
    }
    
    console.error(`Error fetching sheet "${sheetName}":`, error);
    throw error instanceof Error ? error : new Error(`Failed to fetch sheet "${sheetName}"`);
  }
}

// Validate sheet name matches expected
function validateSheetName(
  rows: (string | number | null)[][],
  expectedName: string,
  namePosition: { row: number; col: number }
): boolean {
  const actualName = rows[namePosition.row]?.[namePosition.col];
  
  if (actualName !== expectedName) {
    console.warn(`Sheet name mismatch. Expected: "${expectedName}", Got: "${actualName}"`);
    return false;
  }
  
  return true;
}

// Clean product data by removing first 5 columns
export function cleanProductData(data: (string | number | null)[][]): (string | number | null)[][] {
  return data.map(row => row.slice(5));
}

// Filter out header rows
function filterHeaderRows(rows: (string | number | null)[][]): (string | number | null)[][] {
  return rows.filter((row, index) => {
    if (index === 0 && (row[0] === "Image" || row[0] === "Id category")) {
      return false;
    }
    return true;
  });
}

// Main function to get Google Sheet data with validation and caching
export async function getGoogleSheetData(sheetName: string): Promise<(string | number | null)[][] | null> {
  const cacheKey = getCacheKey(sheetName, undefined, 'processed');
  const cachedData = sheetCache.get<(string | number | null)[][] | null>(cacheKey);
  
  if (cachedData !== null) {
    return cachedData;
  }

  try {
    const rawRows = await fetchGoogleSheetRaw(sheetName);
    const cleanedRows = cleanProductData(rawRows);
    
    // Validate sheet name (position: first row, second-to-last column)
    const namePosition = { row: 0, col: rawRows[0].length - 2 };
    const isValid = validateSheetName(rawRows, sheetName, namePosition);
    
    const result = isValid ? cleanedRows : null;
    
    // Cache the processed result
    sheetCache.set(cacheKey, result);
    
    return result;

  } catch (error) {
    console.error(`Error in getGoogleSheetData for "${sheetName}":`, error);
    throw new Error('Error receiving data');
  }
}

// Get category data with specific processing and caching
export async function getAllCategoriesDataById(
  sheetName: string, 
  spreadsheetId: string
): Promise<CategoryData | null> {
  const cacheKey = getCacheKey(sheetName, spreadsheetId, 'category');
  const cachedData = sheetCache.get<CategoryData | null>(cacheKey);
  
  if (cachedData !== null) {
    return cachedData;
  }
  
  try {
    const rawRows = await fetchGoogleSheetRaw(sheetName, spreadsheetId);
    const cleanedRows = cleanProductData(rawRows);
    
    if (cleanedRows.length < 2) {
      throw new Error(`Sheet "${sheetName}" doesn't have enough data`);
    }

    // Validate sheet name (position: second row, second-to-last column of cleaned data)
    const namePosition = { row: 1, col: cleanedRows[0].length - 2 };
    const isValid = validateSheetName(cleanedRows, sheetName, namePosition);
    
    if (!isValid) {
      console.warn(`⚠️ Sheet name validation failed for "${sheetName}"`);
      console.warn(`   Expected: "${sheetName}"`);
      console.warn(`   Found: "${cleanedRows[namePosition.row]?.[namePosition.col]}"`);
      sheetCache.set(cacheKey, null);
      return null;
    }

    const filteredRows = filterHeaderRows(cleanedRows);
    
    if (filteredRows.length === 0) {
      throw new Error(`No data rows found in sheet "${sheetName}"`);
    }

    const firstDataRow = filteredRows[0];
    const result: CategoryData = {
      allTitle: firstDataRow[firstDataRow.length - 4] ?? null,
      allDescription: firstDataRow[firstDataRow.length - 3] ?? null
    };

    // Cache the result
    sheetCache.set(cacheKey, result);

    return result;

  } catch (error) {
    console.error(`❌ Error in getAllCategoriesDataById for "${sheetName}":`, error);
    throw new Error('Error receiving data');
  }
}

// Batch fetch multiple sheets with intelligent caching
export async function getAllSheetsByName(
  sheetIds: string[]
): Promise<Record<string, (string | number | null)[][]>> {
  if (!Array.isArray(sheetIds) || sheetIds.length === 0) {
    return {};
  }

  const allData: Record<string, (string | number | null)[][]> = {};
  const uncachedSheetIds: string[] = [];

  // Check cache for each sheet first
  for (const sheetId of sheetIds) {
    const cacheKey = getCacheKey(sheetId, undefined, 'batch');
    const cachedData = sheetCache.get<(string | number | null)[][]>(cacheKey);
    
    if (cachedData) {
      allData[sheetId] = cachedData;
    } else {
      uncachedSheetIds.push(sheetId);
    }
  }

  // Only fetch uncached sheets
  if (uncachedSheetIds.length > 0) {
    console.log(`🔄 Fetching ${uncachedSheetIds.length} uncached sheets out of ${sheetIds.length} total`);
    
    const results = await Promise.allSettled(
      uncachedSheetIds.map(async (sheetId): Promise<[string, (string | number | null)[][]]> => {
        try {
          const rows = await getGoogleSheetData(sheetId);
          
          if (!rows) {
            return [sheetId, []];
          }
          const filteredRows = filterHeaderRows(rows);
          
          // Cache the batch result
          const cacheKey = getCacheKey(sheetId, undefined, 'batch');
          sheetCache.set(cacheKey, filteredRows);
          
          return [sheetId, filteredRows];

        } catch (error) {
          console.error(`Failed to fetch sheet "${sheetId}":`, error);
          return [sheetId, []];
        }
      })
    );

    // Process results and handle any rejections
    results.forEach((result, index) => {
      const sheetId = uncachedSheetIds[index];
      
      if (result.status === 'fulfilled') {
        const [id, data] = result.value;
        allData[id] = data;
      } else {
        console.error(`Promise rejected for sheet "${sheetId}":`, result.reason);
        allData[sheetId] = [];
      }
    });
  }

  return allData;
}

// Utility function to get multiple category data with caching
export async function getMultipleCategoriesData(
  sheetNames: string[],
  spreadsheetId: string
): Promise<Record<string, CategoryData | null>> {
  const categoryData: Record<string, CategoryData | null> = {};
  const uncachedSheetNames: string[] = [];

  // Check cache first
  for (const sheetName of sheetNames) {
    const cacheKey = getCacheKey(sheetName, spreadsheetId, 'multi-category');
    const cachedData = sheetCache.get<CategoryData | null>(cacheKey);
    
    if (cachedData !== undefined) {
      categoryData[sheetName] = cachedData;
    } else {
      uncachedSheetNames.push(sheetName);
    }
  }

  // Only fetch uncached data
  if (uncachedSheetNames.length > 0) {
    const results = await Promise.allSettled(
      uncachedSheetNames.map(async (sheetName): Promise<[string, CategoryData | null]> => {
        try {
          const data = await getAllCategoriesDataById(sheetName, spreadsheetId);
          const cacheKey = getCacheKey(sheetName, spreadsheetId, 'multi-category');
          sheetCache.set(cacheKey, data);
          return [sheetName, data];
        } catch (error) {
          console.error(`Failed to fetch category data for "${sheetName}":`, error);
          const cacheKey = getCacheKey(sheetName, spreadsheetId, 'multi-category');
          sheetCache.set(cacheKey, null);
          return [sheetName, null];
        }
      })
    );

    results.forEach((result, index) => {
      const sheetName = uncachedSheetNames[index];
      
      if (result.status === 'fulfilled') {
        const [name, data] = result.value;
        categoryData[name] = data;
      } else {
        categoryData[sheetName] = null;
      }
    });
  }

  return categoryData;
}

// Enhanced product sheets fetching with caching
export async function getAllProductSheetsByName(
  sheetIds: string[],
  spreadsheetId: string
): Promise<Record<string, (string | number | null)[][]>> {
  if (!Array.isArray(sheetIds) || sheetIds.length === 0) {
    return {};
  }

  const allData: Record<string, (string | number | null)[][]> = {};
  const uncachedSheetIds: string[] = [];

  // Check cache first
  for (const sheetId of sheetIds) {
    const cacheKey = getCacheKey(sheetId, spreadsheetId, 'product');
    const cachedData = sheetCache.get<(string | number | null)[][]>(cacheKey);
    
    if (cachedData) {
      allData[sheetId] = cachedData;
    } else {
      uncachedSheetIds.push(sheetId);
    }
  }

  // Only fetch uncached sheets
  if (uncachedSheetIds.length > 0) {
    const results = await Promise.allSettled(
      uncachedSheetIds.map(async (sheetId): Promise<[string, (string | number | null)[][]]> => {
        try {
          const rawRows = await fetchGoogleSheetRaw(sheetId, spreadsheetId);
          const cleanedRows = cleanProductData(rawRows);
          
          // Validate sheet name
          const namePosition = { row: 0, col: rawRows[0].length - 2 };
          const isValid = validateSheetName(rawRows, sheetId, namePosition);
          
          if (!isValid) {
            return [sheetId, []];
          }

          const filteredRows = filterHeaderRows(cleanedRows);
          
          // Cache the result
          const cacheKey = getCacheKey(sheetId, spreadsheetId, 'product');
          sheetCache.set(cacheKey, filteredRows);
          
          return [sheetId, filteredRows];

        } catch (error) {
          console.error(`Failed to fetch sheet "${sheetId}":`, error);
          return [sheetId, []];
        }
      })
    );

    results.forEach((result, index) => {
      const sheetId = uncachedSheetIds[index];
      
      if (result.status === 'fulfilled') {
        const [id, data] = result.value;
        allData[id] = data;
      } else {
        console.error(`Promise rejected for sheet "${sheetId}":`, result.reason);
        allData[sheetId] = [];
      }
    });
  }

  return allData;
}

// Export cache utilities for manual management
export const cacheUtils = {
  // Clear all cached data
  clearAll: () => sheetCache.clearAll(),
  
  // Clear expired entries
  clearExpired: () => sheetCache.clearExpired(),
  
  // Clear specific sheet data
  clearSheet: (sheetName: string, spreadsheetId?: string) => {
    const operations = ['raw', 'processed', 'category', 'batch', 'multi-category', 'product'];
    operations.forEach(op => {
      const key = getCacheKey(sheetName, spreadsheetId, op);
      sheetCache.delete(key);
    });
  },
  
  // Get cache statistics
  getStats: () => sheetCache.getStats(),
  
  // Check if sheet is cached
  isSheetCached: (sheetName: string, spreadsheetId?: string, operation = 'processed') => {
    const key = getCacheKey(sheetName, spreadsheetId, operation);
    return sheetCache.has(key);
  }
};