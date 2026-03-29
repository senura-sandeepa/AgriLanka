import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import { COLORS } from '../../utils/colors';
import { useAuth } from '../../context/AuthContext';

// Sri Lankan provinces and districts
const locationData = {
  provinces: [
    { id: 1, name: 'Western' },
    { id: 2, name: 'Central' },
    { id: 3, name: 'Southern' },
    { id: 4, name: 'Northern' },
    { id: 5, name: 'Eastern' },
    { id: 6, name: 'North Western' },
    { id: 7, name: 'North Central' },
    { id: 8, name: 'Uva' },
    { id: 9, name: 'Sabaragamuwa' },
  ],
  districts: {
    'Western': ['Colombo', 'Gampaha', 'Kalutara'],
    'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
    'Southern': ['Galle', 'Matara', 'Hambantota'],
    'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
    'Eastern': ['Ampara', 'Batticaloa', 'Trincomalee'],
    'North Western': ['Kurunegala', 'Puttalam'],
    'North Central': ['Anuradhapura', 'Polonnaruwa'],
    'Uva': ['Badulla', 'Monaragala'],
    'Sabaragamuwa': ['Ratnapura', 'Kegalle'],
  }
};

// Product categories supermarket typically orders
const productCategories = [
  { id: 1, name: 'Vegetables', icon: 'leaf', items: ['Tomatoes', 'Onions', 'Carrots', 'Cabbage', 'Beans', 'Potatoes', 'Broccoli', 'Lettuce'] },
  { id: 2, name: 'Fruits', icon: 'nutrition', items: ['Banana', 'Mango', 'Papaya', 'Pineapple', 'Watermelon', 'Coconut', 'Avocado'] },
  { id: 3, name: 'Grains', icon: 'restaurant', items: ['Rice', 'Wheat', 'Corn', 'Millet'] },
  { id: 4, name: 'Spices', icon: 'flask', items: ['Cinnamon', 'Pepper', 'Cardamom', 'Cloves', 'Ginger', 'Turmeric'] },
  { id: 5, name: 'Dairy', icon: 'water', items: ['Milk', 'Yogurt', 'Cheese', 'Butter'] },
  { id: 6, name: 'Other', icon: 'ellipsis-horizontal', items: ['Eggs', 'Honey', 'Tea', 'Coffee'] },
];

// Payment methods
const paymentMethods = [
  { id: 1, name: 'Bank Transfer', icon: 'card' },
  { id: 2, name: 'Mobile Payment', icon: 'phone-portrait' },
  { id: 3, name: 'Cash Payment', icon: 'cash' },
  { id: 4, name: 'Cheque', icon: 'document-text' },
  { id: 5, name: 'Credit Terms', icon: 'time' },
];

// Supermarket chains
const supermarketChains = [
  'Keells Super',
  'Cargills Food City',
  'Arpico Supercenter',
  'Laugfs Supermarket',
  'Sathosa',
  'Independent Store',
  'Other'
];

