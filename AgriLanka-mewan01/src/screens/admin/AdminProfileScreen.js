import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import { COLORS } from '../../utils/colors';

const AdminProfileScreen = () => {
  const settingsOptions = [
    {
      id: 1,
      icon: 'people-outline',
      title: 'User Management',
      subtitle: 'Manage farmers and supermarkets',
    },
    {
      id: 2,
      icon: 'settings-outline',
      title: 'System Configuration',
      subtitle: 'Configure platform settings',
    },
    {
      id: 3,
      icon: 'bar-chart-outline',
      title: 'Analytics Settings',
      subtitle: 'Configure reports and analytics',
    },
    {
      id: 4,
      icon: 'notifications-outline',
      title: 'Notification Settings',
      subtitle: 'Manage system notifications',
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Admin Settings" />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="shield-checkmark" size={48} color="#fff" />
          </View>
          <Text style={styles.profileName}>System Administrator</Text>
          <Text style={styles.profileEmail}>admin@agrilanka.lk</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.settingCard}>
              <View style={styles.settingIcon}>
                <Ionicons name={option.icon} size={24} color={COLORS.admin.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{option.title}</Text>
                <Text style={styles.settingSubtitle}>{option.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.common.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Database Status</Text>
              <Text style={[styles.infoValue, { color: COLORS.common.success }]}>
                Active
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Backup</Text>
              <Text style={styles.infoValue}>Today, 3:00 AM</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.admin.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: COLORS.common.gray600,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
    marginBottom: 16,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.admin.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.gray800,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.common.gray600,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  infoLabel: {
    fontSize: 16,
    color: COLORS.common.gray600,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.gray800,
  },
});

export default AdminProfileScreen;