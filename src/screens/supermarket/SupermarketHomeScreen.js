// Copy this file to: src/screens/supermarket/SupermarketHomeScreen.js

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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import { COLORS } from '../../utils/colors';

// Mock data for available crops from farmers
const availableCrops = [
  { id: 1, crop: 'Tomatoes', farmer: 'Kamal Silva Farm', quantity: 500, price: 75, location: 'Kandy District', rating: 4.5, harvestDate: '2026-02-01' },
  { id: 2, crop: 'Rice', farmer: 'Green Valley Farms', quantity: 1000, price: 105, location: 'Anuradhapura', rating: 4.8, harvestDate: '2026-02-05' },
  { id: 3, crop: 'Onions', farmer: 'Highland Produce', quantity: 300, price: 115, location: 'Nuwara Eliya', rating: 4.6, harvestDate: '2026-01-30' },
  { id: 4, crop: 'Carrots', farmer: 'Organic Fields', quantity: 400, price: 85, location: 'Badulla', rating: 4.7, harvestDate: '2026-02-03' },
  { id: 5, crop: 'Cabbage', farmer: 'Kamal Silva Farm', quantity: 250, price: 55, location: 'Kandy District', rating: 4.5, harvestDate: '2026-01-28' },
];

// Mock data for partner farmers
const partnerFarmers = [
  { id: 1, name: 'Kamal Silva Farm', location: 'Kandy District', crops: ['Tomatoes', 'Cabbage', 'Carrots'], rating: 4.5, totalOrders: 45, activeListings: 3 },
  { id: 2, name: 'Green Valley Farms', location: 'Anuradhapura', crops: ['Rice', 'Potatoes'], rating: 4.8, totalOrders: 62, activeListings: 2 },
  { id: 3, name: 'Highland Produce', location: 'Nuwara Eliya', crops: ['Onions', 'Beans', 'Cabbage'], rating: 4.6, totalOrders: 38, activeListings: 4 },
  { id: 4, name: 'Organic Fields', location: 'Badulla', crops: ['Carrots', 'Tomatoes'], rating: 4.7, totalOrders: 51, activeListings: 2 },
];

// Initial purchase goals (buyer inventory)
const initialPurchaseGoals = [
  { crop: 'Tomatoes', targetQuantity: 800, purchasedQuantity: 500, remainingQuantity: 300, unit: 'kg', targetPrice: 75 },
  { crop: 'Rice', targetQuantity: 1500, purchasedQuantity: 1000, remainingQuantity: 500, unit: 'kg', targetPrice: 105 },
  { crop: 'Onions', targetQuantity: 600, purchasedQuantity: 300, remainingQuantity: 300, unit: 'kg', targetPrice: 115 },
];

// Initial order requests
const initialOrderRequests = [
  { id: 1, crop: 'Tomatoes', quantity: 500, farmer: 'Kamal Silva Farm', price: 75, status: 'pending', requestDate: 'Jan 28, 2026', deliveryDate: '2026-02-01' },
  { id: 2, crop: 'Rice', quantity: 1000, farmer: 'Green Valley Farms', price: 105, status: 'approved', requestDate: 'Jan 25, 2026', deliveryDate: '2026-02-05' },
  { id: 3, crop: 'Carrots', quantity: 200, farmer: 'Organic Fields', price: 85, status: 'pending', requestDate: 'Jan 29, 2026', deliveryDate: '2026-02-03' },
];

