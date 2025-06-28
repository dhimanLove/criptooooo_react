import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const sortOptions = [
  { value: 'market_cap', label: 'Market Cap' },
  { value: 'price', label: 'Price' },
  { value: 'price_change_24h', label: '24h Change' },
  { value: 'volume', label: 'Volume' },
];

export const FilterDropdown = ({ onSortChange, currentSort }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortSelect = (option) => {
    onSortChange(option);
    setIsOpen(false);
  };

  const currentLabel = sortOptions.find(option => option.value === currentSort)?.label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors duration-200 min-w-[140px]"
      >
        <span className="flex-1 text-left">Sort by: {currentLabel}</span>
        <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
            >
              <span className="text-white">{option.label}</span>
              {currentSort === option.value && (
                <Check className="w-4 h-4 text-blue-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
