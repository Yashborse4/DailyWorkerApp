import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HirerTabParamList } from '../types';
import HirerDashboard from '../screens/hirer/HirerDashboard';
import MyJobsScreen from '../screens/hirer/MyJobsScreen';
import PostJobScreen from '../screens/hirer/PostJobScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import { useTheme } from '../hooks/useTheme';
import { ThemedText } from '../components/common/ThemedText';

const Tab = createBottomTabNavigator<HirerTabParamList>();

export const HirerNavigator = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: theme.Colors.hirer.base,
        tabBarInactiveTintColor: theme.Colors.grey[400],
        tabBarStyle: {
          backgroundColor: theme.Colors.surface,
          borderTopColor: theme.Colors.grey[200],
          height: 70,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontWeight: '600',
        }
      }}
    >
      <Tab.Screen 
        name="HirerDashboard" 
        component={HirerDashboard} 
        options={{ 
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <ThemedText style={{ color, fontSize: 22 }}>🏠</ThemedText>
        }} 
      />
      <Tab.Screen 
        name="MyJobs" 
        component={MyJobsScreen} 
        options={{ 
          title: 'My Jobs',
          tabBarIcon: ({ color }: { color: string }) => <ThemedText style={{ color, fontSize: 22 }}>📋</ThemedText>
        }} 
      />
      <Tab.Screen 
        name="PostJob" 
        component={PostJobScreen} 
        options={{ 
          title: 'Post',
          tabBarIcon: ({ color }: { color: string }) => <ThemedText style={{ color, fontSize: 22 }}>➕</ThemedText>
        }} 
      />
      <Tab.Screen 
        name="ChatList" 
        component={require('../screens/chat/ChatListScreen').default} 
        options={{ 
          title: 'Chat',
          tabBarIcon: ({ color }: { color: string }) => <ThemedText style={{ color, fontSize: 22 }}>💬</ThemedText>
        }} 
      />
      <Tab.Screen 
        name="HirerProfile" 
        component={ProfileScreen} 
        options={{ 
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => <ThemedText style={{ color, fontSize: 22 }}>👤</ThemedText>
        }} 
      />
    </Tab.Navigator>
  );
};

export default HirerNavigator;
