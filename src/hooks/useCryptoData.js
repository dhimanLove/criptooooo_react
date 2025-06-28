import { useState, useEffect, useCallback } from 'react';
import { coinGeckoApi } from '../services/coinGeckoApi';
import { cacheService } from '../services/cacheService';

export const useCryptoData = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchCoins = useCallback(async () => {
    try {
      setError(null);

      const cached = cacheService.get('coins');
      if (cached) {
        setCoins(cached);
        setLoading(false);
        return;
      }

      const data = await coinGeckoApi.getCoins();
      setCoins(data);
      cacheService.set('coins', data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cryptocurrency data');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    cacheService.delete('coins');
    await fetchCoins();
  }, [fetchCoins]);

  const searchCoins = useCallback(async (query) => {
    if (!query.trim()) {
      clearSearch();
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      const cacheKey = `search:${query}`;
      const cached = cacheService.get(cacheKey);

      if (cached) {
        setCoins(cached);
        return;
      }

      const results = await coinGeckoApi.searchCoins(query);
      setCoins(results);
      cacheService.set(cacheKey, results, 2 * 60 * 1000); // 2 minutes cache
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search cryptocurrencies');
    } finally {
      setIsSearching(false);
    }
  }, []);

  const sortCoins = useCallback((option) => {
    setCoins((prev) => {
      const sorted = [...prev].sort((a, b) => {
        switch (option) {
          case 'market_cap':
            return b.market_cap - a.market_cap;
          case 'price':
            return b.current_price - a.current_price;
          case 'price_change_24h':
            return b.price_change_percentage_24h - a.price_change_percentage_24h;
          case 'volume':
            return b.total_volume - a.total_volume;
          default:
            return 0;
        }
      });
      return sorted;
    });
  }, []);

  const clearSearch = useCallback(() => {
    setIsSearching(false);
    const cached = cacheService.get('coins');
    if (cached) {
      setCoins(cached);
    } else {
      fetchCoins();
    }
  }, [fetchCoins]);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSearching) {
        refreshData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshData, isSearching]);

  return {
    coins,
    loading,
    error,
    refreshData,
    searchCoins,
    sortCoins,
    clearSearch
  };
};
