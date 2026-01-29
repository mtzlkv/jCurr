export interface FiatCurrency {
  code: string;
  name: string;
  rate: number;
}

export interface CryptoCurrency {
  id: string;
  symbol: string;
  name: string;
  price: number;
}

export interface Currency {
  code: string;
  name: string;
  type: 'fiat' | 'crypto';
}
