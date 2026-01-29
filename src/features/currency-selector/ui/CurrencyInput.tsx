import type { Currency } from '@/shared';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CurrencyInputProps {
  label: string;
  value: Currency | null;
  amount?: number | null;
  onFocus: () => void;
  focused: boolean;
  editable?: boolean;
  onChangeAmount?: (amount: number) => void;
  displayCurrency?: Currency | null;
  onCurrencyCodeChange?: (text: string) => void;
  currencyCodeValue?: string;
  onPreventBlur?: () => void;
}

export function CurrencyInput({ 
  label, 
  value, 
  amount,
  onFocus, 
  focused, 
  editable = false,
  onChangeAmount,
  displayCurrency,
  onCurrencyCodeChange,
  currencyCodeValue,
  onPreventBlur,
}: CurrencyInputProps) {
  // displayCurrency overrides value for label; null = hide name block
  const currencyToDisplay = displayCurrency !== undefined ? displayCurrency : value;
  const shouldShowContainer = displayCurrency !== null;

  return (
    <View style={styles.wrapper}>
      {shouldShowContainer && (
        <View style={styles.currencyNameContainer}>
          {currencyToDisplay?.name && (
            <Text style={styles.currencyName} numberOfLines={2}>
              {currencyToDisplay.name}
            </Text>
          )}
        </View>
      )}
      <TouchableOpacity 
        onPress={() => {
          onPreventBlur?.();
          onFocus();
        }} 
        activeOpacity={0.8}
      >
        <View style={[styles.container, focused && styles.focused]}>
          <Text style={styles.label}>{label}</Text>
          {editable ? (
            <TextInput
              style={styles.input}
              value={amount != null ? amount.toString() : ''}
              placeholder="0.00"
              placeholderTextColor="#666"
              keyboardType="numeric"
              onFocus={onFocus}
              onChangeText={(text) => {
                const num = parseFloat(text) || 0;
                onChangeAmount?.(num);
              }}
            />
          ) : (
            <Text style={styles.amountText}>
              {amount != null ? amount.toFixed(2) : '0.00'}
            </Text>
          )}
          {focused && onCurrencyCodeChange ? (
            <TextInput
              style={styles.currencyCodeInput}
              value={currencyCodeValue ?? value?.code ?? ''}
              placeholder="---"
              placeholderTextColor="#666"
              autoCapitalize="characters"
              maxLength={10}
              selectTextOnFocus={true}
              onFocus={() => {
                onPreventBlur?.();
                onFocus();
              }}
              onChangeText={(text) => {
                const upperText = text.toUpperCase();
                onCurrencyCodeChange(upperText);
              }}
            />
          ) : (
            <Text style={styles.currencyCode}>{value?.code || '---'}</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 200,
    marginVertical: 8,
  },
  currencyNameContainer: {
    height: 40, // ~2 lines + spacing
    marginBottom: 8,
    justifyContent: 'flex-start',
  },
  currencyName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
    opacity: 0.9,
    width: 200,
    lineHeight: 20,
  },
  container: {
    width: 200,
    padding: 16,
    backgroundColor: '#1E1E2E',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  focused: {
    borderColor: '#4A90E2',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  amountText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  currencyCode: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginTop: 4,
    opacity: 0.8,
  },
  currencyCodeInput: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    textTransform: 'uppercase',
    marginTop: 4,
    opacity: 0.8,
    padding: 0,
  },
});
