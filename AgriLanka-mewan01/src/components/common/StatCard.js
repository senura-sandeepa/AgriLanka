import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StatCard = ({ icon, label, value, color }) => {
  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <Ionicons name={icon} size={32} color="#fff" style={styles.icon} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    minHeight: 120,
  },
  icon: {
    opacity: 0.8,
    marginBottom: 8,
  },
  label: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default StatCard;