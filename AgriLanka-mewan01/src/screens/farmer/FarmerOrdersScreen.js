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

// Sample orders data with more details
const sampleOrdersData = [
    {
        id: 1,
        orderNumber: 'ORD-2026-001',
        crop: 'Tomatoes',
        quantity: 500,
        unit: 'kg',
        pricePerUnit: 75,
        totalAmount: 37500,
        status: 'pending',
        buyer: {
            name: 'Cargills Food City',
            contact: '+94 77 123 4567',
            location: 'Colombo',
        },
        deliveryDate: '2026-01-25',
        orderDate: '2026-01-20',
        deliveryAddress: 'Cargills Distribution Center, Colombo 05',
        paymentStatus: 'pending',
        notes: 'Please ensure fresh quality',
        timeline: [
            { status: 'placed', date: '2026-01-20 10:30 AM', completed: true },
            { status: 'confirmed', date: '2026-01-20 02:15 PM', completed: true },
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
        status: 'confirmed',
        buyer: {
            name: 'Keells Super',
            contact: '+94 77 987 6543',
            location: 'Kandy',
        },
        deliveryDate: '2026-01-28',
        orderDate: '2026-01-18',
        deliveryAddress: 'Keells Warehouse, Kandy',
        paymentStatus: 'advance_paid',
        notes: 'Premium quality rice required',
        timeline: [
            { status: 'placed', date: '2026-01-18 09:00 AM', completed: true },
            { status: 'confirmed', date: '2026-01-18 11:30 AM', completed: true },
            { status: 'preparing', date: '2026-01-21 08:00 AM', completed: true },
            { status: 'shipped', date: '', completed: false },
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
        buyer: {
            name: 'Arpico Supercentre',
            contact: '+94 77 555 1234',
            location: 'Galle',
        },
        deliveryDate: '2026-01-15',
        orderDate: '2026-01-10',
        deliveryAddress: 'Arpico, Galle Fort',
        paymentStatus: 'paid',
        notes: '',
        timeline: [
            { status: 'placed', date: '2026-01-10 02:00 PM', completed: true },
            { status: 'confirmed', date: '2026-01-10 03:30 PM', completed: true },
            { status: 'preparing', date: '2026-01-12 09:00 AM', completed: true },
            { status: 'shipped', date: '2026-01-14 07:00 AM', completed: true },
            { status: 'delivered', date: '2026-01-15 10:00 AM', completed: true },
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
        status: 'cancelled',
        buyer: {
            name: 'Laughs',
            contact: '+94 77 222 8888',
            location: 'Negombo',
        },
        deliveryDate: '2026-01-22',
        orderDate: '2026-01-19',
        deliveryAddress: 'Laughs Supermarket, Negombo',
        paymentStatus: 'refunded',
        notes: 'Cancelled by buyer',
        timeline: [
            { status: 'placed', date: '2026-01-19 11:00 AM', completed: true },
            { status: 'confirmed', date: '2026-01-19 12:00 PM', completed: true },
            { status: 'cancelled', date: '2026-01-20 09:00 AM', completed: true },
        ],
    },
];

// Order Card Component
const OrderCard = ({ order, onPress }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'confirmed': return '#3b82f6';
            case 'preparing': return '#8b5cf6';
            case 'shipped': return '#06b6d4';
            case 'delivered': return '#10b981';
            case 'cancelled': return '#ef4444';
            default: return COLORS.common.gray600;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return 'time-outline';
            case 'confirmed': return 'checkmark-circle-outline';
            case 'preparing': return 'cube-outline';
            case 'shipped': return 'car-outline';
            case 'delivered': return 'checkmark-done-circle-outline';
            case 'cancelled': return 'close-circle-outline';
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
            case 'refunded':
                return { text: 'Refunded', color: '#6b7280' };
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
                    <Text style={styles.orderBuyer}>{order.buyer.name}</Text>
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

// Create New Order Modal
const CreateOrderModal = ({ visible, onClose, onSave }) => {
    const [newOrder, setNewOrder] = useState({
        crop: '',
        quantity: '',
        unit: 'kg',
        pricePerUnit: '',
        buyerName: '',
        buyerContact: '',
        buyerLocation: '',
        deliveryDate: '',
        deliveryAddress: '',
        notes: '',
    });

    const handleSave = () => {
        // Validation
        if (!newOrder.crop || !newOrder.quantity || !newOrder.pricePerUnit || !newOrder.buyerName) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        const order = {
            id: Date.now(),
            orderNumber: `ORD-2026-${String(Date.now()).slice(-3)}`,
            crop: newOrder.crop,
            quantity: parseInt(newOrder.quantity),
            unit: newOrder.unit,
            pricePerUnit: parseInt(newOrder.pricePerUnit),
            totalAmount: parseInt(newOrder.quantity) * parseInt(newOrder.pricePerUnit),
            status: 'pending',
            buyer: {
                name: newOrder.buyerName,
                contact: newOrder.buyerContact,
                location: newOrder.buyerLocation,
            },
            deliveryDate: newOrder.deliveryDate,
            orderDate: new Date().toISOString().split('T')[0],
            deliveryAddress: newOrder.deliveryAddress,
            paymentStatus: 'pending',
            notes: newOrder.notes,
            timeline: [
                { status: 'placed', date: new Date().toLocaleString(), completed: true },
                { status: 'confirmed', date: '', completed: false },
                { status: 'preparing', date: '', completed: false },
                { status: 'shipped', date: '', completed: false },
                { status: 'delivered', date: '', completed: false },
            ],
        };

        onSave(order);

        // Reset form
        setNewOrder({
            crop: '',
            quantity: '',
            unit: 'kg',
            pricePerUnit: '',
            buyerName: '',
            buyerContact: '',
            buyerLocation: '',
            deliveryDate: '',
            deliveryAddress: '',
            notes: '',
        });

        Alert.alert('Success', 'New order created successfully!');
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.detailModal}>
                <View style={styles.detailHeader}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <Ionicons name="close" size={24} color={COLORS.common.gray800} />
                    </TouchableOpacity>
                    <Text style={styles.detailTitle}>Create New Order</Text>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
                    {/* Crop Details */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Crop Details</Text>

                        <Text style={styles.inputLabel}>Crop Type *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Tomatoes, Rice, Onions"
                            value={newOrder.crop}
                            onChangeText={(text) => setNewOrder({ ...newOrder, crop: text })}
                        />

                        <Text style={styles.inputLabel}>Quantity *</Text>
                        <View style={styles.quantityInputRow}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Enter quantity"
                                keyboardType="numeric"
                                value={newOrder.quantity}
                                onChangeText={(text) => setNewOrder({ ...newOrder, quantity: text })}
                            />
                            <View style={styles.unitPicker}>
                                <TouchableOpacity
                                    style={[styles.unitOption, newOrder.unit === 'kg' && styles.unitOptionActive]}
                                    onPress={() => setNewOrder({ ...newOrder, unit: 'kg' })}
                                >
                                    <Text style={[styles.unitOptionText, newOrder.unit === 'kg' && styles.unitOptionTextActive]}>kg</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.unitOption, newOrder.unit === 'tons' && styles.unitOptionActive]}
                                    onPress={() => setNewOrder({ ...newOrder, unit: 'tons' })}
                                >
                                    <Text style={[styles.unitOptionText, newOrder.unit === 'tons' && styles.unitOptionTextActive]}>tons</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={styles.inputLabel}>Price per {newOrder.unit} *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter price"
                            keyboardType="numeric"
                            value={newOrder.pricePerUnit}
                            onChangeText={(text) => setNewOrder({ ...newOrder, pricePerUnit: text })}
                        />

                        {newOrder.quantity && newOrder.pricePerUnit && (
                            <View style={styles.totalAmountDisplay}>
                                <Text style={styles.totalAmountLabel}>Total Amount:</Text>
                                <Text style={styles.totalAmountValue}>
                                    Rs. {(parseInt(newOrder.quantity || 0) * parseInt(newOrder.pricePerUnit || 0)).toLocaleString()}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Buyer Information */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Buyer Information</Text>

                        <Text style={styles.inputLabel}>Buyer Name *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Cargills Food City"
                            value={newOrder.buyerName}
                            onChangeText={(text) => setNewOrder({ ...newOrder, buyerName: text })}
                        />

                        <Text style={styles.inputLabel}>Contact Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="+94 77 123 4567"
                            keyboardType="phone-pad"
                            value={newOrder.buyerContact}
                            onChangeText={(text) => setNewOrder({ ...newOrder, buyerContact: text })}
                        />

                        <Text style={styles.inputLabel}>Location</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Colombo"
                            value={newOrder.buyerLocation}
                            onChangeText={(text) => setNewOrder({ ...newOrder, buyerLocation: text })}
                        />
                    </View>

                    {/* Delivery Details */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Delivery Details</Text>

                        <Text style={styles.inputLabel}>Delivery Date</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={newOrder.deliveryDate}
                            onChangeText={(text) => setNewOrder({ ...newOrder, deliveryDate: text })}
                        />

                        <Text style={styles.inputLabel}>Delivery Address</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Enter full delivery address"
                            multiline
                            numberOfLines={3}
                            value={newOrder.deliveryAddress}
                            onChangeText={(text) => setNewOrder({ ...newOrder, deliveryAddress: text })}
                        />
                    </View>

                    {/* Notes */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Additional Notes</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Add any special instructions or notes"
                            multiline
                            numberOfLines={3}
                            value={newOrder.notes}
                            onChangeText={(text) => setNewOrder({ ...newOrder, notes: text })}
                        />
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </Modal>
    );
};

// Order Detail Modal with Editing
const OrderDetailModal = ({ visible, onClose, order, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedOrder, setEditedOrder] = useState(null);

    React.useEffect(() => {
        if (order) {
            setEditedOrder(order);
            setIsEditing(false); // Reset editing state when order changes
        }
    }, [order]);

    if (!order || !editedOrder) return null;

    const handleSave = () => {
        Alert.alert(
            'Update Order',
            'Are you sure you want to update this order?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Update',
                    onPress: () => {
                        onUpdate(editedOrder);
                        setIsEditing(false);
                        Alert.alert('Success', 'Order updated successfully');
                    }
                }
            ]
        );
    };

    const handleStatusChange = (newStatus) => {
        Alert.alert(
            'Change Status',
            `Change order status to "${newStatus}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: () => {
                        const updatedOrder = { ...editedOrder, status: newStatus };
                        setEditedOrder(updatedOrder);
                        onUpdate(updatedOrder);
                        Alert.alert('Success', `Order status changed to ${newStatus}`);
                    }
                }
            ]
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b';
            case 'confirmed': return '#3b82f6';
            case 'preparing': return '#8b5cf6';
            case 'shipped': return '#06b6d4';
            case 'delivered': return '#10b981';
            case 'cancelled': return '#ef4444';
            default: return COLORS.common.gray600;
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false}>
            <View style={styles.detailModal}>
                <View style={styles.detailHeader}>
                    <TouchableOpacity onPress={onClose} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={COLORS.common.gray800} />
                    </TouchableOpacity>
                    <Text style={styles.detailTitle}>Order Details</Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (isEditing) {
                                handleSave();
                            } else {
                                setIsEditing(true);
                            }
                        }}
                        style={styles.editButton}
                    >
                        <Ionicons
                            name={isEditing ? 'checkmark' : 'create-outline'}
                            size={24}
                            color={COLORS.farmer.primary}
                        />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.detailContent} showsVerticalScrollIndicator={false}>
                    {/* Order Number and Status */}
                    <View style={styles.detailSection}>
                        <Text style={styles.detailOrderNumber}>{order.orderNumber}</Text>
                        <View style={styles.detailStatusRow}>
                            <View
                                style={[
                                    styles.detailStatusBadge,
                                    { backgroundColor: getStatusColor(editedOrder.status) + '20' }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.detailStatusText,
                                        { color: getStatusColor(editedOrder.status) }
                                    ]}
                                >
                                    {editedOrder.status.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Status Change Buttons */}
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <View style={styles.statusActions}>
                            <Text style={styles.sectionLabel}>Quick Actions</Text>
                            <View style={styles.statusButtonsRow}>
                                {order.status === 'pending' && (
                                    <>
                                        <TouchableOpacity
                                            style={[styles.statusActionButton, { backgroundColor: '#3b82f6' + '20' }]}
                                            onPress={() => handleStatusChange('confirmed')}
                                        >
                                            <Ionicons name="checkmark-circle" size={20} color="#3b82f6" />
                                            <Text style={[styles.statusActionText, { color: '#3b82f6' }]}>Confirm</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.statusActionButton, { backgroundColor: '#ef4444' + '20' }]}
                                            onPress={() => handleStatusChange('cancelled')}
                                        >
                                            <Ionicons name="close-circle" size={20} color="#ef4444" />
                                            <Text style={[styles.statusActionText, { color: '#ef4444' }]}>Cancel</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                                {order.status === 'confirmed' && (
                                    <TouchableOpacity
                                        style={[styles.statusActionButton, { backgroundColor: '#8b5cf6' + '20', flex: 1 }]}
                                        onPress={() => handleStatusChange('preparing')}
                                    >
                                        <Ionicons name="cube" size={20} color="#8b5cf6" />
                                        <Text style={[styles.statusActionText, { color: '#8b5cf6' }]}>
                                            Start Preparing
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {order.status === 'preparing' && (
                                    <TouchableOpacity
                                        style={[styles.statusActionButton, { backgroundColor: '#06b6d4' + '20', flex: 1 }]}
                                        onPress={() => handleStatusChange('shipped')}
                                    >
                                        <Ionicons name="car" size={20} color="#06b6d4" />
                                        <Text style={[styles.statusActionText, { color: '#06b6d4' }]}>Mark Shipped</Text>
                                    </TouchableOpacity>
                                )}
                                {order.status === 'shipped' && (
                                    <TouchableOpacity
                                        style={[styles.statusActionButton, { backgroundColor: '#10b981' + '20', flex: 1 }]}
                                        onPress={() => handleStatusChange('delivered')}
                                    >
                                        <Ionicons name="checkmark-done-circle" size={20} color="#10b981" />
                                        <Text style={[styles.statusActionText, { color: '#10b981' }]}>
                                            Mark Delivered
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}

                    {/* Timeline */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Order Timeline</Text>
                        <View style={styles.timeline}>
                            {order.timeline.map((step, index) => (
                                <View key={index} style={styles.timelineItem}>
                                    <View style={styles.timelineLeft}>
                                        <View
                                            style={[
                                                styles.timelineDot,
                                                step.completed && styles.timelineDotCompleted
                                            ]}
                                        />
                                        {index < order.timeline.length - 1 && (
                                            <View
                                                style={[
                                                    styles.timelineLine,
                                                    step.completed && styles.timelineLineCompleted
                                                ]}
                                            />
                                        )}
                                    </View>
                                    <View style={styles.timelineRight}>
                                        <Text style={styles.timelineStatus}>
                                            {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                                        </Text>
                                        {step.date && (
                                            <Text style={styles.timelineDate}>{step.date}</Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Crop Details */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Crop Details</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Crop Type</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailInput}
                                    value={editedOrder.crop}
                                    onChangeText={(text) =>
                                        setEditedOrder({ ...editedOrder, crop: text })
                                    }
                                />
                            ) : (
                                <Text style={styles.detailValue}>{editedOrder.crop}</Text>
                            )}
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Quantity</Text>
                            {isEditing ? (
                                <View style={styles.quantityRow}>
                                    <TextInput
                                        style={[styles.detailInput, { flex: 1 }]}
                                        value={editedOrder.quantity.toString()}
                                        keyboardType="numeric"
                                        onChangeText={(text) =>
                                            setEditedOrder({ ...editedOrder, quantity: parseInt(text) || 0 })
                                        }
                                    />
                                    <Text style={styles.unitText}>{editedOrder.unit}</Text>
                                </View>
                            ) : (
                                <Text style={styles.detailValue}>
                                    {editedOrder.quantity} {editedOrder.unit}
                                </Text>
                            )}
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Price per {order.unit}</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailInput}
                                    value={editedOrder.pricePerUnit.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) =>
                                        setEditedOrder({ ...editedOrder, pricePerUnit: parseInt(text) || 0 })
                                    }
                                />
                            ) : (
                                <Text style={styles.detailValue}>Rs. {editedOrder.pricePerUnit}</Text>
                            )}
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Total Amount</Text>
                            <Text style={styles.detailValueBold}>
                                Rs. {(editedOrder.quantity * editedOrder.pricePerUnit).toLocaleString()}
                            </Text>
                        </View>
                    </View>

                    {/* Buyer Information */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Buyer Information</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Name</Text>
                            <Text style={styles.detailValue}>{order.buyer.name}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Contact</Text>
                            <TouchableOpacity>
                                <Text style={[styles.detailValue, styles.linkText]}>{order.buyer.contact}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Location</Text>
                            <Text style={styles.detailValue}>{order.buyer.location}</Text>
                        </View>
                    </View>

                    {/* Delivery Details */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Delivery Details</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Delivery Date</Text>
                            {isEditing ? (
                                <TextInput
                                    style={styles.detailInput}
                                    value={editedOrder.deliveryDate}
                                    onChangeText={(text) =>
                                        setEditedOrder({ ...editedOrder, deliveryDate: text })
                                    }
                                />
                            ) : (
                                <Text style={styles.detailValue}>{editedOrder.deliveryDate}</Text>
                            )}
                        </View>
                        <View style={styles.detailRowColumn}>
                            <Text style={styles.detailLabel}>Delivery Address</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.detailInput, styles.textArea]}
                                    value={editedOrder.deliveryAddress}
                                    multiline
                                    onChangeText={(text) =>
                                        setEditedOrder({ ...editedOrder, deliveryAddress: text })
                                    }
                                />
                            ) : (
                                <Text style={styles.detailValue}>{editedOrder.deliveryAddress}</Text>
                            )}
                        </View>
                    </View>

                    {/* Payment Status */}
                    <View style={styles.detailSection}>
                        <Text style={styles.sectionLabel}>Payment Information</Text>
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Payment Status</Text>
                            <View
                                style={[
                                    styles.paymentStatusBadge,
                                    {
                                        backgroundColor:
                                            order.paymentStatus === 'paid'
                                                ? '#10b981' + '20'
                                                : order.paymentStatus === 'advance_paid'
                                                    ? '#3b82f6' + '20'
                                                    : '#f59e0b' + '20'
                                    }
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.paymentStatusText,
                                        {
                                            color:
                                                order.paymentStatus === 'paid'
                                                    ? '#10b981'
                                                    : order.paymentStatus === 'advance_paid'
                                                        ? '#3b82f6'
                                                        : '#f59e0b'
                                        }
                                    ]}
                                >
                                    {order.paymentStatus === 'paid'
                                        ? 'Paid'
                                        : order.paymentStatus === 'advance_paid'
                                            ? 'Advance Paid'
                                            : 'Pending'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Notes */}
                    {(order.notes || isEditing) && (
                        <View style={styles.detailSection}>
                            <Text style={styles.sectionLabel}>Notes</Text>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.detailInput, styles.textArea]}
                                    value={editedOrder.notes}
                                    multiline
                                    placeholder="Add notes..."
                                    onChangeText={(text) =>
                                        setEditedOrder({ ...editedOrder, notes: text })
                                    }
                                />
                            ) : (
                                <Text style={styles.detailValue}>{editedOrder.notes || 'No notes'}</Text>
                            )}
                        </View>
                    )}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
        </Modal>
    );
};

const FarmerOrdersScreen = () => {
    const [orders, setOrders] = useState(sampleOrdersData);
    const [filteredOrders, setFilteredOrders] = useState(sampleOrdersData);
    const [selectedTab, setSelectedTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [sortBy, setSortBy] = useState('date');
    const [showSortMenu, setShowSortMenu] = useState(false);

    // Filter orders by tab
    const filterOrdersByTab = (tab, ordersList = orders) => {
        let filtered = ordersList;

        if (tab === 'active') {
            filtered = ordersList.filter(
                (order) => !['delivered', 'cancelled'].includes(order.status)
            );
        } else if (tab === 'completed') {
            filtered = ordersList.filter((order) => order.status === 'delivered');
        } else if (tab === 'cancelled') {
            filtered = ordersList.filter((order) => order.status === 'cancelled');
        }

        return filtered;
    };

    // Search orders
    const handleSearch = (query) => {
        setSearchQuery(query);
        let filtered = filterOrdersByTab(selectedTab);

        if (query.trim()) {
            filtered = filtered.filter(
                (order) =>
                    order.crop.toLowerCase().includes(query.toLowerCase()) ||
                    order.buyer.name.toLowerCase().includes(query.toLowerCase()) ||
                    order.orderNumber.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredOrders(sortOrders(filtered, sortBy));
    };

    // Sort orders
    const sortOrders = (ordersList, sortType) => {
        let sorted = [...ordersList];

        switch (sortType) {
            case 'date':
                sorted.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                break;
            case 'amount':
                sorted.sort((a, b) => b.totalAmount - a.totalAmount);
                break;
            case 'delivery':
                sorted.sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
                break;
            case 'status':
                sorted.sort((a, b) => a.status.localeCompare(b.status));
                break;
        }

        return sorted;
    };

    const handleSort = (sortType) => {
        setSortBy(sortType);
        setShowSortMenu(false);
        const sorted = sortOrders(filteredOrders, sortType);
        setFilteredOrders(sorted);
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setSelectedTab(tab);
        const filtered = filterOrdersByTab(tab);
        setFilteredOrders(sortOrders(filtered, sortBy));
        setSearchQuery('');
    };

    // Pull to refresh
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            Alert.alert('Success', 'Orders refreshed!');
        }, 1000);
    };

    // Handle order update
    const handleOrderUpdate = (updatedOrder) => {
        const updatedOrders = orders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
        );
        setOrders(updatedOrders);
        const filtered = filterOrdersByTab(selectedTab, updatedOrders);
        setFilteredOrders(sortOrders(filtered, sortBy));
        setSelectedOrder(updatedOrder);
    };

    // Handle new order creation
    const handleCreateOrder = (newOrder) => {
        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
        const filtered = filterOrdersByTab(selectedTab, updatedOrders);
        setFilteredOrders(sortOrders(filtered, sortBy));
    };

    // Export orders
    const handleExport = () => {
        Alert.alert(
            'Export Orders',
            'Choose export format',
            [
                {
                    text: 'PDF',
                    onPress: () => Alert.alert('Success', 'Orders exported as PDF')
                },
                {
                    text: 'CSV',
                    onPress: () => Alert.alert('Success', 'Orders exported as CSV')
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    // Get order counts
    const activeCount = orders.filter(
        (o) => !['delivered', 'cancelled'].includes(o.status)
    ).length;
    const completedCount = orders.filter((o) => o.status === 'delivered').length;
    const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

    return (
        <View style={styles.container}>
            <Header title="My Orders" />

            {/* Search and Actions Bar */}
            <View style={styles.searchBar}>
                <View style={styles.searchInputContainer}>
                    <Ionicons name="search" size={20} color={COLORS.common.gray400} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by crop, buyer, or order #"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => handleSearch('')}>
                            <Ionicons name="close-circle" size={20} color={COLORS.common.gray400} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.actionButton} onPress={() => setShowSortMenu(true)}>
                    <Ionicons name="funnel-outline" size={20} color={COLORS.farmer.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
                    <Ionicons name="download-outline" size={20} color={COLORS.farmer.primary} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabsContainer}
                contentContainerStyle={{ paddingHorizontal: 16 }}
            >
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
                    onPress={() => handleTabChange('all')}
                >
                    <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
                        All ({orders.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'active' && styles.tabActive]}
                    onPress={() => handleTabChange('active')}
                >
                    <Text style={[styles.tabText, selectedTab === 'active' && styles.tabTextActive]}>
                        Active ({activeCount})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'completed' && styles.tabActive]}
                    onPress={() => handleTabChange('completed')}
                >
                    <Text style={[styles.tabText, selectedTab === 'completed' && styles.tabTextActive]}>
                        Completed ({completedCount})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, selectedTab === 'cancelled' && styles.tabActive]}
                    onPress={() => handleTabChange('cancelled')}
                >
                    <Text style={[styles.tabText, selectedTab === 'cancelled' && styles.tabTextActive]}>
                        Cancelled ({cancelledCount})
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Orders List */}
            <ScrollView
                style={styles.ordersContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onPress={(selectedOrder) => {
                                setSelectedOrder(selectedOrder);
                                setModalVisible(true);
                            }}
                        />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="document-text-outline" size={64} color={COLORS.common.gray300} />
                        <Text style={styles.emptyStateText}>No orders found</Text>
                        <Text style={styles.emptyStateSubtext}>
                            {searchQuery ? 'Try a different search term' : 'Orders will appear here'}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setCreateModalVisible(true)}
            >
                <Ionicons name="add" size={28} color={COLORS.common.white} />
            </TouchableOpacity>

            {/* Sort Menu Modal */}
            <Modal visible={showSortMenu} animationType="fade" transparent>
                <TouchableOpacity
                    style={styles.sortModalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowSortMenu(false)}
                >
                    <View style={styles.sortMenu}>
                        <Text style={styles.sortMenuTitle}>Sort by</Text>
                        <TouchableOpacity
                            style={styles.sortMenuItem}
                            onPress={() => handleSort('date')}
                        >
                            <Text style={[styles.sortMenuText, sortBy === 'date' && styles.sortMenuTextActive]}>
                                Order Date
                            </Text>
                            {sortBy === 'date' && (
                                <Ionicons name="checkmark" size={20} color={COLORS.farmer.primary} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.sortMenuItem}
                            onPress={() => handleSort('delivery')}
                        >
                            <Text style={[styles.sortMenuText, sortBy === 'delivery' && styles.sortMenuTextActive]}>
                                Delivery Date
                            </Text>
                            {sortBy === 'delivery' && (
                                <Ionicons name="checkmark" size={20} color={COLORS.farmer.primary} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.sortMenuItem}
                            onPress={() => handleSort('amount')}
                        >
                            <Text style={[styles.sortMenuText, sortBy === 'amount' && styles.sortMenuTextActive]}>
                                Amount
                            </Text>
                            {sortBy === 'amount' && (
                                <Ionicons name="checkmark" size={20} color={COLORS.farmer.primary} />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.sortMenuItem}
                            onPress={() => handleSort('status')}
                        >
                            <Text style={[styles.sortMenuText, sortBy === 'status' && styles.sortMenuTextActive]}>
                                Status
                            </Text>
                            {sortBy === 'status' && (
                                <Ionicons name="checkmark" size={20} color={COLORS.farmer.primary} />
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Create Order Modal */}
            <CreateOrderModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onSave={handleCreateOrder}
            />

            {/* Order Detail Modal */}
            <OrderDetailModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                order={selectedOrder}
                onUpdate={handleOrderUpdate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.common.background,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.common.white,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: COLORS.common.gray200,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.common.gray800,
    },
    actionButton: {
        backgroundColor: COLORS.common.white,
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: COLORS.common.gray200,
    },
    tabsContainer: {
        maxHeight: 50,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: COLORS.common.white,
        borderWidth: 1,
        borderColor: COLORS.common.gray200,
    },
    tabActive: {
        backgroundColor: COLORS.farmer.primary,
        borderColor: COLORS.farmer.primary,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.common.gray600,
    },
    tabTextActive: {
        color: COLORS.common.white,
    },
    ordersContainer: {
        flex: 1,
        paddingTop: 16,
    },
    orderCard: {
        backgroundColor: COLORS.common.white,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.common.gray200,
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
    orderBuyer: {
        fontSize: 14,
        color: COLORS.common.gray600,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        gap: 4,
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
        borderRadius: 8,
    },
    paymentBadgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
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
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.farmer.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    sortModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    sortMenu: {
        backgroundColor: COLORS.common.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 20,
        paddingBottom: 40,
        paddingHorizontal: 16,
    },
    sortMenuTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.common.gray800,
        marginBottom: 16,
    },
    sortMenuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.common.gray200,
    },
    sortMenuText: {
        fontSize: 16,
        color: COLORS.common.gray700,
    },
    sortMenuTextActive: {
        color: COLORS.farmer.primary,
        fontWeight: '600',
    },
    detailModal: {
        flex: 1,
        backgroundColor: COLORS.common.background,
    },
    detailHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: COLORS.common.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.common.gray200,
    },
    backButton: {
        padding: 4,
    },
    detailTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.common.gray800,
    },
    editButton: {
        padding: 4,
    },
    saveButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: COLORS.farmer.primary,
        borderRadius: 8,
    },
    saveButtonText: {
        color: COLORS.common.white,
        fontSize: 16,
        fontWeight: '600',
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
    statusActions: {
        backgroundColor: COLORS.common.white,
        padding: 16,
        marginTop: 12,
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
        backgroundColor: COLORS.farmer.primary,
    },
    timelineLine: {
        flex: 1,
        width: 2,
        backgroundColor: COLORS.common.gray300,
        marginTop: 4,
    },
    timelineLineCompleted: {
        backgroundColor: COLORS.farmer.primary,
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
        color: COLORS.farmer.primary,
    },
    detailInput: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.common.gray800,
        borderWidth: 1,
        borderColor: COLORS.farmer.primary,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    unitText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.common.gray600,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
        marginTop: 8,
    },
    linkText: {
        color: COLORS.farmer.primary,
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
        backgroundColor: COLORS.farmer.primary,
    },
    unitOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.common.gray600,
    },
    unitOptionTextActive: {
        color: COLORS.common.white,
    },
    totalAmountDisplay: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.farmer.primary + '10',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
    },
    totalAmountLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.common.gray700,
    },
    totalAmountValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.farmer.primary,
    },
});

export default FarmerOrdersScreen;