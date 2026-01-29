import type { Currency } from '@/shared';
import { useEffect, useState } from 'react';
import { conversionApi } from '../api/conversion-api';

interface UseConversionParams {
  fromCurrency: Currency | null;
  toCurrency: Currency | null;
  amount: number;
}

export function useConversion({ fromCurrency, toCurrency, amount }: UseConversionParams) {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (
      !fromCurrency ||
      !toCurrency ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setConvertedAmount(null);
      setError(null);
      return;
    }

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        let result: number;
        if (fromCurrency.type === 'fiat' && toCurrency.type === 'fiat') {
          result = await conversionApi.convertFiat(
            fromCurrency.code,
            toCurrency.code,
            amount
          );
        } else if (fromCurrency.type === 'crypto' && toCurrency.type === 'crypto') {
          result = await conversionApi.convertCrypto(
            fromCurrency.code,
            toCurrency.code,
            amount
          );
        } else if (fromCurrency.type === 'fiat' && toCurrency.type === 'crypto') {
          result = await conversionApi.convertFiatToCrypto(
            fromCurrency.code,
            toCurrency.code,
            amount
          );
        } else {
          result = await conversionApi.convertCryptoToFiat(
            fromCurrency.code,
            toCurrency.code,
            amount
          );
        }
        setConvertedAmount(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Conversion failed');
        setConvertedAmount(null);
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(run, 500); // debounce

    return () => clearTimeout(timeoutId);
  }, [fromCurrency, toCurrency, amount]);

  return { convertedAmount, loading, error };
}
