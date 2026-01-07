import { ServiceType, Product, ServiceItem, Staff, Vessel, LeaderboardEntry, MarineRoute, ClubEvent } from './types';

export const APP_NAME = "Evening Sun Nigeria Limited";
export const HUB_ADDRESS = "No. 4, Unity Estate, Mosafejo, Badagry, Lagos State";
export const HUB_PHONE = "08032665268";

export const SERVICE_CATEGORIES = [
  {
    id: ServiceType.EATERY,
    title: "Kitchen & Canteen",
    icon: "Utensils",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop",
    description: "Excellently prepared local delicacies and continental dishes for your maximum satisfaction."
  },
  {
    id: ServiceType.LOUNGE,
    title: "Premium Lounge",
    icon: "GlassWater",
    image: "https://images.unsplash.com/photo-1514525253361-bee8a48790c3?q=80&w=1000&auto=format&fit=crop",
    description: "Chilled refreshments and a serene environment for your relaxation, Sir/Madam."
  },
  {
    id: ServiceType.SUPERMARKET,
    title: "Supermarket",
    icon: "ShoppingBag",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop",
    description: "Quality daily provisions and household essentials at highly competitive prices."
  },
  {
    id: ServiceType.MEETING_HALL,
    title: "Event Center",
    icon: "Presentation",
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=1000&auto=format&fit=crop",
    description: "Conference Rooms for your corporate meetings, seminars, and high-profile social gatherings."
  },
  {
    id: ServiceType.SALON,
    title: "Beauty Salon",
    icon: "Scissors",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop",
    description: "Professional hair styling and expert grooming services for our esteemed clientele."
  },
  {
    id: ServiceType.PEDICURE,
    title: "Spa & Pedicure",
    icon: "Footprints",
    image: "https://images.unsplash.com/photo-1519415510271-e62b4d7598db?q=80&w=1000&auto=format&fit=crop",
    description: "Specialized therapeutic spa treatments to ensure your complete physical rejuvenation."
  },
  {
    id: ServiceType.GAME_LOUNGE,
    title: "Gaming Arena",
    icon: "Gamepad2",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1000&auto=format&fit=crop",
    description: "State-of-the-art electronic sports and digital entertainment for gaming enthusiasts."
  },
  {
    id: ServiceType.MARINE,
    title: "Jetty & Marine",
    icon: "Anchor",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000&auto=format&fit=crop",
    description: "Secure private charters and marine logistics for safe and efficient water transportation."
  }
];

export const MOCK_MARINE_ROUTES: MarineRoute[] = [
  {
    id: 'rt1',
    origin: 'Badagry Jetty',
    destination: 'Lekki Phase 1',
    durationMin: 75,
    price: 15000,
    vesselId: 'v3',
    departureTimes: ['08:00 AM', '11:00 AM', '03:00 PM'],
    description: 'An executive commuter route for those who wish to avoid road congestion. Fully air-conditioned.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000&auto=format&fit=crop'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'f1', name: 'Marching Ground Special', price: 3500, category: 'Lounge Menu', description: 'Our signature delicacy prepared with smoked fish, prawns, and authentic Badagry spices.', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=400', isAvailable: true, trendScore: 95, prepTimeMin: 20 },
  { id: 'dr1', name: 'Premium Lager', price: 1200, category: 'Drinks', description: 'Highly refreshing cold bottle of premium lager beer.', image: 'https://images.unsplash.com/photo-1584225065152-4a1454aa3d4e?q=80&w=400&auto=format&fit=crop', isAvailable: true, trendScore: 85, prepTimeMin: 2, stockLevel: 48 },
  { id: 'pv1', name: 'Dano Milk Powder', price: 2800, category: 'Provisions', description: 'Quality instant milk powder for the whole family.', image: 'https://images.unsplash.com/photo-1550583760-d80305277440?q=80&w=400&auto=format&fit=crop', isAvailable: true, prepTimeMin: 0, stockLevel: 100 },
];

export const MOCK_SERVICES: Record<string, ServiceItem[]> = {
  [ServiceType.SALON]: [
    { id: 'sf1', name: 'Expert Braiding', price: 12000, durationMin: 180, description: 'Elegant hair braiding with extensions for a sophisticated appearance.', relatedServices: ['sf2'] },
  ],
  [ServiceType.GAME_LOUNGE]: [
    { 
      id: 'g1', 
      name: 'Gaming Unit 01', 
      price: 2500, 
      durationMin: 60, 
      platform: 'PS5', 
      status: 'AVAILABLE',
      description: 'Experience ultra high-definition gaming on our premium stations.',
      specs: { 'GPU': '16.7 TFLOPS', 'Storage': '2TB SSD', 'Display': '65" OLED' },
      gamesList: ['FIFA 25', 'Call of Duty', 'Spider-Man 2']
    },
  ],
};

export const GAMING_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb1', rank: 1, name: 'CyberTunde', game: 'FIFA 25', winRate: '88%', xp: 12400 },
  { id: 'lb2', rank: 2, name: 'BadagryBolt', game: 'Valorant', winRate: '82%', xp: 9500 },
];

export const MOCK_STAFF: Staff[] = [
  { id: 'st3', name: 'Captain Musa', role: 'BOAT_OPERATOR', specialization: 'Expert Marine Navigation', rating: 5.0, ratingCount: 120, status: 'ACTIVE', phone: '08032665268', password: '1234', completedTasks: 56, earnings: 1200000, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=musa' },
  { id: 'st4', name: 'Chef Amaka', role: 'KITCHEN', specialization: 'Traditional Delicacies', rating: 4.8, ratingCount: 210, status: 'ACTIVE', phone: '08030000001', password: '1234', completedTasks: 440, earnings: 850000, imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amaka' },
];

export const EVENTS: ClubEvent[] = [
  { id: 'e1', title: 'Karaoke & Cocktails Night', date: 'Friday, 14th Oct', price: '₦5,000 Entrance', capacity: 50, attendeeCount: 42, image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80' },
];

export const MOCK_VESSELS: Vessel[] = [
  { id: 'v1', name: 'Oceanic Runner I', type: 'SPEEDBOAT', capacity: 12, imageUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a28c5a5?auto=format&fit=crop&w=400', baseHourlyRate: 50000, hourlyRate: 50000, status: 'AVAILABLE', reviews: [] },
];

export const MARINE_DESTINATIONS = ["Badagry Marina", "Lekki Jetty", "Ilashe Beach"];