// Available Crop Card Component
const AvailableCropCard = ({ crop, onPress }) => {
  return (
      <TouchableOpacity style={styles.cropCard} onPress={() => onPress(crop)} activeOpacity={0.7}>
        <View style={styles.cropCardHeader}>
          <Text style={styles.cropCardTitle}>{crop.crop}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text style={styles.ratingText}>{crop.rating}</Text>
          </View>
        </View>

        <Text style={styles.farmerName}>{crop.farmer}</Text>

        <View style={styles.cropCardDetails}>
          <View style={styles.cropCardDetail}>
            <Ionicons name="cube-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.cropCardDetailText}>{crop.quantity} kg</Text>
          </View>
          <View style={styles.cropCardDetail}>
            <Ionicons name="cash-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.cropCardDetailText}>Rs. {crop.price}/kg</Text>
          </View>
          <View style={styles.cropCardDetail}>
            <Ionicons name="location-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.cropCardDetailText}>{crop.location}</Text>
          </View>
        </View>

        <View style={styles.cropCardFooter}>
          <View style={styles.deliveryInfo}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.common.gray500} />
            <Text style={styles.deliveryText}>Available: {crop.harvestDate}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.common.gray400} />
        </View>
      </TouchableOpacity>
  );
};

// Farmer Card Component
const FarmerCard = ({ farmer, onPress }) => {
  return (
      <TouchableOpacity style={styles.farmerCard} onPress={() => onPress(farmer)} activeOpacity={0.7}>
        <View style={styles.farmerCardHeader}>
          <View style={styles.farmerAvatar}>
            <Ionicons name="person" size={24} color={COLORS.supermarket.primary} />
          </View>
          <View style={styles.farmerInfo}>
            <Text style={styles.farmerCardName}>{farmer.name}</Text>
            <View style={styles.farmerLocation}>
              <Ionicons name="location-outline" size={14} color={COLORS.common.gray600} />
              <Text style={styles.farmerLocationText}>{farmer.location}</Text>
            </View>
          </View>
          <View style={styles.farmerRating}>
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text style={styles.farmerRatingText}>{farmer.rating}</Text>
          </View>
        </View>

        <View style={styles.farmerCrops}>
          <Text style={styles.farmerCropsLabel}>Specialties:</Text>
          <View style={styles.cropTags}>
            {farmer.crops.slice(0, 3).map((crop, index) => (
                <View key={index} style={styles.cropTag}>
                  <Text style={styles.cropTagText}>{crop}</Text>
                </View>
            ))}
          </View>
        </View>

        <View style={styles.farmerStats}>
          <View style={styles.farmerStat}>
            <Text style={styles.farmerStatValue}>{farmer.totalOrders}</Text>
            <Text style={styles.farmerStatLabel}>Orders</Text>
          </View>
          <View style={styles.farmerStat}>
            <Text style={styles.farmerStatValue}>{farmer.activeListings}</Text>
            <Text style={styles.farmerStatLabel}>Active Listings</Text>
          </View>
        </View>
      </TouchableOpacity>
  );
};

// Purchase Goal Card Component
const PurchaseGoalCard = ({ item }) => {
  const purchasePercentage = (item.purchasedQuantity / item.targetQuantity) * 100;

  return (
      <View style={styles.purchaseGoalCard}>
        <View style={styles.purchaseGoalHeader}>
          <Text style={styles.purchaseGoalCrop}>{item.crop}</Text>
          <Text style={styles.purchaseGoalTarget}>Target: {item.targetQuantity} {item.unit}</Text>
        </View>

        <View style={styles.purchaseGoalStats}>
          <View style={[styles.purchaseGoalStatBox, { backgroundColor: '#dbeafe' }]}>
            <Text style={styles.purchaseGoalStatLabel}>Purchased</Text>
            <Text style={[styles.purchaseGoalStatValue, { color: '#2563eb' }]}>
              {item.purchasedQuantity} {item.unit}
            </Text>
          </View>
          <View style={[styles.purchaseGoalStatBox, { backgroundColor: '#fee2e2' }]}>
            <Text style={styles.purchaseGoalStatLabel}>Remaining</Text>
            <Text style={[styles.purchaseGoalStatValue, { color: '#dc2626' }]}>
              {item.remainingQuantity} {item.unit}
            </Text>
          </View>
        </View>

        <View style={styles.priceInfo}>
          <Text style={styles.priceInfoText}>Target Price: Rs. {item.targetPrice}/kg</Text>
        </View>

        <View style={styles.purchaseProgressContainer}>
          <View style={styles.purchaseProgressHeader}>
            <Text style={styles.purchaseProgressLabel}>Purchase Progress</Text>
            <Text style={styles.purchaseProgressPercentage}>{Math.round(purchasePercentage)}%</Text>
          </View>
          <View style={styles.purchaseProgressBar}>
            <View style={[styles.purchaseProgressFill, { width: `${purchasePercentage}%` }]} />
          </View>
        </View>
      </View>
  );
};

