import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import { COLORS } from '../../utils/colors';

// Sample orders data for supermarket (buyer perspective)
const sampleOrdersData = [
  {
    id: 1,
    orderNumber: 'ORD-2026-001',
    crop: 'Tomatoes',
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 75,
    totalAmount: 37500,
    status: 'confirmed',
    farmer: {
      name: 'Silva Farms',
      contact: '+94 77 123 4567',
      location: 'Nuwara Eliya',
    },
    deliveryDate: '2026-02-05',
    orderDate: '2026-02-01',
    deliveryAddress: 'Keells Super - Kandy Branch, Main Street',
    paymentStatus: 'advance_paid',
    notes: 'Fresh organic tomatoes required',
    timeline: [
      { status: 'placed', date: '2026-02-01 10:30 AM', completed: true },
      { status: 'accepted', date: '2026-02-01 02:15 PM', completed: true },
      { status: 'preparing', date: '', completed: false },
      { status: 'shipped', date: '', completed: false },
      { status: 'delivered', date: '', completed: false },
    ],
  },
  {
    id: 2,
    orderNumber: 'ORD-2026-002',
    crop: 'Rice',
    quantity: 1000,
    unit: 'kg',
    pricePerUnit: 105,
    totalAmount: 105000,
    status: 'shipped',
    farmer: {
      name: 'Fernando Farms',
      contact: '+94 77 987 6543',
      location: 'Polonnaruwa',
    },
    deliveryDate: '2026-02-04',
    orderDate: '2026-01-28',
    deliveryAddress: 'Keells Distribution Center, Colombo',
    paymentStatus: 'pending',
    notes: 'Premium quality Samba rice',
    timeline: [
      { status: 'placed', date: '2026-01-28 09:00 AM', completed: true },
      { status: 'accepted', date: '2026-01-28 11:30 AM', completed: true },
      { status: 'preparing', date: '2026-01-30 08:00 AM', completed: true },
      { status: 'shipped', date: '2026-02-02 07:00 AM', completed: true },
      { status: 'delivered', date: '', completed: false },
    ],
  },
  {
    id: 3,
    orderNumber: 'ORD-2026-003',
    crop: 'Onions',
    quantity: 300,
    unit: 'kg',
    pricePerUnit: 115,
    totalAmount: 34500,
    status: 'delivered',
    farmer: {
      name: 'Kumar Vegetables',
      contact: '+94 77 555 1234',
      location: 'Dambulla',
    },
    deliveryDate: '2026-01-25',
    orderDate: '2026-01-20',
    deliveryAddress: 'Keells Super - Galle Branch',
    paymentStatus: 'paid',
    notes: '',
    timeline: [
      { status: 'placed', date: '2026-01-20 02:00 PM', completed: true },
      { status: 'accepted', date: '2026-01-20 03:30 PM', completed: true },
      { status: 'preparing', date: '2026-01-22 09:00 AM', completed: true },
      { status: 'shipped', date: '2026-01-24 07:00 AM', completed: true },
      { status: 'delivered', date: '2026-01-25 10:00 AM', completed: true },
    ],
  },
  {
    id: 4,
    orderNumber: 'ORD-2026-004',
    crop: 'Carrots',
    quantity: 200,
    unit: 'kg',
    pricePerUnit: 85,
    totalAmount: 17000,
    status: 'rejected',
    farmer: {
      name: 'Green Valley Farms',
      contact: '+94 77 222 8888',
      location: 'Nuwara Eliya',
    },
    deliveryDate: '2026-02-06',
    orderDate: '2026-02-01',
    deliveryAddress: 'Keells Super - Negombo Branch',
    paymentStatus: 'cancelled',
    notes: 'Order rejected due to unavailability',
    timeline: [
      { status: 'placed', date: '2026-02-01 11:00 AM', completed: true },
      { status: 'rejected', date: '2026-02-01 03:00 PM', completed: true },
    ],
  },
  {
    id: 5,
    orderNumber: 'ORD-2026-005',
    crop: 'Coconut',
    quantity: 500,
    unit: 'units',
    pricePerUnit: 45,
    totalAmount: 22500,
    status: 'pending',
    farmer: {
      name: 'Coastal Coconuts',
      contact: '+94 77 333 9999',
      location: 'Kurunegala',
    },
    deliveryDate: '2026-02-08',
    orderDate: '2026-02-03',
    deliveryAddress: 'Keells Super - Colombo 05',
    paymentStatus: 'pending',
    notes: 'King coconuts preferred',
    timeline: [
      { status: 'placed', date: '2026-02-03 09:30 AM', completed: true },
      { status: 'accepted', date: '', completed: false },
      { status: 'preparing', date: '', completed: false },
      { status: 'shipped', date: '', completed: false },
      { status: 'delivered', date: '', completed: false },
    ],
  },
];

