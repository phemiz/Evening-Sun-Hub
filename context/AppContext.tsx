
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, CartItem, Booking, Product, ServiceType, ServiceItem, Staff, Transaction, Voucher, ClubEvent, SavedPaymentMethod, RefundRequest, ShiftRecord, StaffRole, Campaign, CustomerSegment, Vessel } from '../types';
import { MOCK_PRODUCTS, MOCK_SERVICES, EVENTS, MOCK_VESSELS, MOCK_STAFF } from '../constants';

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

export interface AppSettings {
  notifications: { orders: boolean; promos: boolean; email: boolean; };
  security: { twoFactor: boolean; };
}

export interface ServiceStatus {
  id: ServiceType;
  isActive: boolean;
}

const MOCK_CUSTOMERS: User[] = [
  { name: 'Tunde Ednut', phone: '0801', role: 'CUSTOMER', loyaltyPoints: 15400, walletBalance: 45000, segment: 'VIP_LEGEND', lastActive: '2023-11-20', preferences: { spiciness: 'HIGH', vesselType: 'YACHT', newsletter: true, language: 'EN' }, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tunde' },
  { name: 'Amaka Sun', phone: '0802', role: 'CUSTOMER', loyaltyPoints: 450, walletBalance: 1200, segment: 'NEW_NODE', lastActive: '2023-12-01', preferences: { spiciness: 'MEDIUM', vesselType: 'ANY', newsletter: false, language: 'EN' }, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amaka' },
];

interface AppContextType {
  user: User | null;
  updateUser: (updates: Partial<User>) => void;
  customers: User[];
  login: (phone: string, password?: string) => boolean;
  signup: (name: string, phone: string, password?: string) => boolean;
  logout: () => void;
  products: Product[];
  bookings: Booking[];
  balance: number;
  updateBalance: (amount: number) => void;
  loyaltyPoints: number;
  addPoints: (amount: number) => void;
  vessels: Vessel[];
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  cart: CartItem[];
  addToCart: (p: Product) => void;
  removeFromCart: (id: string) => void;
  deleteFromCart: (id: string) => void;
  clearCart: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  weather: { temp: number; };
  sailingTempLimit: number;
  updateSailingTempLimit: (t: number) => void;
  rewardPercentage: number;
  updateRewardPercentage: (p: number) => void;
  addBooking: (b: Booking) => void;
  updateBookingStatus: (id: string, s: Booking['status']) => void;
  cancelBooking: (id: string) => void;
  addNotification: (n: Partial<AppNotification>) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  chatHistory: ChatMessage[];
  setChatHistory: (msgs: ChatMessage[]) => void;
  clearChat: () => void;
  transactions: Transaction[];
  addTransaction: (tx: Partial<Transaction>) => void;
  events: ClubEvent[];
  updateStaff: (id: string, s: Partial<Staff>) => void;
  businessSettings: { openingTime: string; closingTime: string; };
  updateBusinessSettings: (s: any) => void;
  vouchers: Voucher[];
  getTierProgress: () => any;
  updateProduct: (id: string, p: Partial<Product>) => void;
  addProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addStaff: (s: Staff) => void;
  deleteStaff: (id: string) => void;
  deleteVessel: (id: string) => void;
  addEvent: (e: ClubEvent) => void;
  updateEvent: (id: string, e: Partial<ClubEvent>) => void;
  deleteEvent: (id: string) => void;
  addVoucher: (v: Voucher) => void;
  removeVoucher: (c: string) => void;
  redeemPoints: (p: number) => number;
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;
  isOnline: boolean;
  lastSyncTime: string;
  updateUserPassword: (p: string) => void;
  deleteAccount: () => void;
  activeToast: { message: string; type: string } | null;
  clearToast: () => void;
  services: Record<string, ServiceItem[]>;
  updateServiceItem: (cat: ServiceType, id: string, updates: Partial<ServiceItem>) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  refundRequests: RefundRequest[];
  requestRefund: (bookingId: string, reason: string) => void;
  savePaymentMethod: (m: SavedPaymentMethod) => void;
  deletePaymentMethod: (id: string) => void;
  shifts: ShiftRecord[];
  clockIn: (staffId: string) => void;
  clockOut: (staffId: string) => void;
  serviceStatuses: ServiceStatus[];
  toggleServiceStatus: (id: ServiceType) => void;
  campaigns: Campaign[];
  addCampaign: (c: Campaign) => void;
  deleteCampaign: (id: string) => void;
  addVesselReview: (vesselId: string, review: any) => void;
  getDynamicPrice: (serviceId: string, basePrice: number) => { price: number; surgeFactor: number; isPeak: boolean };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_SERVICE_STATUSES: ServiceStatus[] = Object.values(ServiceType).map(type => ({
  id: type,
  isActive: true
}));

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [balance, setBalance] = useState(50000);
  const [loyaltyPoints, setLoyaltyPoints] = useState(4500);
  const [vessels, setVessels] = useState<Vessel[]>(MOCK_VESSELS);
  const [staff, setStaff] = useState<Staff[]>(MOCK_STAFF);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [weather] = useState({ temp: 36 });
  const [sailingTempLimit, setSailingTempLimit] = useState(35);
  const [rewardPercentage, setRewardPercentage] = useState(5);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{ role: 'assistant', text: 'Greetings, Boss! How can I optimize your station today?' }]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [events, setEvents] = useState<ClubEvent[]>(EVENTS);
  const [businessSettings, setBusinessSettings] = useState({ openingTime: '08:00', closingTime: '23:00' });
  const [vouchers, setVouchers] = useState<Voucher[]>([{ code: 'SUN10', discount: 10, type: 'PERCENT', isActive: true }]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [shifts, setShifts] = useState<ShiftRecord[]>([]);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>(INITIAL_SERVICE_STATUSES);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [customers, setCustomers] = useState<User[]>(MOCK_CUSTOMERS);
  const [services, setServices] = useState<Record<string, ServiceItem[]>>(MOCK_SERVICES);
  
  const [settings, setSettings] = useState<AppSettings>({ notifications: { orders: true, promos: true, email: true }, security: { twoFactor: false } });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSyncTime, setLastSyncTime] = useState(new Date().toLocaleTimeString());
  const [activeToast, setActiveToast] = useState<{ message: string; type: string } | null>(null);

  const updateBalance = (v: number) => setBalance(p => p + v);
  const addPoints = (v: number) => setLoyaltyPoints(p => p + v);
  const addTransaction = (tx: Partial<Transaction>) => setTransactions(p => [{ ...tx, id: Math.random().toString(), date: new Date().toLocaleDateString() } as Transaction, ...p]);
  const addNotification = (n: Partial<AppNotification>) => setNotifications(p => [{ id: Math.random().toString(), read: false, timestamp: new Date().toLocaleTimeString(), ...n } as any, ...p]);
  
  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(p => p.map(b => b.id === id ? { ...b, status } : b));
  };

  const updateServiceItem = (cat: ServiceType, id: string, updates: Partial<ServiceItem>) => {
    setServices(prev => ({
        ...prev,
        [cat]: prev[cat].map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const signup = (name: string, phone: string, password?: string) => {
    const newUser: User = { 
      name, 
      phone, 
      role: 'CUSTOMER', 
      loyaltyPoints: 0, 
      walletBalance: 0, 
      segment: 'NEW_NODE', 
      password,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, 
      preferences: { spiciness: 'MEDIUM', vesselType: 'ANY', newsletter: true, language: 'EN' } 
    };
    setCustomers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const login = (phone: string, pass?: string) => {
    if (phone === '0000') { 
      setUser({ name: 'Hub Admin', phone: '0000', role: 'ADMIN', avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=admin` }); 
      return true; 
    }
    const c = customers.find(x => x.phone === phone && (!pass || x.password === pass));
    if (c) { setUser(c); return true; }
    const s = staff.find(x => x.phone === phone && (!pass || x.password === pass));
    if (s) { 
      setUser({ 
        name: s.name, 
        phone: s.phone, 
        role: 'STAFF', 
        staffRole: s.role, 
        password: s.password,
        avatarUrl: s.imageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.name}` 
      }); 
      return true; 
    }
    return false;
  };

  const logout = () => setUser(null);

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
    if (user?.role === 'CUSTOMER') {
      setCustomers(prev => prev.map(c => c.phone === user.phone ? { ...c, ...updates } : c));
    }
  };

  const getDynamicPrice = (serviceId: string, basePrice: number) => {
    const now = new Date();
    const hour = now.getHours();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    let surgeFactor = ((hour >= 18 && hour <= 22) || isWeekend) ? 1.25 : 1.0;
    return { price: basePrice * surgeFactor, surgeFactor, isPeak: surgeFactor > 1 };
  };

  const contextValue: AppContextType = {
    user, updateUser, customers, login, signup, logout, products, bookings, balance, 
    updateBalance, loyaltyPoints, addPoints,
    vessels, staff, setStaff, cart,
    addToCart: (p) => setCart(c => { const x = c.find(i => i.id === p.id); return x ? c.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i) : [...c, { ...p, quantity: 1 }]; }),
    removeFromCart: (id) => setCart(c => c.map(i => i.id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0)),
    deleteFromCart: (id) => setCart(c => c.filter(i => i.id !== id)),
    clearCart: () => setCart([]), isDarkMode, toggleTheme: () => setIsDarkMode(!isDarkMode),
    weather, sailingTempLimit, updateSailingTempLimit: setSailingTempLimit, rewardPercentage, updateRewardPercentage: setRewardPercentage,
    addBooking: (b) => setBookings(p => [b, ...p]),
    updateBookingStatus,
    cancelBooking: (id) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b)),
    addNotification,
    notifications, markNotificationAsRead: (id) => setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n)),
    chatHistory, setChatHistory, clearChat: () => setChatHistory([]),
    transactions, addTransaction,
    events, updateStaff: (id, s) => setStaff(p => p.map(x => x.id === id ? { ...x, ...s } : x)),
    businessSettings, updateBusinessSettings: setBusinessSettings,
    vouchers, 
    getTierProgress: () => {
      const pts = loyaltyPoints || 0;
      if (pts < 1000) return { current: 'Bronze Node', progress: Math.floor((pts / 1000) * 100), next: 'Silver' };
      if (pts < 5000) return { current: 'Silver Legend', progress: Math.floor(((pts - 1000) / 4000) * 100), next: 'Gold' };
      return { current: 'Sunset Elite', progress: Math.min(100, Math.floor(((pts - 5000) / 10000) * 100)), next: 'Diamond Core' };
    },
    updateProduct: (id, p) => setProducts(prev => prev.map(x => x.id === id ? { ...x, ...p } : x)),
    addProduct: (p) => setProducts(prev => [p, ...prev]),
    deleteProduct: (id) => setProducts(prev => prev.filter(x => x.id !== id)),
    addStaff: (s) => setStaff(prev => [s, ...prev]),
    deleteStaff: (id) => setStaff(prev => prev.filter(x => x.id !== id)),
    deleteVessel: (id) => setVessels(prev => prev.filter(x => x.id !== id)),
    addEvent: (e) => setEvents(prev => [e, ...prev]),
    updateEvent: (id, e) => setEvents(prev => prev.map(x => x.id === id ? { ...x, ...e } : x)),
    deleteEvent: (id) => setEvents(prev => prev.filter(x => x.id !== id)),
    addVoucher: (v) => setVouchers(prev => [v, ...prev]),
    removeVoucher: (code) => setVouchers(prev => prev.filter(x => x.code !== code)),
    redeemPoints: (p) => { setLoyaltyPoints(prev => prev - p); return p; },
    settings, updateSettings: (s) => setSettings(prev => ({ ...prev, ...s })),
    isOnline, lastSyncTime, updateUserPassword: (p) => updateUser({ password: p }), 
    deleteAccount: () => setUser(null),
    activeToast, clearToast: () => setActiveToast(null), services, updateServiceItem, favorites, 
    toggleFavorite: (id) => setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]),
    refundRequests, requestRefund: () => {}, savePaymentMethod: () => {}, deletePaymentMethod: () => {},
    shifts, clockIn: (staffId) => setShifts(p => [...p, { id: Math.random().toString(), staffId, date: new Date().toLocaleDateString(), clockIn: new Date().toLocaleTimeString(), status: 'ACTIVE' }]),
    clockOut: (staffId) => setShifts(p => p.map(s => s.staffId === staffId && s.status === 'ACTIVE' ? { ...s, clockOut: new Date().toLocaleTimeString(), status: 'COMPLETED' } : s)),
    serviceStatuses, toggleServiceStatus: (id) => setServiceStatuses(p => p.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)),
    campaigns, addCampaign: (c) => setCampaigns(p => [c, ...p]), deleteCampaign: (id) => setCampaigns(p => p.filter(c => c.id !== id)),
    addVesselReview: (vesselId, review) => setVessels(prev => prev.map(v => v.id === vesselId ? { ...v, reviews: [...v.reviews, review] } : v)),
    getDynamicPrice
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const c = useContext(AppContext);
  if (!c) throw new Error("useApp error");
  return c;
};
