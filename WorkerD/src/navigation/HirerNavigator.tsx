import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HirerTabParamList } from '../types';
import HirerDashboard from '../screens/hirer/HirerDashboard';
import MyJobsScreen from '../screens/hirer/MyJobsScreen';
import PostJobScreen from '../screens/hirer/PostJobScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View } from 'react-native';

const Tab = createBottomTabNavigator<HirerTabParamList>();

export const HirerNavigator = () => {
  const { theme } = useTheme();
  const { t } = useTranslation(['common', 'jobs']);

  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: theme.Colors.hirer.base,
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
        }
      }}
    >
      <Tab.Screen 
        name="HirerDashboard" 
        component={HirerDashboard} 
        options={{ 
          title: t('common:home'),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
              {focused && (
                <View style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: theme.Colors.hirer.base,
                  marginTop: 2,
                }} />
              )}
            </View>
          )
        }} 
      />
      <Tab.Screen 
        name="MyJobs" 
        component={MyJobsScreen} 
        options={{ 
          title: t('common:my_tasks'),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'list-sharp' : 'list-outline'} size={22} color={color} />
              {focused && (
                <View style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: theme.Colors.hirer.base,
                  marginTop: 2,
                }} />
              )}
            </View>
          )
        }} 
      />
      <Tab.Screen 
        name="PostJob" 
        component={PostJobScreen} 
        options={{ 
          title: t('jobs:post_job'),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'add-circle' : 'add-circle-outline'} size={22} color={color} />
              {focused && (
                <View style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: theme.Colors.hirer.base,
                  marginTop: 2,
                }} />
              )}
            </View>
          )
        }} 
      />
      <Tab.Screen 
        name="ChatList" 
        component={require('../screens/chat/ChatListScreen').default} 
        options={{ 
          title: t('common:chat'),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline'} size={22} color={color} />
              {focused && (
                <View style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: theme.Colors.hirer.base,
                  marginTop: 2,
                }} />
              )}
            </View>
          )
        }} 
      />
      <Tab.Screen 
        name="HirerProfile" 
        component={ProfileScreen} 
        options={{ 
          title: t('common:profile'),
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
              {focused && (
                <View style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: theme.Colors.hirer.base,
                  marginTop: 2,
                }} />
              )}
            </View>
          )
        }} 
      />
    </Tab.Navigator>
  );
};

export default HirerNavigator;
