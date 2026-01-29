import { API_CONFIG, ApiClient } from '@/shared';

const CRYPTO_SYMBOL_TO_ID: Record<string, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  SOL: 'solana',
  ADA: 'cardano',
  XRP: 'ripple',
  DOT: 'polkadot',
  DOGE: 'dogecoin',
  MATIC: 'matic-network',
  LTC: 'litecoin',
};

function cryptoId(symbol: string): string {
  return CRYPTO_SYMBOL_TO_ID[symbol] ?? symbol.toLowerCase();
}

/** Fiat: ExchangeRate-API. Crypto: CoinGecko. All conversions via USD. */
export const conversionApi = {
  /** Fiat ↔ fiat via USD. */
  async convertFiat(from: string, to: string, amount: number): Promise<number> {
    const up = (s: string) => s.toUpperCase();
    if (up(from) === up(to)) return amount;
    const response = await ApiClient.get<{ rates: Record<string, number> }>(
      API_CONFIG.FIAT_API
    );
    const rates = response.rates ?? {};
    const fromRate = rates[from] ?? rates[up(from)] ?? 1;
    const toRate = rates[to] ?? rates[up(to)] ?? 1;
    const usdAmount = amount / fromRate;
    return usdAmount * toRate;
  },

  /** Crypto ↔ crypto via USD. */
  async convertCrypto(
    fromSymbol: string,
    toSymbol: string,
    amount: number
  ): Promise<number> {
    const fromId = cryptoId(fromSymbol);
    const toId = cryptoId(toSymbol);
    const ids = [fromId, toId].join(',');
    const response = await ApiClient.get<Record<string, { usd: number }>>(
      `${API_CONFIG.CRYPTO_API}?ids=${ids}&vs_currencies=usd`
    );
    const fromPrice = response[fromId]?.usd ?? 1;
    const toPrice = response[toId]?.usd ?? 1;
    const usdAmount = amount * fromPrice;
    return usdAmount / toPrice;
  },

  /** Fiat → USD → crypto. */
  async convertFiatToCrypto(
    fiatCode: string,
    cryptoCode: string,
    amount: number
  ): Promise<number> {
    const id = cryptoId(cryptoCode);
    const [usdAmount, priceRes] = await Promise.all([
      this.convertFiat(fiatCode, 'USD', amount),
      ApiClient.get<Record<string, { usd: number }>>(
        `${API_CONFIG.CRYPTO_API}?ids=${id}&vs_currencies=usd`
      ),
    ]);
    const priceUsd = priceRes[id]?.usd;
    if (priceUsd == null || priceUsd <= 0 || !Number.isFinite(priceUsd)) {
      throw new Error(`No price for ${cryptoCode}`);
    }
    return usdAmount / priceUsd;
  },

  /** Crypto → USD → fiat. Skip fiat API when target is USD. */
  async convertCryptoToFiat(
    cryptoCode: string,
    fiatCode: string,
    amount: number
  ): Promise<number> {
    const id = cryptoId(cryptoCode);
    const priceRes = await ApiClient.get<Record<string, { usd: number }>>(
      `${API_CONFIG.CRYPTO_API}?ids=${id}&vs_currencies=usd`
    );
    const priceUsd = priceRes[id]?.usd;
    if (priceUsd == null || priceUsd <= 0 || !Number.isFinite(priceUsd)) {
      throw new Error(`No price for ${cryptoCode}`);
    }
    const usdAmount = amount * priceUsd;
    if (fiatCode.toUpperCase() === 'USD') return usdAmount;
    return this.convertFiat('USD', fiatCode, usdAmount);
  },
};
