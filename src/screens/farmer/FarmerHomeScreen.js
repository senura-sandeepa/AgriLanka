import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import StatCard from '../../components/common/StatCard';
import { COLORS } from '../../utils/colors';
import { useAuth } from '../../context/AuthContext';
import {
  fetchCropTypes,
  createCropListing,
  fetchFarmerCropListings,
} from '../../services/CropListingApi';

// Mock data for crop price ranges (keep as is)
const cropPriceData = [
  { id: 1, name: 'Rice', minPrice: 80, maxPrice: 120, unit: 'kg', trend: 'up', priceHistory: [
      { day: 'Mon', price: 95 }, { day: 'Tue', price: 98 }, { day: 'Wed', price: 100 },
      { day: 'Thu', price: 102 }, { day: 'Fri', price: 105 }, { day: 'Sat', price: 108 }, { day: 'Sun', price: 110 }
    ]},
  { id: 2, name: 'Tomatoes', minPrice: 60, maxPrice: 90, unit: 'kg', trend: 'stable', priceHistory: [
      { day: 'Mon', price: 75 }, { day: 'Tue', price: 73 }, { day: 'Wed', price: 75 },
      { day: 'Thu', price: 74 }, { day: 'Fri', price: 76 }, { day: 'Sat', price: 75 }, { day: 'Sun', price: 75 }
    ]},
  { id: 3, name: 'Carrots', minPrice: 70, maxPrice: 100, unit: 'kg', trend: 'down', priceHistory: [
      { day: 'Mon', price: 95 }, { day: 'Tue', price: 92 }, { day: 'Wed', price: 88 },
      { day: 'Thu', price: 86 }, { day: 'Fri', price: 83 }, { day: 'Sat', price: 80 }, { day: 'Sun', price: 78 }
    ]},
  { id: 4, name: 'Cabbage', minPrice: 40, maxPrice: 65, unit: 'kg', trend: 'up', priceHistory: [
      { day: 'Mon', price: 48 }, { day: 'Tue', price: 50 }, { day: 'Wed', price: 52 },
      { day: 'Thu', price: 53 }, { day: 'Fri', price: 55 }, { day: 'Sat', price: 57 }, { day: 'Sun', price: 58 }
    ]},
  { id: 5, name: 'Potatoes', minPrice: 50, maxPrice: 75, unit: 'kg', trend: 'stable', priceHistory: [
      { day: 'Mon', price: 62 }, { day: 'Tue', price: 63 }, { day: 'Wed', price: 62 },
      { day: 'Thu', price: 63 }, { day: 'Fri', price: 62 }, { day: 'Sat', price: 63 }, { day: 'Sun', price: 62 }
    ]},
  { id: 6, name: 'Onions', minPrice: 90, maxPrice: 130, unit: 'kg', trend: 'up', priceHistory: [
      { day: 'Mon', price: 102 }, { day: 'Tue', price: 105 }, { day: 'Wed', price: 108 },
      { day: 'Thu', price: 110 }, { day: 'Fri', price: 115 }, { day: 'Sat', price: 118 }, { day: 'Sun', price: 120 }
    ]},
];

const initialInventory = [
  { crop: 'Tomatoes', totalQuantity: 800, listedQuantity: 500, remainingQuantity: 300, unit: 'kg' },
  { crop: 'Rice', totalQuantity: 1200, listedQuantity: 1000, remainingQuantity: 200, unit: 'kg' },
  { crop: 'Onions', totalQuantity: 300, listedQuantity: 300, remainingQuantity: 0, unit: 'kg' },
];

