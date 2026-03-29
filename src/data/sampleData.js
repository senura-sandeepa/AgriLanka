export const sampleCrops = [
  {
    id: 1,
    name: 'Tomatoes',
    farmer: 'Farmer Silva',
    quantity: '500 kg',
    price: 'Rs. 80/kg',
    harvest: '2025-01-05',
    location: 'Nuwara Eliya'
  },
  {
    id: 2,
    name: 'Carrots',
    farmer: 'Farmer Perera',
    quantity: '300 kg',
    price: 'Rs. 120/kg',
    harvest: '2025-01-08',
    location: 'Badulla'
  },
  {
    id: 3,
    name: 'Cabbage',
    farmer: 'Farmer Fernando',
    quantity: '400 kg',
    price: 'Rs. 60/kg',
    harvest: '2025-01-10',
    location: 'Nuwara Eliya'
  },
];

export const sampleOrders = [
  {
    id: 1,
    crop: 'Tomatoes',
    quantity: '200 kg',
    status: 'Pending',
    buyer: 'Keells Super',
    total: 'Rs. 16,000'
  },
  {
    id: 2,
    crop: 'Carrots',
    quantity: '150 kg',
    status: 'Confirmed',
    buyer: 'Cargills',
    total: 'Rs. 18,000'
  },
];

export const sampleNotifications = {
  farmer: [
    {
      id: 1,
      type: 'success',
      title: 'New Order Received',
      message: 'Keells Super ordered 200kg Tomatoes',
      time: '1 hour ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'Order Confirmed',
      message: 'Your order has been confirmed',
      time: '3 hours ago'
    },
  ],
  supermarket: [
    {
      id: 1,
      type: 'success',
      title: 'Order Confirmed',
      message: 'Your order for 200kg Tomatoes confirmed',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Crops Available',
      message: 'Fresh Carrots from Badulla now available',
      time: '5 hours ago'
    },
  ],
  admin: [
    {
      id: 1,
      type: 'warning',
      title: 'Pending Approval',
      message: '3 new farmer registrations awaiting review',
      time: '30 minutes ago'
    },
  ],
};