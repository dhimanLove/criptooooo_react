import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';
import { coinGeckoApi } from '../services/coinGeckoApi';
import { cacheService } from '../services/cacheService';
import { formatPrice, formatPercentage, formatMarketCap, formatVolume } from '../utils/formatters';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';

export const CoinDetailPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoinDetail = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const cacheKey = `coin:${id}`;
      const cached = cacheService.get(cacheKey);

      if (cached) {
        setCoin(cached);
        setLoading(false);
        return;
      }

      const data = await coinGeckoApi.getCoinById(id);
      setCoin(data);
      cacheService.set(cacheKey, data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch coin details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoinDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <LoadingSkeleton count={1} />
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>
          <ErrorMessage message={error || 'Coin not found'} onRetry={fetchCoinDetail} />
        </div>
      </div>
    );
  }

  const isPositive = coin.market_data.price_change_percentage_24h > 0;
  const changeColor = isPositive ? 'text-green-400' : 'text-red-400';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-4 mb-6">
            <img src={coin.image.large} alt={coin.name} className="w-16 h-16 rounded-full" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{coin.name}</h1>
              <p className="text-gray-400 uppercase text-lg">{coin.symbol}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-white mb-2">
                {formatPrice(coin.market_data.current_price.usd)}
              </div>
              <div className={`flex items-center justify-end space-x-1 ${changeColor}`}>
                <TrendIcon className="w-5 h-5" />
                <span className="text-lg font-medium">
                  {formatPercentage(coin.market_data.price_change_percentage_24h)}
                </span>
              </div>
            </div>
          </div>

          {coin.market_cap_rank && (
            <div className="text-sm text-gray-400 mb-4">
              Rank #{coin.market_cap_rank}
            </div>
          )}
        </div>

        {/* Market Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Market Cap</h3>
            <p className="text-white text-xl font-bold">
              {formatMarketCap(coin.market_data.market_cap.usd)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">24h Volume</h3>
            <p className="text-white text-xl font-bold">
              {formatVolume(coin.market_data.total_volume.usd)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">24h High</h3>
            <p className="text-white text-xl font-bold">
              {formatPrice(coin.market_data.high_24h.usd)}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">24h Low</h3>
            <p className="text-white text-xl font-bold">
              {formatPrice(coin.market_data.low_24h.usd)}
            </p>
          </div>
        </div>

        {/* Supply Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Circulating Supply</h3>
            <p className="text-white text-lg font-bold">
              {coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Supply</h3>
            <p className="text-white text-lg font-bold">
              {coin.market_data.total_supply
                ? `${coin.market_data.total_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`
                : 'N/A'}
            </p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Max Supply</h3>
            <p className="text-white text-lg font-bold">
              {coin.market_data.max_supply
                ? `${coin.market_data.max_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`
                : 'N/A'}
            </p>
          </div>
        </div>

        {/* Description */}
        {coin.description.en && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">About {coin.name}</h2>
            <div
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: coin.description.en.replace(/<a/g, '<a class="text-blue-400 hover:text-blue-300"')
              }}
            />
          </div>
        )}

        {/* Links */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coin.links.homepage[0] && (
              <a
                href={coin.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Official Website
              </a>
            )}
            {coin.links.twitter_screen_name && (
              <a
                href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors duration-200"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Twitter
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
