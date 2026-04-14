import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WorkerTabParamList } from '../types';
import WorkerDashboard from '../screens/worker/WorkerDashboard';
import FindJobsScreen from '../screens/worker/FindJobsScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import VerificationScreen from '../screens/worker/VerificationScreen';
import { ThemedText } from '../components/common/ThemedText';
import { useTheme } from '../hooks/useTheme';

const Tab = createBottomTabNavigator<WorkerTabParamList>();
const Stack = createNativeStackNavigator();

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WorkerDashboardMain" component={WorkerDashboard} />
    <Stack.Screen name="Verification" component={VerificationScreen} />
  </Stack.Navigator>
);

export const WorkerNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.Colors.worker.base,
        tabBarInactiveTintColor: theme.Colors.grey[400],
        tabBarStyle: {
          backgroundColor: theme.Colors.surface,
          borderTopColor: theme.Colors.grey[200],
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="WorkerDashboard"
        component={DashboardStack}
        options={{
          title: 'Home / घर',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <ThemedText style={{ color, fontSize: 22 }}>🏠</ThemedText>
              {focused && (
                <View style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: theme.Colors.worker.base,
                  marginTop: 2,
                }} />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="FindJobs"
        component={FindJobsScreen}
        options={{
          title: 'Jobs / काम',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <ThemedText style={{ color, fontSize: 22 }}>🔍</ThemedText>
              {focused && (
                <View style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: theme.Colors.worker.base,
                  marginTop: 2,
                }} />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={require('../screens/chat/ChatListScreen').default}
        options={{
          title: 'Chat / चैट',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <ThemedText style={{ color, fontSize: 22 }}>💬</ThemedText>
              {focused && (
                <View style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: theme.Colors.worker.base,
                  marginTop: 2,
                }} />
              )}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="WorkerProfile"
        component={ProfileScreen}
        options={{
          title: 'Profile / प्रोफ़ाइल',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <ThemedText style={{ color, fontSize: 22 }}>👤</ThemedText>
              {focused && (
                <View style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: theme.Colors.worker.base,
                  marginTop: 2,
                }} />
              )}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default WorkerNavigator;
