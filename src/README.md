# jCurrency – Feature-Sliced Design

```
src/
├── shared/           # Shared utilities and types
│   ├── api/
│   └── lib/
├── entities/        # Business entities
│   └── currency/
│       ├── api/
│       └── model/
├── features/        # User-facing features
│   ├── currency-selector/
│   └── currency-type-toggle/
└── widgets/         # Composite UI
    └── currency-converter/
```

**Public API:** Import from slice roots (e.g. `@/entities/currency`, `@/features/currency-selector`, `@/shared`).

**APIs:** ExchangeRate-API (fiat), CoinGecko (crypto).
