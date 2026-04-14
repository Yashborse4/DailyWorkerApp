import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import AuthNavigator from './AuthNavigator';
import WorkerNavigator from './WorkerNavigator';
import HirerNavigator from './HirerNavigator';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen 
            name={userRole === 'worker' ? 'WorkerApp' : 'HirerApp'} 
            component={userRole === 'worker' ? WorkerNavigator : HirerNavigator} 
          />
          <Stack.Screen 
            name="ChatRoom" 
            component={require('../screens/chat/ChatRoomScreen').default} 
          />
          <Stack.Screen 
            name="Verification" 
            component={require('../screens/worker/VerificationScreen').default} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
