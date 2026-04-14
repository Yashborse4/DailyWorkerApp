import apiClient from './apiClient';

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  name?: string; // Standardized name field used in UI
  role: 'WORKER' | 'HIRER' | 'ADMIN' | 'USER';
  isEmailVerified: boolean;
  isDealerVerified: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified';
  location?: string;
  trade?: string;
  companyName?: string;
  companyLocation?: string;
  projects?: any[]; // For hirers
  categories?: string[]; // For workers
}

export interface AuthenticationResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const login = async (username: string, password: string): Promise<AuthenticationResponse> => {
  const response = await apiClient.post<AuthenticationResponse>('/auth/authenticate', {
    username,
    password,
  });
  return response.data;
};

export const register = async (username: string, password: string, role: string = 'USER'): Promise<AuthenticationResponse> => {
  const response = await apiClient.post<AuthenticationResponse>('/auth/register', {
    username,
    password,
    role,
  });
  return response.data;
};

export const refreshToken = async (refreshTokenValue: string): Promise<AuthenticationResponse> => {
  const response = await apiClient.post<AuthenticationResponse>('/auth/refresh-token', {
    refreshToken: refreshTokenValue
  });
  return response.data;
};