// Component for displaying crop price cards
const PriceListingCard = ({ crop, onPress }) => {
  const getTrendIcon = () => {
    if (crop.trend === 'up') return 'trending-up';
    if (crop.trend === 'down') return 'trending-down';
    return 'remove';
  };

  const getTrendColor = () => {
    if (crop.trend === 'up') return '#10b981';
    if (crop.trend === 'down') return '#ef4444';
    return '#6b7280';
  };

  return (
      <TouchableOpacity style={styles.priceCard} onPress={() => onPress(crop)} activeOpacity={0.7}>
        <View style={styles.priceCardLeft}>
          <Text style={styles.cropName}>{crop.name}</Text>
          <View style={styles.priceRange}>
            <Text style={styles.priceText}>Rs. {crop.minPrice} - {crop.maxPrice}</Text>
            <Text style={styles.unitText}>/{crop.unit}</Text>
          </View>
        </View>
        <View style={[styles.trendBadge, { backgroundColor: getTrendColor() + '20' }]}>
          <Ionicons name={getTrendIcon()} size={24} color={getTrendColor()} />
        </View>
      </TouchableOpacity>
  );
};

// Component for displaying farmer's crop listing cards
const MyListingCard = ({ listing, onPress }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDaysUntil = (dateString) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = calculateDaysUntil(listing.available_from);
  const locationString = `${listing.area}, ${listing.district}`;

  return (
      <TouchableOpacity style={styles.myListingCard} onPress={() => onPress(listing)} activeOpacity={0.7}>
        <View style={styles.listingCardHeader}>
          <Text style={styles.listingCropName}>{listing.crop_name}</Text>
          <View style={styles.listingStatusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.listingStatusText}>Active</Text>
          </View>
        </View>

        <View style={styles.listingDetailsRow}>
          <View style={styles.listingDetail}>
            <Ionicons name="cube-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.listingDetailText}>{listing.quantity} kg</Text>
          </View>
          <View style={styles.listingDetail}>
            <Ionicons name="cash-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.listingDetailText}>Rs. {listing.price}/kg</Text>
          </View>
          <View style={styles.listingDetail}>
            <Ionicons name="location-outline" size={16} color={COLORS.common.gray600} />
            <Text style={styles.listingDetailText}>{locationString}</Text>
          </View>
        </View>

        <View style={styles.listingFooter}>
          <View style={styles.listingStats}>
            {daysUntil > 0 ? (
                <Text style={styles.daysUntilText}>{daysUntil} days until available</Text>
            ) : (
                <Text style={styles.availableNowText}>Available Now</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={20} color={COLORS.common.gray400} />
        </View>
      </TouchableOpacity>
  );
};

// Component for displaying inventory cards
const InventoryCard = ({ item }) => {
  const listingPercentage = (item.listedQuantity / item.totalQuantity) * 100;

  return (
      <View style={styles.inventoryCard}>
        <View style={styles.inventoryHeader}>
          <Text style={styles.inventoryCropName}>{item.crop}</Text>
          <Text style={styles.inventoryTotal}>Total: {item.totalQuantity} {item.unit}</Text>
        </View>

        <View style={styles.inventoryStats}>
          <View style={[styles.inventoryStatBox, { backgroundColor: '#eff6ff' }]}>
            <Text style={styles.inventoryStatLabel}>Listed</Text>
            <Text style={[styles.inventoryStatValue, { color: '#3b82f6' }]}>
              {item.listedQuantity} {item.unit}
            </Text>
          </View>
          <View style={[styles.inventoryStatBox, { backgroundColor: '#f0fdf4' }]}>
            <Text style={styles.inventoryStatLabel}>Available</Text>
            <Text style={[styles.inventoryStatValue, { color: '#10b981' }]}>
              {item.remainingQuantity} {item.unit}
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Listed Progress</Text>
            <Text style={styles.progressPercentage}>{Math.round(listingPercentage)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${listingPercentage}%` }]} />
          </View>
        </View>
      </View>
  );
};

// Modal for adding stock to inventory
const AddStockModal = ({ visible, onClose }) => {
  return (
      <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add to Inventory</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.common.gray600} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.comingSoonText}>
                This feature will allow you to add harvested crops to your inventory. Coming soon!
              </Text>

              <TouchableOpacity style={styles.submitButton} onPress={onClose}>
                <Text style={styles.submitButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
  );
};

// Modal for viewing all crop prices
const AllCropPricesModal = ({ visible, onClose, onCropSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTrend, setFilterTrend] = useState('all');

  const filteredCrops = cropPriceData.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrend = filterTrend === 'all' || crop.trend === filterTrend;
    return matchesSearch && matchesTrend;
  });

  return (
      <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
        <View style={styles.fullScreenModal}>
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.common.gray800} />
            </TouchableOpacity>
            <Text style={styles.fullScreenTitle}>All Market Prices</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.common.gray400} />
            <TextInput
                style={styles.searchInput}
                placeholder="Search crops..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.common.gray400} />
                </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}
                      contentContainerStyle={{ paddingHorizontal: 16 }}>
            <TouchableOpacity
                style={[styles.filterButton, filterTrend === 'all' && styles.filterButtonActive]}
                onPress={() => setFilterTrend('all')}
            >
              <Text style={[styles.filterButtonText, filterTrend === 'all' && styles.filterButtonTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, filterTrend === 'up' && styles.filterButtonActive]}
                onPress={() => setFilterTrend('up')}
            >
              <Ionicons name="trending-up" size={16} color={filterTrend === 'up' ? '#fff' : '#10b981'} />
              <Text style={[styles.filterButtonText, filterTrend === 'up' && styles.filterButtonTextActive]}>Rising</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, filterTrend === 'down' && styles.filterButtonActive]}
                onPress={() => setFilterTrend('down')}
            >
              <Ionicons name="trending-down" size={16} color={filterTrend === 'down' ? '#fff' : '#ef4444'} />
              <Text style={[styles.filterButtonText, filterTrend === 'down' && styles.filterButtonTextActive]}>Falling</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, filterTrend === 'stable' && styles.filterButtonActive]}
                onPress={() => setFilterTrend('stable')}
            >
              <Ionicons name="remove" size={16} color={filterTrend === 'stable' ? '#fff' : '#6b7280'} />
              <Text style={[styles.filterButtonText, filterTrend === 'stable' && styles.filterButtonTextActive]}>Stable</Text>
            </TouchableOpacity>
          </ScrollView>

          <ScrollView style={styles.fullScreenContent}>
            {filteredCrops.length > 0 ? (
                filteredCrops.map((crop) => (
                    <PriceListingCard key={crop.id} crop={crop} onPress={onCropSelect} />
                ))
            ) : (
                <View style={styles.emptySearchResult}>
                  <Ionicons name="search-outline" size={64} color={COLORS.common.gray400} />
                  <Text style={styles.emptySearchText}>No crops found</Text>
                  <Text style={styles.emptySearchSubtext}>Try adjusting your search or filters</Text>
                </View>
            )}
          </ScrollView>
        </View>
      </Modal>
  );
};

// Modal for viewing crop price details (informational only)
const CropPriceDetailModal = ({ visible, onClose, crop }) => {
  if (!crop) return null;

  return (
      <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{crop.name} - Market Info</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.common.gray600} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.priceRangeBox}>
                <Text style={styles.priceRangeLabel}>Current Market Range</Text>
                <Text style={styles.priceRangeValue}>
                  Rs. {crop.minPrice} - {crop.maxPrice} per {crop.unit}
                </Text>
                <Text style={styles.priceRangeAvg}>
                  Average: Rs. {Math.round((crop.minPrice + crop.maxPrice) / 2)}
                </Text>
              </View>

              {crop.priceHistory && (
                  <View style={styles.priceHistorySection}>
                    <Text style={styles.priceHistoryTitle}>Last 7 Days Price Trend</Text>
                    <View style={styles.chartContainer}>
                      {crop.priceHistory.map((item, index) => {
                        const maxPriceInHistory = Math.max(...crop.priceHistory.map(h => h.price));
                        const heightPercent = (item.price / maxPriceInHistory) * 100;

                        return (
                            <View key={index} style={styles.chartBar}>
                              <Text style={styles.chartPrice}>Rs. {item.price}</Text>
                              <View style={styles.barContainer}>
                                <View
                                    style={[
                                      styles.bar,
                                      {
                                        height: `${heightPercent}%`,
                                        backgroundColor: crop.trend === 'up'
                                            ? '#10b981'
                                            : crop.trend === 'down'
                                                ? '#ef4444'
                                                : '#6b7280'
                                      }
                                    ]}
                                />
                              </View>
                              <Text style={styles.chartDay}>{item.day}</Text>
                            </View>
                        );
                      })}
                    </View>
                  </View>
              )}

              <View style={styles.insightBox}>
                <View style={styles.insightHeader}>
                  <Ionicons name="bulb" size={20} color={COLORS.farmer.primary} />
                  <Text style={styles.insightTitle}>Market Insight</Text>
                </View>
                <Text style={styles.insightText}>
                  {crop.trend === 'up' &&
                      `${crop.name} prices are trending upward. This could be a good time to list your produce.`}
                  {crop.trend === 'down' &&
                      `${crop.name} prices are declining. Consider waiting for better market conditions or adjust your pricing.`}
                  {crop.trend === 'stable' &&
                      `${crop.name} prices are stable. Consistent demand in the market.`}
                </Text>
              </View>

              <TouchableOpacity style={styles.gotItButton} onPress={onClose}>
                <Text style={styles.gotItButtonText}>Got it</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
  );
};

// Modal for adding new crop listing
const AddCropModal = ({ visible, onClose, cropTypes, loadingCrops, onCreateListing, userId }) => {
  const [formData, setFormData] = useState({
    cropId: '',
    cropName: '',
    quantity: '',
    price: '',
    availableFrom: '',
  });
  const [showCropSelector, setShowCropSelector] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      cropId: '',
      cropName: '',
      quantity: '',
      price: '',
      availableFrom: '',
    });
    setShowCropSelector(true);
  };

  const handleSubmit = async () => {
    if (!formData.cropId || !formData.quantity || !formData.price || !formData.availableFrom) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const quantity = parseFloat(formData.quantity);
    const price = parseFloat(formData.price);

    if (quantity <= 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid quantity');
      return;
    }

    if (price <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price');
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreateListing({
        userId,
        cropId: formData.cropId,
        quantity,
        price,
        availableFrom: formData.availableFrom
      });

      Alert.alert('Success', 'Your crop listing has been added successfully!');
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Crop Listing</Text>
              <TouchableOpacity onPress={() => { resetForm(); onClose(); }} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={COLORS.common.gray600} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {showCropSelector ? (
                  <View>
                    <Text style={styles.label}>Select Crop Type *</Text>

                    {loadingCrops ? (
                        <ActivityIndicator size="large" color={COLORS.farmer.primary} style={{ marginTop: 20 }} />
                    ) : cropTypes.length === 0 ? (
                        <Text style={styles.errorText}>No crop types available</Text>
                    ) : (
                        <View style={styles.cropSelectorGrid}>
                          {cropTypes.map(crop => (
                              <TouchableOpacity
                                  key={crop.crop_id}
                                  style={[
                                    styles.cropSelectorItem,
                                    formData.cropId === crop.crop_id && styles.cropSelectorItemActive
                                  ]}
                                  onPress={() => {
                                    setFormData({
                                      ...formData,
                                      cropId: crop.crop_id,
                                      cropName: crop.crop_name,
                                    });
                                    setShowCropSelector(false);
                                  }}
                              >
                                <Text style={styles.cropSelectorText}>{crop.crop_name}</Text>
                              </TouchableOpacity>
                          ))}
                        </View>
                    )}
                  </View>
              ) : (
                  <>
                    <View style={styles.selectedCropBanner}>
                      <View>
                        <Text style={styles.selectedCropText}>{formData.cropName}</Text>
                      </View>
                      <TouchableOpacity onPress={() => setShowCropSelector(true)}>
                        <Text style={styles.changeButton}>Change</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Quantity (kg) *</Text>
                      <TextInput
                          style={styles.input}
                          placeholder="e.g., 500"
                          keyboardType="numeric"
                          value={formData.quantity}
                          onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Price (per kg) *</Text>
                      <TextInput
                          style={styles.input}
                          placeholder="e.g., 150"
                          keyboardType="numeric"
                          value={formData.price}
                          onChangeText={(text) => setFormData({ ...formData, price: text })}
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Available From (YYYY-MM-DD) *</Text>
                      <TextInput
                          style={styles.input}
                          placeholder="e.g., 2026-02-15"
                          value={formData.availableFrom}
                          onChangeText={(text) => setFormData({ ...formData, availableFrom: text })}
                      />
                    </View>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                          <ActivityIndicator color="#fff" />
                      ) : (
                          <Text style={styles.submitButtonText}>Create Listing</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          resetForm();
                          onClose();
                        }}
                        disabled={isSubmitting}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
  );
};

// Main Farmer Home Screen Component
const FarmerHomeScreen = () => {
  const { userData } = useAuth(); // ✅ FIXED: Use userData instead of currentUser
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [priceDetailModalVisible, setPriceDetailModalVisible] = useState(false);
  const [selectedCropForInfo, setSelectedCropForInfo] = useState(null);
  const [showAllPricesModal, setShowAllPricesModal] = useState(false);
  const [showAddStockModal, setShowAddStockModal] = useState(false);

  // Crop types & listings state
  const [cropTypes, setCropTypes] = useState([]);
  const [loadingCrops, setLoadingCrops] = useState(false);
  const [farmerListings, setFarmerListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [inventory, setInventory] = useState(initialInventory);

  // ✅ Load crop types and listings on mount
  useEffect(() => {
    loadInitialData();
  }, [userData?.id]);

  const loadInitialData = async () => {
    if (!userData?.id) {
      console.log('⚠️ No user ID found');
      return;
    }

    try {
      await Promise.all([
        loadCropTypes(),
        loadFarmerListings()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadCropTypes = async () => {
    setLoadingCrops(true);
    try {
      console.log('🔹 Loading crop types...');
      const types = await fetchCropTypes(); // ✅ FIXED: Use the imported function
      setCropTypes(types);
      console.log('✅ Crop types loaded:', types.length);
    } catch (error) {
      console.error('❌ Failed to fetch crop types:', error);
      Alert.alert('Error', 'Unable to fetch crop types from server.');
    } finally {
      setLoadingCrops(false);
    }
  };

  const loadFarmerListings = async () => {
    setLoadingListings(true);
    try {
      console.log('🔹 Loading farmer listings...');
      const listings = await fetchFarmerCropListings(userData.id);
      setFarmerListings(listings);
      console.log('✅ Farmer listings loaded:', listings.length);
    } catch (error) {
      console.error('❌ Failed to fetch listings:', error);
    } finally {
      setLoadingListings(false);
    }
  };

  const handleCreateListing = async (listingData) => {
    try {
      await createCropListing(listingData); // ✅ FIXED: Use the imported function
      await loadFarmerListings(); // Reload listings after creating
    } catch (error) {
      throw error;
    }
  };

  const handleListingPress = (listing) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    Alert.alert(
        listing.crop_name,
        `Quantity: ${listing.quantity} kg\n` +
        `Price: Rs. ${listing.price}/kg\n` +
        `Available From: ${formatDate(listing.available_from)}\n` +
        `Location: ${listing.area}, ${listing.city}, ${listing.district}`,
        [{ text: 'OK', style: 'cancel' }]
    );
  };

  return (
      <View style={styles.container}>
        <Header title="Farmer Dashboard" />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Section */}
          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.statsContainer}
          >
            <StatCard
                icon="cube-outline"
                label="Active Listings"
                value={farmerListings.length.toString()}
                color={COLORS.farmer.primary}
            />
            <StatCard
                icon="cart-outline"
                label="Pending Orders"
                value="0"
                color={COLORS.supermarket.primary}
            />
            <StatCard
                icon="cash-outline"
                label="This Month"
                value="Rs. 0"
                color="#f59e0b"
            />
          </ScrollView>

          {/* Inventory Overview Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Inventory Overview</Text>
                <Text style={styles.sectionSubtitle}>Your current stock levels</Text>
              </View>
              <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowAddStockModal(true)}
              >
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Stock</Text>
              </TouchableOpacity>
            </View>

            {inventory.map((item, index) => (
                <InventoryCard key={index} item={item} />
            ))}
          </View>

          {/* Market Price Listings Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Today's Market Prices</Text>
                <Text style={styles.sectionSubtitle}>Tap to view price trends</Text>
              </View>
              <TouchableOpacity style={styles.refreshButtonIcon}>
                <Ionicons name="refresh" size={20} color={COLORS.farmer.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.priceListContainer}>
              {cropPriceData.slice(0, 4).map((crop) => (
                  <PriceListingCard
                      key={crop.id}
                      crop={crop}
                      onPress={(crop) => {
                        setSelectedCropForInfo(crop);
                        setPriceDetailModalVisible(true);
                      }}
                  />
              ))}
            </View>

            <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => setShowAllPricesModal(true)}
            >
              <Text style={styles.viewAllText}>
                View All Crops ({cropPriceData.length})
              </Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.farmer.primary} />
            </TouchableOpacity>

            <View style={styles.priceNote}>
              <Ionicons name="information-circle-outline" size={16} color={COLORS.common.gray600} />
              <Text style={styles.priceNoteText}>
                Prices updated daily based on market trends
              </Text>
            </View>
          </View>

          {/* My Listings Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>My Crop Listings</Text>
                <Text style={styles.sectionSubtitle}>
                  {farmerListings.length} active listing{farmerListings.length !== 1 ? 's' : ''}
                </Text>
              </View>
              <TouchableOpacity style={styles.addButton} onPress={() => setAddModalVisible(true)}>
                <Ionicons name="add" size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add Crop</Text>
              </TouchableOpacity>
            </View>

            {loadingListings ? (
                <ActivityIndicator size="large" color={COLORS.farmer.primary} style={{ marginTop: 20 }} />
            ) : farmerListings.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="leaf-outline" size={64} color={COLORS.common.gray400} />
                  <Text style={styles.emptyStateTitle}>No listings yet</Text>
                  <Text style={styles.emptyStateText}>
                    Create your first crop listing to start selling
                  </Text>
                  <TouchableOpacity
                      style={styles.emptyStateButton}
                      onPress={() => setAddModalVisible(true)}
                  >
                    <Text style={styles.emptyStateButtonText}>Create Listing</Text>
                  </TouchableOpacity>
                </View>
            ) : (
                farmerListings.map((listing) => (
                    <MyListingCard
                        key={listing.id}
                        listing={listing}
                        onPress={handleListingPress}
                    />
                ))
            )}
          </View>
        </ScrollView>

        {/* Modals */}
        <AllCropPricesModal
            visible={showAllPricesModal}
            onClose={() => setShowAllPricesModal(false)}
            onCropSelect={(crop) => {
              setShowAllPricesModal(false);
              setTimeout(() => {
                setSelectedCropForInfo(crop);
                setPriceDetailModalVisible(true);
              }, 300);
            }}
        />

        <CropPriceDetailModal
            visible={priceDetailModalVisible}
            onClose={() => setPriceDetailModalVisible(false)}
            crop={selectedCropForInfo}
        />

        <AddCropModal
            visible={addModalVisible}
            onClose={() => setAddModalVisible(false)}
            cropTypes={cropTypes}
            loadingCrops={loadingCrops}
            onCreateListing={handleCreateListing}
            userId={userData?.id}
        />

        <AddStockModal
            visible={showAddStockModal}
            onClose={() => setShowAddStockModal(false)}
        />
      </View>
  );
};

// (Keep all your existing styles exactly as they are)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.common.gray50 },
  content: { flex: 1 },
  statsContainer: { paddingVertical: 16, paddingHorizontal: 16 },
  section: { paddingHorizontal: 16, paddingBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.common.gray800 },
  sectionSubtitle: { fontSize: 13, color: COLORS.common.gray600, marginTop: 2 },
  refreshButtonIcon: { padding: 8 },
  inventoryCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  inventoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  inventoryCropName: { fontSize: 18, fontWeight: 'bold', color: COLORS.common.gray800 },
  inventoryTotal: { fontSize: 13, color: COLORS.common.gray600 },
  inventoryStats: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  inventoryStatBox: { flex: 1, padding: 12, borderRadius: 10 },
  inventoryStatLabel: { fontSize: 12, color: COLORS.common.gray600, marginBottom: 4 },
  inventoryStatValue: { fontSize: 18, fontWeight: 'bold' },
  progressContainer: { marginTop: 8 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: COLORS.common.gray600 },
  progressPercentage: { fontSize: 12, color: COLORS.common.gray600, fontWeight: '600' },
  progressBar: { width: '100%', height: 8, backgroundColor: COLORS.common.gray200, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#3b82f6', borderRadius: 4 },
  priceListContainer: { marginBottom: 12 },
  priceCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  priceCardLeft: { flex: 1 },
  cropName: { fontSize: 16, fontWeight: '600', color: COLORS.common.gray800, marginBottom: 4 },
  priceRange: { flexDirection: 'row', alignItems: 'baseline' },
  priceText: { fontSize: 15, fontWeight: '500', color: COLORS.farmer.primary },
  unitText: { fontSize: 13, color: COLORS.common.gray600, marginLeft: 2 },
  trendBadge: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  priceNote: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.common.gray100, padding: 12, borderRadius: 8, gap: 8, marginTop: 12 },
  priceNoteText: { flex: 1, fontSize: 12, color: COLORS.common.gray600 },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.farmer.primary, gap: 8, marginBottom: 12 },
  viewAllText: { fontSize: 15, fontWeight: '600', color: COLORS.farmer.primary },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.farmer.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, gap: 4 },
  addButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingVertical: 48, backgroundColor: '#fff', borderRadius: 12 },
  emptyStateTitle: { fontSize: 18, fontWeight: '600', color: COLORS.common.gray800, marginTop: 16 },
  emptyStateText: { fontSize: 14, color: COLORS.common.gray600, marginTop: 8, textAlign: 'center', paddingHorizontal: 32 },
  emptyStateButton: { backgroundColor: COLORS.farmer.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, marginTop: 16 },
  emptyStateButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  myListingCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  listingCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  listingCropName: { fontSize: 18, fontWeight: 'bold', color: COLORS.common.gray800 },
  listingStatusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981' + '10', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10b981' },
  listingStatusText: { fontSize: 12, fontWeight: '600', color: '#10b981' },
  listingDetailsRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  listingDetail: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  listingDetailText: { fontSize: 13, color: COLORS.common.gray600 },
  listingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.common.gray100 },
  listingStats: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  daysUntilText: { fontSize: 12, color: COLORS.common.gray600 },
  availableNowText: { fontSize: 12, color: '#10b981', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.common.gray100 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.common.gray800 },
  closeButton: { padding: 4 },
  formContainer: { padding: 20 },
  comingSoonText: { fontSize: 15, color: COLORS.common.gray600, lineHeight: 22, marginBottom: 20 },
  cropSelectorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  cropSelectorItem: { width: '47%', backgroundColor: COLORS.common.gray50, padding: 16, borderRadius: 12, borderWidth: 2, borderColor: COLORS.common.gray100 },
  cropSelectorItemActive: { backgroundColor: COLORS.farmer.primary + '10', borderColor: COLORS.farmer.primary },
  cropSelectorText: { fontSize: 15, fontWeight: '600', color: COLORS.common.gray800 },
  selectedCropBanner: { backgroundColor: COLORS.farmer.primary + '10', padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: COLORS.farmer.primary + '30' },
  selectedCropText: { fontSize: 15, fontWeight: '600', color: COLORS.farmer.primary },
  changeButton: { fontSize: 14, color: COLORS.farmer.primary, fontWeight: '600' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.common.gray800, marginBottom: 8 },
  input: { backgroundColor: COLORS.common.gray50, borderWidth: 1, borderColor: COLORS.common.gray200, borderRadius: 10, padding: 14, fontSize: 15, color: COLORS.common.gray800 },
  errorText: { fontSize: 13, color: '#ef4444', marginTop: 4 },
  submitButton: { backgroundColor: COLORS.farmer.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8, marginBottom: 12 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelButton: { padding: 16, alignItems: 'center' },
  cancelButtonText: { color: COLORS.common.gray600, fontSize: 15, fontWeight: '500' },
  gotItButton: { backgroundColor: COLORS.farmer.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 12 },
  gotItButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  fullScreenModal: { flex: 1, backgroundColor: COLORS.common.gray50 },
  fullScreenHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 48, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.common.gray100 },
  backButton: { padding: 8 },
  fullScreenTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.common.gray800 },
  fullScreenContent: { flex: 1, padding: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, gap: 12, borderWidth: 1, borderColor: COLORS.common.gray100 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.common.gray800 },
  filterContainer: { paddingHorizontal: 0, marginBottom: 16, maxHeight: 50 },
  filterButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, gap: 6, borderWidth: 1, borderColor: COLORS.common.gray100, height: 36 },
  filterButtonActive: { backgroundColor: COLORS.farmer.primary, borderColor: COLORS.farmer.primary },
  filterButtonText: { fontSize: 14, fontWeight: '500', color: COLORS.common.gray800 },
  filterButtonTextActive: { color: '#fff' },
  emptySearchResult: { alignItems: 'center', paddingVertical: 60 },
  emptySearchText: { fontSize: 18, fontWeight: '600', color: COLORS.common.gray800, marginTop: 16 },
  emptySearchSubtext: { fontSize: 14, color: COLORS.common.gray600, marginTop: 8 },
  priceRangeBox: { backgroundColor: COLORS.farmer.primary + '10', padding: 20, borderRadius: 12, marginBottom: 20, alignItems: 'center', borderWidth: 1, borderColor: COLORS.farmer.primary + '30' },
  priceRangeLabel: { fontSize: 14, color: COLORS.common.gray600, marginBottom: 8 },
  priceRangeValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.farmer.primary, marginBottom: 4 },
  priceRangeAvg: { fontSize: 14, color: COLORS.common.gray600 },
  priceHistorySection: { backgroundColor: COLORS.common.gray50, padding: 16, borderRadius: 12, marginBottom: 20 },
  priceHistoryTitle: { fontSize: 15, fontWeight: '600', color: COLORS.common.gray800, marginBottom: 16 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 150, paddingTop: 10 },
  chartBar: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  chartPrice: { fontSize: 10, color: COLORS.common.gray600, marginBottom: 4, fontWeight: '500' },
  barContainer: { width: '80%', height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: '100%', borderTopLeftRadius: 4, borderTopRightRadius: 4, minHeight: 20 },
  chartDay: { fontSize: 11, color: COLORS.common.gray600, marginTop: 6, fontWeight: '500' },
  insightBox: { backgroundColor: COLORS.common.gray50, padding: 16, borderRadius: 12, marginTop: 12 },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  insightTitle: { fontSize: 15, fontWeight: '600', color: COLORS.common.gray800 },
  insightText: { fontSize: 14, color: COLORS.common.gray600, lineHeight: 20 },
});

export default FarmerHomeScreen;