// Order Card Component
const OrderCard = ({ order, onPress }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'accepted': return '#3b82f6';
      case 'preparing': return '#8b5cf6';
      case 'shipped': return '#06b6d4';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'rejected': return '#ef4444';
      default: return COLORS.common.gray600;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'confirmed': return 'checkmark-circle-outline';
      case 'accepted': return 'checkmark-circle-outline';
      case 'preparing': return 'cube-outline';
      case 'shipped': return 'car-outline';
      case 'delivered': return 'checkmark-done-circle-outline';
      case 'cancelled': return 'close-circle-outline';
      case 'rejected': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const getPaymentStatusBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case 'paid':
        return { text: 'Paid', color: '#10b981' };
      case 'advance_paid':
        return { text: 'Advance Paid', color: '#3b82f6' };
      case 'pending':
        return { text: 'Payment Pending', color: '#f59e0b' };
      case 'cancelled':
        return { text: 'Cancelled', color: '#6b7280' };
      default:
        return { text: 'Unknown', color: '#6b7280' };
    }
  };

  const statusColor = getStatusColor(order.status);
  const paymentBadge = getPaymentStatusBadge(order.paymentStatus);

  return (
      <TouchableOpacity style={styles.orderCard} onPress={() => onPress(order)}>
        <View style={styles.orderCardHeader}>
          <View>
            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
            <Text style={styles.orderFarmer}>From: {order.farmer.name}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
            <Ionicons name={getStatusIcon(order.status)} size={16} color={statusColor} />
            <Text style={[styles.statusText, { color: statusColor }]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.orderDetails}>
          <View style={styles.orderDetailRow}>
            <Ionicons name="leaf-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.orderDetailText}>{order.crop} - {order.quantity} {order.unit}</Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Ionicons name="cash-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.orderDetailText}>Rs. {order.totalAmount.toLocaleString()}</Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Ionicons name="calendar-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.orderDetailText}>Delivery: {order.deliveryDate}</Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={[styles.paymentBadge, { backgroundColor: paymentBadge.color + '20' }]}>
            <Text style={[styles.paymentBadgeText, { color: paymentBadge.color }]}>
              {paymentBadge.text}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.common.gray400} />
        </View>
      </TouchableOpacity>
  );
};

