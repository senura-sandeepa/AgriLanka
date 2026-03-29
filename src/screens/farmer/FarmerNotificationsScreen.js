import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import { COLORS } from '../../utils/colors';

// Enhanced sample notifications with order references
const sampleNotificationsData = [
  {
    id: 1,
    type: 'success',
    title: 'Order Confirmed',
    message: 'Your order ORD-2026-001 for Tomatoes has been confirmed by the buyer.',
    time: '2 hours ago',
    isRead: false,
    orderNumber: 'ORD-2026-001',
    createdAt: new Date('2026-01-23T10:30:00'),
  },
  {
    id: 2,
    type: 'info',
    title: 'Payment Received',
    message: 'Payment of Rs. 105,000 received for order ORD-2026-002.',
    time: '5 hours ago',
    isRead: false,
    orderNumber: 'ORD-2026-002',
    createdAt: new Date('2026-01-23T07:00:00'),
  },
  {
    id: 3,
    type: 'warning',
    title: 'Delivery Reminder',
    message: 'Order ORD-2026-001 is scheduled for delivery tomorrow.',
    time: '1 day ago',
    isRead: true,
    orderNumber: 'ORD-2026-001',
    createdAt: new Date('2026-01-22T14:00:00'),
  },
  {
    id: 4,
    type: 'success',
    title: 'Order Delivered',
    message: 'Order ORD-2026-003 for Onions has been successfully delivered.',
    time: '2 days ago',
    isRead: true,
    orderNumber: 'ORD-2026-003',
    createdAt: new Date('2026-01-21T10:00:00'),
  },
  {
    id: 5,
    type: 'info',
    title: 'New Order Request',
    message: 'You have received a new order request from Keells Super for Rice.',
    time: '3 days ago',
    isRead: false,
    orderNumber: 'ORD-2026-002',
    createdAt: new Date('2026-01-20T09:00:00'),
  },
  {
    id: 6,
    type: 'warning',
    title: 'Order Cancelled',
    message: 'Order ORD-2026-004 for Carrots has been cancelled by the buyer.',
    time: '3 days ago',
    isRead: true,
    orderNumber: 'ORD-2026-004',
    createdAt: new Date('2026-01-20T09:00:00'),
  },
];

const NotificationCard = ({ notification, onPress, onDelete, isSelecting, isSelected, onSelect }) => {
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

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return 'checkmark-circle';
      case 'info':
        return 'information-circle';
      case 'warning':
        return 'warning';
      default:
        return 'notifications';
    }
  };

  return (
      <TouchableOpacity
          style={[
            styles.notificationCard,
            { borderLeftColor: getBorderColor() },
            !notification.isRead && styles.unreadCard,
            isSelected && styles.selectedCard
          ]}
          onPress={() => isSelecting ? onSelect(notification.id) : onPress(notification)}
          onLongPress={() => onSelect(notification.id)}
          activeOpacity={0.7}
      >
        <View style={styles.cardContent}>
          {isSelecting && (
              <View style={styles.checkboxContainer}>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={16} color={COLORS.common.white} />}
                </View>
              </View>
          )}

          <View style={[styles.iconContainer, { backgroundColor: getBorderColor() + '20' }]}>
            <Ionicons name={getIcon()} size={24} color={getBorderColor()} />
          </View>

          <View style={styles.textContent}>
            <View style={styles.titleRow}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              {!notification.isRead && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
            <Text style={styles.notificationTime}>{notification.time}</Text>
          </View>

          {!isSelecting && (
              <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onDelete(notification.id)}
              >
                <Ionicons name="trash-outline" size={20} color={COLORS.common.gray400} />
              </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
  );
};

