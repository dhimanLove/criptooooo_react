const BASE_URL = 'https://api.coingecko.com/api/v3';
const API_KEY = 'CG-FNgdqY3y5usQ7mxvTrcXviM5';

class CoinGeckoApi {
  async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const headers = API_KEY
          ? { headers: { 'x-cg-pro-api-key': API_KEY } }
          : {};

        const response = await fetch(url, headers);

        if (response.ok) {
          return response;
        }

        if (response.status === 429) {
          // Rate limit hit, wait and retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        if (i === retries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }

    throw new Error('Max retries exceeded');
  }

  async getCoins() {
    const url = `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h`;
    const response = await this.fetchWithRetry(url);
    return response.json();
  }

  async getCoinById(id) {
    const url = `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    const response = await this.fetchWithRetry(url);
    return response.json();
  }

  async searchCoins(query) {
    const url = `${BASE_URL}/search?query=${encodeURIComponent(query)}`;
    const response = await this.fetchWithRetry(url);
    const searchResults = await response.json();

    if (searchResults.coins && searchResults.coins.length > 0) {
      const coinIds = searchResults.coins
        .slice(0, 10)
        .map(coin => coin.id)
        .join(',');

      const detailUrl = `${BASE_URL}/coins/markets?vs_currency=usd&ids=${coinIds}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`;
      const detailResponse = await this.fetchWithRetry(detailUrl);
      return detailResponse.json();
    }

    return [];
  }
}

export const coinGeckoApi = new CoinGeckoApi();
