import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/colors';
import { ORDER_STATUS } from '../../utils/constants';

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUS.CONFIRMED:
        return COLORS.common.success;
      case ORDER_STATUS.PENDING:
        return COLORS.common.warning;
      case ORDER_STATUS.DELIVERED:
        return COLORS.common.info;
      case ORDER_STATUS.CANCELLED:
        return COLORS.common.error;
      default:
        return COLORS.common.gray500;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.cropName}>{order.crop}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
            {order.status}
          </Text>
        </View>
      </View>
      <Text style={styles.detail}>{order.buyer} • {order.quantity}</Text>
      <Text style={styles.total}>{order.total}</Text>
    </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detail: {
    fontSize: 14,
    color: COLORS.common.gray600,
    marginBottom: 4,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.common.gray800,
  },
});

export default OrderCard;
