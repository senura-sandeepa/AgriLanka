import React, { useEffect } from 'react';
import { NavigationContainer, CommonActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import LoginFormScreen from '../screens/auth/LoginFormScreen';
import SavedAccountsScreen from '../screens/auth/SavedAccountsScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import BottomTabNavigator from './BottomTabNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { userType, isLoading } = useAuth();
  const navigationRef = React.useRef();

  useEffect(() => {
    if (!userType && navigationRef.current) {
      // Reset navigation stack when user logs out
      navigationRef.current.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
      );
    }
  }, [userType]);


  if (isLoading) {
    return null; // You can add a loading screen here
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userType ? (
          <Stack.Screen
            name="Main"
            component={BottomTabNavigator}
            options={{ animationEnabled: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ animationEnabled: false }}
            />
            <Stack.Screen
              name="LoginForm"
              component={LoginFormScreen}
            />
            <Stack.Screen
              name="SavedAccounts"
              component={SavedAccountsScreen}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;