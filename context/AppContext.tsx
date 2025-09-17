// context/AppContext.tsx
"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Types
interface Sheet {
  id: string;
  name: string;
}

interface AppContextType {
  // Community sheets (backward compatibility)
  sheets: Sheet[];
  communitySheets: Sheet[];
  

  
  // Loading states
  loading: {
    community: boolean;
    products: boolean;
  };
  
  // Error states
  errors: {
    community: string | null;
    products: string | null;
  };
  
  // Methods
  refreshSheets: (type?: 'community' | 'all') => Promise<void>;
  
  // Utility methods
  isLoading: boolean;
  hasErrors: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [communitySheets, setCommunitySheets] = useState<Sheet[]>([]);
  const [loading, setLoading] = useState({
    community: true,
    products: true,
  });
  const [errors, setErrors] = useState({
    community: null as string | null,
    products: null as string | null,
  });

  const fetchCommunitySheets = async () => {
    try {
      setLoading(prev => ({ ...prev, community: true }));
      setErrors(prev => ({ ...prev, community: null }));
      
      const res = await fetch("/api/sheet-names?type=community");
      if (!res.ok) {
        throw new Error(`Failed to fetch community sheets: ${res.status}`);
      }
      
      const data = await res.json();
      setCommunitySheets(data.sheets || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load community sheets";
      setErrors(prev => ({ ...prev, community: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, community: false }));
    }
  };



  const refreshSheets = async (type: 'community' | 'all' = 'all') => {
    const promises = [];
    
    if (type === 'community' || type === 'all') {
      promises.push(fetchCommunitySheets());
    }
   
    
    await Promise.allSettled(promises);
  };

  // Initial fetch on mount
  useEffect(() => {
    console.log("AppProvider: Initial data fetch");
    refreshSheets('all');
  }, []);

  const contextValue: AppContextType = {
    // Backward compatibility - sheets points to community sheets
    sheets: communitySheets,
    communitySheets,
    loading,
    errors,
    refreshSheets,
    
    // Utility computed values
    isLoading: loading.community || loading.products,
    hasErrors: Boolean(errors.community || errors.products),
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Main hook - throws error if used outside provider
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

// Backward compatibility - keeps your existing useSheets hook working
export function useSheets() {
  const { sheets, loading, errors } = useAppContext();
  return { 
    sheets,
    loading: loading.community,
    error: errors.community
  };
}

// Specific hooks for better organization
export function useCommunitySheets() {
  const { communitySheets, loading, errors, refreshSheets } = useAppContext();
  return {
    sheets: communitySheets,
    loading: loading.community,
    error: errors.community,
    refresh: () => refreshSheets('community'),
  };
}



// Hook for getting both types
export function useAllSheets() {
  const { communitySheets, loading, errors, refreshSheets, isLoading, hasErrors } = useAppContext();
  return {
    communitySheets,
    loading,
    errors,
    isLoading,
    hasErrors,
    refresh: refreshSheets,
  };
}