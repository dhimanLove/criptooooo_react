import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPrice, formatPercentage, formatMarketCap, formatVolume } from '../utils/formatters';
import { Sparkline } from './Sparkline';

export const CryptoCard = ({ coin }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isPositive = coin.price_change_percentage_24h > 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const changeIcon = isPositive ? TrendingUp : TrendingDown;
  const ChangeTrendIcon = changeIcon;

  return (
    <Link
      to={`/coin/${coin.id}`}
      className="block bg-gray-800 rounded-xl p-4 hover:bg-gray-750 transition-all duration-200 hover:scale-105 hover:shadow-lg border border-gray-700 hover:border-gray-600"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-700">
          {!imageError && (
            <img
              src={coin.image}
              alt={coin.name}
              className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          )}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gray-600 animate-pulse rounded-full" />
          )}
          {imageError && (
            <div className="absolute inset-0 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-300">
                {coin.symbol.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{coin.name}</h3>
          <p className="text-sm text-gray-400 uppercase">{coin.symbol}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-500">#{coin.market_cap_rank}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-white">
            {formatPrice(coin.current_price)}
          </span>
          <div className={`flex items-center space-x-1 ${changeColor}`}>
            <ChangeTrendIcon className="w-4 h-4" />
            <span className="text-sm font-medium">
              {formatPercentage(coin.price_change_percentage_24h)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-400">Market Cap</span>
            <p className="text-white font-medium">
              {formatMarketCap(coin.market_cap)}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Volume</span>
            <p className="text-white font-medium">
              {formatVolume(coin.total_volume)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">7d Chart</span>
          </div>
          <Sparkline
            data={coin.sparkline_in_7d?.price || []}
            color={isPositive ? '#10B981' : '#EF4444'}
          />
        </div>
      </div>
    </Link>
  );
};
