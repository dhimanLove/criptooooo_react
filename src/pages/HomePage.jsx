import React, { useState } from 'react';
import { Header } from '../components/Header';
import { CryptoGrid } from '../components/CryptoGrid';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { useCryptoData } from '../hooks/useCryptoData';

export const HomePage = () => {
  const [currentSort, setCurrentSort] = useState('market_cap');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    coins,
    loading,
    error,
    refreshData,
    searchCoins,
    sortCoins,
    clearSearch
  } = useCryptoData();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSortChange = (option) => {
    setCurrentSort(option);
    sortCoins(option);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header
          onSearch={searchCoins}
          onClearSearch={clearSearch}
          onSortChange={handleSortChange}
          onRefresh={handleRefresh}
          currentSort={currentSort}
          isRefreshing={isRefreshing}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header
          onSearch={searchCoins}
          onClearSearch={clearSearch}
          onSortChange={handleSortChange}
          onRefresh={handleRefresh}
          currentSort={currentSort}
          isRefreshing={isRefreshing}
        />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorMessage message={error} onRetry={refreshData} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        onSearch={searchCoins}
        onClearSearch={clearSearch}
        onSortChange={handleSortChange}
        onRefresh={handleRefresh}
        currentSort={currentSort}
        isRefreshing={isRefreshing}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CryptoGrid coins={coins} />
      </main>
    </div>
  );
};
