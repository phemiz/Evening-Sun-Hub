
export enum ServiceType {
  EATERY = 'EATERY',
  LOUNGE = 'LOUNGE',
  SUPERMARKET = 'SUPERMARKET',
  MEETING_HALL = 'MEETING_HALL',
  SALON = 'SALON',
  PEDICURE = 'PEDICURE',
  GAME_LOUNGE = 'GAME_LOUNGE',
  MARINE = 'MARINE',
  SALON_FEMALE = 'SALON_FEMALE',
  SALON_MALE = 'SALON_MALE',
  CLUB = 'CLUB',
}

export type StaffRole = 
  | 'KITCHEN' 
  | 'BAR' 
  | 'CASHIER' 
  | 'INVENTORY' 
  | 'EVENT_SUPERVISOR' 
  | 'SALON' 
  | 'PEDICURE' 
  | 'GAME_LOUNGE' 
  | 'BOAT_OPERATOR' 
  | 'FLOOR_MANAGER'
  | 'ADMIN_MGMT' 
  | 'OPERATIONS_MGMT' 
  | 'FINANCE_MGMT' 
  | 'EXECUTIVE';

export type CustomerSegment = 'NEW_NODE' | 'VIP_LEGEND' | 'CHURN_RISK' | 'STALE';

export interface Campaign {
  id: string;
  title: string;
  segment: CustomerSegment;
  channel: 'WHATSAPP' | 'SMS' | 'PUSH';
  status: 'SCHEDULED' | 'SENT' | 'DRAFT';
  content: string;
  conversionCount: number;
}

export interface ProductOption {
  id: string;
  name: string;
  price: number;
}

export interface ProductOptionGroup {
  name: string;
  required?: boolean;
  options: ProductOption[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image?: string;
  description: string;
  isAvailable?: boolean;
  trendScore?: number;
  prepTimeMin: number;
  stockLevel?: number;
  bulkPrice?: { minQty: number; price: number };
  optionGroups?: ProductOptionGroup[];
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceType;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS' | 'PREPARING' | 'READY' | 'PICKED' | 'PACKED';
  price?: number;
  customerPhone?: string;
  location?: string;
  staffName?: string;
  depositPaid?: boolean;
  orderType?: 'DINE_IN' | 'TAKEAWAY' | 'PRE_ORDER' | 'DELIVERY';
  tableNumber?: string;
  items?: CartItem[];
  seatNumber?: string;
  gateNumber?: string;
  isDynamicPriced?: boolean;
  surgeFactor?: number;
  stationId?: string;
}

export interface UserPreferences {
  spiciness: 'LOW' | 'MEDIUM' | 'HIGH';
  vesselType: 'SPEEDBOAT' | 'YACHT' | 'ANY';
  preferredStylistId?: string;
  newsletter: boolean;
  language: 'EN' | 'YO' | 'FR';
}

export interface User {
  name: string;
  phone: string;
  role: 'CUSTOMER' | 'STAFF' | 'ADMIN';
  loyaltyPoints?: number;
  walletBalance?: number;
  segment?: CustomerSegment;
  lastActive?: string;
  password?: string;
  staffRole?: StaffRole;
  savedMethods?: SavedPaymentMethod[];
  avatarUrl?: string;
  preferences?: UserPreferences;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: ServiceType | 'DEPOSIT' | 'WITHDRAWAL' | 'REFUND';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  channel: string;
  provider?: string;
}

export interface Voucher {
  code: string;
  discount: number;
  type: 'FIXED' | 'PERCENT';
  isActive: boolean;
}

export interface ShiftRecord {
  id: string;
  staffId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface SavedPaymentMethod {
  id: string;
  type: 'CARD' | 'BANK_ACCOUNT';
  brand: string;
  last4: string;
}

export interface RefundRequest {
  id: string;
  bookingId: string;
  amount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason: string;
  timestamp: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  durationMin: number;
  description?: string;
  capacityOptions?: string[];
  dailyRate?: number;
  platform?: string;
  totalStations?: number;
  activePlayers?: number;
  relatedServices?: string[];
  basePrice?: number;
  status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  specs?: Record<string, string>;
  gamesList?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: StaffRole;
  status: 'ACTIVE' | 'OFFBOARDED';
  completedTasks: number;
  earnings: number;
  rating: number;
  specialization?: string;
  ratingCount?: number;
  password?: string;
  imageUrl?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  entityId: string;
}

export interface Vessel {
  id: string;
  name: string;
  type: 'SPEEDBOAT' | 'YACHT' | 'JETSKI' | 'COMMUTER';
  status: 'AVAILABLE' | 'MAINTENANCE' | 'IN_USE';
  reviews: Review[];
  capacity?: number;
  imageUrl?: string;
  baseHourlyRate?: number;
  hourlyRate?: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  game: string;
  winRate: string;
  xp: number;
}

export interface MarineRoute {
  id: string;
  origin: string;
  destination: string;
  durationMin: number;
  price: number;
  vesselId: string;
  departureTimes: string[];
  description: string;
  image: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  price: string;
  capacity: number;
  attendeeCount: number;
  image: string;
  description?: string;
  isTournament?: boolean;
  prizePool?: string;
  game?: string;
}

export interface MarineTripLog {
  id: string;
  tripId: string;
  engineHoursStart: number;
  fuelStart: number;
  engineHoursEnd?: number;
  fuelEnd?: number;
  status: 'PRE_CHECK' | 'IN_TRIP' | 'POST_CHECK' | 'COMPLETED';
}

export interface SeatInfo {
  id: string;
  row: string;
  number: number;
  isBooked: boolean;
  type: 'WINDOW' | 'AISLE';
}
