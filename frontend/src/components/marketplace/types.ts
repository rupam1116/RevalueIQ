export type CategoryType = 
  | 'All' 
  | 'Phones' 
  | 'Laptops' 
  | 'Tablets' 
  | 'Cameras' 
  | 'Gaming' 
  | 'Accessories' 
  | 'Smart Watches'
  | 'Audio'
  | 'Other';

export type ConditionGrade = 'A+' | 'A' | 'B+' | 'B' | 'C';

export interface SellerReview {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface SellerInfo {
  id: string;
  name: string;
  avatar: string;
  rating: number; // 1-5
  reviewsCount: number;
  responseTime: string; // e.g. "< 10 mins"
  totalSales: number;
  verified: boolean;
  memberSince: string;
  location: string;
  trustScore?: number; // 0-100 score
  co2SavedTotalKg?: number;
  ewasteDivertedTotalKg?: number;
  reviews?: SellerReview[];
  bio?: string;
}

export interface AIAppraisalDetails {
  cosmeticGrade: ConditionGrade | string;
  estimatedMarketValue: number;
  marketValueRange: { min: number; max: number };
  conditionScore: number; // 0-100 score
  conditionBreakdown: {
    screenDisplay: number; // 0-100
    batteryHealth: number; // 0-100
    chassisBody: number; // 0-100
    hardwarePerformance: number; // 0-100
  };
  repairCostEstimate: number;
  repairRecommendations: string[];
  circularEconomyScore: number; // 0-100 score
  co2SavedKg: number; // e.g. 78.4 kg CO2e
  ewasteDivertedKg: number; // e.g. 0.22 kg e-waste
  waterSavedLiters?: number; // e.g. 12500 Liters
  resaleDemandIndex: 'Very High' | 'High' | 'Moderate' | 'Low';
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  category: CategoryType;
  brand: string;
  model: string;
  purchaseYear: number;
  price: number;
  originalPrice: number;
  aiAppraisal: AIAppraisalDetails;
  location: string;
  distanceKm?: number;
  seller: SellerInfo;
  images: string[];
  description: string;
  specs: { key: string; value: string }[];
  createdAt: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  status: 'active' | 'pending' | 'sold' | 'draft';
  viewsCount: number;
  inquiriesCount: number;
  isRepairable: boolean;
  warranty: string; // e.g. "12-Month Revalue Eco Warranty"
  returnPolicy?: string; // e.g. "14-Day Free Returns"
  shippingMethod?: string; // e.g. "Insured Eco Express Shipping"
  condition?: string;
  sustainabilityScore?: number;
  co2SavingsKg?: number;
  isOwner?: boolean;
  listingCode?: string;
  deviceId?: string;
  valuationId?: string;
}

export interface FilterState {
  category: CategoryType;
  brand: string[];
  priceRange: [number, number];
  conditionGrades: ConditionGrade[];
  minCircularScore: number;
  repairableOnly: boolean;
  warrantyOnly?: boolean;
  searchQuery: string;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'rating' | 'ai-score';
  locationFilter?: string;
}

export type MarketplaceViewMode = 'home' | 'my-listings' | 'wishlist' | 'recent' | 'dashboard';

export interface EnvironmentalImpactMetrics {
  totalCo2AvoidedKg: number;
  totalEwasteDivertedKg: number;
  totalWaterSavedLiters: number;
  circularPlatformIndex: number;
  totalDevicesRefurbished: number;
}
