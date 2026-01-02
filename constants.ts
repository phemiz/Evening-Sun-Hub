
import { ServiceType, Product, ServiceItem, Staff, Vessel, Booking } from './types';

export const APP_NAME = "Evening Sun Nigeria Limited";
export const HUB_ADDRESS = "4, Unity Estate, Mosafejo, Off Badagry Express Road, Badagry, Lagos State";
export const HUB_PHONE = "08032665268";

export const SERVICE_CATEGORIES = [
  {
    id: ServiceType.EATERY,
    title: "Eatery & Supermart",
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    description: "Delicious meals & daily provisions."
  },
  {
    id: ServiceType.CLUB,
    title: "Lounge & Nightlife",
    icon: "Music",
    image: "https://images.unsplash.com/photo-1514525253361-bee8a48790c3?q=80&w=1000&auto=format&fit=crop",
    description: "Premium cocktails & live sets."
  },
  {
    id: "MEETING_HALL",
    title: "Meeting Hall",
    icon: "Users",
    image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000&auto=format&fit=crop",
    description: "Professional space for events."
  },
  {
    id: ServiceType.SALON_MALE,
    title: "Beauty & Grooming",
    icon: "Scissors",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop",
    description: "Sharp cuts & styling."
  },
  {
    id: ServiceType.MARINE,
    title: "Marine Services",
    icon: "Anchor",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    description: "Boat rentals & logistics."
  }
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'f1', name: 'Marching Ground', price: 3500, category: 'Lounge Menu', description: 'Specialized local delicacy with rich spices.', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=400' },
  { id: 'f2', name: 'Nkwobi', price: 2500, category: 'Lounge Menu', description: 'Traditional spicy cow foot delicacy served in a wooden mortar.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400' },
  { id: 'f3', name: 'Isiewu', price: 3000, category: 'Lounge Menu', description: 'Spiced goat head served in traditional sauce.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400' },
  { id: 'f4', name: 'Asun', price: 2500, category: 'Lounge Menu', description: 'Spicy peppered goat meat, smoked and chopped.', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=400' },
  { id: 'd1', name: 'Monster Energy', price: 1500, category: 'Drinks', description: 'Original Energy boost.', image: 'https://images.unsplash.com/photo-1622543953494-a17d46b80300?q=80&w=400&auto=format&fit=crop' },
  { id: 'd2', name: 'Goldberg', price: 1000, category: 'Drinks', description: 'Premium quality lager.', image: 'https://images.unsplash.com/photo-1532635224-cf024e66d122?auto=format&fit=crop&w=400' },
  { id: 'd5', name: 'Guinness Stout', price: 1200, category: 'Drinks', description: 'Classic dark malt draught stout.', image: 'https://images.unsplash.com/photo-1518176259641-0f8a49c44c3c?q=80&w=400&auto=format&fit=crop' },
  { id: 'p1', name: 'Peak Milk (Tin)', price: 950, category: 'Provisions', description: 'Full cream evaporated milk.', image: 'https://images.unsplash.com/photo-1550583724-125581cc255b?auto=format&fit=crop&w=400' },
  { id: 'p2', name: 'Milo 500g', price: 2400, category: 'Provisions', description: 'Nourishing cocoa malt drink.', image: 'https://images.unsplash.com/photo-1569158062037-d8dc66088dea?auto=format&fit=crop&w=400' },
  { id: 'p3', name: 'Golden Morn', price: 1800, category: 'Provisions', description: 'Nutritious cereal for family.', image: 'https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?auto=format&fit=crop&w=400' },
  { id: 'p4', name: 'Toiletries Set', price: 4500, category: 'Provisions', description: 'Essential bathroom bundle.', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400' },
];

export const MOCK_SERVICES: Record<string, ServiceItem[]> = {
  [ServiceType.SALON_FEMALE]: [
    { id: 'sf1', name: 'Box Braids (Medium)', price: 12000, durationMin: 180 },
    { id: 'sf2', name: 'Wash, Treatment & Set', price: 5000, durationMin: 60 },
    { id: 'sf3', name: 'Wig Revamping', price: 8000, durationMin: 120 },
    { id: 'sf4', name: 'Pedicure & Manicure', price: 7500, durationMin: 90 },
  ],
  [ServiceType.SALON_MALE]: [
    { id: 'sm1', name: 'Executive Haircut', price: 3000, durationMin: 45 },
    { id: 'sm2', name: 'Beard Trim & Dye', price: 2000, durationMin: 30 },
    { id: 'sm3', name: 'Face Scrub & Massage', price: 4000, durationMin: 30 },
    { id: 'sm4', name: 'Children Haircut', price: 1500, durationMin: 30 },
  ],
  [ServiceType.MARINE]: [
    { id: 'mr1', name: 'Private Beach Drop-off', price: 45000, durationMin: 60 },
    { id: 'mr2', name: 'Sunset Luxury Cruise', price: 120000, durationMin: 120 },
    { id: 'mr3', name: 'Jet Ski (30 Mins)', price: 25000, durationMin: 30 },
    { id: 'mr4', name: 'Night Fishing Trip', price: 85000, durationMin: 240 },
  ],
  "MEETING_HALL": [
    { id: 'mh1', name: 'Boardroom Hourly', price: 15000, durationMin: 60 },
    { id: 'mh2', name: 'Full Hall Event', price: 250000, durationMin: 720 },
  ]
};

export const MOCK_STAFF: Staff[] = [
  // Executive Leadership
  { id: 'exec1', name: 'Louis Ntofon', role: 'EXECUTIVE', rating: 5.0, status: 'ACTIVE', phone: '0801', password: 'ceo', completedTasks: 0, earnings: 0, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Louis' },
  { id: 'exec2', name: 'Mrs. Philomena', role: 'EXECUTIVE', rating: 5.0, status: 'ACTIVE', phone: '0802', password: 'md', completedTasks: 0, earnings: 0, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Philomena' },
  { id: 'exec3', name: 'Mr. Umana', role: 'EXECUTIVE', rating: 5.0, status: 'ACTIVE', phone: '0803', password: 'chairman', completedTasks: 0, earnings: 0, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Umana' },
  
  // Management Team
  { id: 'mgmt1', name: 'Mrs. Lynda', role: 'FINANCE_MGMT', rating: 4.9, status: 'ACTIVE', phone: '0804', password: 'lynda', completedTasks: 0, earnings: 0, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lynda' },
  { id: 'mgmt2', name: 'Mr. Isaac', role: 'ADMIN_MGMT', rating: 4.9, status: 'ACTIVE', phone: '0805', password: 'isaac', completedTasks: 0, earnings: 0, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isaac' },
  { id: 'mgmt3', name: 'Ms. Utiebeima', role: 'OPERATIONS_MGMT', rating: 4.9, status: 'ACTIVE', phone: '0806', password: 'utie', completedTasks: 0, earnings: 0, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Utie' },
  
  // Field Staff
  { id: 'st1', name: 'Chioma', role: 'SALON', rating: 4.8, status: 'ACTIVE', phone: '08000000001', password: '1234', completedTasks: 142, earnings: 450000 },
  { id: 'st2', name: 'Emmanuel', role: 'SALON', rating: 4.9, status: 'ACTIVE', phone: '08000000002', password: '1234', completedTasks: 89, earnings: 280000 },
  { id: 'st3', name: 'Captain Musa', role: 'MARINE', rating: 5.0, status: 'ACTIVE', phone: '1111', password: '1234', completedTasks: 56, earnings: 1200000 },
  { id: 'st4', name: 'Chef Tunde', role: 'KITCHEN', rating: 4.7, status: 'ACTIVE', phone: '08000000003', password: '1234', completedTasks: 310, earnings: 890000 },
];

export const EVENTS = [
  { id: 'e1', title: 'Karaoke & Cocktails', date: 'Fri, 14th Oct', price: '₦5,000 Entry', capacity: 50, image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80' },
  { id: 'e2', title: 'Sunday Live Band', date: 'Sun, 16th Oct', price: 'Free Entry', capacity: 100, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80' },
  { id: 'e3', title: 'Afrobeat Night Out', date: 'Sat, 15th Oct', price: '₦10,000 VIP', capacity: 80, image: 'https://images.unsplash.com/photo-1514525253361-bee8a48790c3?auto=format&fit=crop&q=80' },
  { id: 'e4', title: 'VIP Lounge Exclusive', date: 'Daily from 9PM', price: 'Table Booking Req.', capacity: 30, image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80' },
  { id: 'e5', title: 'Salon Glow Up Special', date: 'Weekdays Only', price: '20% Discount', capacity: 10, image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80', description: 'Special styling package including wash, treatment, and executive cut.' },
  { id: 'e6', title: 'Lounge Menu Highlight', date: 'Official Hub Choice', price: '₦3,500', capacity: 999, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80', description: 'The legendary Marching Ground local delicacy is now served daily at the lounge.' },
];

export const MOCK_VESSELS: Vessel[] = [
  { id: 'v1', name: 'Sea Runner I', type: 'SPEEDBOAT', capacity: 12, imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a28c5a5?auto=format&fit=crop&w=400', baseHourlyRate: 50000, hourlyRate: 50000, status: 'AVAILABLE', reviews: [] },
  { id: 'v2', name: 'The Sun King', type: 'YACHT', capacity: 25, imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400', baseHourlyRate: 150000, hourlyRate: 150000, status: 'AVAILABLE', reviews: [] },
];

export const MARINE_DESTINATIONS = [
  "Badagry Marina",
  "Lekki Phase 1 Jetty",
  "Ilashe Private Beach",
  "Tarkwa Bay",
];

export const MOCK_INITIAL_BOOKINGS: Booking[] = [];

// Company Protocol Data (Management KPIs)
export const MANAGEMENT_KPIS = {
  FINANCE: {
    manager: "Mrs. Lynda",
    points: [
      "Develop & implement financial strategies to improve revenue.",
      "Conduct Financial analysis weekly to support business growth.",
      "Ensure Compliance with tax regulations and internal policies.",
      "Collaborate with other Department to set and achieve financial targets.",
      "Manage Budgeting, Accounting & auditing process and any other responsibilities assigned."
    ]
  },
  ADMIN: {
    manager: "Mr. Isaac",
    points: [
      "Maintaining a well Organized Office environment.",
      "Managing Procurement (Supplies, stocks and placing orders).",
      "Managing the facilities & equipment & its inventory.",
      "Managing Power / fuel.",
      "Maintaining filing system.",
      "Update Company Policies as required.",
      "Review requisition with Finance & send for approval.",
      "Maintaining and managing the Snooker and give reports.",
      "Attending to officials and ensure maximum cooperation with all stakeholders.",
      "Streamline workflows, improve productivity and reduce overhead costs.",
      "Develop a strategy to eliminate wastage and loss in all units.",
      "Development of an inventory log system for transparency."
    ]
  },
  OPERATIONS: {
    manager: "Ms. Utiebeima",
    points: [
      "Ensure smooth & efficient running of Supermarket, Lounge, Bakery & Eatery.",
      "Overseeing delivery & daily operations.",
      "Manage Staff work & rest Hour & Time log.",
      "Monitoring Inventory & the Financial Report.",
      "Maintaining high level of Customer Satisfaction.",
      "Identify & advise on areas of improvement & implement new systems.",
      "Implementation of strategies to eliminate wastage and loss.",
      "Implementation of inventory log system for transparency."
    ]
  }
};