// Order Request Card Component
const OrderRequestCard = ({ order, onPress }) => {
  const getStatusColor = () => {
    switch (order.status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return COLORS.common.gray600;
    }
  };

  const getStatusText = () => {
    return order.status.charAt(0).toUpperCase() + order.status.slice(1);
  };

  return (
      <TouchableOpacity style={styles.orderCard} onPress={() => onPress(order)} activeOpacity={0.7}>
        <View style={styles.orderCardHeader}>
          <Text style={styles.orderCardCrop}>{order.crop}</Text>
          <View style={[styles.orderStatusBadge, { backgroundColor: getStatusColor() + '20' }]}>
            <View style={[styles.orderStatusDot, { backgroundColor: getStatusColor() }]} />
            <Text style={[styles.orderStatusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
          </View>
        </View>

        <Text style={styles.orderFarmer}>{order.farmer}</Text>

        <View style={styles.orderDetails}>
          <View style={styles.orderDetail}>
            <Ionicons name="cube-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.orderDetailText}>{order.quantity} kg</Text>
          </View>
          <View style={styles.orderDetail}>
            <Ionicons name="cash-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.orderDetailText}>Rs. {order.price}/kg</Text>
          </View>
        </View>

        <View style={styles.orderFooter}>
          <View style={styles.orderDate}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.common.gray500} />
            <Text style={styles.orderDateText}>Delivery: {order.deliveryDate}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.common.gray400} />
        </View>
      </TouchableOpacity>
  );
};

// Crop Detail Modal
const CropDetailModal = ({ visible, onClose, crop, onPlaceOrder }) => {
  if (!crop) return null;

  const [orderQuantity, setOrderQuantity] = useState('');

  const handlePlaceOrder = () => {
    const quantity = parseInt(orderQuantity);
    if (!quantity || quantity <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }
    if (quantity > crop.quantity) {
      Alert.alert('Insufficient Stock', `Only ${crop.quantity} kg available`);
      return;
    }

    onPlaceOrder({
      crop: crop.crop,
      farmer: crop.farmer,
      quantity: quantity,
      price: crop.price,
      deliveryDate: crop.harvestDate,
    });

    Alert.alert('Order Placed', 'Your order request has been sent to the farmer');
    setOrderQuantity('');
    onClose();
  };

  return (
      <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{crop.crop} - Details</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.common.gray600} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.cropDetailSection}>
                <Text style={styles.cropDetailLabel}>Farmer</Text>
                <Text style={styles.cropDetailValue}>{crop.farmer}</Text>
              </View>

              <View style={styles.detailRow}>
                <View style={[styles.cropDetailSection, { flex: 1 }]}>
                  <Text style={styles.cropDetailLabel}>Available Quantity</Text>
                  <Text style={styles.cropDetailValue}>{crop.quantity} kg</Text>
                </View>
                <View style={[styles.cropDetailSection, { flex: 1 }]}>
                  <Text style={styles.cropDetailLabel}>Price per kg</Text>
                  <Text style={styles.cropDetailValue}>Rs. {crop.price}</Text>
                </View>
              </View>

              <View style={styles.cropDetailSection}>
                <Text style={styles.cropDetailLabel}>Location</Text>
                <Text style={styles.cropDetailValue}>{crop.location}</Text>
              </View>

              <View style={styles.cropDetailSection}>
                <Text style={styles.cropDetailLabel}>Available From</Text>
                <Text style={styles.cropDetailValue}>{crop.harvestDate}</Text>
              </View>

              <View style={styles.ratingSection}>
                <Ionicons name="star" size={20} color="#f59e0b" />
                <Text style={styles.ratingDetailText}>Farmer Rating: {crop.rating}/5.0</Text>
              </View>

              <View style={styles.orderFormSection}>
                <Text style={styles.orderFormTitle}>Place Order</Text>
                <Text style={styles.orderFormLabel}>Quantity (kg)</Text>
                <TextInput
                    style={styles.orderInput}
                    placeholder={`Max: ${crop.quantity} kg`}
                    keyboardType="numeric"
                    value={orderQuantity}
                    onChangeText={setOrderQuantity}
                />

                {orderQuantity && (
                    <View style={styles.totalCostBox}>
                      <Text style={styles.totalCostLabel}>Total Cost</Text>
                      <Text style={styles.totalCostValue}>
                        Rs. {(parseInt(orderQuantity) || 0) * crop.price}
                      </Text>
                    </View>
                )}

                <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                  <Text style={styles.placeOrderButtonText}>Place Order Request</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
  );
};

