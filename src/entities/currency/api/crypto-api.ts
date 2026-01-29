import type { CryptoCurrency } from '@/shared';
import { API_CONFIG, ApiClient } from '@/shared';

interface CryptoPriceResponse {
  [key: string]: {
    usd: number;
  };
}

export const cryptoApi = {
  async getPopularCurrencies(): Promise<CryptoCurrency[]> {
    // CoinGecko ids for popular crypto
    const popularIds = [
      'bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano',
      'ripple', 'polkadot', 'dogecoin', 'matic-network', 'litecoin'
    ];
    
    const ids = popularIds.join(',');
    const data = await ApiClient.get<CryptoPriceResponse>(
      `${API_CONFIG.CRYPTO_API}?ids=${ids}&vs_currencies=usd`
    );
    
    return Object.entries(data)
      .map(([id, priceData]) => ({
        id,
        symbol: getCryptoSymbol(id),
        name: getCryptoName(id),
        price: priceData.usd,
      }));
  },
};

function getCryptoSymbol(id: string): string {
  const symbols: Record<string, string> = {
    bitcoin: 'BTC',
    ethereum: 'ETH',
    binancecoin: 'BNB',
    solana: 'SOL',
    cardano: 'ADA',
    ripple: 'XRP',
    polkadot: 'DOT',
    dogecoin: 'DOGE',
    'matic-network': 'MATIC',
    litecoin: 'LTC',
  };
  return symbols[id] || id.toUpperCase();
}

function getCryptoName(id: string): string {
  const names: Record<string, string> = {
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    binancecoin: 'Binance Coin',
    solana: 'Solana',
    cardano: 'Cardano',
    ripple: 'Ripple',
    polkadot: 'Polkadot',
    dogecoin: 'Dogecoin',
    'matic-network': 'Polygon',
    litecoin: 'Litecoin',
  };
  return names[id] || id;
}
