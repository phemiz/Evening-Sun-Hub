
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, CartItem, Booking, Product, ServiceType, ServiceItem, Staff, ActivityLog, Vessel, Review, Transaction, Voucher, ClubEvent, ProtocolData } from '../types';
import { MOCK_PRODUCTS, MOCK_SERVICES, EVENTS, MOCK_STAFF as INITIAL_STAFF, SERVICE_CATEGORIES, MOCK_VESSELS, MOCK_INITIAL_BOOKINGS, MANAGEMENT_KPIS } from '../constants';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: string;
  read: boolean;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

interface TickerConfig {
  messages: string[];
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'XL';
  color: string;
  speed: 'SLOW' | 'STEADY' | 'QUICK' | 'URGENT';
}

interface AppSettings {
  notifications: { orders: boolean; promos: boolean; email: boolean; };
  security: { twoFactor: boolean; };
  themeMode: 'light' | 'dark' | 'system';
}

interface BusinessSettings {
  openingTime: string;
  closingTime: string;
  deliveryFee: number;
  serviceCharge: number;
}

interface OrderTracker {
  id: string;
  status: 'LOGGED' | 'PREPPING' | 'DISPATCHED' | 'READY';
  type: 'FOOD' | 'ORDER' | 'SERVICE';
}

interface WeatherData {
  temp: number;
  condition: 'SUNNY' | 'WINDY' | 'STORM_WARNING';
  sailability: number;
}