// Notification Detail Modal
const NotificationDetailModal = ({ visible, onClose, notification, onMarkAsRead, onViewOrder }) => {
  if (!notification) return null;

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

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return 'checkmark-circle';
      case 'info':
        return 'information-circle';
      case 'warning':
        return 'warning';
      default:
        return 'notifications';
    }
  };

  return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.common.gray800} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Notification Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.modalBody}>
              <View style={[styles.modalIconContainer, { backgroundColor: getBorderColor() + '20' }]}>
                <Ionicons name={getIcon()} size={48} color={getBorderColor()} />
              </View>

              <Text style={styles.modalNotificationTitle}>{notification.title}</Text>
              <Text style={styles.modalNotificationMessage}>{notification.message}</Text>
              <Text style={styles.modalNotificationTime}>{notification.time}</Text>

              {notification.orderNumber && (
                  <View style={styles.orderInfoCard}>
                    <Ionicons name="document-text-outline" size={20} color={COLORS.farmer.primary} />
                    <Text style={styles.orderInfoText}>Order: {notification.orderNumber}</Text>
                  </View>
              )}

              <View style={styles.modalActions}>
                {!notification.isRead && (
                    <TouchableOpacity
                        style={[styles.modalButton, styles.markReadButton]}
                        onPress={() => {
                          onMarkAsRead(notification.id);
                          onClose();
                        }}
                    >
                      <Ionicons name="checkmark-done" size={20} color={COLORS.common.white} />
                      <Text style={styles.modalButtonText}>Mark as Read</Text>
                    </TouchableOpacity>
                )}

                {notification.orderNumber && (
                    <TouchableOpacity
                        style={[styles.modalButton, styles.viewOrderButton]}
                        onPress={() => {
                          onViewOrder(notification.orderNumber);
                          onClose();
                        }}
                    >
                      <Ionicons name="eye-outline" size={20} color={COLORS.farmer.primary} />
                      <Text style={[styles.modalButtonText, { color: COLORS.farmer.primary }]}>
                        See Order Details
                      </Text>
                    </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
  );
};

const FarmerNotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(sampleNotificationsData);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Filter notifications
  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.isRead);
      case 'read':
        return notifications.filter(n => n.isRead);
      default:
        return notifications;
    }
  };

  const handleNotificationPress = (notification) => {
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    Alert.alert(
        'Mark All as Read',
        'Are you sure you want to mark all notifications as read?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: () => {
              setNotifications(notifications.map(n => ({ ...n, isRead: true })));
              Alert.alert('Success', 'All notifications marked as read');
            }
          }
        ]
    );
  };

  const handleDeleteNotification = (id) => {
    Alert.alert(
        'Delete Notification',
        'Are you sure you want to delete this notification?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setNotifications(notifications.filter(n => n.id !== id));
              Alert.alert('Success', 'Notification deleted');
            }
          }
        ]
    );
  };

  const handleSelectNotification = (id) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectedIds([id]);
    } else {
      if (selectedIds.includes(id)) {
        const newSelected = selectedIds.filter(selectedId => selectedId !== id);
        setSelectedIds(newSelected);
        if (newSelected.length === 0) {
          setIsSelecting(false);
        }
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const handleDeleteSelected = () => {
    Alert.alert(
        'Delete Notifications',
        `Are you sure you want to delete ${selectedIds.length} notification(s)?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              setNotifications(notifications.filter(n => !selectedIds.includes(n.id)));
              setSelectedIds([]);
              setIsSelecting(false);
              Alert.alert('Success', `${selectedIds.length} notification(s) deleted`);
            }
          }
        ]
    );
  };

  const handleSelectAll = () => {
    const filteredNotifs = getFilteredNotifications();
    if (selectedIds.length === filteredNotifs.length) {
      setSelectedIds([]);
      setIsSelecting(false);
    } else {
      setSelectedIds(filteredNotifs.map(n => n.id));
      setIsSelecting(true);
    }
  };

  const handleCancelSelection = () => {
    setSelectedIds([]);
    setIsSelecting(false);
  };

  const handleViewOrder = (orderNumber) => {
    // Navigate to orders screen with the specific order
    // This assumes you have navigation set up
    if (navigation) {
      navigation.navigate('FarmerOrders', {
        openOrder: orderNumber,
        highlightOrder: true
      });
    } else {
      Alert.alert('Navigate to Orders', `Opening order ${orderNumber}`);
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
      <View style={styles.container}>
        <Header
            title="Notifications"
            rightComponent={
                unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                )
            }
        />

        {/* Action Bar */}
        <View style={styles.actionBar}>
          {isSelecting ? (
              <>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleCancelSelection}
                >
                  <Ionicons name="close" size={20} color={COLORS.common.gray600} />
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>

                <Text style={styles.selectedCount}>
                  {selectedIds.length} selected
                </Text>

                <View style={styles.actionButtonsRight}>
                  <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleSelectAll}
                  >
                    <Ionicons
                        name={selectedIds.length === filteredNotifications.length ? "checkbox" : "square-outline"}
                        size={20}
                        color={COLORS.farmer.primary}
                    />
                    <Text style={styles.actionButtonText}>All</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                      style={[styles.actionButton, selectedIds.length === 0 && styles.disabledButton]}
                      onPress={handleDeleteSelected}
                      disabled={selectedIds.length === 0}
                  >
                    <Ionicons name="trash-outline" size={20} color={COLORS.common.error} />
                    <Text style={[styles.actionButtonText, { color: COLORS.common.error }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </>
          ) : (
              <>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterContainer}
                >
                  <TouchableOpacity
                      style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                      onPress={() => setFilter('all')}
                  >
                    <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
                      All ({notifications.length})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[styles.filterButton, filter === 'unread' && styles.filterButtonActive]}
                      onPress={() => setFilter('unread')}
                  >
                    <Text style={[styles.filterButtonText, filter === 'unread' && styles.filterButtonTextActive]}>
                      Unread ({unreadCount})
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[styles.filterButton, filter === 'read' && styles.filterButtonActive]}
                      onPress={() => setFilter('read')}
                  >
                    <Text style={[styles.filterButtonText, filter === 'read' && styles.filterButtonTextActive]}>
                      Read ({notifications.length - unreadCount})
                    </Text>
                  </TouchableOpacity>
                </ScrollView>

                {unreadCount > 0 && (
                    <TouchableOpacity
                        style={styles.markAllButton}
                        onPress={handleMarkAllAsRead}
                    >
                      <Ionicons name="checkmark-done-outline" size={20} color={COLORS.farmer.primary} />
                    </TouchableOpacity>
                )}
              </>
          )}
        </View>

        {/* Notifications List */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {filteredNotifications.length > 0 ? (
              <View style={styles.section}>
                {filteredNotifications.map((notification) => (
                    <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onPress={handleNotificationPress}
                        onDelete={handleDeleteNotification}
                        isSelecting={isSelecting}
                        isSelected={selectedIds.includes(notification.id)}
                        onSelect={handleSelectNotification}
                    />
                ))}
              </View>
          ) : (
              <View style={styles.emptyState}>
                <Ionicons name="notifications-off-outline" size={64} color={COLORS.common.gray300} />
                <Text style={styles.emptyStateText}>No notifications</Text>
                <Text style={styles.emptyStateSubtext}>
                  {filter === 'unread' ? 'You have no unread notifications' :
                      filter === 'read' ? 'You have no read notifications' :
                          'You have no notifications yet'}
                </Text>
              </View>
          )}
        </ScrollView>

        {/* Notification Detail Modal */}
        <NotificationDetailModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            notification={selectedNotification}
            onMarkAsRead={handleMarkAsRead}
            onViewOrder={handleViewOrder}
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.common.gray50,
  },
  badge: {
    backgroundColor: COLORS.common.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: COLORS.common.white,
    fontSize: 12,
    fontWeight: '700',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.common.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  filterContainer: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.common.gray100,
  },
  filterButtonActive: {
    backgroundColor: COLORS.farmer.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.common.gray600,
  },
  filterButtonTextActive: {
    color: COLORS.common.white,
  },
  markAllButton: {
    padding: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.common.gray600,
  },
  actionButtonsRight: {
    flexDirection: 'row',
    gap: 8,
  },
  selectedCount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.gray800,
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  notificationCard: {
    backgroundColor: COLORS.common.white,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    backgroundColor: COLORS.farmer.primary + '05',
  },
  selectedCard: {
    backgroundColor: COLORS.farmer.primary + '10',
    borderColor: COLORS.farmer.primary,
    borderWidth: 2,
    borderLeftWidth: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkboxContainer: {
    paddingTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.common.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.farmer.primary,
    borderColor: COLORS.farmer.primary,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.gray800,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.farmer.primary,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.common.gray600,
    marginBottom: 8,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.common.gray500,
  },
  deleteButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.common.gray600,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.common.gray500,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.common.white,
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.common.gray800,
  },
  modalBody: {
    padding: 24,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalNotificationTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.common.gray800,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalNotificationMessage: {
    fontSize: 16,
    color: COLORS.common.gray600,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  modalNotificationTime: {
    fontSize: 14,
    color: COLORS.common.gray500,
    marginBottom: 20,
  },
  orderInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.farmer.primary + '10',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  orderInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.farmer.primary,
  },
  modalActions: {
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  markReadButton: {
    backgroundColor: COLORS.farmer.primary,
    borderColor: COLORS.farmer.primary,
  },
  viewOrderButton: {
    backgroundColor: COLORS.common.white,
    borderColor: COLORS.farmer.primary,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.white,
  },
});

export default FarmerNotificationsScreen;