// Farmer Detail Modal
const FarmerDetailModal = ({ visible, onClose, farmer }) => {
  if (!farmer) return null;

  return (
      <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{farmer.name}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.common.gray600} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.farmerDetailHeader}>
                <View style={styles.farmerDetailAvatar}>
                  <Ionicons name="person" size={48} color={COLORS.supermarket.primary} />
                </View>
                <View style={styles.farmerDetailRating}>
                  <Ionicons name="star" size={24} color="#f59e0b" />
                  <Text style={styles.farmerDetailRatingText}>{farmer.rating}/5.0</Text>
                </View>
              </View>

              <View style={styles.cropDetailSection}>
                <Text style={styles.cropDetailLabel}>Location</Text>
                <Text style={styles.cropDetailValue}>{farmer.location}</Text>
              </View>

              <View style={styles.cropDetailSection}>
                <Text style={styles.cropDetailLabel}>Specialty Crops</Text>
                <View style={styles.cropTagsLarge}>
                  {farmer.crops.map((crop, index) => (
                      <View key={index} style={styles.cropTagLarge}>
                        <Text style={styles.cropTagLargeText}>{crop}</Text>
                      </View>
                  ))}
                </View>
              </View>

              <View style={styles.farmerStatsLarge}>
                <View style={styles.farmerStatLarge}>
                  <Ionicons name="receipt-outline" size={24} color={COLORS.supermarket.primary} />
                  <Text style={styles.farmerStatLargeValue}>{farmer.totalOrders}</Text>
                  <Text style={styles.farmerStatLargeLabel}>Total Orders</Text>
                </View>
                <View style={styles.farmerStatLarge}>
                  <Ionicons name="leaf-outline" size={24} color={COLORS.farmer.primary} />
                  <Text style={styles.farmerStatLargeValue}>{farmer.activeListings}</Text>
                  <Text style={styles.farmerStatLargeLabel}>Active Listings</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.viewListingsButton} onPress={onClose}>
                <Text style={styles.viewListingsButtonText}>View All Listings</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.supermarket.primary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
  );
};

