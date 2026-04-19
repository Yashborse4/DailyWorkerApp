import { Platform } from 'react-native';

/**
 * API Configuration
 * 
 * Provides centralized management of API endpoints and timeouts.
 */
export const API_CONFIG = {
  // Use machine IP for both Emulator and Physical devices on the same network
  // Fallback to 10.0.2.2 for Android Emulator if IP is not reachable
  BASE_URL: 'http://192.168.1.5:8090/api/v1',
  
  // Alternative URLs for different environments
  ENV: {
    EMULATOR_ANDROID: 'http://10.0.2.2:8090/api/v1',
    EMULATOR_IOS: 'http://localhost:8090/api/v1',
  },
  
  TIMEOUT: 15000, // 15 seconds
  
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

/**
 * Returns the resolved base URL based on the platform and reachability.
 * In a real-world app, this might involve environment variables.
 */
export const getBaseUrl = () => {
  // Add logic here if you want to dynamically switch based on __DEV__
  return API_CONFIG.BASE_URL;
};
