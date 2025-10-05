import { useState, useMemo } from 'react';
import { Search, ShoppingCart, LogOut, Utensils, Calendar, Truck, DollarSign, Settings, Plus, X, Edit2, Trash2, Eye } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Types
interface Dish {
  id: number;
  name: string;
  price: number;
  category: string;
  isVeg: boolean;
  discount?: number;
}

interface OrderItem extends Dish {
  quantity: number;
}

interface TableData {
  tableNumber: number;
  status: 'Ordering' | 'Ordered';
  orderItems: { [key: number]: number };
  orderType: 'Dine-in' | 'Takeaway' | 'Delivery';
  paymentMethod: 'Card' | 'Cash' | 'Coupon';
}

interface Reservation {
  id: number;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  tableNumber: number;
  partySize: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

interface DeliveryOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  deliveryTime: string;
  status: 'Awaiting Acceptance' | 'In Delivery' | 'Completed' | 'Cancelled';
  courier?: string;
  items: string[];
  total: number;
}

interface StoreSettings {
  storeName: string;
  storeDescription: string;
  manager: string;
  landlinePhone: string;
  mobilePhone: string;
  email: string;
  storeAddress: string;
  businessHours: string;
}

interface Bill {
  id: number;
  billNumber: string;
  date: string;
  time: string;
  tableNumber: number;
  amount: number;
  paymentMethod: 'Card' | 'Cash' | 'Coupon';
  status: 'Paid' | 'Pending' | 'Cancelled';
  items: { name: string; quantity: number; price: number }[];
}

// Sample data
const dishes: Dish[] = [
  { id: 1, name: 'Seafood Tomato Spaghetti', price: 68, category: 'Pasta', isVeg: false, discount: 20 },
  { id: 2, name: 'Classic Carbonara', price: 58, category: 'Pasta', isVeg: false },
  { id: 3, name: 'Pesto Pasta', price: 52, category: 'Pasta', isVeg: true },
  { id: 4, name: 'Grilled Salmon', price: 88, category: 'Mains', isVeg: false },
  { id: 5, name: 'Ribeye Steak', price: 128, category: 'Mains', isVeg: false, discount: 20 },
  { id: 6, name: 'Vegetable Stir Fry', price: 48, category: 'Mains', isVeg: true },
  { id: 7, name: 'Caesar Salad', price: 38, category: 'Salads', isVeg: true },
  { id: 8, name: 'Greek Salad', price: 42, category: 'Salads', isVeg: true },
  { id: 9, name: 'Cobb Salad', price: 45, category: 'Salads', isVeg: false },
  { id: 10, name: 'Tomato Soup', price: 28, category: 'Soups', isVeg: true },
  { id: 11, name: 'Chicken Noodle Soup', price: 32, category: 'Soups', isVeg: false },
  { id: 12, name: 'French Onion Soup', price: 35, category: 'Soups', isVeg: true },
  { id: 13, name: 'Mushroom Soup', price: 30, category: 'Soups', isVeg: true },
  { id: 14, name: 'Pancakes', price: 25, category: 'Breakfast', isVeg: true },
  { id: 15, name: 'Eggs Benedict', price: 35, category: 'Breakfast', isVeg: false },
  { id: 16, name: 'Avocado Toast', price: 28, category: 'Breakfast', isVeg: true },
  { id: 17, name: 'French Toast', price: 30, category: 'Breakfast', isVeg: true },
  { id: 18, name: 'Omelette', price: 32, category: 'Breakfast', isVeg: false },
];

// Initial tables data
const initialTables: { [key: number]: TableData } = {
  1: {
    tableNumber: 1,
    status: 'Ordered',
    orderItems: { 1: 2, 4: 1 },
    orderType: 'Dine-in',
    paymentMethod: 'Card',
  },
  2: {
    tableNumber: 2,
    status: 'Ordering',
    orderItems: { 7: 1 },
    orderType: 'Dine-in',
    paymentMethod: 'Cash',
  },
  4: {
    tableNumber: 4,
    status: 'Ordering',
    orderItems: {},
    orderType: 'Dine-in',
    paymentMethod: 'Card',
  },
};