// Add Purchase Goal Modal
const AddPurchaseGoalModal = ({ visible, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    crop: '',
    targetQuantity: '',
    targetPrice: '',
  });

  const cropTypes = ['Tomatoes', 'Rice', 'Onions', 'Carrots', 'Cabbage', 'Potatoes', 'Beans'];

  const handleSubmit = () => {
    if (!formData.crop || !formData.targetQuantity || !formData.targetPrice) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    onAdd({
      crop: formData.crop,
      targetQuantity: parseInt(formData.targetQuantity),
      targetPrice: parseFloat(formData.targetPrice),
      purchasedQuantity: 0,
      remainingQuantity: parseInt(formData.targetQuantity),
      unit: 'kg',
    });

    Alert.alert('Success', 'Purchase goal added successfully');
    setFormData({ crop: '', targetQuantity: '', targetPrice: '' });
    onClose();
  };

  return (
      <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Purchase Goal</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.common.gray600} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Crop *</Text>
                <View style={styles.cropSelectorGrid}>
                  {cropTypes.map((crop, index) => (
                      <TouchableOpacity
                          key={index}
                          style={[
                            styles.cropSelectorItem,
                            formData.crop === crop && styles.cropSelectorItemActive
                          ]}
                          onPress={() => setFormData({ ...formData, crop })}
                      >
                        <Text style={styles.cropSelectorText}>{crop}</Text>
                      </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Target Quantity (kg) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., 1000"
                    keyboardType="numeric"
                    value={formData.targetQuantity}
                    onChangeText={(text) => setFormData({ ...formData, targetQuantity: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Target Price (per kg) *</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g., 75"
                    keyboardType="numeric"
                    value={formData.targetPrice}
                    onChangeText={(text) => setFormData({ ...formData, targetPrice: text })}
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Add Goal</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
  );
};

// Main Supermarket Home Screen
const SupermarketHomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [showCropDetailModal, setShowCropDetailModal] = useState(false);
  const [showFarmerDetailModal, setShowFarmerDetailModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  const [purchaseGoals, setPurchaseGoals] = useState(initialPurchaseGoals);
  const [orderRequests, setOrderRequests] = useState(initialOrderRequests);

  const filteredCrops = availableCrops.filter(crop =>
      crop.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.farmer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlaceOrder = (orderData) => {
    const newOrder = {
      id: orderRequests.length + 1,
      ...orderData,
      status: 'pending',
      requestDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
    };

    setOrderRequests(prev => [newOrder, ...prev]);

    // Update purchase goals
    setPurchaseGoals(prev =>
        prev.map(goal =>
            goal.crop === orderData.crop
                ? {
                  ...goal,
                  purchasedQuantity: goal.purchasedQuantity + orderData.quantity,
                  remainingQuantity: goal.remainingQuantity - orderData.quantity,
                }
                : goal
        )
    );
  };

  const handleAddGoal = (goalData) => {
    setPurchaseGoals(prev => [...prev, goalData]);
  };

  return (
      <View style={styles.container}>
        <Header title="Supermarket Dashboard" />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Section */}
          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.statsContainer}
          >
            <StatCard
                icon="cart-outline"
                label="Active Orders"
                value={orderRequests.filter(o => o.status === 'pending').length.toString()}
                color={COLORS.supermarket.primary}
            />
            <StatCard
                icon="people-outline"
                label="Partner Farmers"
                value={partnerFarmers.length.toString()}
                color={COLORS.admin.primary}
            />
            <StatCard
                icon="trending-up-outline"
                label="Purchase Goals"
                value={purchaseGoals.length.toString()}
                color={COLORS.farmer.primary}
            />
          </ScrollView>

          {/* Purchase Goals Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Purchase Goals</Text>
                <Text style={styles.sectionSubtitle}>Track your buying targets</Text>
              </View>
              <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddGoalModal(true)}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Goal</Text>
              </TouchableOpacity>
            </View>

            {purchaseGoals.map((item, index) => (
                <PurchaseGoalCard key={index} item={item} />
            ))}
          </View>

          {/* Order Requests Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Order Requests</Text>
            </View>

            {orderRequests.slice(0, 3).map((order) => (
                <OrderRequestCard key={order.id} order={order} onPress={() => {}} />
            ))}

            {orderRequests.length > 3 && (
                <TouchableOpacity style={styles.viewAllTextButton}>
                  <Text style={styles.viewAllTextButtonText}>View All Orders</Text>
                  <Ionicons name="arrow-forward" size={16} color={COLORS.supermarket.primary} />
                </TouchableOpacity>
            )}
          </View>

          {/* Available Crops Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Available Crops</Text>
                <Text style={styles.sectionSubtitle}>Fresh from local farmers</Text>
              </View>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.common.gray400} />
              <TextInput
                  style={styles.searchInput}
                  placeholder="Search crops or farmers..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={COLORS.common.gray400} />
                  </TouchableOpacity>
              )}
            </View>

            {filteredCrops.map((crop) => (
                <AvailableCropCard
                    key={crop.id}
                    crop={crop}
                    onPress={(crop) => {
                      setSelectedCrop(crop);
                      setShowCropDetailModal(true);
                    }}
                />
            ))}
          </View>

          {/* Partner Farmers Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Partner Farmers</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllLink}>View All</Text>
              </TouchableOpacity>
            </View>

            {partnerFarmers.slice(0, 3).map((farmer) => (
                <FarmerCard
                    key={farmer.id}
                    farmer={farmer}
                    onPress={(farmer) => {
                      setSelectedFarmer(farmer);
                      setShowFarmerDetailModal(true);
                    }}
                />
            ))}
          </View>
        </ScrollView>

        {/* Modals */}
        <CropDetailModal
            visible={showCropDetailModal}
            onClose={() => setShowCropDetailModal(false)}
            crop={selectedCrop}
            onPlaceOrder={handlePlaceOrder}
        />

        <FarmerDetailModal
            visible={showFarmerDetailModal}
            onClose={() => setShowFarmerDetailModal(false)}
            farmer={selectedFarmer}
        />

        <AddPurchaseGoalModal
            visible={showAddGoalModal}
            onClose={() => setShowAddGoalModal(false)}
            onAdd={handleAddGoal}
        />
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
    paddingHorizontal: 16,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: COLORS.common.gray600,
    marginTop: 2,
  },

  // Search Container
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.common.gray200,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.common.gray800,
  },

  // Purchase Goal Card Styles
  purchaseGoalCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  purchaseGoalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  purchaseGoalCrop: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
  },
  purchaseGoalTarget: {
    fontSize: 13,
    color: COLORS.common.gray600,
  },
  purchaseGoalStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  purchaseGoalStatBox: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
  },
  purchaseGoalStatLabel: {
    fontSize: 12,
    color: COLORS.common.gray600,
    marginBottom: 4,
  },
  purchaseGoalStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceInfo: {
    backgroundColor: COLORS.common.gray50,
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  priceInfoText: {
    fontSize: 13,
    color: COLORS.common.gray700,
    fontWeight: '500',
  },
  purchaseProgressContainer: {
    marginTop: 8,
  },
  purchaseProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  purchaseProgressLabel: {
    fontSize: 12,
    color: COLORS.common.gray600,
  },
  purchaseProgressPercentage: {
    fontSize: 12,
    color: COLORS.common.gray600,
    fontWeight: '600',
  },
  purchaseProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.common.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  purchaseProgressFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },

  // Available Crop Card Styles
  cropCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cropCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f59e0b',
  },
  farmerName: {
    fontSize: 14,
    color: COLORS.common.gray600,
    marginBottom: 12,
  },
  cropCardDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  cropCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cropCardDetailText: {
    fontSize: 13,
    color: COLORS.common.gray600,
  },
  cropCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.common.gray100,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliveryText: {
    fontSize: 12,
    color: COLORS.common.gray600,
  },

  // Farmer Card Styles
  farmerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  farmerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  farmerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.supermarket.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  farmerInfo: {
    flex: 1,
  },
  farmerCardName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
    marginBottom: 4,
  },
  farmerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  farmerLocationText: {
    fontSize: 13,
    color: COLORS.common.gray600,
  },
  farmerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  farmerRatingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f59e0b',
  },
  farmerCrops: {
    marginBottom: 12,
  },
  farmerCropsLabel: {
    fontSize: 13,
    color: COLORS.common.gray600,
    marginBottom: 8,
  },
  cropTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cropTag: {
    backgroundColor: COLORS.farmer.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cropTagText: {
    fontSize: 12,
    color: COLORS.farmer.primary,
    fontWeight: '500',
  },
  farmerStats: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.common.gray100,
  },
  farmerStat: {
    flex: 1,
    alignItems: 'center',
  },
  farmerStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
    marginBottom: 2,
  },
  farmerStatLabel: {
    fontSize: 12,
    color: COLORS.common.gray600,
  },

  // Order Request Card Styles
  orderCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderCardCrop: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
  },
  orderStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  orderStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderFarmer: {
    fontSize: 14,
    color: COLORS.common.gray600,
    marginBottom: 12,
  },
  orderDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  orderDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderDetailText: {
    fontSize: 13,
    color: COLORS.common.gray600,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.common.gray100,
  },
  orderDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  orderDateText: {
    fontSize: 12,
    color: COLORS.common.gray600,
  },

  // Button Styles
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.supermarket.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllLink: {
    fontSize: 14,
    color: COLORS.supermarket.primary,
    fontWeight: '600',
  },
  viewAllTextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  viewAllTextButtonText: {
    fontSize: 14,
    color: COLORS.supermarket.primary,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray100,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    padding: 20,
  },

  // Crop Detail Modal Styles
  cropDetailSection: {
    marginBottom: 20,
  },
  cropDetailLabel: {
    fontSize: 13,
    color: COLORS.common.gray600,
    marginBottom: 6,
  },
  cropDetailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.gray800,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    marginBottom: 20,
  },
  ratingDetailText: {
    fontSize: 14,
    color: '#f59e0b',
    fontWeight: '600',
  },
  orderFormSection: {
    backgroundColor: COLORS.common.gray50,
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },
  orderFormTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
    marginBottom: 16,
  },
  orderFormLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.gray800,
    marginBottom: 8,
  },
  orderInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.common.gray200,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: COLORS.common.gray800,
    marginBottom: 12,
  },
  totalCostBox: {
    backgroundColor: COLORS.supermarket.primary + '10',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalCostLabel: {
    fontSize: 14,
    color: COLORS.common.gray600,
    fontWeight: '500',
  },
  totalCostValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.supermarket.primary,
  },
  placeOrderButton: {
    backgroundColor: COLORS.supermarket.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Farmer Detail Modal Styles
  farmerDetailHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  farmerDetailAvatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.supermarket.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  farmerDetailRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  farmerDetailRatingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  cropTagsLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  cropTagLarge: {
    backgroundColor: COLORS.farmer.primary + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cropTagLargeText: {
    fontSize: 14,
    color: COLORS.farmer.primary,
    fontWeight: '600',
  },
  farmerStatsLarge: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  farmerStatLarge: {
    flex: 1,
    backgroundColor: COLORS.common.gray50,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  farmerStatLargeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
  },
  farmerStatLargeLabel: {
    fontSize: 12,
    color: COLORS.common.gray600,
    textAlign: 'center',
  },
  viewListingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.supermarket.primary,
    gap: 8,
    marginBottom: 12,
  },
  viewListingsButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.supermarket.primary,
  },
  closeModalButton: {
    padding: 16,
    alignItems: 'center',
  },
  closeModalButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.common.gray600,
  },

  // Form Styles
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.gray800,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.common.gray50,
    borderWidth: 1,
    borderColor: COLORS.common.gray200,
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: COLORS.common.gray800,
  },
  cropSelectorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  cropSelectorItem: {
    width: '30%',
    backgroundColor: COLORS.common.gray50,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.common.gray100,
    alignItems: 'center',
  },
  cropSelectorItemActive: {
    backgroundColor: COLORS.supermarket.primary + '10',
    borderColor: COLORS.supermarket.primary,
  },
  cropSelectorText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.common.gray800,
  },
  submitButton: {
    backgroundColor: COLORS.supermarket.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.common.gray600,
    fontSize: 15,
    fontWeight: '500',
  },
});

export default SupermarketHomeScreen;