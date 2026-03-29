import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { getThemeColors } from '../utils/colors';

// Farmer Screens
import FarmerHomeScreen from '../screens/farmer/FarmerHomeScreen';
import FarmerOrdersScreen from '../screens/farmer/FarmerOrdersScreen';
import FarmerNotificationsScreen from '../screens/farmer/FarmerNotificationsScreen';
import FarmerProfileScreen from '../screens/farmer/FarmerProfileScreen';

// Supermarket Screens
import SupermarketHomeScreen from '../screens/supermarket/SupermarketHomeScreen';
import SupermarketOrdersScreen from '../screens/supermarket/SupermarketOrdersScreen';
import SupermarketNotificationsScreen from '../screens/supermarket/SupermarketNotificationsScreen';
import SupermarketProfileScreen from '../screens/supermarket/SupermarketProfileScreen';

// Admin Screens
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import AdminReportsScreen from '../screens/admin/AdminReportsScreen';
import AdminNotificationsScreen from '../screens/admin/AdminNotificationsScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';

const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Loading...</Text>
  </View>
);

const BottomTabNavigator = () => {
  const { userType, isLoading } = useAuth();
  const insets = useSafeAreaInsets();

  if (isLoading || !userType) {
    return <LoadingScreen />;
  }

  const themeColors = getThemeColors(userType);

  const getScreens = () => {
    switch (userType) {
      case 'farmer':
        return [
          { name: 'Home', component: FarmerHomeScreen, icon: 'home' },
          { name: 'Orders', component: FarmerOrdersScreen, icon: 'document-text' },
          { name: 'Alerts', component: FarmerNotificationsScreen, icon: 'notifications' },
          { name: 'Profile', component: FarmerProfileScreen, icon: 'person' },
        ];
      case 'supermarket':
        return [
          { name: 'Home', component: SupermarketHomeScreen, icon: 'home' },
          { name: 'Orders', component: SupermarketOrdersScreen, icon: 'document-text' },
          { name: 'Alerts', component: SupermarketNotificationsScreen, icon: 'notifications' },
          { name: 'Profile', component: SupermarketProfileScreen, icon: 'person' },
        ];
      case 'admin':
        return [
          { name: 'Home', component: AdminHomeScreen, icon: 'home' },
          { name: 'Reports', component: AdminReportsScreen, icon: 'bar-chart' },
          { name: 'Alerts', component: AdminNotificationsScreen, icon: 'notifications' },
          { name: 'Profile', component: AdminProfileScreen, icon: 'person' },
        ];
      default:
        return [];
    }
  };

  const screens = getScreens();

  if (screens.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const screen = screens.find(s => s.name === route.name);
          return <Ionicons name={screen.icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      {screens.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;