// Initial reservations data
const initialReservations: Reservation[] = [
  {
    id: 1,
    customerName: 'John Smith',
    phone: '555-0101',
    date: '2025-10-08',
    time: '18:00',
    tableNumber: 5,
    partySize: 4,
    status: 'Confirmed',
  },
  {
    id: 2,
    customerName: 'Sarah Johnson',
    phone: '555-0102',
    date: '2025-10-08',
    time: '19:30',
    tableNumber: 3,
    partySize: 2,
    status: 'Confirmed',
  },
  {
    id: 3,
    customerName: 'Michael Brown',
    phone: '555-0103',
    date: '2025-10-09',
    time: '20:00',
    tableNumber: 8,
    partySize: 6,
    status: 'Pending',
  },
  {
    id: 4,
    customerName: 'Emily Davis',
    phone: '555-0104',
    date: '2025-10-10',
    time: '18:30',
    tableNumber: 2,
    partySize: 3,
    status: 'Confirmed',
  },
];

// Initial delivery orders data
const initialDeliveryOrders: DeliveryOrder[] = [
  {
    id: 1,
    orderNumber: 'DD20251005001',
    customerName: 'Xiao Cheng',
    phone: '0475123456',
    address: 'Balaclava Rd, Macquarie Park NSW 2113',
    deliveryTime: 'Deliver ASAP',
    status: 'In Delivery',
    courier: 'Mr. Li',
    items: ['Seafood Tomato Spaghetti', 'Caesar Salad'],
    total: 106,
  },
  {
    id: 2,
    orderNumber: 'DD20251005002',
    customerName: 'Emma Wilson',
    phone: '0412345678',
    address: '123 George St, Sydney NSW 2000',
    deliveryTime: '12:30 PM',
    status: 'Awaiting Acceptance',
    items: ['Ribeye Steak', 'French Onion Soup'],
    total: 163,
  },
  {
    id: 3,
    orderNumber: 'DD20251005003',
    customerName: 'James Taylor',
    phone: '0423456789',
    address: '45 Market St, Parramatta NSW 2150',
    deliveryTime: 'Deliver ASAP',
    status: 'Completed',
    courier: 'Ms. Wang',
    items: ['Classic Carbonara', 'Greek Salad'],
    total: 100,
  },
  {
    id: 4,
    orderNumber: 'DD20251005004',
    customerName: 'Sophie Brown',
    phone: '0434567890',
    address: '78 High St, North Sydney NSW 2060',
    deliveryTime: '1:00 PM',
    status: 'In Delivery',
    courier: 'Mr. Chen',
    items: ['Grilled Salmon', 'Tomato Soup'],
    total: 116,
  },
  {
    id: 5,
    orderNumber: 'DD20251005005',
    customerName: 'Oliver Martinez',
    phone: '0445678901',
    address: '12 King St, Newtown NSW 2042',
    deliveryTime: 'Deliver ASAP',
    status: 'Awaiting Acceptance',
    items: ['Pancakes', 'Avocado Toast'],
    total: 53,
  },
];

// Initial bills data
const initialBills: Bill[] = [
  {
    id: 1,
    billNumber: 'B20251005001',
    date: '2025-10-05',
    time: '12:30',
    tableNumber: 4,
    amount: 156,
    paymentMethod: 'Card',
    status: 'Paid',
    items: [
      { name: 'Seafood Tomato Spaghetti', quantity: 2, price: 54.4 },
      { name: 'Caesar Salad', quantity: 2, price: 38 },
    ],
  },
  {
    id: 2,
    billNumber: 'B20251005002',
    date: '2025-10-05',
    time: '13:15',
    tableNumber: 2,
    amount: 210,
    paymentMethod: 'Cash',
    status: 'Paid',
    items: [
      { name: 'Ribeye Steak', quantity: 1, price: 102.4 },
      { name: 'Grilled Salmon', quantity: 1, price: 88 },
    ],
  },
  {
    id: 3,
    billNumber: 'B20251005003',
    date: '2025-10-05',
    time: '14:00',
    tableNumber: 1,
    amount: 96,
    paymentMethod: 'Card',
    status: 'Paid',
    items: [
      { name: 'Classic Carbonara', quantity: 1, price: 58 },
      { name: 'Caesar Salad', quantity: 1, price: 38 },
    ],
  },
  {
    id: 4,
    billNumber: 'B20251004001',
    date: '2025-10-04',
    time: '18:30',
    tableNumber: 5,
    amount: 185,
    paymentMethod: 'Card',
    status: 'Paid',
    items: [
      { name: 'Ribeye Steak', quantity: 1, price: 102.4 },
      { name: 'Pesto Pasta', quantity: 1, price: 52 },
      { name: 'Tomato Soup', quantity: 1, price: 28 },
    ],
  },
  {
    id: 5,
    billNumber: 'B20251004002',
    date: '2025-10-04',
    time: '19:45',
    tableNumber: 3,
    amount: 142,
    paymentMethod: 'Cash',
    status: 'Paid',
    items: [
      { name: 'Grilled Salmon', quantity: 1, price: 88 },
      { name: 'Seafood Tomato Spaghetti', quantity: 1, price: 54.4 },
    ],
  },
  {
    id: 6,
    billNumber: 'B20251003001',
    date: '2025-10-03',
    time: '12:00',
    tableNumber: 6,
    amount: 220,
    paymentMethod: 'Card',
    status: 'Paid',
    items: [
      { name: 'Ribeye Steak', quantity: 2, price: 102.4 },
    ],
  },
  {
    id: 7,
    billNumber: 'B20251002001',
    date: '2025-10-02',
    time: '13:30',
    tableNumber: 2,
    amount: 175,
    paymentMethod: 'Coupon',
    status: 'Paid',
    items: [
      { name: 'Grilled Salmon', quantity: 2, price: 88 },
    ],
  },
  {
    id: 8,
    billNumber: 'B20251001001',
    date: '2025-10-01',
    time: '18:00',
    tableNumber: 4,
    amount: 195,
    paymentMethod: 'Card',
    status: 'Paid',
    items: [
      { name: 'Ribeye Steak', quantity: 1, price: 102.4 },
      { name: 'Classic Carbonara', quantity: 1, price: 58 },
      { name: 'Caesar Salad', quantity: 1, price: 38 },
    ],
  },
];

