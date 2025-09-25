// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://api.mycards.rizzmo.site',
  ENDPOINTS: {
    CREATE_WALLET_PASS: '/api/wallet/create-pass',
    HEALTH: '/health'
  }
} as const;

// Environment helpers
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// API URL helper
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};