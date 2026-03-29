import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import { COLORS } from '../../utils/colors';

const ActivityCard = ({ activity }) => {
  const getBorderColor = () => {
    switch (activity.type) {
      case 'success':
        return COLORS.common.success;
      case 'info':
        return COLORS.common.info;
      case 'warning':
        return COLORS.common.warning;
      default:
        return COLORS.common.gray300;
    }
  };

  return (
    <View style={[styles.activityCard, { borderLeftColor: getBorderColor() }]}>
      <Text style={styles.activityTitle}>{activity.title}</Text>
      <Text style={styles.activityMessage}>{activity.message}</Text>
    </View>
  );
};

const AdminHomeScreen = () => {
  const activities = [
    {
      id: 1,
      type: 'success',
      title: 'New Farmer Registration',
      message: 'Farmer Jayawardena from Kandy - 2 hours ago',
    },
    {
      id: 2,
      type: 'info',
      title: 'Order Completed',
      message: 'Keells Super purchased 500kg Tomatoes - 3 hours ago',
    },
    {
      id: 3,
      type: 'warning',
      title: 'New Crop Listed',
      message: '300kg Carrots available from Nuwara Eliya - 5 hours ago',
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Admin Dashboard" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsContainer}
        >
          <StatCard
            icon="people-outline"
            label="Total Farmers"
            value="124"
            color={COLORS.admin.primary}
          />
          <StatCard
            icon="storefront-outline"
            label="Supermarkets"
            value="18"
            color={COLORS.supermarket.primary}
          />
          <StatCard
            icon="checkmark-circle-outline"
            label="Completed Orders"
            value="1,247"
            color={COLORS.farmer.primary}
          />
          <StatCard
            icon="bar-chart-outline"
            label="Total Revenue"
            value="Rs. 2.4M"
            color="#f59e0b"
          />
        </ScrollView>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Activity</Text>
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Performing Regions</Text>
          <View style={styles.regionCard}>
            <View style={styles.regionRow}>
              <Text style={styles.regionName}>Nuwara Eliya</Text>
              <Text style={styles.regionValue}>Rs. 450K</Text>
            </View>
            <View style={styles.regionRow}>
              <Text style={styles.regionName}>Badulla</Text>
              <Text style={styles.regionValue}>Rs. 320K</Text>
            </View>
            <View style={styles.regionRow}>
              <Text style={styles.regionName}>Kandy</Text>
              <Text style={styles.regionValue}>Rs. 280K</Text>
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
  },
  statsContainer: {
    paddingVertical: 16,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.gray800,
    marginBottom: 4,
  },
  activityMessage: {
    fontSize: 14,
    color: COLORS.common.gray600,
  },
  regionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  regionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  regionName: {
    fontSize: 16,
    color: COLORS.common.gray700,
  },
  regionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.farmer.primary,
  },
});

export default AdminHomeScreen;