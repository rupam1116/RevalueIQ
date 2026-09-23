export type DeviceCategory = "Smartphone" | "Laptop" | "Tablet" | "Smartwatch" | "Audio" | "Gaming Console";

export interface RepairShopService {
  id: string;
  name: string;
  category: DeviceCategory;
  price: number;
  duration: string;
  warranty: string;
  ecoSavingsKg: number;
  description: string;
  popular?: boolean;
}

export interface ShopReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  device: string;
  repairType: string;
  content: string;
  verifiedPurchase: boolean;
  shopResponse?: {
    date: string;
    content: string;
  };
}

export interface ShopEcoMetrics {
  eWastePreventedKg: number;
  co2EmissionsSavedKg: number;
  preciousMetalsRecoveredGrams: number;
  circularRank: string;
}

export interface RepairShop {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  rating: number;
  reviewCount: number;
  aiTrustScore: number; // 0 - 100
  circularContributionScore: number; // 0 - 100
  distanceMiles: number;
  estimatedTime: string; // e.g. "1-3 hrs"
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  website: string;
  businessHours: string;
  warrantyPeriod: string; // e.g. "1 Year Warranty"
  pickupAvailable: boolean;
  pickupDetails: string;
  verifiedPartner: boolean;
  oemPartsCertified: boolean;
  bio: string;
  services: RepairShopService[];
  environmentalMetrics: ShopEcoMetrics;
  reviews: ShopReview[];
  badges: string[];
}

export interface BookingRequest {
  id: string;
  shopId: string;
  shopName: string;
  deviceCategory: DeviceCategory;
  deviceBrand: string;
  deviceModel: string;
  issueType: string;
  issueDescription: string;
  date: string;
  timeSlot: string;
  userFullName: string;
  userEmail: string;
  userPhone: string;
  pickupRequested: boolean;
  pickupAddress?: string;
  userNotes?: string;
  estimatedCost: number;
  confirmationId: string;
  status: "Confirmed" | "In Progress" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  radiusMiles: number;
  minTrustScore: number;
  pickupOnly: boolean;
  oemOnly: boolean;
  sortBy: "trust" | "rating" | "distance" | "price";
}
