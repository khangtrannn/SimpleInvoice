export const REVIEWER_USER = {
  email: 'reviewer@simpleinvoice.local',
  password: 'Password123!',
  fullname: 'SimpleInvoice Reviewer',
} as const;

export const BCRYPT_SALT_ROUNDS = 12;

export const GENERATED_INVOICE_COUNT = 30;

export const FAKER_SEED = 101;

export const SUPPORTED_CURRENCIES = [
  { currency: 'AUD', currencySymbol: 'AU$' },
  { currency: 'USD', currencySymbol: 'US$' },
  { currency: 'GBP', currencySymbol: '£' },
] as const;

export const TAX_PERCENTAGES = ['0.00', '5.00', '8.00', '10.00'] as const;