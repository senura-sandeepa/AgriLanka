import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { getThemeColors } from '../../utils/colors';

const Header = ({ title }) => {
  const { userType, logout } = useAuth();
  const themeColors = getThemeColors(userType);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.primary }]}>
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="leaf" size={24} color="#fff" />
        </View>
        <View>
          <Text style={styles.title}>AgriLanka</Text>
          <Text style={styles.subtitle}>{userType?.toUpperCase()}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
  },
});

export default Header;