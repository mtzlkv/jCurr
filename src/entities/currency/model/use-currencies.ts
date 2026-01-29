import type { Currency } from '@/shared';
import { useEffect, useState } from 'react';
import { cryptoApi } from '../api/crypto-api';
import { fiatApi } from '../api/fiat-api';
import type { CurrencyState } from './types';

export function useCurrencies() {
  const [state, setState] = useState<CurrencyState>({
    currencies: [],
    loading: false,
    error: null,
    selectedType: 'fiat',
  });

  const loadFiatCurrencies = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const fiatCurrencies = await fiatApi.getPopularCurrencies();
      const currencies: Currency[] = fiatCurrencies.map(c => ({
        code: c.code,
        name: c.name,
        type: 'fiat' as const,
      }));
      setState(prev => ({ ...prev, currencies, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load currencies',
        loading: false,
      }));
    }
  };

  const loadCryptoCurrencies = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const cryptoCurrencies = await cryptoApi.getPopularCurrencies();
      const currencies: Currency[] = cryptoCurrencies.map(c => ({
        code: c.symbol,
        name: c.name,
        type: 'crypto' as const,
      }));
      setState(prev => ({ ...prev, currencies, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load currencies',
        loading: false,
      }));
    }
  };

  useEffect(() => {
    if (state.selectedType === 'fiat') {
      loadFiatCurrencies();
    } else {
      loadCryptoCurrencies();
    }
  }, [state.selectedType]);

  const setSelectedType = (type: 'fiat' | 'crypto') => {
    setState(prev => ({ ...prev, selectedType: type }));
  };

  return {
    ...state,
    setSelectedType,
  };
}
