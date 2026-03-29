import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/common/Header';
import { COLORS } from '../../utils/colors';

const AdminReportsScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="Analytics & Reports" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Performance</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Growth Rate</Text>
            <Text style={styles.cardValue}>+23%</Text>
            <Text style={styles.cardSubtext}>vs last month</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Active Users</Text>
            <Text style={styles.cardValue}>142</Text>
            <Text style={styles.cardSubtext}>Farmers & Supermarkets</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regional Analytics</Text>
          
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Top Region</Text>
            <Text style={styles.cardValue}>Nuwara Eliya</Text>
            <Text style={styles.cardSubtext}>Rs. 450,000 in sales</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Fastest Growing</Text>
            <Text style={styles.cardValue}>Badulla</Text>
            <Text style={styles.cardSubtext}>+35% this month</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Crops</Text>
          
          <View style={styles.cropList}>
            <View style={styles.cropRow}>
              <Text style={styles.cropName}>Tomatoes</Text>
              <Text style={styles.cropOrders}>245 orders</Text>
            </View>
            <View style={styles.cropRow}>
              <Text style={styles.cropName}>Carrots</Text>
              <Text style={styles.cropOrders}>198 orders</Text>
            </View>
            <View style={styles.cropRow}>
              <Text style={styles.cropName}>Cabbage</Text>
              <Text style={styles.cropOrders}>176 orders</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.common.gray50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: COLORS.common.gray600,
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.admin.primary,
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 12,
    color: COLORS.common.gray500,
  },
  cropList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cropRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  cropName: {
    fontSize: 16,
    color: COLORS.common.gray800,
    fontWeight: '600',
  },
  cropOrders: {
    fontSize: 16,
    color: COLORS.common.gray600,
  },
});

export default AdminReportsScreen;