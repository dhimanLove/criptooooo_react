import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { FilterDropdown } from './FilterDropdown';

export const Header = ({
  onSearch,
  onClearSearch,
  onSortChange,
  onRefresh,
  currentSort,
  isRefreshing = false
}) => {
  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-4 py-6">
          {/* Title Row */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">
                Crypto Dashboard
              </h1>
            </Link>

            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 max-w-md">
              <SearchBar
                onSearch={onSearch}
                onClear={onClearSearch}
                placeholder="Search cryptocurrencies..."
              />
            </div>

            <FilterDropdown
              onSortChange={onSortChange}
              currentSort={currentSort}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
