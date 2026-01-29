import { useConversion, useCurrencies } from '@/entities/currency';
import { CurrencyArc, CurrencyInput } from '@/features/currency-selector';
import { CurrencyTypeToggle } from '@/features/currency-type-toggle';
import type { Currency } from '@/shared';
import React, { useEffect, useState } from 'react';
import {
    Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

export function CurrencyConverter() {
  const { currencies, selectedType, setSelectedType } = useCurrencies();
  const [fromCurrency, setFromCurrency] = useState<Currency | null>(null);
  const [toCurrency, setToCurrency] = useState<Currency | null>(null);
  const [focusedInput, setFocusedInput] = useState<'from' | 'to' | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [currencySearchText, setCurrencySearchText] = useState<string>('');
  const [searchSelectedCurrency, setSearchSelectedCurrency] = useState<Currency | null>(null);

  useEffect(() => {
    // default From to USD when fiat loads
    if (selectedType === 'fiat' && currencies.length > 0 && !fromCurrency) {
      const usdCurrency = currencies.find(c => c.code === 'USD');
      if (usdCurrency) {
        setFromCurrency(usdCurrency);
      }
    }
  }, [currencies, selectedType, fromCurrency]);

  const { convertedAmount, error: conversionError } = useConversion({
    fromCurrency,
    toCurrency,
    amount,
  });

  const handleTypeChange = (type: 'fiat' | 'crypto') => {
    setSelectedType(type);
    if (focusedInput === null) setFocusedInput('from');
  };

  const handleCurrencySelect = (currency: Currency) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
    const currentFocusedInput = focusedInput;
    if (currentFocusedInput === 'from') {
      setFromCurrency(currency);
      setCurrencySearchText(currency.code);
      setSearchSelectedCurrency(currency);
      setTimeout(() => setFocusedInput('from'), 0); // keep focus after selection
    } else if (currentFocusedInput === 'to') {
      setToCurrency(currency);
      setCurrencySearchText(currency.code);
      setSearchSelectedCurrency(currency);
      setTimeout(() => setFocusedInput('to'), 0);
    }
  };

  const handlePreventBlur = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  const handleInputFocus = (input: 'from' | 'to') => {
    handlePreventBlur();
    if (input === 'to' && focusedInput === 'from') Keyboard.dismiss(); // cursor leaves From
    setFocusedInput(input);
    if (input === 'from' && fromCurrency) {
      setCurrencySearchText(fromCurrency.code);
      setSearchSelectedCurrency(fromCurrency);
    } else if (input === 'to' && toCurrency) {
      setCurrencySearchText(toCurrency.code);
      setSearchSelectedCurrency(toCurrency);
    } else {
      setCurrencySearchText('');
      setSearchSelectedCurrency(null);
    }
  };

  const handleCurrencyCodeChange = (text: string) => {
    setCurrencySearchText(text);
    if (text.trim().length > 0) {
      const searchUpper = text.toUpperCase().trim();
      const foundCurrency = currencies.find(c =>
        c.code.toUpperCase().startsWith(searchUpper)
      );
      if (foundCurrency) {
        setSearchSelectedCurrency(foundCurrency);
        // exact match: apply and clear search
        if (foundCurrency.code.toUpperCase() === searchUpper && text.length >= 2) {
          if (focusedInput === 'from') {
            setFromCurrency(foundCurrency);
          } else if (focusedInput === 'to') {
            setToCurrency(foundCurrency);
          }
          setCurrencySearchText('');
          setSearchSelectedCurrency(null);
        }
      } else {
        setSearchSelectedCurrency(null);
      }
    } else {
      setSearchSelectedCurrency(null);
    }
  };

  const blurTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBlur = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    // delay so arc tap runs before blur
    blurTimeoutRef.current = setTimeout(() => {
      Keyboard.dismiss();
      setFocusedInput(null);
      blurTimeoutRef.current = null;
    }, 200);
  };

  React.useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={handleBlur}>
        <View style={styles.content} pointerEvents="box-none">
          <View style={styles.inputsContainer} pointerEvents="auto">
            {conversionError && (
              <Text style={styles.errorText}>{conversionError}</Text>
            )}
            <CurrencyInput
              label="From"
              value={fromCurrency}
              amount={amount}
              onFocus={() => handleInputFocus('from')}
              focused={focusedInput === 'from'}
              editable={true}
              onChangeAmount={setAmount}
              displayCurrency={
                focusedInput === 'from' 
                  ? fromCurrency 
                  : focusedInput === 'to' 
                    ? toCurrency 
                    : fromCurrency
              }
              onCurrencyCodeChange={focusedInput === 'from' ? handleCurrencyCodeChange : undefined}
              currencyCodeValue={focusedInput === 'from' ? currencySearchText : undefined}
              onPreventBlur={handlePreventBlur}
            />
            <CurrencyInput
              label="To"
              value={toCurrency}
              amount={convertedAmount}
              onFocus={() => handleInputFocus('to')}
              focused={focusedInput === 'to'}
              editable={false}
              displayCurrency={null}
              onCurrencyCodeChange={focusedInput === 'to' ? handleCurrencyCodeChange : undefined}
              currencyCodeValue={focusedInput === 'to' ? currencySearchText : undefined}
              onPreventBlur={handlePreventBlur}
            />
          </View>
          <CurrencyArc
            currencies={currencies}
            selectedCurrency={
              searchSelectedCurrency 
                ? searchSelectedCurrency
                : focusedInput === 'from' 
                  ? fromCurrency
                  : toCurrency
            }
            onSelect={handleCurrencySelect}
            visible={focusedInput !== null && currencies.length > 0}
          />

          <View style={styles.toggleContainer} pointerEvents="auto">
            <CurrencyTypeToggle selectedType={selectedType} onTypeChange={handleTypeChange} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: '#e57373',
    fontSize: 13,
    marginBottom: 8,
    maxWidth: 280,
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 20,
    overflow: 'visible',
  },
  inputsContainer: {
    alignItems: 'flex-start',
    marginBottom: 40,
    width: '100%',
  },
  toggleContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
});
