import { useState, useEffect, useCallback, useRef } from 'react';
import { Stock, mockStocks, marketIndices as mockIndices } from '@/data/stockData';

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface StockDataResponse {
  stocks: Stock[];
  indices: MarketIndex[];
  lastUpdated: string;
}

interface UseStockDataOptions {
  symbols?: string[];
  refreshInterval?: number;
  enabled?: boolean;
}

export const useStockData = (options: UseStockDataOptions = {}) => {
  const { 
    symbols, 
    refreshInterval = 30000,
    enabled = true 
  } = options;

  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [indices, setIndices] = useState<MarketIndex[]>(mockIndices);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStockData = useCallback(async () => {
    if (!enabled) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch from edge function
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      let url = `${supabaseUrl}/functions/v1/stock-data`;
      if (symbols && symbols.length > 0) {
        url += `?symbols=${symbols.join(',')}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data?.stocks?.length > 0) {
          setStocks(data.stocks);
          setIndices(data.indices || mockIndices);
          setLastUpdated(data.lastUpdated);
          setIsLive(data.source !== 'simulated');
        }
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stock data');
      setIsLive(false);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, symbols]);

  useEffect(() => {
    if (enabled) {
      fetchStockData();
    }
  }, [fetchStockData, enabled]);

  useEffect(() => {
    if (!enabled || refreshInterval <= 0) return;

    intervalRef.current = setInterval(() => {
      fetchStockData();
    }, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchStockData, refreshInterval, enabled]);

  const refresh = useCallback(() => {
    return fetchStockData();
  }, [fetchStockData]);

  const getStock = useCallback((symbol: string): Stock | undefined => {
    return stocks.find(s => s.symbol === symbol);
  }, [stocks]);

  return {
    stocks,
    indices,
    lastUpdated,
    isLoading,
    error,
    isLive,
    refresh,
    getStock,
  };
};

// Hook for single stock data
export const useSingleStock = (symbol: string) => {
  const { stocks, isLoading, error, isLive, refresh } = useStockData({
    symbols: [symbol],
    refreshInterval: 15000, // More frequent updates for single stock
  });

  const stock = stocks.find(s => s.symbol === symbol) || mockStocks.find(s => s.symbol === symbol);

  return {
    stock,
    isLoading,
    error,
    isLive,
    refresh,
  };
};
