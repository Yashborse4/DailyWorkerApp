import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { JobOfferProvider } from './src/context/JobOfferContext';
import { ChatProvider } from './src/context/ChatContext';
import { useTheme } from './src/hooks/useTheme';
import { IncomingOfferModal } from './src/components/worker/IncomingOfferModal';
import './src/i18n'; // Initialize i18n
import RootNavigator from './src/navigation/RootNavigator';

const AppContent = () => {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <IncomingOfferModal />
    </>
  );
};

import { ToastProvider } from './src/context/ToastContext';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <JobOfferProvider>
              <ChatProvider> {/* Wrapped AppContent with ChatProvider */}
                <AppContent />
              </ChatProvider>
            </JobOfferProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
