const LOCAL_DEVELOPMENT_API_BASE_URL = 'http://localhost:8080/api/v1';

const configuredApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

if (!__DEV__ && !configuredApiBaseUrl) {
  throw new Error(
    'EXPO_PUBLIC_API_BASE_URL must be configured with the public HTTPS API URL for release builds.',
  );
}

if (!__DEV__ && !configuredApiBaseUrl?.startsWith('https://')) {
  throw new Error(
    'EXPO_PUBLIC_API_BASE_URL must use HTTPS for release builds.',
  );
}

export const API_BASE_URL = (
  configuredApiBaseUrl ?? LOCAL_DEVELOPMENT_API_BASE_URL
).replace(/\/+$/, '');
