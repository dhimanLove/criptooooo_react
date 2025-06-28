// crypto.js

// Example coin structure used in app (CryptoGrid, CoinCard, etc.)
export const defaultCryptoCurrency = {
  id: '',
  symbol: '',
  name: '',
  image: '',
  current_price: 0,
  market_cap: 0,
  market_cap_rank: 0,
  fully_diluted_valuation: null,
  total_volume: 0,
  high_24h: 0,
  low_24h: 0,
  price_change_24h: 0,
  price_change_percentage_24h: 0,
  market_cap_change_24h: 0,
  market_cap_change_percentage_24h: 0,
  circulating_supply: 0,
  total_supply: null,
  max_supply: null,
  ath: 0,
  ath_change_percentage: 0,
  ath_date: '',
  atl: 0,
  atl_change_percentage: 0,
  atl_date: '',
  roi: null, // or { times, currency, percentage }
  last_updated: '',
  sparkline_in_7d: {
    price: [],
  },
};

// Coin details for CoinDetailPage
export const defaultCoinDetail = {
  id: '',
  symbol: '',
  name: '',
  description: {
    en: '',
  },
  image: {
    thumb: '',
    small: '',
    large: '',
  },
  market_cap_rank: 0,
  market_data: {
    current_price: { usd: 0 },
    market_cap: { usd: 0 },
    total_volume: { usd: 0 },
    high_24h: { usd: 0 },
    low_24h: { usd: 0 },
    price_change_24h: 0,
    price_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: null,
    max_supply: null,
  },
  links: {
    homepage: [''],
    blockchain_site: [],
    official_forum_url: [],
    chat_url: [],
    announcement_url: [],
    twitter_screen_name: '',
    facebook_username: '',
    bitcointalk_thread_identifier: null,
    telegram_channel_identifier: '',
    subreddit_url: '',
    repos_url: {
      github: [],
      bitbucket: [],
    },
  },
};

// Cache Entry (for internal cache service)
export const createCacheEntry = (data, ttl) => ({
  data,
  timestamp: Date.now(),
  ttl,
});

// Sorting options used by dropdown and logic
export const SORT_OPTIONS = {
  MARKET_CAP: 'market_cap',
  PRICE: 'price',
  PRICE_CHANGE_24H: 'price_change_24h',
  VOLUME: 'volume',
};