// Find first table with "Ordering" status
const getInitialSelectedTable = () => {
  const orderingTable = Object.values(initialTables).find(table => table.status === 'Ordering');
  return orderingTable ? orderingTable.tableNumber : Object.keys(initialTables)[0] ? parseInt(Object.keys(initialTables)[0]) : 1;
};

function App() {
  const [selectedMenu, setSelectedMenu] = useState('Ordering');
  const [selectedTable, setSelectedTable] = useState(getInitialSelectedTable());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  
  // Table management state
  const [tables, setTables] = useState<{ [key: number]: TableData }>(initialTables);
  
  // Reservations state
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [reservationSearch, setReservationSearch] = useState('');
  const [showAddReservation, setShowAddReservation] = useState(false);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [reservationForm, setReservationForm] = useState({
    customerName: '',
    phone: '',
    date: '',
    time: '',
    tableNumber: 1,
    partySize: 2,
  });

  // Delivery state
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(initialDeliveryOrders);
  const [deliverySearch, setDeliverySearch] = useState('');
  const [showAddDelivery, setShowAddDelivery] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    deliveryTime: '',
    items: '',
    total: 0,
  });

  // Settings state
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Delicious Restaurant',
    storeDescription: 'Provide delicious Chinese and Western cuisine, ensuring every customer enjoys a comfortable dining experience.',
    manager: 'Mr. Sheng',
    landlinePhone: '010-12345678',
    mobilePhone: '0475123456',
    email: 'restaurant@example.com',
    storeAddress: 'Balaclava Rd, Macquarie Park NSW 2113',
    businessHours: '10:00 - 22:00',
  });

  // Revenue state
  const [bills] = useState<Bill[]>(initialBills);
  const [revenueSearch, setRevenueSearch] = useState('');
  const [revenueFilter, setRevenueFilter] = useState<'Today' | 'This Week' | 'All'>('All');
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showBillDetails, setShowBillDetails] = useState(false);
  
  const currentTable = tables[selectedTable] || {
    tableNumber: selectedTable,
    status: 'Ordering' as const,
    orderItems: {},
    orderType: 'Dine-in' as const,
    paymentMethod: 'Card' as const,
  };

  const categories = useMemo(() => {
    const counts: { [key: string]: number } = { All: dishes.length };
    dishes.forEach(dish => {
      counts[dish.category] = (counts[dish.category] || 0) + 1;
    });
    return counts;
  }, []);

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const orderItemsList: OrderItem[] = useMemo(() => {
    return Object.entries(currentTable.orderItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([id, quantity]) => {
        const dish = dishes.find(d => d.id === parseInt(id))!;
        return { ...dish, quantity };
      });
  }, [currentTable.orderItems]);

  const subtotal = useMemo(() => {
    return orderItemsList.reduce((sum, item) => {
      const price = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      return sum + price * item.quantity;
    }, 0);
  }, [orderItemsList]);

  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  const updateQuantity = (dishId: number, delta: number) => {
    if (currentTable.status === 'Ordered') return; // Can't modify ordered tables
    
    setTables(prev => ({
      ...prev,
      [selectedTable]: {
        ...prev[selectedTable],
        orderItems: (() => {
          const current = prev[selectedTable]?.orderItems || {};
          const newQuantity = (current[dishId] || 0) + delta;
          if (newQuantity <= 0) {
            const { [dishId]: _, ...rest } = current;
            return rest;
          }
          return { ...current, [dishId]: newQuantity };
        })(),
      },
    }));
  };

  const updateOrderType = (type: 'Dine-in' | 'Takeaway' | 'Delivery') => {
    setTables(prev => ({
      ...prev,
      [selectedTable]: {
        ...prev[selectedTable],
        orderType: type,
      },
    }));
  };

  const updatePaymentMethod = (method: 'Card' | 'Cash' | 'Coupon') => {
    setTables(prev => ({
      ...prev,
      [selectedTable]: {
        ...prev[selectedTable],
        paymentMethod: method,
      },
    }));
  };

  const handlePlaceOrder = () => {
    if (currentTable.status === 'Ordering') {
      // Change status to Ordered
      setTables(prev => ({
        ...prev,
        [selectedTable]: {
          ...prev[selectedTable],
          status: 'Ordered',
        },
      }));
      alert(`Order placed for Table ${selectedTable}!\nTotal: $${total.toFixed(2)}`);
    }
  };

  const handleCheckout = () => {
    // Remove table from the list
    setTables(prev => {
      const { [selectedTable]: _, ...rest } = prev;
      return rest;
    });
    
    alert(`Table ${selectedTable} checked out!\nTotal: $${total.toFixed(2)}\nPayment: ${currentTable.paymentMethod}`);
    
    // Switch to another available table or create a new one
    const remainingTables = Object.keys(tables).map(Number).filter(t => t !== selectedTable);
    if (remainingTables.length > 0) {
      setSelectedTable(remainingTables[0]);
    } else {
      // Create a new table
      const newTableNumber = 1;
      setSelectedTable(newTableNumber);
      setTables({
        [newTableNumber]: {
          tableNumber: newTableNumber,
          status: 'Ordering',
          orderItems: {},
          orderType: 'Dine-in',
          paymentMethod: 'Card',
        },
      });
    }
  };

  const handleAddTable = (tableNumber: number) => {
    if (tables[tableNumber]) {
      alert(`Table ${tableNumber} already exists!`);
      return;
    }
    
    setTables(prev => ({
      ...prev,
      [tableNumber]: {
        tableNumber,
        status: 'Ordering',
        orderItems: {},
        orderType: 'Dine-in',
        paymentMethod: 'Card',
      },
    }));
    
    setSelectedTable(tableNumber);
    setShowAddTableModal(false);
  };

  // Reservation handlers
  const filteredReservations = useMemo(() => {
    return reservations.filter(reservation =>
      reservation.customerName.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      reservation.phone.includes(reservationSearch)
    );
  }, [reservations, reservationSearch]);

  const handleAddReservation = () => {
    if (!reservationForm.customerName || !reservationForm.phone || !reservationForm.date || !reservationForm.time) {
      alert('Please fill in all required fields!');
      return;
    }

    if (editingReservation) {
      // Update existing reservation
      setReservations(prev =>
        prev.map(res =>
          res.id === editingReservation.id
            ? { ...res, ...reservationForm }
            : res
        )
      );
      setEditingReservation(null);
    } else {
      // Add new reservation
      const newReservation: Reservation = {
        id: Math.max(...reservations.map(r => r.id), 0) + 1,
        ...reservationForm,
        status: 'Pending',
      };
      setReservations(prev => [...prev, newReservation]);
    }

    // Reset form
    setReservationForm({
      customerName: '',
      phone: '',
      date: '',
      time: '',
      tableNumber: 1,
      partySize: 2,
    });
    setShowAddReservation(false);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setReservationForm({
      customerName: reservation.customerName,
      phone: reservation.phone,
      date: reservation.date,
      time: reservation.time,
      tableNumber: reservation.tableNumber,
      partySize: reservation.partySize,
    });
    setShowAddReservation(true);
  };

  const handleCancelReservation = (id: number) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      setReservations(prev => prev.filter(res => res.id !== id));
    }
  };

  const handleCloseReservationForm = () => {
    setShowAddReservation(false);
    setEditingReservation(null);
    setReservationForm({
      customerName: '',
      phone: '',
      date: '',
      time: '',
      tableNumber: 1,
      partySize: 2,
    });
  };

  // Delivery handlers
  const filteredDeliveryOrders = useMemo(() => {
    return deliveryOrders.filter(order =>
      order.orderNumber.toLowerCase().includes(deliverySearch.toLowerCase()) ||
      order.customerName.toLowerCase().includes(deliverySearch.toLowerCase())
    );
  }, [deliveryOrders, deliverySearch]);

  const deliveryStats = useMemo(() => {
    const today = deliveryOrders.length;
    const completed = deliveryOrders.filter(o => o.status === 'Completed').length;
    const inDelivery = deliveryOrders.filter(o => o.status === 'In Delivery').length;
    return { today, completed, inDelivery };
  }, [deliveryOrders]);

  const handleAddDeliveryOrder = () => {
    if (!deliveryForm.customerName || !deliveryForm.phone || !deliveryForm.address || !deliveryForm.items) {
      alert('Please fill in all required fields!');
      return;
    }

    const newOrder: DeliveryOrder = {
      id: Math.max(...deliveryOrders.map(o => o.id), 0) + 1,
      orderNumber: `DD${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(deliveryOrders.length + 1).padStart(3, '0')}`,
      customerName: deliveryForm.customerName,
      phone: deliveryForm.phone,
      address: deliveryForm.address,
      deliveryTime: deliveryForm.deliveryTime || 'Deliver ASAP',
      status: 'Awaiting Acceptance',
      items: deliveryForm.items.split(',').map(i => i.trim()),
      total: deliveryForm.total,
    };

    setDeliveryOrders(prev => [...prev, newOrder]);
    setDeliveryForm({
      customerName: '',
      phone: '',
      address: '',
      deliveryTime: '',
      items: '',
      total: 0,
    });
    setShowAddDelivery(false);
  };

  const handleUpdateOrderStatus = (orderId: number, newStatus: DeliveryOrder['status']) => {
    setDeliveryOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleCancelOrder = (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      setDeliveryOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: 'Cancelled' } : order
        )
      );
    }
  };

  // Settings handlers
  const handleSaveSettings = () => {
    alert('Settings saved successfully!');
    // In a real application, you would save to a backend/database here
  };

  // Revenue handlers
  const filteredBills = useMemo(() => {
    let filtered = bills.filter(bill =>
      bill.billNumber.toLowerCase().includes(revenueSearch.toLowerCase())
    );

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().split('T')[0];

    if (revenueFilter === 'Today') {
      filtered = filtered.filter(bill => bill.date === today);
    } else if (revenueFilter === 'This Week') {
      filtered = filtered.filter(bill => bill.date >= weekAgoStr);
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.date + ' ' + a.time);
      const dateB = new Date(b.date + ' ' + b.time);
      return dateB.getTime() - dateA.getTime();
    });
  }, [bills, revenueSearch, revenueFilter]);

  const salesTrendData = useMemo(() => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date();
    const currentDayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert Sunday=0 to Sunday=6
    
    return daysOfWeek.map((day, index) => {
      // Calculate date for this day
      const daysAgo = (currentDayIndex - index + 7) % 7;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayTotal = bills
        .filter(bill => bill.date === dateStr && bill.status === 'Paid')
        .reduce((sum, bill) => sum + bill.amount, 0);
      
      return { name: day, sales: dayTotal };
    });
  }, [bills]);

  const paymentMethodData = useMemo(() => {
    const methods = { Card: 0, Cash: 0, Coupon: 0 };
    bills.filter(bill => bill.status === 'Paid').forEach(bill => {
      methods[bill.paymentMethod] += bill.amount;
    });
    
    return [
      { name: 'Card', value: methods.Card },
      { name: 'Cash', value: methods.Cash },
      { name: 'Coupon', value: methods.Coupon },
    ].filter(item => item.value > 0);
  }, [bills]);

  const handleViewBillDetails = (bill: Bill) => {
    setSelectedBill(bill);
    setShowBillDetails(true);
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  const menuItems = [
    { name: 'Ordering', icon: Utensils },
    { name: 'Reservations', icon: Calendar },
    { name: 'Delivery', icon: Truck },
    { name: 'Revenue', icon: DollarSign },
    { name: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Navigation */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800">RestaurantOS</h1>
        </div>
        <nav className="flex-1 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedMenu === item.name;
            return (
              <button
                key={item.name}
                onClick={() => setSelectedMenu(item.name)}
                className={`w-full flex items-center space-x-3 px-4 py-3 mb-2 rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-lime-yellow text-black font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
        <div className="p-4">
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      {selectedMenu === 'Ordering' && (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Enter a dish name to search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Table Info and Order Type */}
          <div className="ml-6 flex items-center space-x-4">
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-800">Table {selectedTable}</div>
              <div className="flex space-x-2 mt-2">
                {(['Dine-in', 'Takeaway', 'Delivery'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateOrderType(type)}
                    disabled={currentTable.status === 'Ordered'}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      currentTable.orderType === type
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${currentTable.status === 'Ordered' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Dishes Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(categories).map(([category, count]) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {category} {count}
                </button>
              ))}
            </div>

            {/* Dish Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredDishes.map((dish) => (
                <div key={dish.id} className="bg-white rounded-lg shadow-md overflow-hidden relative">
                  {dish.discount && (
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg">
                      {dish.discount}% off
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-semibold text-gray-800 flex-1">{dish.name}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${dish.discount ? (dish.price * (1 - dish.discount / 100)).toFixed(0) : dish.price}
                        </span>
                        {dish.discount && (
                          <span className="text-sm text-gray-400 line-through">${dish.price}</span>
                        )}
                      </div>
                      <div className={`flex items-center space-x-1 text-xs font-medium ${
                        dish.isVeg ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          dish.isVeg ? 'bg-green-600' : 'bg-red-600'
                        }`}></div>
                        <span>{dish.isVeg ? 'Veg' : 'Non Veg'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-end space-x-3 mt-3">
                      {currentTable.orderItems[dish.id] > 0 && (
                        <>
                          <button
                            onClick={() => updateQuantity(dish.id, -1)}
                            disabled={currentTable.status === 'Ordered'}
                            className={`w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full transition-colors text-gray-700 font-bold ${
                              currentTable.status === 'Ordered' 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-gray-300'
                            }`}
                          >
                            −
                          </button>
                          <span className="font-semibold text-gray-800 w-6 text-center">
                            {currentTable.orderItems[dish.id]}
                          </span>
                        </>
                      )}
                      <button
                        onClick={() => updateQuantity(dish.id, 1)}
                        disabled={currentTable.status === 'Ordered'}
                        className={`w-8 h-8 flex items-center justify-center bg-green-500 rounded-full transition-colors text-white font-bold ${
                          currentTable.status === 'Ordered' 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'hover:bg-green-600'
                        }`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Order Details */}
          <div className="w-80 bg-white shadow-lg p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
              <ShoppingCart className="text-gray-600" size={24} />
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-6">
              {orderItemsList.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items in order</p>
              ) : (
                orderItemsList.map((item) => {
                  const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
                  return (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="flex items-center space-x-1 text-xs mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            item.isVeg ? 'bg-green-600' : 'bg-red-600'
                          }`}></div>
                          <span className={item.isVeg ? 'text-green-600' : 'text-red-600'}>
                            {item.isVeg ? 'Veg' : 'Non Veg'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">
                          ${itemPrice.toFixed(0)} × {item.quantity}
                        </div>
                        <div className="text-gray-600">
                          ${(itemPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Order Summary */}
            {orderItemsList.length > 0 && (
              <>
                <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee (5%)</span>
                    <span className="font-semibold text-gray-800">${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span className="text-gray-800">Total Amount</span>
                    <span className="text-green-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Payment Method</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Card', 'Cash', 'Coupon'] as const).map((method) => (
                      <button
                        key={method}
                        onClick={() => updatePaymentMethod(method)}
                        disabled={currentTable.status === 'Ordered'}
                        className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentTable.paymentMethod === method
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${currentTable.status === 'Ordered' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Place Order / Checkout Button */}
                <button
                  onClick={currentTable.status === 'Ordered' ? handleCheckout : handlePlaceOrder}
                  className={`w-full font-bold py-3 rounded-lg transition-colors ${
                    currentTable.status === 'Ordered'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {currentTable.status === 'Ordered' ? 'Checkout' : 'Place Order'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="bg-light-orange px-6 py-3 shadow-inner">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-gray-700">Order Progress:</span>
            <div className="flex flex-wrap gap-3 items-center">
              {Object.values(tables).map((table) => (
                <button
                  key={table.tableNumber}
                  onClick={() => setSelectedTable(table.tableNumber)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    table.status === 'Ordered'
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  } ${selectedTable === table.tableNumber ? 'ring-2 ring-blue-500' : ''}`}
                >
                  Table {table.tableNumber} - {table.status}
                </button>
              ))}
              <button
                onClick={() => setShowAddTableModal(true)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>Add Table</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Reservations Page */}
      {selectedMenu === 'Reservations' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-white shadow-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Reservations Management</h2>
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by customer name or phone"
                    value={reservationSearch}
                    onChange={(e) => setReservationSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-80"
                  />
                </div>
                <button
                  onClick={() => setShowAddReservation(true)}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add Reservation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Reservations Table */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Customer Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Table</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Party Size</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                        No reservations found
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((reservation) => (
                      <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-800">{reservation.customerName}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{reservation.phone}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{reservation.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{reservation.time}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">Table {reservation.tableNumber}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{reservation.partySize} people</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              reservation.status === 'Confirmed'
                                ? 'bg-green-100 text-green-800'
                                : reservation.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {reservation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditReservation(reservation)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Reservation Modal */}
      {showAddReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingReservation ? 'Edit Reservation' : 'Add New Reservation'}
              </h2>
              <button
                onClick={handleCloseReservationForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={reservationForm.customerName}
                  onChange={(e) => setReservationForm({ ...reservationForm, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter customer name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={reservationForm.phone}
                  onChange={(e) => setReservationForm({ ...reservationForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="555-0123"
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reservation Date *
                  </label>
                  <input
                    type="date"
                    value={reservationForm.date}
                    onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reservation Time *
                  </label>
                  <input
                    type="time"
                    value={reservationForm.time}
                    onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Table Number and Party Size */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={reservationForm.tableNumber}
                    onChange={(e) => setReservationForm({ ...reservationForm, tableNumber: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party Size *
                  </label>
                  <select
                    value={reservationForm.partySize}
                    onChange={(e) => setReservationForm({ ...reservationForm, partySize: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((size) => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? 'person' : 'people'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCloseReservationForm}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReservation}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors"
              >
                {editingReservation ? 'Update Reservation' : 'Confirm Add Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Page */}
      {selectedMenu === 'Delivery' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-white shadow-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Delivery Management</h2>
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by order number"
                    value={deliverySearch}
                    onChange={(e) => setDeliverySearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-80"
                  />
                </div>
                <button
                  onClick={() => setShowAddDelivery(true)}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>New Delivery</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="px-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-100 rounded-lg p-4">
                <div className="text-blue-800 text-sm font-medium mb-1">Today's Orders</div>
                <div className="text-3xl font-bold text-blue-900">{deliveryStats.today}</div>
              </div>
              <div className="bg-green-100 rounded-lg p-4">
                <div className="text-green-800 text-sm font-medium mb-1">Completed</div>
                <div className="text-3xl font-bold text-green-900">{deliveryStats.completed}</div>
              </div>
              <div className="bg-orange-100 rounded-lg p-4">
                <div className="text-orange-800 text-sm font-medium mb-1">In Delivery</div>
                <div className="text-3xl font-bold text-orange-900">{deliveryStats.inDelivery}</div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDeliveryOrders.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No delivery orders found
                </div>
              ) : (
                filteredDeliveryOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                    {/* Order Number */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-bold text-gray-800">{order.orderNumber}</div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'In Delivery'
                            ? 'bg-orange-100 text-orange-800'
                            : order.status === 'Awaiting Acceptance'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Delivery Address</div>
                      <div className="text-sm text-gray-800">{order.address}</div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Customer</div>
                      <div className="text-sm text-gray-800">
                        {order.phone} - {order.customerName}
                      </div>
                    </div>

                    {/* Delivery Time */}
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Expected Time</div>
                      <div className="text-sm font-medium text-gray-800">{order.deliveryTime}</div>
                    </div>

                    {/* Courier Info */}
                    {order.courier && (
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">Courier</div>
                        <div className="text-sm text-gray-800">{order.courier}</div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="mb-3">
                      <div className="text-xs text-gray-500 mb-1">Items</div>
                      <div className="text-sm text-gray-800">{order.items.join(', ')}</div>
                    </div>

                    {/* Total */}
                    <div className="mb-4 pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Total</span>
                        <span className="text-lg font-bold text-green-600">${order.total}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {order.status === 'Awaiting Acceptance' && (
                        <>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'In Delivery')}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                          >
                            Accept Order
                          </button>
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {order.status === 'In Delivery' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                        >
                          Complete Delivery
                        </button>
                      )}
                      {order.status === 'Completed' && (
                        <div className="flex-1 text-center text-sm text-green-600 font-medium py-2">
                          ✓ Delivered
                        </div>
                      )}
                      {order.status === 'Cancelled' && (
                        <div className="flex-1 text-center text-sm text-red-600 font-medium py-2">
                          ✗ Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Delivery Modal */}
      {showAddDelivery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">New Delivery Order</h2>
              <button
                onClick={() => setShowAddDelivery(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={deliveryForm.customerName}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter customer name"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={deliveryForm.phone}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0475123456"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  value={deliveryForm.address}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter delivery address"
                  rows={2}
                />
              </div>

              {/* Delivery Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Time
                </label>
                <input
                  type="text"
                  value={deliveryForm.deliveryTime}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deliver ASAP or 12:30 PM"
                />
              </div>

              {/* Items */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Items *
                </label>
                <textarea
                  value={deliveryForm.items}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, items: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter items separated by commas"
                  rows={2}
                />
              </div>

              {/* Total */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={deliveryForm.total}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, total: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddDelivery(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDeliveryOrder}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition-colors"
              >
                Create Delivery Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Page */}
      {selectedMenu === 'Settings' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-white shadow-sm px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">Restaurant Settings</h2>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
                
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        value={settings.storeName}
                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter store name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Description
                      </label>
                      <textarea
                        value={settings.storeDescription}
                        onChange={(e) => setSettings({ ...settings, storeDescription: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter store description"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manager
                      </label>
                      <input
                        type="text"
                        value={settings.manager}
                        onChange={(e) => setSettings({ ...settings, manager: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter manager name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Landline Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.landlinePhone}
                          onChange={(e) => setSettings({ ...settings, landlinePhone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="010-12345678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mobile Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.mobilePhone}
                          onChange={(e) => setSettings({ ...settings, mobilePhone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="0475123456"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="restaurant@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Business Information Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Business Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Store Address
                      </label>
                      <textarea
                        value={settings.storeAddress}
                        onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter store address"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Hours
                      </label>
                      <input
                        type="text"
                        value={settings.businessHours}
                        onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="10:00 - 22:00"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveSettings}
                    className="bg-green-500 hover:bg-green-600 text-white font-medium px-8 py-3 rounded-lg transition-colors shadow-md"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Page */}
      {selectedMenu === 'Revenue' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="bg-white shadow-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Revenue Management</h2>
              <div className="flex items-center space-x-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by bill number"
                    value={revenueSearch}
                    onChange={(e) => setRevenueSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-80"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Data Visualization Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Trend Chart */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Sales Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#10b981" name="Sales ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Method Breakdown */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: { name: string; percent: number }) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Billing List Section */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">Billing List</h3>
                  <div className="flex space-x-2">
                    {(['Today', 'This Week', 'All'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setRevenueFilter(filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          revenueFilter === filter
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Bill Number</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date & Time</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Table</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Method</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBills.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                          No bills found
                        </td>
                      </tr>
                    ) : (
                      filteredBills.map((bill) => (
                        <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-800">{bill.billNumber}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">
                            {bill.date} {bill.time}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-800">Table {bill.tableNumber}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-green-600">${bill.amount.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{bill.paymentMethod}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                bill.status === 'Paid'
                                  ? 'bg-green-100 text-green-800'
                                  : bill.status === 'Pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {bill.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewBillDetails(bill)}
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              <Eye size={16} />
                              <span>Details</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bill Details Modal */}
      {showBillDetails && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px] shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Bill Details</h2>
              <button
                onClick={() => setShowBillDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Bill Info */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Bill Number</div>
                  <div className="font-semibold text-gray-800">{selectedBill.billNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Date & Time</div>
                  <div className="font-semibold text-gray-800">
                    {selectedBill.date} {selectedBill.time}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Table Number</div>
                  <div className="font-semibold text-gray-800">Table {selectedBill.tableNumber}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Payment Method</div>
                  <div className="font-semibold text-gray-800">{selectedBill.paymentMethod}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Status</div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      selectedBill.status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : selectedBill.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedBill.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedBill.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{item.name}</div>
                        <div className="text-xs text-gray-500">Quantity: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                  <span className="text-2xl font-bold text-green-600">${selectedBill.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowBillDetails(false)}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Table</h2>
              <button
                onClick={() => setShowAddTableModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">Select a table number to add:</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((num) => (
                <button
                  key={num}
                  onClick={() => handleAddTable(num)}
                  disabled={!!tables[num]}
                  className={`py-3 rounded-lg font-medium transition-colors ${
                    tables[num]
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAddTableModal(false)}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
