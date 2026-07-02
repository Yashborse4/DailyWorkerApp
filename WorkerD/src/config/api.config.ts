import { Platform } from 'react-native';

const DEV_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:8090/api/v1',
  ios: 'http://localhost:8090/api/v1',
  default: 'http://localhost:8090/api/v1',
});

export const getBaseUrl = () => {
  return __DEV__ ? DEV_BASE_URL : 'https://api.workerd.com/api/v1';
};

/**
 * API Configuration
 * 
 * Provides centralized management of API endpoints and timeouts.
 */
export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  
  // Alternative URLs for different environments
  ENV: {
    EMULATOR_ANDROID: 'http://10.0.2.2:8090/api/v1',
    EMULATOR_IOS: 'http://localhost:8090/api/v1',
  },
  
  TIMEOUT: 15000,
  
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};
