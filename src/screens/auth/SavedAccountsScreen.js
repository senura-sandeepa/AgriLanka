import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { COLORS, getThemeColors } from '../../utils/colors';

const SavedAccountsScreen = ({ route, navigation }) => {
  const { userType } = route.params;
  const { savedAccounts, login, removeSavedAccount } = useAuth();
  const themeColors = getThemeColors(userType);

  const accountsForType = savedAccounts.filter(acc => acc.userType === userType);

  const handleAccountSelect = (account) => {
    login(account.userType, account.userData, account.credentials);
  };

  const handleRemoveAccount = (accountId) => {
    Alert.alert(
      'Remove Account',
      'Are you sure you want to remove this account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeSavedAccount(accountId),
        },
      ]
    );
  };

  const getUserIcon = () => {
    switch (userType) {
      case 'farmer':
        return 'people';
      case 'supermarket':
        return 'storefront';
      case 'admin':
        return 'shield-checkmark';
      default:
        return 'person';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.common.gray800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Account</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Saved Accounts</Text>

        {accountsForType.map((account) => (
          <TouchableOpacity
            key={account.id}
            style={styles.accountCard}
            onPress={() => handleAccountSelect(account)}
          >
            <View style={[styles.accountIcon, { backgroundColor: themeColors.primary }]}>
              <Ionicons name={getUserIcon()} size={32} color="#fff" />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{account.userData.name}</Text>
              <Text style={styles.accountLocation}>{account.userData.location}</Text>
              <Text style={styles.accountEmail}>{account.credentials.email}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveAccount(account.id)}
            >
              <Ionicons name="close-circle" size={24} color={COLORS.common.error} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.addAccountButton, { borderColor: themeColors.primary }]}
          onPress={() => navigation.navigate('LoginForm', { userType })}
        >
          <Ionicons name="add-circle-outline" size={24} color={themeColors.primary} />
          <Text style={[styles.addAccountText, { color: themeColors.primary }]}>
            Login with Different Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupButton}
          onPress={() => navigation.navigate('SignUp', { userType })}
        >
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.common.gray50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
    marginTop: 24,
    marginBottom: 16,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
    marginBottom: 4,
  },
  accountLocation: {
    fontSize: 14,
    color: COLORS.common.gray600,
    marginBottom: 2,
  },
  accountEmail: {
    fontSize: 12,
    color: COLORS.common.gray500,
  },
  removeButton: {
    padding: 8,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addAccountText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  signupButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 24,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.common.gray600,
    textDecorationLine: 'underline',
  },
});

export default SavedAccountsScreen;