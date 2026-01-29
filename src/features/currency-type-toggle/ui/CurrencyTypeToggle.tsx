import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CurrencyTypeToggleProps {
  selectedType: 'fiat' | 'crypto';
  onTypeChange: (type: 'fiat' | 'crypto') => void;
}

export function CurrencyTypeToggle({ selectedType, onTypeChange }: CurrencyTypeToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, selectedType === 'crypto' && styles.activeButton]}
        onPress={() => onTypeChange('crypto')}
      >
        <Text style={[styles.buttonText, selectedType === 'crypto' && styles.activeText]}>
          CRYPTO
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, selectedType === 'fiat' && styles.activeButton]}
        onPress={() => onTypeChange('fiat')}
      >
        <Text style={[styles.buttonText, selectedType === 'fiat' && styles.activeText]}>
          FIAT
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2A2A3A',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  activeText: {
    fontWeight: '700',
  },
});
