import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/colors';

const CropCard = ({ crop, onPress, showFarmer = false }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text style={styles.cropName}>{crop.name}</Text>
          {showFarmer && (
            <Text style={styles.farmer}>Farmer: {crop.farmer}</Text>
          )}
          <Text style={styles.location}>Location: {crop.location}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detail}>Qty: {crop.quantity}</Text>
            <Text style={styles.detail}>Price: {crop.price}</Text>
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.harvestLabel}>Harvest</Text>
          <Text style={styles.harvestDate}>{crop.harvest}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftSection: {
    flex: 1,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
    marginBottom: 4,
  },
  farmer: {
    fontSize: 14,
    color: COLORS.common.gray600,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: COLORS.common.gray600,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detail: {
    fontSize: 13,
    color: COLORS.common.gray700,
  },
  harvestLabel: {
    fontSize: 12,
    color: COLORS.common.gray500,
    marginBottom: 4,
  },
  harvestDate: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.farmer.primary,
  },
});

export default CropCard;