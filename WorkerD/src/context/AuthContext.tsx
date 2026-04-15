import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../api/authService';
import * as workerService from '../api/workerService';
import { STORAGE_KEYS } from '../constants';

interface AuthContextType {
  user: authService.User | null;
  profile: authService.User | null; // Alias for user
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout
  isAuthenticated: boolean;
  userRole: 'worker' | 'hirer' | 'admin' | 'user' | null;
  signIn: (phone: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  changeLanguage: (lng: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  selectRole: (role: 'worker' | 'hirer') => Promise<void>;
}

const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<authService.User | null>(null);
  const [userRole, setUserRole] = useState<'worker' | 'hirer' | 'admin' | 'user' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const refreshTokenVal = await AsyncStorage.getItem('refreshToken');
        const lastRefreshStr = await AsyncStorage.getItem('lastRefresh');
        const storedRole = await AsyncStorage.getItem('userRole') as any;
        const storedUser = await AsyncStorage.getItem('user');
        
        if (token && refreshTokenVal) {
          const now = Date.now();
          const lastRefresh = lastRefreshStr ? parseInt(lastRefreshStr, 10) : 0;
          
          if (now - lastRefresh > FIVE_DAYS_MS) {
            console.log('Token is older than 5 days, refreshing...');
            try {
              const data = await authService.refreshToken(refreshTokenVal);
              await AsyncStorage.setItem('accessToken', data.accessToken);
              await AsyncStorage.setItem('refreshToken', data.refreshToken);
              await AsyncStorage.setItem('lastRefresh', Date.now().toString());
              await AsyncStorage.setItem('userRole', data.user.role.toLowerCase());
              await AsyncStorage.setItem('user', JSON.stringify(data.user));
              
              setUser(data.user);
              setUserRole(data.user.role.toLowerCase() as any);
            } catch (err) {
              console.error('Auto-refresh failed', err);
              if (storedUser) setUser(JSON.parse(storedUser));
              setUserRole(storedRole || null);
            }
          } else {
            if (storedUser) setUser(JSON.parse(storedUser));
            setUserRole(storedRole || null);
          }
        }
      } catch (e) {
        console.error('Failed to load storage data', e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAndRefreshToken();
  }, []);

  const login = async (username: string, password: string) => {
    const data = await authService.login(username, password);
    const role = data.user.role.toLowerCase() as any;
    
    await AsyncStorage.setItem('accessToken', data.accessToken);
    await AsyncStorage.setItem('refreshToken', data.refreshToken);
    await AsyncStorage.setItem('lastRefresh', Date.now().toString());
    await AsyncStorage.setItem('userRole', role);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
    
    setUser(data.user);
    setUserRole(role);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('lastRefresh');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('user');
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile: user,
      isLoading, 
      login, 
      logout, 
      signOut: logout,
      isAuthenticated: !!user,
      userRole,
      signIn: async (phone: string) => {
        console.log('SignIn with phone:', phone);
        // Placeholder for phone auth
      },
      verifyOTP: async (otp: string) => {
        console.log('Verify OTP:', otp);
        if (otp !== '123456') throw new Error('Invalid OTP');
        // OTP Success - Proceed to profile in frontend
      },
      changeLanguage: async (lng: string) => {
        const i18n = (await import('../i18n')).default;
        await i18n.changeLanguage(lng);
        await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
      },
      updateProfile: async (data: any) => {
        console.log('Updating profile for:', data);
        try {
          if (userRole === 'worker') {
            // If we're updating worker-specific fields (skills, bio, etc.)
            const profileData: workerService.WorkerProfileRequest = {
              bio: data.bio || user?.bio || '',
              skills: data.skills || user?.skills || [],
              experienceYears: data.experienceYears || user?.experienceYears || 0,
              isAvailable: data.isAvailable !== undefined ? data.isAvailable : user?.isAvailable,
            };
            const updatedProfile = await workerService.createOrUpdateProfile(profileData);
            
            const updatedUser = { ...user, ...updatedProfile };
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser as any);
          } else {
            // For general user updates, we might need a general userService.
            // For now, we'll just merge the data into the local state.
            const updatedUser = { ...user, ...data };
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser as any);
          }
        } catch (error) {
          console.error('Failed to update profile:', error);
          throw error;
        }
      },
      selectRole: async (role: 'worker' | 'hirer') => {
        console.log('Select role:', role);
        setUserRole(role as any);
        await AsyncStorage.setItem('userRole', role);
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
