import type { FiatCurrency } from '@/shared';
import { API_CONFIG, ApiClient } from '@/shared';

interface ExchangeRateResponse {
  rates: Record<string, number>;
  base: string;
}

export const fiatApi = {
  async getPopularCurrencies(): Promise<FiatCurrency[]> {
    const data = await ApiClient.get<ExchangeRateResponse>(API_CONFIG.FIAT_API);
    // top fiats + RSD
    const popularCodes = [
      'USD', 'EUR', 'JPY', 'GBP', 'CNY', 'AUD', 'CAD', 'CHF', 'HKD', 'NZD',
      'SEK', 'KRW', 'SGD', 'NOK', 'MXN', 'INR', 'RUB', 'ZAR', 'TRY', 'BRL',
      'DKK', 'PLN', 'TWD', 'THB', 'MYR', 'IDR', 'CZK', 'HUF', 'ILS', 'CLP',
      'RSD'
    ];
    
    return popularCodes
      .filter(code => data.rates[code])
      .map(code => ({
        code,
        name: getCurrencyName(code),
        rate: data.rates[code],
      }));
  },
};

function getCurrencyName(code: string): string {
  const names: Record<string, string> = {
    USD: 'US Dollar',
    EUR: 'Euro',
    JPY: 'Japanese Yen',
    GBP: 'British Pound',
    CNY: 'Chinese Yuan',
    AUD: 'Australian Dollar',
    CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc',
    HKD: 'Hong Kong Dollar',
    NZD: 'New Zealand Dollar',
    SEK: 'Swedish Krona',
    KRW: 'South Korean Won',
    SGD: 'Singapore Dollar',
    NOK: 'Norwegian Krone',
    MXN: 'Mexican Peso',
    INR: 'Indian Rupee',
    RUB: 'Russian Ruble',
    ZAR: 'South African Rand',
    TRY: 'Turkish Lira',
    BRL: 'Brazilian Real',
    DKK: 'Danish Krone',
    PLN: 'Polish Zloty',
    TWD: 'Taiwan Dollar',
    THB: 'Thai Baht',
    MYR: 'Malaysian Ringgit',
    IDR: 'Indonesian Rupiah',
    CZK: 'Czech Koruna',
    HUF: 'Hungarian Forint',
    ILS: 'Israeli Shekel',
    CLP: 'Chilean Peso',
    RSD: 'Serbian Dinar',
  };
  return names[code] || code;
}
