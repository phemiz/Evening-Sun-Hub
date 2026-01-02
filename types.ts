
export enum ServiceType {
  EATERY = 'EATERY',
  SALON_FEMALE = 'SALON_FEMALE',
  SALON_MALE = 'SALON_MALE',
  CLUB = 'CLUB',
  MARINE = 'MARINE',
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description: string;
  isAvailable?: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  durationMin: number;
  category?: ServiceType | string;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  role: 'KITCHEN' | 'SALON' | 'MARINE' | 'CLUB' | 'SECURITY' | 'FINANCE_MGMT' | 'ADMIN_MGMT' | 'OPERATIONS_MGMT' | 'EXECUTIVE';
  rating: number;
  imageUrl?: string;
  password?: string;
  status: 'ACTIVE' | 'OFFBOARDED';
  completedTasks: number;
  earnings: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'BOOKING' | 'ORDER' | 'SECURITY' | 'SYSTEM' | 'STAFF_ACTION';
  message: string;
  user: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceType;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'IN_PROGRESS';
  statusHistory?: { status: string; timestamp: string }[];
  depositPaid: boolean;
  price?: number;
  staffName?: string;
  location?: string;
  notes?: string;
  customerPhone?: string;
  estimatedArrival?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  name: string;
  phone: string;
  role: 'CUSTOMER' | 'STAFF' | 'ADMIN';
  password?: string;
  staffRole?: Staff['role'];
  loyaltyPoints?: number;
  walletBalance?: number;
  referralCode?: string;
}

export interface Voucher {
  code: string;
  discount: number;
  type: 'FIXED' | 'PERCENT';
  isActive: boolean;
  minPurchase?: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  entityId: string; // Vessel or Service ID
}

export interface Vessel {
  id: string;
  name: string;
  type: 'SPEEDBOAT' | 'YACHT' | 'JETSKI';
  capacity: number;
  imageUrl: string;
  baseHourlyRate: number;
  hourlyRate: number;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'IN_USE';
  reviews: Review[];
  isSurgeEnabled?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'EATERY' | 'SALON' | 'MARINE' | 'CLUB' | 'DEPOSIT' | 'WITHDRAWAL';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  ref: string;
  channel: string;
  customerPhone?: string;
}

export interface AuditEntry {
  timestamp: string;
  field: string;
  oldValue: any;
  newValue: any;
  staffName: string;
}

export interface MarineTripLog {
  id: string;
  bookingId: string;
  vesselId: string;
  captainId: string;
  startTime?: string;
  endTime?: string;
  startEngineHours?: number;
  endEngineHours?: number;
  startFuelLevel?: number;
  endFuelLevel?: number;
  passengerCount: number;
  customerSignature?: string;
  checklist: {
    lifeJackets: boolean;
    fuelCheck: boolean;
    radioCheck: boolean;
  };
  auditTrail: AuditEntry[];
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string;
  price: string;
  capacity: number;
  description?: string;
  image?: string;
}

export interface ProtocolUnit {
  manager: string;
  points: string[];
}

export interface ProtocolData {
  [key: string]: ProtocolUnit;
}
