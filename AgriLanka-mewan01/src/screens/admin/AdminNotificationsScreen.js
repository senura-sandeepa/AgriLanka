import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../../components/common/Header';
import { COLORS } from '../../utils/colors';
import { sampleNotifications } from '../../data/sampleData';

const NotificationCard = ({ notification }) => {
  const getBorderColor = () => {
    switch (notification.type) {
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
    <View style={[styles.notificationCard, { borderLeftColor: getBorderColor() }]}>
      <Text style={styles.notificationTitle}>{notification.title}</Text>
      <Text style={styles.notificationMessage}>{notification.message}</Text>
      <Text style={styles.notificationTime}>{notification.time}</Text>
    </View>
  );
};

const AdminNotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="System Alerts" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Alerts</Text>
          {sampleNotifications.admin.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Actions</Text>
          <View style={styles.pendingCard}>
            <Text style={styles.pendingTitle}>User Approvals</Text>
            <Text style={styles.pendingCount}>3</Text>
            <Text style={styles.pendingSubtext}>farmer registrations awaiting review</Text>
          </View>

          <View style={styles.pendingCard}>
            <Text style={styles.pendingTitle}>Payment Issues</Text>
            <Text style={styles.pendingCount}>1</Text>
            <Text style={styles.pendingSubtext}>orders require attention</Text>
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
  notificationCard: {
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
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.gray800,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.common.gray600,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.common.gray500,
  },
  pendingCard: {
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
  pendingTitle: {
    fontSize: 14,
    color: COLORS.common.gray600,
    marginBottom: 8,
  },
  pendingCount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.common.warning,
    marginBottom: 4,
  },
  pendingSubtext: {
    fontSize: 12,
    color: COLORS.common.gray500,
  },
});

export default AdminNotificationsScreen;