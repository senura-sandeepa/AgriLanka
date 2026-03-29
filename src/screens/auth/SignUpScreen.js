
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchLocations } from '../../services/locationApi';

import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, getThemeColors } from '../../utils/colors';
import { authAPI } from '../../services/Auth'; // Firebase Auth
//import axios from 'axios';
import { saveUserProfile } from '../../services/signupScreenApi';



const SignUpScreen = ({ route, navigation }) => {
  const { userType } = route.params;
  const themeColors = getThemeColors(userType);
  const [locations, setLocations] = useState([]);
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const { register } = useAuth();


  const handleLocationSearch = (text) => {
    setLocationQuery(text);
    setSelectedLocation(null); //  clear selection when typing

    if (!text.trim()) {
      setFilteredLocations([]);
      setShowLocationDropdown(false);
      handleInputChange('location', '');
      return;
    }

    const filtered = locations.filter((loc) =>
        `${loc.province} ${loc.district} ${loc.city} ${loc.area}`
            .toLowerCase()
            .includes(text.toLowerCase())
    );

    setFilteredLocations(filtered);
    setShowLocationDropdown(true);
  };



  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    addressNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    location: '',
    phone: '',
  });

  useEffect(() => {
    // fetch location list from backend
    const loadLocations = async () => {
      try {
        const data = await fetchLocations();
        setLocations(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadLocations();
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
      setFormData({
        ...formData,
        [field]: typeof value === 'string' ? value.trim() : value
      });
    };



    const validateForm = () => {
    const { name, ownerName, addressNo, email, password, confirmPassword, location, phone } = formData;

    if (!name || !email || !password || !confirmPassword || !location || !phone) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    if (userType === 'farmer' && (!ownerName || !addressNo)) {
      Alert.alert('Error', 'Owner name and address are required for farmers');
      return false;
    }

    if (!selectedLocation) {
      Alert.alert("Error", "Please select a valid location from the list");
      return false;
    }


    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const saveUserToBackend = async (firebaseUser) => {
    const { ownerName, addressNo } = formData;

    if (userType === "farmer") {
      if (!ownerName.trim() || !addressNo.trim()) {
        Alert.alert("Error", "Owner name and address are required for farmers");
        throw new Error("Owner name and address required");
      }
    }

    const payload = {
      uid: firebaseUser.uid,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      location: Number(selectedLocation.id),
      userType,
      ownerName: formData.ownerName.trim(),
      addressNo: formData.addressNo.trim()
    };


    const response = await saveUserProfile(payload); // Calls your backend service
    console.log('Backend returned userId:', response.userId);
    return response.userId;
  };


  const { setUserType } = useAuth();

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const { email, password } = formData;
    try {


      console.log('🔹 Signing up with Firebase...');
      const result = await authAPI.signUp(email, password);

      if (!result.success) {
        setIsLoading(false);
        return Alert.alert('Error', result.error);
      }

      const firebaseUser = result.user;
      console.log('✅ Firebase user:', firebaseUser.uid);

      console.log('🔹 Saving user to backend...');
      const numericUserId = await saveUserToBackend(firebaseUser);
      console.log('✅ Backend save complete');

      await register(userType, {
        id:numericUserId,
        uid: firebaseUser.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
      }, {
        email: formData.email,
        password,
      });

      Alert.alert(
          'Success',
          'Account created successfully!',
          [{ text: 'OK', onPress: () => navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: 'Main' }],
                })
            ),
          },
       ]);
    } catch (error) {
      console.error('❌ Signup failed:', error);

      Alert.alert(
          'Signup Failed',
          err.message.includes('auth/email-already-in-use')
              ? 'Email is already in use. Please log in or use a different email.'
              : err.message
      );
    } finally {
      setIsLoading(false); // 🔥 ALWAYS runs
    }
  };


  const getUserTypeLabel = () => {
    switch (userType) {
      case 'farmer': return 'Farmer';
      case 'supermarket': return 'Supermarket';
      case 'admin': return 'Admin';
      default: return 'User';
    }
  };

  const getNamePlaceholder = () => {
    switch (userType) {
      case 'farmer': return 'Farm Name';
      case 'supermarket': return 'Store Name';
      case 'admin': return 'Full Name';
      default: return 'Name';
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={COLORS.common.gray800} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={[styles.iconContainer, { backgroundColor: themeColors.primary }]}>
              <Ionicons
                  name={
                    userType === 'farmer' ? 'people' :
                        userType === 'supermarket' ? 'storefront' : 'shield-checkmark'
                  }
                  size={48}
                  color="#fff"
              />
            </View>

            <Text style={styles.welcomeText}>Join AgriLanka</Text>
            <Text style={styles.subtitleText}>Create your {getUserTypeLabel()} account</Text>

            <View style={styles.form}>
              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{getNamePlaceholder()}</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color={COLORS.common.gray400} />
                  <TextInput
                      style={styles.input}
                      placeholder={`Enter ${getNamePlaceholder().toLowerCase()}`}
                      value={formData.name}
                      onChangeText={(value) => handleInputChange('name', value)}
                  />
                </View>
              </View>

              {userType === 'farmer' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Owner Name</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons name="person-circle-outline" size={20} color={COLORS.common.gray400} />
                      <TextInput
                          style={styles.input}
                          placeholder="Enter owner name"
                          value={formData.ownerName}
                          onChangeText={(value) => handleInputChange('ownerName', value)}
                      />
                    </View>
                  </View>
              )}


              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.common.gray400} />
                  <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChangeText={(value) => handleInputChange('email', value)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                  />
                </View>
              </View>

              {userType === 'farmer' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Address No / Street</Text>
                    <View style={styles.inputContainer}>
                      <Ionicons name="home-outline" size={20} color={COLORS.common.gray400} />
                      <TextInput
                          style={styles.input}
                          placeholder="House no, street"
                          value={formData.addressNo}
                          onChangeText={(value) => handleInputChange('addressNo', value)}
                      />
                    </View>
                  </View>
              )}


              {/* Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>

                <View style={styles.inputContainer}>
                  <Ionicons
                      name="location-outline"
                      size={20}
                      color={COLORS.common.gray400}
                  />

                  <TextInput
                      style={styles.input}
                      placeholder="Type your location"
                      value={
                        selectedLocation
                            ? `${selectedLocation.province}, ${selectedLocation.district} district, ${selectedLocation.city}, ${selectedLocation.area}`
                            : locationQuery
                      }
                      onChangeText={handleLocationSearch}
                      onFocus={() => setShowLocationDropdown(true)}
                  />
                </View>

                {/* Dropdown */}
                {showLocationDropdown && filteredLocations.length > 0 && (
                    <View style={styles.dropdown}>
                      {filteredLocations.slice(0, 8).map((loc) => (
                          <TouchableOpacity
                              key={loc.id}
                              style={styles.dropdownItem}
                              onPress={() => {
                                setSelectedLocation(loc);              // store full object
                                handleInputChange('location', loc.id); // save ID to form
                                setLocationQuery('');
                                setShowLocationDropdown(false);
                              }}
                          >
                            <Text style={styles.dropdownText}>
                              {loc.province} • {loc.district} district • {loc.city} • {loc.area}
                            </Text>
                          </TouchableOpacity>
                      ))}
                    </View>
                )}
              </View>



              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="call-outline" size={20} color={COLORS.common.gray400} />
                  <TextInput
                      style={styles.input}
                      placeholder="+94 77 123 4567"
                      value={formData.phone}
                      onChangeText={(value) => handleInputChange('phone', value)}
                      keyboardType="phone-pad"
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.common.gray400} />
                  <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      value={formData.password}
                      onChangeText={(value) => handleInputChange('password', value)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={COLORS.common.gray400}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.common.gray400} />
                  <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                        name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={COLORS.common.gray400}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                  style={[styles.signupButton, { backgroundColor: themeColors.primary }]}
                  onPress={handleSignUp}
                  disabled={isLoading}
              >
                <Text style={styles.signupButtonText}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate('LoginForm', { userType })}
              >
                <Text style={styles.loginButtonText}>
                  Already have an account? <Text style={{ fontWeight: 'bold' }}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.common.gray50 },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.common.gray200,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.common.gray800 },
  content: { flex: 1, paddingHorizontal: 24 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 32, marginBottom: 24 },
  welcomeText: { fontSize: 28, fontWeight: 'bold', color: COLORS.common.gray800, textAlign: 'center', marginBottom: 8 },
  subtitleText: { fontSize: 16, color: COLORS.common.gray600, textAlign: 'center', marginBottom: 32 },
  form: { marginBottom: 32 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.common.gray700, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.common.gray300 },
  input: { flex: 1, paddingVertical: 14, paddingHorizontal: 12, fontSize: 16, color: COLORS.common.gray800 },
  signupButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  signupButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.common.gray300 },
  dividerText: { marginHorizontal: 16, fontSize: 14, color: COLORS.common.gray500 },
  loginButton: { paddingVertical: 16, alignItems: 'center' },
  loginButtonText: { fontSize: 14, color: COLORS.common.gray600 },
  dropdown: {backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: COLORS.common.gray300, marginTop: 4, maxHeight: 200, zIndex: 1000,},
  dropdownItem: {paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: COLORS.common.gray200,},
  dropdownText: {fontSize: 14, color: COLORS.common.gray800,},

});

export default SignUpScreen;
