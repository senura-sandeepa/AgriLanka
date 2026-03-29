import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/common/Header';
import { COLORS } from '../../utils/colors';
import { useAuth } from '../../context/AuthContext';
import { fetchFarmerProfile, updateFarmerProfile } from '../../services/FarmerProfileApi';
import { fetchCropTypes, fetchFarmerCropListings } from "../../services/CropListingApi";

// Crop Data
const cropCategories = [
  { id: 1, name: 'Vegetables', icon: 'leaf', items: ['Tomatoes', 'Onions', 'Carrots', 'Cabbage', 'Beans', 'Potatoes'] },
  { id: 2, name: 'Fruits', icon: 'nutrition', items: ['Banana', 'Mango', 'Papaya', 'Pineapple', 'Watermelon'] },
  { id: 3, name: 'Grains', icon: 'restaurant', items: ['Rice', 'Wheat', 'Corn', 'Millet'] },
  { id: 4, name: 'Spices', icon: 'flask', items: ['Cinnamon', 'Pepper', 'Cardamom', 'Cloves', 'Ginger'] },
  { id: 5, name: 'Dairy', icon: 'water', items: ['Milk', 'Yogurt', 'Cheese', 'Butter'] },
  { id: 6, name: 'Other', icon: 'ellipsis-horizontal', items: ['Eggs', 'Honey', 'Tea', 'Coffee'] },
];

const paymentMethods = [
  { id: 1, name: 'Bank Transfer', icon: 'card' },
  { id: 2, name: 'Mobile Payment', icon: 'phone-portrait' },
  { id: 3, name: 'Cash on Delivery', icon: 'cash' },
  { id: 4, name: 'Cheque', icon: 'document-text' },
];