// Create New Order Modal (Request Quote from Farmer)
const CreateOrderModal = ({ visible, onClose, onSave }) => {
  const [newOrder, setNewOrder] = useState({
    crop: '',
    quantity: '',
    unit: 'kg',
    expectedPrice: '',
    farmerName: '',
    deliveryDate: '',
    deliveryAddress: '',
    notes: '',
  });

  const handleSave = () => {
    // Validation
    if (!newOrder.crop || !newOrder.quantity || !newOrder.deliveryDate || !newOrder.deliveryAddress) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const order = {
      id: Date.now(),
      orderNumber: `ORD-2026-${String(Date.now()).slice(-3)}`,
      crop: newOrder.crop,
      quantity: parseInt(newOrder.quantity),
      unit: newOrder.unit,
      pricePerUnit: 0,
      totalAmount: 0,
      status: 'pending',
      farmer: {
        name: newOrder.farmerName || 'To be assigned',
        contact: '',
        location: '',
      },
      deliveryDate: newOrder.deliveryDate,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryAddress: newOrder.deliveryAddress,
      paymentStatus: 'pending',
      notes: newOrder.notes,
      timeline: [
        { status: 'placed', date: new Date().toLocaleTimeString(), completed: true },
        { status: 'accepted', date: '', completed: false },
        { status: 'preparing', date: '', completed: false },
        { status: 'shipped', date: '', completed: false },
        { status: 'delivered', date: '', completed: false },
      ],
    };

    onSave(order);
    setNewOrder({
      crop: '',
      quantity: '',
      unit: 'kg',
      expectedPrice: '',
      farmerName: '',
      deliveryDate: '',
      deliveryAddress: '',
      notes: '',
    });
    onClose();
  };

  return (
      <Modal visible={visible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Place New Order</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color={COLORS.common.gray800} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Product Details */}
              <Text style={styles.inputLabel}>Product *</Text>
              <TextInput
                  style={styles.input}
                  placeholder="e.g., Tomatoes, Rice, Onions"
                  value={newOrder.crop}
                  onChangeText={(value) => setNewOrder({ ...newOrder, crop: value })}
              />

              <Text style={styles.inputLabel}>Quantity *</Text>
              <View style={styles.quantityInputRow}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter quantity"
                    value={newOrder.quantity}
                    onChangeText={(value) => setNewOrder({ ...newOrder, quantity: value })}
                    keyboardType="numeric"
                />
                <View style={styles.unitPicker}>
                  <TouchableOpacity
                      style={[styles.unitOption, newOrder.unit === 'kg' && styles.unitOptionActive]}
                      onPress={() => setNewOrder({ ...newOrder, unit: 'kg' })}
                  >
                    <Text style={[styles.unitOptionText, newOrder.unit === 'kg' && styles.unitOptionTextActive]}>
                      kg
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                      style={[styles.unitOption, newOrder.unit === 'units' && styles.unitOptionActive]}
                      onPress={() => setNewOrder({ ...newOrder, unit: 'units' })}
                  >
                    <Text style={[styles.unitOptionText, newOrder.unit === 'units' && styles.unitOptionTextActive]}>
                      units
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.inputLabel}>Expected Price (Optional)</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Expected price per unit (Rs.)"
                  value={newOrder.expectedPrice}
                  onChangeText={(value) => setNewOrder({ ...newOrder, expectedPrice: value })}
                  keyboardType="numeric"
              />

              {/* Delivery Details */}
              <Text style={styles.inputLabel}>Delivery Date *</Text>
              <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  value={newOrder.deliveryDate}
                  onChangeText={(value) => setNewOrder({ ...newOrder, deliveryDate: value })}
              />

              <Text style={styles.inputLabel}>Delivery Address *</Text>
              <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter full delivery address"
                  value={newOrder.deliveryAddress}
                  onChangeText={(value) => setNewOrder({ ...newOrder, deliveryAddress: value })}
                  multiline
                  numberOfLines={3}
              />

              {/* Optional Farmer Preference */}
              <Text style={styles.inputLabel}>Preferred Farmer (Optional)</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Enter farmer name if you have preference"
                  value={newOrder.farmerName}
                  onChangeText={(value) => setNewOrder({ ...newOrder, farmerName: value })}
              />

              {/* Notes */}
              <Text style={styles.inputLabel}>Special Requirements</Text>
              <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Any special requirements or notes"
                  value={newOrder.notes}
                  onChangeText={(value) => setNewOrder({ ...newOrder, notes: value })}
                  multiline
                  numberOfLines={3}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createButton} onPress={handleSave}>
                <Text style={styles.createButtonText}>Place Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  );
};