interface AppContextType {
  user: User | null;
  customers: User[];
  login: (phone: string, password?: string) => boolean;
  signup: (name: string, phone: string, password?: string) => boolean;
  logout: () => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (p: Product) => void;
  updateProduct: (id: string, p: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  services: Record<string, ServiceItem[]>;
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  addStaff: (s: Staff) => void;
  updateStaff: (id: string, s: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  activeTrackers: OrderTracker[];
  weather: WeatherData;
  balance: number;
  updateBalance: (amount: number) => void;
  loyaltyPoints: number;
  addPoints: (amount: number) => void;
  redeemPoints: (points: number) => number;
  getTierProgress: (points?: number) => { current: string; next: string; progress: number; pointsToNext: number };
  rewardPercentage: number;
  updateRewardPercentage: (p: number) => void;
  sailingTempLimit: number;
  updateSailingTempLimit: (temp: number) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  deleteFromCart: (productId: string) => void;
  clearCart: () => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  vessels: Vessel[];
  setVessels: React.Dispatch<React.SetStateAction<Vessel[]>>;
  updateVesselStatus: (vesselId: string, status: Vessel['status']) => void;
  updateVesselDetails: (vesselId: string, details: Partial<Vessel>) => void;
  deleteVessel: (id: string) => void;
  activityLogs: ActivityLog[];
  addActivity: (log: Partial<ActivityLog>) => void;
  reviews: Review[];
  addReview: (review: Review) => void;
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  businessSettings: BusinessSettings;
  updateBusinessSettings: (s: Partial<BusinessSettings>) => void;
  adminPassword: string;
  updateAdminPassword: (pass: string) => void;
  updateUserPassword: (newPass: string) => void;
  updateUserRecord: (phone: string, updates: Partial<User | Staff>) => void;
  deleteUserRecord: (phone: string, type: 'STAFF' | 'CUSTOMER') => void;
  offlineBookings: Booking[];
  addOfflineBooking: (booking: Booking) => void;
  syncOfflineBookings: () => void;
  addVesselReview: (vesselId: string, review: Review) => void;
  isOnline: boolean;
  notifications: AppNotification[];
  addNotification: (n: Partial<AppNotification>) => void;
  markNotificationAsRead: (id: string) => void;
  deleteAccount: () => void;
  transactions: Transaction[];
  addTransaction: (tx: Partial<Transaction>) => void;
  tickerConfig: TickerConfig;
  updateTickerConfig: (config: Partial<TickerConfig>) => void;
  activeToast: AppNotification | null;
  clearToast: () => void;
  lastSyncTime: string | null;
  vouchers: Voucher[];
  addVoucher: (v: Voucher) => void;
  updateVoucher: (code: string, v: Partial<Voucher>) => void;
  removeVoucher: (code: string) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (msgs: ChatMessage[]) => void;
  clearChat: () => void;
  events: ClubEvent[];
  addEvent: (e: ClubEvent) => void;
  updateEvent: (id: string, e: Partial<ClubEvent>) => void;
  deleteEvent: (id: string) => void;
  protocol: ProtocolData;
  updateProtocol: (p: ProtocolData) => void;
  addCustomer: (c: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getStoredItem = (key: string, defaultValue: any) => {
  const saved = localStorage.getItem(key);
  try {
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const INITIAL_CUSTOMERS: User[] = [
  { name: 'Tunde Ednut', phone: '08001112222', role: 'CUSTOMER', loyaltyPoints: 4500, walletBalance: 25000, referralCode: 'SUN-TUN-4422' },
  { name: 'Sandra Mills', phone: '08003334444', role: 'CUSTOMER', loyaltyPoints: 12000, walletBalance: 125000, referralCode: 'SUN-SAN-1199' },
  { name: 'Captain Emeka', phone: '08005556666', role: 'CUSTOMER', loyaltyPoints: 850, walletBalance: 4200, referralCode: 'SUN-EME-8833' },
];

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(getStoredItem('sun_user', null));
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(getStoredItem('sun_registered_customers', INITIAL_CUSTOMERS));
  const [staffState, setStaffState] = useState<Staff[]>(getStoredItem('sun_staff', INITIAL_STAFF));
  const [productsState, setProductsState] = useState<Product[]>(getStoredItem('sun_products', MOCK_PRODUCTS.map(p => ({ ...p, isAvailable: true }))));
  const [bookings, setBookings] = useState<Booking[]>(getStoredItem('sun_bookings', MOCK_INITIAL_BOOKINGS));
  const [balance, setBalance] = useState(getStoredItem('sun_balance', 50000));
  const [loyaltyPoints, setLoyaltyPoints] = useState(getStoredItem('sun_points', 4500));
  const [rewardPercentage, setRewardPercentage] = useState(getStoredItem('sun_reward_pct', 5));
  const [sailingTempLimit, setSailingTempLimit] = useState(getStoredItem('sun_sail_limit', 35));
  const [isDarkMode, setIsDarkMode] = useState(getStoredItem('sun_dark_mode', false));
  const [vesselsState, setVesselsState] = useState<Vessel[]>(getStoredItem('sun_vessels', MOCK_VESSELS));
  const [eventsState, setEventsState] = useState<ClubEvent[]>(getStoredItem('sun_events', EVENTS));
  const [vouchers, setVouchers] = useState<Voucher[]>(getStoredItem('sun_vouchers', [
    { code: 'SUN10', discount: 10, type: 'PERCENT', isActive: true },
    { code: 'WELCOME5K', discount: 5000, type: 'FIXED', isActive: true }
  ]));
  const [chatHistory, setChatHistoryState] = useState<ChatMessage[]>(getStoredItem('sun_chat', [
    { role: 'assistant', text: "Hello! I'm your Evening Sun Concierge. Need help booking a table, finding a meal, or scheduling a haircut?" }
  ]));
  const [protocol, setProtocol] = useState<ProtocolData>(getStoredItem('sun_protocol', MANAGEMENT_KPIS));

  const [transactions, setTransactions] = useState<Transaction[]>(getStoredItem('sun_transactions', [
    { id: 't1', title: 'Welcome Credit', amount: 50000, date: 'Account Setup', type: 'DEPOSIT', status: 'SUCCESS', ref: 'SUN-START', channel: 'System', customerPhone: '0000' },
    { id: 't2', title: 'Jollof Special', amount: -3500, date: 'Yesterday', type: 'EATERY', status: 'SUCCESS', ref: 'SUN-JOL-1', channel: 'Wallet', customerPhone: '08001112222' },
    { id: 't3', title: 'Yacht Cruise', amount: -150000, date: 'Last Week', type: 'MARINE', status: 'SUCCESS', ref: 'SUN-YAC-1', channel: 'Card', customerPhone: '08003334444' },
  ]));

  const [tickerConfig, setTickerConfig] = useState<TickerConfig>(getStoredItem('sun_ticker', {
    messages: [
      "HUB STATUS: JETTY POINT 1 IS CLEAR",
      "PROMO: 10% OFF MARCHING GROUND MEALS",
      "WEATHER: BEST TIME TO RIDE A BOAT IS NOW",
      "SYSTEM: ALL SERVICE POINTS ARE ONLINE",
      "SUNREWARDS: TOP UP YOUR WALLET TO EARN POINTS"
    ],
    size: 'MEDIUM',
    color: '#f59e0b',
    speed: 'STEADY'
  }));

  const [favorites, setFavorites] = useState<string[]>([]);
  const [weather] = useState<WeatherData>({ temp: 36, condition: 'SUNNY', sailability: 95 });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getStoredItem('sun_settings', {
    notifications: { orders: true, promos: true, email: true },
    security: { twoFactor: false },
    themeMode: 'system'
  }));
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(getStoredItem('sun_biz_settings', {
    openingTime: '08:00',
    closingTime: '23:00',
    deliveryFee: 1000,
    serviceCharge: 500
  }));
  const [adminPassword, setAdminPassword] = useState(getStoredItem('sun_admin_pass', '0000'));
  const [offlineBookings, setOfflineBookings] = useState<Booking[]>(getStoredItem('sun_offline_bookings', []));
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(getStoredItem('sun_last_sync', null));

  useEffect(() => {
    localStorage.setItem('sun_user', JSON.stringify(user));
    localStorage.setItem('sun_registered_customers', JSON.stringify(registeredUsers));
    localStorage.setItem('sun_staff', JSON.stringify(staffState));
    localStorage.setItem('sun_products', JSON.stringify(productsState));
    localStorage.setItem('sun_bookings', JSON.stringify(bookings));
    localStorage.setItem('sun_balance', JSON.stringify(balance));
    localStorage.setItem('sun_points', JSON.stringify(loyaltyPoints));
    localStorage.setItem('sun_reward_pct', JSON.stringify(rewardPercentage));
    localStorage.setItem('sun_sail_limit', JSON.stringify(sailingTempLimit));
    localStorage.setItem('sun_dark_mode', JSON.stringify(isDarkMode));
    localStorage.setItem('sun_vessels', JSON.stringify(vesselsState));
    localStorage.setItem('sun_events', JSON.stringify(eventsState));
    localStorage.setItem('sun_settings', JSON.stringify(settings));
    localStorage.setItem('sun_biz_settings', JSON.stringify(businessSettings));
    localStorage.setItem('sun_admin_pass', JSON.stringify(adminPassword));
    localStorage.setItem('sun_transactions', JSON.stringify(transactions));
    localStorage.setItem('sun_ticker', JSON.stringify(tickerConfig));
    localStorage.setItem('sun_offline_bookings', JSON.stringify(offlineBookings));
    localStorage.setItem('sun_last_sync', JSON.stringify(lastSyncTime));
    localStorage.setItem('sun_vouchers', JSON.stringify(vouchers));
    localStorage.setItem('sun_vouchers', JSON.stringify(vouchers));
    localStorage.setItem('sun_chat', JSON.stringify(chatHistory));
    localStorage.setItem('sun_protocol', JSON.stringify(protocol));
  }, [user, registeredUsers, staffState, productsState, bookings, balance, loyaltyPoints, rewardPercentage, sailingTempLimit, isDarkMode, vesselsState, eventsState, settings, businessSettings, adminPassword, transactions, tickerConfig, offlineBookings, lastSyncTime, vouchers, chatHistory, protocol]);

  const addNotification = (n: Partial<AppNotification>) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      title: n.title || 'Notification',
      message: n.message || '',
      type: n.type || 'INFO',
      timestamp: new Date().toLocaleTimeString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
    setActiveToast(newNotif);
  };

  const login = (phone: string, password?: string) => {
    // SUPER ADMIN (IT HEAD) - DEFAULT OR CONFIGURED
    if (phone === '0000' && password === adminPassword) {
      setUser({ name: "IT Super Admin", phone: "0000", role: 'SUPER_ADMIN', password: adminPassword });
      return true;
    }

    // SEARCH ALL REGISTERED ENTITIES (STAFF & CUSTOMERS)
    const staffMember = staffState.find(s => s.phone === phone && s.password === password);
    if (staffMember) {
      // Map Staff roles to User roles for routing
      let userRole: User['role'] = 'STAFF';
      if (staffMember.role === 'FINANCE_HEAD') userRole = 'FINANCE';
      if (staffMember.role === 'ADMIN_HEAD') userRole = 'ADMIN';
      if (staffMember.role === 'OPERATIONS_HEAD') userRole = 'OPERATIONS';

      setUser({
        name: staffMember.name,
        phone: staffMember.phone,
        role: userRole,
        staffRole: staffMember.role,
        password: staffMember.password
      });
      return true;
    }

    const customer = registeredUsers.find(u => u.phone === phone && u.password === password);
    if (customer) {
      setUser(customer);
      if (customer.loyaltyPoints !== undefined) setLoyaltyPoints(customer.loyaltyPoints);
      if (customer.walletBalance !== undefined) setBalance(customer.walletBalance);
      return true;
    }
    return false;
  };

  const signup = (name: string, phone: string, password?: string) => {
    // ENFORCE WHATSAPP FORMAT (Basic check for now: starts with +, or 080/090/070 etc - Nigerian focus)
    const isWhatsApp = /^\+?[0-9]{10,15}$/.test(phone);
    if (!isWhatsApp) return false;

    // ENFORCE STRONG PASSWORD (Min 8 chars, 1 uppercase, 1 number)
    const isStrong = password && password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    if (!isStrong) return false;

    const prefix = name.split(' ')[0].substring(0, 3).toUpperCase();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newUser: User = {
      name,
      phone,
      role: 'CUSTOMER',
      password,
      loyaltyPoints: 0,
      walletBalance: 0,
      referralCode: `SUN-${prefix}-${randomPart}`
    };
    setRegisteredUsers(prev => [...prev.filter(u => u.phone !== phone), newUser]);
    setUser(newUser);
    setLoyaltyPoints(0);
    setBalance(0);
    return true;
  };

  const updateUserRecord = (phone: string, updates: Partial<User | Staff>) => {
    setRegisteredUsers(prev => prev.map(u => u.phone === phone ? { ...u, ...(updates as Partial<User>) } : u));
    setStaffState(prev => prev.map(s => s.phone === phone ? { ...s, ...(updates as Partial<Staff>) } : s));
    if (user?.phone === phone) setUser(prev => prev ? { ...prev, ...(updates as Partial<User>) } : null);
  };

  const deleteUserRecord = (phone: string, type: 'STAFF' | 'CUSTOMER') => {
    if (type === 'STAFF') setStaffState(prev => prev.filter(s => s.phone !== phone));
    else setRegisteredUsers(prev => prev.filter(u => u.phone !== phone));
    if (user?.phone === phone) setUser(null);
  };

  const addProduct = (p: Product) => setProductsState(prev => [...prev, p]);
  const updateProduct = (id: string, p: Partial<Product>) => setProductsState(prev => prev.map(x => x.id === id ? { ...x, ...p } : x));
  const deleteProduct = (id: string) => setProductsState(prev => prev.filter(x => x.id !== id));

  const updateVesselStatus = (vesselId: string, status: Vessel['status']) => {
    const vessel = vesselsState.find(v => v.id === vesselId);
    setVesselsState(prev => prev.map(v => v.id === vesselId ? { ...v, status } : v));

    if (status === 'MAINTENANCE' && vessel) {
      addNotification({
        title: 'Maintenance Alert',
        message: `Vessel "${vessel.name}" has been moved to dry dock for maintenance. Check manifest.`,
        type: 'WARNING'
      });
    }
  };

  const updateVesselDetails = (vesselId: string, details: Partial<Vessel>) => {
    setVesselsState(prev => prev.map(v => v.id === vesselId ? { ...v, ...details } : v));
  };

  const deleteVessel = (id: string) => {
    setVesselsState(prev => prev.filter(v => v.id !== id));
  };

  const addVesselReview = (vesselId: string, review: Review) => {
    setVesselsState(prev => prev.map(v => v.id === vesselId ? { ...v, reviews: [review, ...v.reviews] } : v));
  };

  const addVoucher = (v: Voucher) => setVouchers(prev => [...prev, v]);
  const updateVoucher = (code: string, v: Partial<Voucher>) => setVouchers(prev => prev.map(x => x.code === code ? { ...x, ...v } : x));
  const removeVoucher = (code: string) => setVouchers(prev => prev.filter(v => v.code !== code));

  const getTierProgress = (points: number = loyaltyPoints) => {
    if (points >= 10000) return { current: 'Sunset Elite', next: 'MAX', progress: 100, pointsToNext: 0 };
    if (points >= 5000) return { current: 'Golden Hour', next: 'Sunset Elite', progress: ((points - 5000) / 5000) * 100, pointsToNext: 10000 - points };
    return { current: 'Rising Sun', next: 'Golden Hour', progress: (points / 5000) * 100, pointsToNext: 5000 - points };
  };

  const addEvent = (e: ClubEvent) => setEventsState(prev => [...prev, e]);
  const updateEvent = (id: string, e: Partial<ClubEvent>) => setEventsState(prev => prev.map(x => x.id === id ? { ...x, ...e } : x));
  const deleteEvent = (id: string) => setEventsState(prev => prev.filter(x => x.id !== id));

  return (
    <AppContext.Provider value={{
      user, customers: registeredUsers, login, signup,
      logout: () => setUser(null),
      products: productsState, setProducts: setProductsState,
      addProduct, updateProduct, deleteProduct,
      services: MOCK_SERVICES,
      staff: staffState, setStaff: setStaffState, addStaff: (s) => setStaffState(p => [...p, s]), updateStaff: (id, s) => setStaffState(p => p.map(x => x.id === id ? { ...x, ...s } : x)),
      deleteStaff: (id) => setStaffState(p => p.filter(s => s.id !== id)),
      favorites, toggleFavorite: (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]),
      activeTrackers: [], weather, balance, updateBalance: (v) => setBalance(b => b + v),
      loyaltyPoints, addPoints: (a) => setLoyaltyPoints(p => p + a), redeemPoints: (p) => { setLoyaltyPoints(l => l - p); return p; },
      getTierProgress,
      rewardPercentage, updateRewardPercentage: setRewardPercentage,
      sailingTempLimit, updateSailingTempLimit: setSailingTempLimit,
      cart, addToCart: (p) => setCart(c => { const x = c.find(i => i.id === p.id); return x ? c.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...c, { ...p, quantity: 1 }]; }),
      removeFromCart: (id) => setCart(c => c.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i).filter(i => i.quantity > 0)),
      deleteFromCart: (id) => setCart(c => c.filter(i => i.id !== id)),
      clearCart: () => setCart([]),
      bookings, addBooking: (b) => {
        const historyEntry = { status: b.status, timestamp: new Date().toLocaleString() };
        setBookings(prev => [{ ...b, statusHistory: [historyEntry], customerPhone: user?.phone }, ...prev]);
      },
      updateBookingStatus: (id, status) => {
        setBookings(prev => prev.map(b => {
          if (b.id === id) {
            const newHistory = [...(b.statusHistory || []), { status, timestamp: new Date().toLocaleString() }];
            return { ...b, status, statusHistory: newHistory };
          }
          return b;
        }));
      },
      isDarkMode, toggleTheme: () => { setIsDarkMode(!isDarkMode); document.documentElement.classList.toggle('dark'); },
      vessels: vesselsState, setVessels: setVesselsState, updateVesselStatus, updateVesselDetails, deleteVessel,
      activityLogs: [], addActivity: (l) => { }, reviews: [], addReview: (r) => { },
      settings, updateSettings: (s) => setSettings(p => ({ ...p, ...s })),
      businessSettings, updateBusinessSettings: (s) => setBusinessSettings(p => ({ ...p, ...s })),
      adminPassword, updateAdminPassword: setAdminPassword, updateUserPassword: (p) => updateUserRecord(user?.phone || '', { password: p }),
      updateUserRecord, deleteUserRecord,
      offlineBookings: [], addOfflineBooking: (b) => { }, syncOfflineBookings: () => { }, addVesselReview,
      isOnline: true, notifications, addNotification, markNotificationAsRead: (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n)),
      deleteAccount: () => setUser(null),
      transactions, addTransaction: (tx) => {
        const newTx: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          title: tx.title || 'Untitled Flow',
          amount: tx.amount || 0,
          date: new Date().toLocaleDateString(),
          type: tx.type || 'DEPOSIT',
          status: tx.status || 'SUCCESS',
          ref: `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          channel: tx.channel || 'System',
          customerPhone: tx.customerPhone || user?.phone
        };
        setTransactions(prev => [newTx, ...prev]);
      },
      tickerConfig, updateTickerConfig: (c) => setTickerConfig(p => ({ ...p, ...c })),
      activeToast: null, clearToast: () => { }, lastSyncTime: null,
      vouchers, addVoucher, updateVoucher, removeVoucher,
      chatHistory, setChatHistory: setChatHistoryState, clearChat: () => setChatHistoryState([]),
      events: eventsState, addEvent, updateEvent, deleteEvent,
      protocol, updateProtocol: setProtocol,
      addCustomer: (c) => {
        const prefix = c.name.split(' ')[0].substring(0, 3).toUpperCase();
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        const newUser: User = {
          ...c,
          role: 'CUSTOMER',
          referralCode: c.referralCode || `SUN-${prefix}-${randomPart}`
        };
        setRegisteredUsers(prev => [...prev.filter(u => u.phone !== c.phone), newUser]);
      }
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const c = useContext(AppContext);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
};