const FarmerProfileScreen = () => {
  const { userData } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [showPaymentSelector, setShowPaymentSelector] = useState(false);

  useEffect(() => {
    console.log('🔹 userData:', userData);

    if (!userData?.id) {
      console.log('⚠️ No user ID found');
      setLoading(false);
      Alert.alert("Error", "User ID not found. Please log in again.");
      return;
    }

    loadProfile();
  }, [userData?.id]);

  const loadProfile = async () => {
    try {
      console.log('🔹 Loading profile for user ID:', userData.id);

      const data = await fetchFarmerProfile(userData.id);
      console.log("✅ Fetched profile data:", data);

      if (data) {
        setProfile({
          farmName: data.farm_name || '',
          ownerName: data.owner_name || '',
          description: data.description || '',
          addressNo: data.address_no || '',

          province: data.province || '',
          district: data.district || '',
          city: data.city || '',
          area: data.area || '',

          email: data.email || '',
          contactNumber: data.phone_number || '',

          bankName: data.bank_name || '',
          bankBranch: data.bank_branch || '',
          accountName: data.account_name || '',
          accountNumber: data.account_number || '',

          selectedCrops: data.selectedCrops || [],
          paymentMethods: data.paymentMethods || [],
          profilePhoto: data.profile_photo || null,
        });
      } else {
        Alert.alert("Error", "Profile not found");
      }
    } catch (error) {
      console.error("❌ Fetch profile error:", error);
      Alert.alert("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    Alert.alert(
        'Update Profile',
        'Are you sure you want to update your profile?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Update',
            onPress: async () => {
              try {
                const payload = {
                  farmName: profile.farmName,
                  ownerName: profile.ownerName,
                  description: profile.description,
                  addressNo: profile.addressNo,
                  email: profile.email,
                  contactNumber: profile.contactNumber,
                  bankName: profile.bankName,
                  bankBranch: profile.bankBranch,
                  accountName: profile.accountName,
                  accountNumber: profile.accountNumber,
                };

                console.log('🔹 Updating profile with payload:', payload);

                await updateFarmerProfile(userData.id, payload);

                console.log('✅ Profile updated successfully');
                Alert.alert('Success', 'Profile updated successfully!');
                setIsEditing(false);

                // Reload profile to show updated data
                await loadProfile();
              } catch (error) {
                console.error('❌ Update profile error:', error);
                Alert.alert('Error', 'Failed to update profile');
              }
            },
          },
        ]
    );
  };

  const toggleCrop = (crop) => {
    if (profile.selectedCrops.includes(crop)) {
      setProfile({ ...profile, selectedCrops: profile.selectedCrops.filter(c => c !== crop) });
    } else {
      setProfile({ ...profile, selectedCrops: [...profile.selectedCrops, crop] });
    }
  };

  const togglePaymentMethod = (method) => {
    if (profile.paymentMethods.includes(method)) {
      setProfile({ ...profile, paymentMethods: profile.paymentMethods.filter(m => m !== method) });
    } else {
      setProfile({ ...profile, paymentMethods: [...profile.paymentMethods, method] });
    }
  };

  if (loading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.farmer.primary} />
          <Text style={{ marginTop: 16 }}>Loading profile...</Text>
        </View>
    );
  }

  if (!profile) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="alert-circle" size={48} color={COLORS.common.gray400} />
          <Text style={{ marginTop: 16, fontSize: 16, textAlign: 'center' }}>
            Profile not found. Please contact support.
          </Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <Header title="Profile" />
        <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity style={styles.avatarContainer} disabled>
              {profile.profilePhoto ? (
                  <Image source={{ uri: profile.profilePhoto }} style={styles.avatar} />
              ) : (
                  <Ionicons name="person" size={48} color={COLORS.common.white} />
              )}
            </TouchableOpacity>
            <Text style={styles.profileName}>{profile.farmName}</Text>
            <Text style={styles.profileLocation}>
              {profile.area}, {profile.city}, {profile.district}, {profile.province}
            </Text>
          </View>

          {/* Basic Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Farm Name *</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.farmName}
                  onChangeText={(text) => setProfile({ ...profile, farmName: text })}
                  editable={isEditing}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Owner Name *</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.ownerName}
                  onChangeText={(text) => setProfile({ ...profile, ownerName: text })}
                  editable={isEditing}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address No / Street *</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.addressNo}
                  onChangeText={(text) => setProfile({ ...profile, addressNo: text })}
                  editable={isEditing}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                  style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
                  value={profile.description}
                  onChangeText={(text) => setProfile({ ...profile, description: text })}
                  multiline
                  numberOfLines={4}
                  editable={isEditing}
              />
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>
                {profile.area}, {profile.city}, {profile.district} district, {profile.province} province
              </Text>
              <Text style={{ fontSize: 12, color: COLORS.common.gray500, marginTop: 4 }}>
                Location cannot be changed here
              </Text>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contact Number *</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.contactNumber}
                  onChangeText={(text) => setProfile({ ...profile, contactNumber: text })}
                  editable={isEditing}
                  keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.email}
                  onChangeText={(text) => setProfile({ ...profile, email: text })}
                  editable={isEditing}
                  keyboardType="email-address"
                  autoCapitalize="none"
              />
            </View>
          </View>

          {/* Crops */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crops & Products</Text>
            <TouchableOpacity
                style={[styles.addButton, !isEditing && styles.inputDisabled]}
                onPress={() => setShowCropSelector(true)}
                disabled={!isEditing}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.farmer.primary} />
              <Text style={styles.addButtonText}>
                {profile.selectedCrops.length > 0 ? 'Manage Crops' : 'Add Crops'}
              </Text>
            </TouchableOpacity>

            {profile.selectedCrops.length > 0 && (
                <View style={styles.selectedItemsContainer}>
                  {profile.selectedCrops.map((crop, index) => (
                      <View key={index} style={styles.selectedItem}>
                        <Text style={styles.selectedItemText}>{crop}</Text>
                      </View>
                  ))}
                </View>
            )}
          </View>

          {/* Payment Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity
                style={[styles.addButton, !isEditing && styles.inputDisabled]}
                onPress={() => setShowPaymentSelector(true)}
                disabled={!isEditing}
            >
              <Ionicons name="add-circle-outline" size={20} color={COLORS.farmer.primary} />
              <Text style={styles.addButtonText}>
                {profile.paymentMethods.length > 0 ? 'Manage Payment Methods' : 'Add Payment Methods'}
              </Text>
            </TouchableOpacity>

            {profile.paymentMethods.length > 0 && (
                <View style={styles.selectedItemsContainer}>
                  {profile.paymentMethods.map((method, index) => (
                      <View key={index} style={styles.selectedItem}>
                        <Text style={styles.selectedItemText}>{method}</Text>
                      </View>
                  ))}
                </View>
            )}
          </View>

          {/* Bank Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bank Details</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bank Name</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.bankName}
                  onChangeText={(text) => setProfile({ ...profile, bankName: text })}
                  editable={isEditing}
                  placeholder="e.g., Bank of Ceylon"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Branch</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.bankBranch}
                  onChangeText={(text) => setProfile({ ...profile, bankBranch: text })}
                  editable={isEditing}
                  placeholder="e.g., Colombo Main Branch"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Holder Name</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.accountName}
                  onChangeText={(text) => setProfile({ ...profile, accountName: text })}
                  editable={isEditing}
                  placeholder="Full name as per bank account"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Number</Text>
              <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profile.accountNumber}
                  onChangeText={(text) => setProfile({ ...profile, accountNumber: text })}
                  editable={isEditing}
                  keyboardType="numeric"
                  placeholder="Bank account number"
              />
            </View>
          </View>
        </ScrollView>

        {/* Floating Edit/Save Button */}
        <TouchableOpacity
            style={styles.floatingEditButton}
            onPress={() => (isEditing ? handleUpdateProfile() : setIsEditing(true))}
        >
          <Ionicons
              name={isEditing ? 'checkmark-circle' : 'create'}
              size={24}
              color={COLORS.common.white}
          />
          <Text style={styles.floatingEditButtonText}>
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>

        {/* Crop Selector Modal */}
        <Modal visible={showCropSelector} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Crops</Text>
                <TouchableOpacity onPress={() => setShowCropSelector(false)}>
                  <Ionicons name="close" size={24} color={COLORS.common.gray800} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {cropCategories.map((cat) => (
                    <View key={cat.id} style={{ marginBottom: 20 }}>
                      <Text style={{ fontWeight: '600', fontSize: 16, marginBottom: 8 }}>
                        {cat.name}
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                        {cat.items.map((item) => (
                            <TouchableOpacity
                                key={item}
                                onPress={() => toggleCrop(item)}
                                style={{
                                  padding: 8,
                                  paddingHorizontal: 12,
                                  borderWidth: 1,
                                  borderRadius: 20,
                                  borderColor: profile.selectedCrops.includes(item)
                                      ? COLORS.farmer.primary
                                      : COLORS.common.gray300,
                                  backgroundColor: profile.selectedCrops.includes(item)
                                      ? COLORS.farmer.primary + '15'
                                      : COLORS.common.white,
                                }}
                            >
                              <Text
                                  style={{
                                    color: profile.selectedCrops.includes(item)
                                        ? COLORS.farmer.primary
                                        : COLORS.common.gray700,
                                  }}
                              >
                                {item}
                              </Text>
                            </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                  style={[styles.modalButton, { margin: 16 }]}
                  onPress={() => setShowCropSelector(false)}
              >
                <Text style={styles.modalButtonText}>
                  Done ({profile.selectedCrops.length} selected)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Payment Selector Modal */}
        <Modal visible={showPaymentSelector} animationType="slide" transparent>
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
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 16,
                          borderBottomWidth: 1,
                          borderBottomColor: COLORS.common.gray200,
                        }}
                        onPress={() => togglePaymentMethod(method.name)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Ionicons name={method.icon} size={20} color={COLORS.common.gray700} />
                        <Text style={{ fontSize: 16 }}>{method.name}</Text>
                      </View>
                      {profile.paymentMethods.includes(method.name) && (
                          <Ionicons name="checkmark-circle" size={24} color={COLORS.farmer.primary} />
                      )}
                    </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                  style={[styles.modalButton, { margin: 16 }]}
                  onPress={() => setShowPaymentSelector(false)}
              >
                <Text style={styles.modalButtonText}>
                  Done ({profile.paymentMethods.length} selected)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.common.gray50 },
  content: { flex: 1 },
  profileHeader: { alignItems: 'center', paddingVertical: 32, backgroundColor: COLORS.common.white },
  avatarContainer: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.farmer.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  profileName: { fontSize: 24, fontWeight: '700', marginBottom: 4, color: COLORS.common.gray800 },
  profileLocation: { fontSize: 14, color: COLORS.common.gray600 },
  section: { backgroundColor: COLORS.common.white, padding: 16, marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, color: COLORS.common.gray800 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: COLORS.common.gray700 },
  input: { borderWidth: 1, borderColor: COLORS.common.gray300, borderRadius: 8, padding: 12, fontSize: 16, color: COLORS.common.gray800 },
  inputDisabled: { backgroundColor: COLORS.common.gray100, color: COLORS.common.gray600 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  infoBlock: { marginBottom: 16 },
  value: { fontSize: 16, color: COLORS.common.gray800, marginTop: 4 },
  addButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 12, borderWidth: 1, borderColor: COLORS.common.gray300, borderRadius: 8, borderStyle: 'dashed', marginBottom: 8 },
  addButtonText: { fontWeight: '600', color: COLORS.farmer.primary },
  selectedItemsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  selectedItem: { backgroundColor: COLORS.farmer.primary + '15', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: COLORS.farmer.primary },
  selectedItemText: { color: COLORS.farmer.primary, fontSize: 14 },
  floatingEditButton: { position: 'absolute', bottom: 24, left: 16, right: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: COLORS.farmer.primary, padding: 16, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  floatingEditButtonText: { color: COLORS.common.white, fontWeight: '700', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.common.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.common.gray200 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.common.gray800 },
  modalBody: { padding: 16 },
  modalButton: { backgroundColor: COLORS.farmer.primary, borderRadius: 8, padding: 14, alignItems: 'center' },
  modalButtonText: { color: COLORS.common.white, fontWeight: '600', fontSize: 16 },
});

export default FarmerProfileScreen;