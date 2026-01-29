import type { Currency } from '@/shared';

export interface CurrencyState {
  currencies: Currency[];
  loading: boolean;
  error: string | null;
  selectedType: 'fiat' | 'crypto';
}