const SupermarketProfileScreen = () => {
  const { userData } = useAuth();

  // Profile state
  const [profile, setProfile] = useState({
    supermarketName: 'Keells Super',
    branch: 'Kandy City Center',
    contactPerson: 'Nimal Perera',
    designation: 'Purchasing Manager',
    province: 'Central',
    district: 'Kandy',
    city: 'Kandy',
    area: 'City Center',
    addressNo: '45/2',
    contactNumber: '+94 81 223 4567',
    email: 'kandy.purchasing@keells.lk',
    businessRegistrationNo: 'BR-2015-001234',
    taxId: 'TIN-123456789',
    description: 'Leading supermarket chain serving fresh produce to customers across Sri Lanka.',
    interestedProducts: ['Tomatoes', 'Onions', 'Rice', 'Coconut'],
    paymentMethods: ['Bank Transfer', 'Credit Terms'],
    bankName: 'Commercial Bank',
    accountNumber: '1234567890',
    accountName: 'Keells Super - Kandy',
    creditDays: '30',
    profilePhoto: null,
  });

  // Modal states
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showProductSelector, setShowProductSelector] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);
  const [showChainSelector, setShowChainSelector] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = () => {
    Alert.alert(
        'Update Profile',
        'Are you sure you want to update your profile?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Update',
            onPress: () => {
              // API call to update profile
              setIsEditing(false);
              Alert.alert('Success', 'Profile updated successfully!');
            }
          }
        ]
    );
  };

  const handleUploadPhoto = () => {
    Alert.alert(
        'Upload Photo',
        'Choose an option',
        [
          { text: 'Take Photo', onPress: () => Alert.alert('Camera', 'Opening camera...') },
          { text: 'Choose from Gallery', onPress: () => Alert.alert('Gallery', 'Opening gallery...') },
          { text: 'Cancel', style: 'cancel' }
        ]
    );
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    // API call to delete account
    Alert.alert('Account Deleted', 'Your account has been permanently deleted.');
    setShowDeleteConfirm(false);
  };

  const toggleProduct = (product) => {
    if (profile.interestedProducts.includes(product)) {
      setProfile({
        ...profile,
        interestedProducts: profile.interestedProducts.filter(p => p !== product)
      });
    } else {
      setProfile({
        ...profile,
        interestedProducts: [...profile.interestedProducts, product]
      });
    }
  };

  const togglePaymentMethod = (method) => {
    if (profile.paymentMethods.includes(method)) {
      setProfile({
        ...profile,
        paymentMethods: profile.paymentMethods.filter(m => m !== method)
      });
    } else {
      setProfile({
        ...profile,
        paymentMethods: [...profile.paymentMethods, method]
      });
    }
  };

  return (
      <View style={styles.container}>
        <Header title="Profile" />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity
                style={styles.avatarContainer}
                onPress={handleUploadPhoto}
                disabled={!isEditing}
            >
              {profile.profilePhoto ? (
                  <Image source={{ uri: profile.profilePhoto }} style={styles.avatar} />
              ) : (
                  <Ionicons name="storefront" size={48} color={COLORS.common.white} />
              )}
              {isEditing && (
                  <View style={styles.cameraIcon}>
                    <Ionicons name="camera" size={16} color={COLORS.common.white} />
                  </View>
              )}
            </TouchableOpacity>
            <Text style={styles.profileName}>{profile.supermarketName}</Text>
            <Text style={styles.profileLocation}>
              {profile.branch && `${profile.branch} • `}{profile.city}, {profile.district}
            </Text>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Supermarket Name *</Text>
              <TouchableOpacity
                  style={[styles.input, styles.selectInput, !isEditing && styles.inputDisabled]}
                  onPress={() => isEditing && setShowChainSelector(true)}
                  disabled={!isEditing}
              >
                <Text style={styles.selectInputText}>{profile.supermarketName}</Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.common.gray400} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Branch Name</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.branch}
                  onChangeText={(text) => setProfile({ ...profile, branch: text })}
                  placeholder="Enter branch name"
                  editable={isEditing}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Contact Person *</Text>
                <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={profile.contactPerson}
                    onChangeText={(text) => setProfile({ ...profile, contactPerson: text })}
                    placeholder="Enter contact person"
                    editable={isEditing}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Designation</Text>
                <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={profile.designation}
                    onChangeText={(text) => setProfile({ ...profile, designation: text })}
                    placeholder="Enter designation"
                    editable={isEditing}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                  style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
                  value={profile.description}
                  onChangeText={(text) => setProfile({ ...profile, description: text })}
                  placeholder="Describe your business"
                  multiline
                  numberOfLines={4}
                  editable={isEditing}
              />
            </View>
          </View>

          {/* Business Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Business Details</Text>
              <Ionicons name="business" size={20} color={COLORS.supermarket.primary} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Registration No</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.businessRegistrationNo}
                  onChangeText={(text) => setProfile({ ...profile, businessRegistrationNo: text })}
                  placeholder="Enter registration number"
                  editable={isEditing}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tax ID (TIN)</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.taxId}
                  onChangeText={(text) => setProfile({ ...profile, taxId: text })}
                  placeholder="Enter tax ID"
                  editable={isEditing}
              />
            </View>
          </View>

          {/* Location Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Location Details</Text>
              <Ionicons name="location" size={20} color={COLORS.supermarket.primary} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Province *</Text>
              <TouchableOpacity
                  style={[styles.input, styles.selectInput, !isEditing && styles.inputDisabled]}
                  onPress={() => isEditing && setShowLocationPicker(true)}
                  disabled={!isEditing}
              >
                <Text style={styles.selectInputText}>{profile.province}</Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.common.gray400} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>District *</Text>
              <TouchableOpacity
                  style={[styles.input, styles.selectInput, !isEditing && styles.inputDisabled]}
                  onPress={() => isEditing && setShowLocationPicker(true)}
                  disabled={!isEditing}
              >
                <Text style={styles.selectInputText}>{profile.district}</Text>
                <Ionicons name="chevron-down" size={20} color={COLORS.common.gray400} />
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>City/Town *</Text>
                <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={profile.city}
                    onChangeText={(text) => setProfile({ ...profile, city: text })}
                    placeholder="Enter city"
                    editable={isEditing}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Area</Text>
                <TextInput
                    style={[styles.input, !isEditing && styles.inputDisabled]}
                    value={profile.area}
                    onChangeText={(text) => setProfile({ ...profile, area: text })}
                    placeholder="Enter area"
                    editable={isEditing}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address No</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.addressNo}
                  onChangeText={(text) => setProfile({ ...profile, addressNo: text })}
                  placeholder="Enter address number"
                  editable={isEditing}
              />
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Contact Information</Text>
              <Ionicons name="call" size={20} color={COLORS.supermarket.primary} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number *</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.contactNumber}
                  onChangeText={(text) => setProfile({ ...profile, contactNumber: text })}
                  placeholder="Enter contact number"
                  keyboardType="phone-pad"
                  editable={isEditing}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.email}
                  onChangeText={(text) => setProfile({ ...profile, email: text })}
                  placeholder="Enter email"
                  keyboardType="email-address"
                  editable={isEditing}
              />
            </View>
          </View>

          {/* Interested Products */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Products of Interest</Text>
              <Ionicons name="cart" size={20} color={COLORS.supermarket.primary} />
            </View>

            <Text style={styles.helperText}>Select products you regularly purchase</Text>

            <TouchableOpacity
                style={[styles.addButton, !isEditing && styles.inputDisabled]}
                onPress={() => setShowProductSelector(true)}
                disabled={!isEditing}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.supermarket.primary} />
              <Text style={styles.addButtonText}>
                {profile.interestedProducts.length > 0 ? 'Manage Products' : 'Add Products'}
              </Text>
            </TouchableOpacity>

            {profile.interestedProducts.length > 0 && (
                <View style={styles.tagsContainer}>
                  {profile.interestedProducts.map((product, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{product}</Text>
                        {isEditing && (
                            <TouchableOpacity onPress={() => toggleProduct(product)}>
                              <Ionicons name="close-circle" size={16} color={COLORS.supermarket.primary} />
                            </TouchableOpacity>
                        )}
                      </View>
                  ))}
                </View>
            )}
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment Methods</Text>
              <Ionicons name="card" size={20} color={COLORS.supermarket.primary} />
            </View>

            <Text style={styles.helperText}>Select your preferred payment methods</Text>

            <TouchableOpacity
                style={[styles.addButton, !isEditing && styles.inputDisabled]}
                onPress={() => setShowPaymentSelector(true)}
                disabled={!isEditing}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.supermarket.primary} />
              <Text style={styles.addButtonText}>
                {profile.paymentMethods.length > 0 ? 'Manage Payment Methods' : 'Add Payment Methods'}
              </Text>
            </TouchableOpacity>

            {profile.paymentMethods.length > 0 && (
                <View style={styles.paymentMethodsList}>
                  {profile.paymentMethods.map((method, index) => {
                    const methodData = paymentMethods.find(m => m.name === method);
                    return (
                        <View key={index} style={styles.paymentMethodItem}>
                          <Ionicons name={methodData?.icon || 'card'} size={20} color={COLORS.supermarket.primary} />
                          <Text style={styles.paymentMethodText}>{method}</Text>
                          {isEditing && (
                              <TouchableOpacity onPress={() => togglePaymentMethod(method)}>
                                <Ionicons name="close-circle" size={18} color={COLORS.common.error} />
                              </TouchableOpacity>
                          )}
                        </View>
                    );
                  })}
                </View>
            )}

            {/* Bank Details */}
            {profile.paymentMethods.includes('Bank Transfer') && (
                <>
                  <Text style={[styles.label, { marginTop: 16 }]}>Bank Details</Text>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bank Name</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={profile.bankName}
                        onChangeText={(text) => setProfile({ ...profile, bankName: text })}
                        placeholder="Enter bank name"
                        editable={isEditing}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Account Number</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={profile.accountNumber}
                        onChangeText={(text) => setProfile({ ...profile, accountNumber: text })}
                        placeholder="Enter account number"
                        keyboardType="numeric"
                        editable={isEditing}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Account Name</Text>
                    <TextInput
                        style={[styles.input, !isEditing && styles.inputDisabled]}
                        value={profile.accountName}
                        onChangeText={(text) => setProfile({ ...profile, accountName: text })}
                        placeholder="Enter account name"
                        editable={isEditing}
                    />
                  </View>
                </>
            )}

            {/* Credit Terms */}
            {profile.paymentMethods.includes('Credit Terms') && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Credit Period (Days)</Text>
                  <TextInput
                      style={[styles.input, !isEditing && styles.inputDisabled]}
                      value={profile.creditDays}
                      onChangeText={(text) => setProfile({ ...profile, creditDays: text })}
                      placeholder="Enter credit days (e.g., 30)"
                      keyboardType="numeric"
                      editable={isEditing}
                  />
                </View>
            )}
          </View>

          {/* Action Buttons */}
          {isEditing && (
              <View style={styles.section}>
                <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
                  <Text style={styles.updateButtonText}>Save Changes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setIsEditing(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
          )}

          {/* Danger Zone */}
          <View style={[styles.section, styles.dangerZone]}>
            <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeleteAccount}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.common.error} />
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
            <Text style={styles.dangerZoneText}>
              Once you delete your account, there is no going back. Please be certain.
            </Text>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Floating Edit/Save Button */}
        <TouchableOpacity
            style={styles.floatingEditButton}
            onPress={() => {
              if (isEditing) {
                handleUpdateProfile();
              } else {
                setIsEditing(true);
              }
            }}
        >
          <Ionicons
              name={isEditing ? "checkmark-circle" : "create"}
              size={24}
              color={COLORS.common.white}
          />
          <Text style={styles.floatingEditButtonText}>
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Text>
        </TouchableOpacity>

        {/* Supermarket Chain Selector Modal */}
        <Modal visible={showChainSelector} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Supermarket</Text>
                <TouchableOpacity onPress={() => setShowChainSelector(false)}>
                  <Ionicons name="close" size={24} color={COLORS.common.gray800} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {supermarketChains.map((chain, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.chainOption}
                        onPress={() => {
                          setProfile({ ...profile, supermarketName: chain });
                          setShowChainSelector(false);
                        }}
                    >
                      <Text style={styles.chainOptionText}>{chain}</Text>
                      {profile.supermarketName === chain && (
                          <Ionicons name="checkmark-circle" size={24} color={COLORS.supermarket.primary} />
                      )}
                    </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Product Selector Modal */}
        <Modal visible={showProductSelector} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Products</Text>
                <TouchableOpacity onPress={() => setShowProductSelector(false)}>
                  <Ionicons name="close" size={24} color={COLORS.common.gray800} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {productCategories.map((category) => (
                    <View key={category.id} style={styles.categorySection}>
                      <View style={styles.categoryHeader}>
                        <Ionicons name={category.icon} size={20} color={COLORS.supermarket.primary} />
                        <Text style={styles.categoryTitle}>{category.name}</Text>
                      </View>
                      <View style={styles.itemsGrid}>
                        {category.items.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                  styles.productItem,
                                  profile.interestedProducts.includes(item) && styles.productItemSelected
                                ]}
                                onPress={() => toggleProduct(item)}
                            >
                              <Text style={[
                                styles.productItemText,
                                profile.interestedProducts.includes(item) && styles.productItemTextSelected
                              ]}>{item}</Text>
                              {profile.interestedProducts.includes(item) && (
                                  <Ionicons name="checkmark-circle" size={16} color={COLORS.supermarket.primary} />
                              )}
                            </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowProductSelector(false)}
                >
                  <Text style={styles.modalButtonText}>
                    Done ({profile.interestedProducts.length} selected)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Payment Method Selector Modal */}
        <Modal visible={showPaymentSelector} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Payment Methods</Text>
                <TouchableOpacity onPress={() => setShowPaymentSelector(false)}>
                  <Ionicons name="close" size={24} color={COLORS.common.gray800} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {paymentMethods.map((method) => (
                    <TouchableOpacity
                        key={method.id}
                        style={styles.paymentMethodOption}
                        onPress={() => togglePaymentMethod(method.name)}
                    >
                      <View style={styles.paymentMethodOptionLeft}>
                        <Ionicons name={method.icon} size={24} color={COLORS.supermarket.primary} />
                        <Text style={styles.paymentMethodOptionText}>{method.name}</Text>
                      </View>
                      <View style={[
                        styles.checkbox,
                        profile.paymentMethods.includes(method.name) && styles.checkboxChecked
                      ]}>
                        {profile.paymentMethods.includes(method.name) && (
                            <Ionicons name="checkmark" size={16} color={COLORS.common.white} />
                        )}
                      </View>
                    </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                    style={styles.modalButton}
                    onPress={() => setShowPaymentSelector(false)}
                >
                  <Text style={styles.modalButtonText}>
                    Done ({profile.paymentMethods.length} selected)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Delete Account Confirmation Modal */}
        <Modal visible={showDeleteConfirm} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.deleteModalContent}>
              <View style={styles.deleteIconContainer}>
                <Ionicons name="warning" size={48} color={COLORS.common.error} />
              </View>
              <Text style={styles.deleteModalTitle}>Delete Account?</Text>
              <Text style={styles.deleteModalText}>
                This action cannot be undone. All your data including orders, profile information, and history will be permanently deleted.
              </Text>
              <View style={styles.deleteModalActions}>
                <TouchableOpacity
                    style={styles.deleteModalCancelButton}
                    onPress={() => setShowDeleteConfirm(false)}
                >
                  <Text style={styles.deleteModalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteModalConfirmButton}
                    onPress={confirmDeleteAccount}
                >
                  <Text style={styles.deleteModalConfirmText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.common.gray50,
  },
  floatingEditButton: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.supermarket.primary,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingEditButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.common.white,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: COLORS.common.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.supermarket.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.supermarket.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.common.white,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.common.gray800,
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: COLORS.common.gray600,
  },
  section: {
    backgroundColor: COLORS.common.white,
    padding: 16,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.common.gray800,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.gray600,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.common.white,
    borderWidth: 1,
    borderColor: COLORS.common.gray300,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.common.gray800,
  },
  inputDisabled: {
    backgroundColor: COLORS.common.gray100,
    color: COLORS.common.gray600,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectInputText: {
    fontSize: 16,
    color: COLORS.common.gray800,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.common.gray500,
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.supermarket.primary,
    borderRadius: 8,
    borderStyle: 'dashed',
    backgroundColor: COLORS.common.white,
  },
  addButtonDisabled: {
    borderColor: COLORS.common.gray300,
    backgroundColor: COLORS.common.gray50,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.supermarket.primary,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.supermarket.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.supermarket.primary,
  },
  paymentMethodsList: {
    marginTop: 12,
    gap: 8,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.common.gray50,
    borderRadius: 8,
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.common.gray800,
  },
  updateButton: {
    backgroundColor: COLORS.supermarket.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  updateButtonText: {
    color: COLORS.common.white,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: COLORS.common.white,
    borderWidth: 1,
    borderColor: COLORS.common.gray300,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.common.gray600,
    fontSize: 16,
    fontWeight: '600',
  },
  dangerZone: {
    borderTopWidth: 1,
    borderTopColor: COLORS.common.error + '30',
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.common.error,
    marginBottom: 8,
  },
  dangerZoneText: {
    fontSize: 12,
    color: COLORS.common.gray500,
    marginTop: 8,
    lineHeight: 18,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.common.error,
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.common.error,
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
    padding: 16,
  },
  chainOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  chainOptionText: {
    fontSize: 16,
    color: COLORS.common.gray800,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.gray800,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.common.gray300,
    borderRadius: 20,
    backgroundColor: COLORS.common.white,
  },
  productItemSelected: {
    backgroundColor: COLORS.supermarket.primary + '15',
    borderColor: COLORS.supermarket.primary,
  },
  productItemText: {
    fontSize: 14,
    color: COLORS.common.gray700,
  },
  productItemTextSelected: {
    color: COLORS.supermarket.primary,
    fontWeight: '500',
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  paymentMethodOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethodOptionText: {
    fontSize: 16,
    color: COLORS.common.gray800,
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
  checkboxChecked: {
    backgroundColor: COLORS.supermarket.primary,
    borderColor: COLORS.supermarket.primary,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.common.gray200,
  },
  modalButton: {
    backgroundColor: COLORS.supermarket.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalButtonText: {
    color: COLORS.common.white,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalContent: {
    backgroundColor: COLORS.common.white,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  deleteIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.common.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.common.gray800,
    marginBottom: 12,
  },
  deleteModalText: {
    fontSize: 14,
    color: COLORS.common.gray600,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  deleteModalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  deleteModalCancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.common.gray300,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteModalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.gray600,
  },
  deleteModalConfirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: COLORS.common.error,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteModalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.common.white,
  },
});

export default SupermarketProfileScreen;