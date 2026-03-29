import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadSavedAccounts();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUserType = await AsyncStorage.getItem(STORAGE_KEYS.USER_TYPE);
      const savedUserData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (savedUserType) {
        setUserType(savedUserType);
      }
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSavedAccounts = async () => {
    try {
      const accounts = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_ACCOUNTS);
      if (accounts) {
        setSavedAccounts(JSON.parse(accounts));
      }
    } catch (error) {
      console.error('Error loading saved accounts:', error);
    }
  };

  const saveSavedAccounts = async (accounts) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_ACCOUNTS, JSON.stringify(accounts));
      setSavedAccounts(accounts);
    } catch (error) {
      console.error('Error saving accounts:', error);
    }
  };

  const login = async (type, data, credentials) => {
    try {
      setUserType(type);
      setUserData(data);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TYPE, type);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));

      // Save account for quick login
      const accountId = `${type}_${data.email}_${Date.now()}`;
      const newAccount = {
        id: accountId,
        userType: type,
        userData: data,
        credentials: credentials,
      };

      const existingAccount = savedAccounts.find(
        acc => acc.userType === type && acc.credentials.email === credentials.email
      );

      if (!existingAccount) {
        const updatedAccounts = [...savedAccounts, newAccount];
        await saveSavedAccounts(updatedAccounts);
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const register = async (type, data, credentials) => {
    // For now, registration just calls login
    // In production, you'd call your backend API here
    await login(type, data, credentials);
  };

  const removeSavedAccount = async (accountId) => {
    try {
      const updatedAccounts = savedAccounts.filter(acc => acc.id !== accountId);
      await saveSavedAccounts(updatedAccounts);
    } catch (error) {
      console.error('Error removing account:', error);
    }
  };

  const logout = async () => {
    try {
      setUserType(null);
      setUserData(null);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TYPE);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userType,
        userData,
        savedAccounts,
        isLoading,
        login,
        register,
        removeSavedAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};