// Main Screen Component
const SupermarketOrdersScreen = () => {
  const [orders, setOrders] = useState(sampleOrdersData);
  const [filteredOrders, setFilteredOrders] = useState(sampleOrdersData);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === status));
    }
  };

  const handleOrderPress = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleCreateOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
    setFilteredOrders([newOrder, ...filteredOrders]);
    Alert.alert('Success', 'Order placed successfully! Waiting for farmer confirmation.');
  };

  const handleCancelOrder = () => {
    Alert.alert(
        'Cancel Order',
        'Are you sure you want to cancel this order?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: () => {
              const updatedOrders = orders.map(order =>
                  order.id === selectedOrder.id
                      ? { ...order, status: 'cancelled', paymentStatus: 'cancelled' }
                      : order
              );
              setOrders(updatedOrders);
              setFilteredOrders(updatedOrders);
              setShowDetailModal(false);
              Alert.alert('Order Cancelled', 'Your order has been cancelled.');
            }
          }
        ]
    );
  };

  const handleMakePayment = () => {
    Alert.alert(
        'Make Payment',
        `Pay Rs. ${selectedOrder.totalAmount.toLocaleString()} for this order?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Pay Now',
            onPress: () => {
              const updatedOrders = orders.map(order =>
                  order.id === selectedOrder.id
                      ? { ...order, paymentStatus: 'paid' }
                      : order
              );
              setOrders(updatedOrders);
              setFilteredOrders(updatedOrders);
              Alert.alert('Payment Successful', 'Payment has been processed.');
            }
          }
        ]
    );
  };

  return (
      <View style={styles.container}>
        <Header title="My Orders" />

        {/* Filter Bar */}
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterOptions.map((option) => (
                <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterChip,
                      filterStatus === option.value && styles.filterChipActive
                    ]}
                    onPress={() => handleFilterChange(option.value)}
                >
                  <Text
                      style={[
                        styles.filterChipText,
                        filterStatus === option.value && styles.filterChipTextActive
                      ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
        >
          <View style={styles.section}>
            {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} onPress={handleOrderPress} />
                ))
            ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="cart-outline" size={64} color={COLORS.common.gray300} />
                  <Text style={styles.emptyStateText}>No orders found</Text>
                  <Text style={styles.emptyStateSubtext}>
                    {filterStatus === 'all'
                        ? 'Place your first order to get started'
                        : `No ${filterStatus} orders`}
                  </Text>
                </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
            style={styles.fab}
            onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={28} color={COLORS.common.white} />
        </TouchableOpacity>

        {/* Create Order Modal */}
        <CreateOrderModal
            visible={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSave={handleCreateOrder}
        />

        {/* Order Detail Modal */}
        {selectedOrder && (
            <Modal visible={showDetailModal} animationType="slide">
              <View style={styles.detailContainer}>
                <View style={styles.detailHeader}>
                  <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.common.gray800} />
                  </TouchableOpacity>
                  <Text style={styles.detailHeaderTitle}>Order Details</Text>
                  <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
                  {/* Order Info */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailOrderNumber}>{selectedOrder.orderNumber}</Text>
                    <View style={styles.detailStatusRow}>
                      <View
                          style={[
                            styles.detailStatusBadge,
                            { backgroundColor: getStatusColor(selectedOrder.status) + '20' }
                          ]}
                      >
                        <Text
                            style={[
                              styles.detailStatusText,
                              { color: getStatusColor(selectedOrder.status) }
                            ]}
                        >
                          {selectedOrder.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Timeline */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionLabel}>Order Timeline</Text>
                    <View style={styles.timeline}>
                      {selectedOrder.timeline.map((item, index) => (
                          <View key={index} style={styles.timelineItem}>
                            <View style={styles.timelineLeft}>
                              <View
                                  style={[
                                    styles.timelineDot,
                                    item.completed && styles.timelineDotCompleted
                                  ]}
                              />
                              {index < selectedOrder.timeline.length - 1 && (
                                  <View
                                      style={[
                                        styles.timelineLine,
                                        item.completed && styles.timelineLineCompleted
                                      ]}
                                  />
                              )}
                            </View>
                            <View style={styles.timelineRight}>
                              <Text style={styles.timelineStatus}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Text>
                              {item.date && (
                                  <Text style={styles.timelineDate}>{item.date}</Text>
                              )}
                            </View>
                          </View>
                      ))}
                    </View>
                  </View>

                  {/* Product Details */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionLabel}>Product Details</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Product</Text>
                      <Text style={styles.detailValue}>{selectedOrder.crop}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Quantity</Text>
                      <Text style={styles.detailValue}>{selectedOrder.quantity} {selectedOrder.unit}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Price per Unit</Text>
                      <Text style={styles.detailValue}>Rs. {selectedOrder.pricePerUnit.toLocaleString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Total Amount</Text>
                      <Text style={styles.detailValueBold}>Rs. {selectedOrder.totalAmount.toLocaleString()}</Text>
                    </View>
                  </View>

                  {/* Farmer Details */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionLabel}>Farmer Details</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Farmer Name</Text>
                      <Text style={styles.detailValue}>{selectedOrder.farmer.name}</Text>
                    </View>
                    {selectedOrder.farmer.contact && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Contact</Text>
                          <Text style={[styles.detailValue, styles.linkText]}>
                            {selectedOrder.farmer.contact}
                          </Text>
                        </View>
                    )}
                    {selectedOrder.farmer.location && (
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Location</Text>
                          <Text style={styles.detailValue}>{selectedOrder.farmer.location}</Text>
                        </View>
                    )}
                  </View>

                  {/* Delivery Information */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionLabel}>Delivery Information</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Expected Date</Text>
                      <Text style={styles.detailValue}>{selectedOrder.deliveryDate}</Text>
                    </View>
                    <View style={styles.detailRowColumn}>
                      <Text style={styles.detailLabel}>Delivery Address</Text>
                      <Text style={[styles.detailValue, { marginTop: 4 }]}>
                        {selectedOrder.deliveryAddress}
                      </Text>
                    </View>
                  </View>

                  {/* Payment Information */}
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionLabel}>Payment Information</Text>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Payment Status</Text>
                      <View
                          style={[
                            styles.paymentStatusBadge,
                            { backgroundColor: getPaymentStatusBadge(selectedOrder.paymentStatus).color + '20' }
                          ]}
                      >
                        <Text
                            style={[
                              styles.paymentStatusText,
                              { color: getPaymentStatusBadge(selectedOrder.paymentStatus).color }
                            ]}
                        >
                          {getPaymentStatusBadge(selectedOrder.paymentStatus).text}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Notes */}
                  {selectedOrder.notes && (
                      <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Special Requirements</Text>
                        <Text style={styles.detailValue}>{selectedOrder.notes}</Text>
                      </View>
                  )}

                  {/* Action Buttons */}
                  {selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'rejected' && (
                      <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Actions</Text>
                        <View style={styles.statusButtonsRow}>
                          {selectedOrder.paymentStatus === 'pending' && selectedOrder.status === 'confirmed' && (
                              <TouchableOpacity
                                  style={[
                                    styles.statusActionButton,
                                    { backgroundColor: COLORS.supermarket.primary }
                                  ]}
                                  onPress={handleMakePayment}
                              >
                                <Ionicons name="card-outline" size={18} color={COLORS.common.white} />
                                <Text style={[styles.statusActionText, { color: COLORS.common.white }]}>
                                  Make Payment
                                </Text>
                              </TouchableOpacity>
                          )}
                          {(selectedOrder.status === 'pending' || selectedOrder.status === 'confirmed') && (
                              <TouchableOpacity
                                  style={[
                                    styles.statusActionButton,
                                    { backgroundColor: COLORS.common.error }
                                  ]}
                                  onPress={handleCancelOrder}
                              >
                                <Ionicons name="close-circle-outline" size={18} color={COLORS.common.white} />
                                <Text style={[styles.statusActionText, { color: COLORS.common.white }]}>
                                  Cancel Order
                                </Text>
                              </TouchableOpacity>
                          )}
                        </View>
                      </View>
                  )}
                </ScrollView>
              </View>
            </Modal>
        )}
      </View>
  );
};

// Helper function (outside component)
const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return '#f59e0b';
    case 'confirmed': return '#3b82f6';
    case 'accepted': return '#3b82f6';
    case 'preparing': return '#8b5cf6';
    case 'shipped': return '#06b6d4';
    case 'delivered': return '#10b981';
    case 'cancelled': return '#ef4444';
    case 'rejected': return '#ef4444';
    default: return COLORS.common.gray600;
  }
};

const getPaymentStatusBadge = (paymentStatus) => {
  switch (paymentStatus) {
    case 'paid':
      return { text: 'Paid', color: '#10b981' };
    case 'advance_paid':
      return { text: 'Advance Paid', color: '#3b82f6' };
    case 'pending':
      return { text: 'Payment Pending', color: '#f59e0b' };
    case 'cancelled':
      return { text: 'Cancelled', color: '#6b7280' };
    default:
      return { text: 'Unknown', color: '#6b7280' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.common.gray50,
  },
  filterBar: {
    backgroundColor: COLORS.common.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: COLORS.common.gray100,
  },
  filterChipActive: {
    backgroundColor: COLORS.supermarket.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.common.gray600,
  },
  filterChipTextActive: {
    color: COLORS.common.white,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  orderCard: {
    backgroundColor: COLORS.common.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.common.gray800,
    marginBottom: 4,
  },
  orderFarmer: {
    fontSize: 14,
    color: COLORS.common.gray600,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    gap: 8,
    marginBottom: 12,
  },
  orderDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderDetailText: {
    fontSize: 14,
    color: COLORS.common.gray700,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.common.gray200,
  },
  paymentBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  paymentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.supermarket.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.common.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.common.gray200,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.common.gray300,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.gray600,
  },
  createButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.supermarket.primary,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.white,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.gray700,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: COLORS.common.white,
    borderWidth: 1,
    borderColor: COLORS.common.gray300,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.common.gray800,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  quantityInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  unitPicker: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.common.gray300,
    borderRadius: 8,
    overflow: 'hidden',
  },
  unitOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.common.white,
  },
  unitOptionActive: {
    backgroundColor: COLORS.supermarket.primary,
  },
  unitOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.common.gray600,
  },
  unitOptionTextActive: {
    color: COLORS.common.white,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: COLORS.common.gray50,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.common.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  detailHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.common.gray800,
  },
  detailContent: {
    flex: 1,
  },
  detailSection: {
    backgroundColor: COLORS.common.white,
    padding: 16,
    marginTop: 12,
  },
  detailOrderNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.common.gray800,
    marginBottom: 8,
  },
  detailStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  detailStatusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.gray600,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 50,
  },
  timelineLeft: {
    width: 30,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.common.gray300,
    borderWidth: 2,
    borderColor: COLORS.common.white,
  },
  timelineDotCompleted: {
    backgroundColor: COLORS.supermarket.primary,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.common.gray300,
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: COLORS.supermarket.primary,
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 16,
  },
  timelineStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.gray800,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: COLORS.common.gray600,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  detailRowColumn: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  detailLabel: {
    fontSize: 14,
    color: COLORS.common.gray600,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.common.gray800,
  },
  detailValueBold: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.supermarket.primary,
  },
  linkText: {
    color: COLORS.supermarket.primary,
    textDecorationLine: 'underline',
  },
  paymentStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  paymentStatusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  statusActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
  },
  statusActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SupermarketOrdersScreen;