export interface AIRecommendationReport {
  id: string;
  deviceName: string;
  deviceCategory: string;
  detectedIssues: string[];
  estimatedCostINR: number;
  estimatedDays: string;
  confidenceScore: number;
  rationale: string;
  actionRequired: string;
}

export interface RepairCharge {
  service: string;
  priceINR: number;
  warranty: string;
}

export interface CenterPerks {
  pickupService: boolean;
  homeVisit: boolean;
  parkingAvailable: boolean;
  accessibility: boolean;
  nearbyMetro: string;
  nearbyBusStop: string;
}

export interface AIReviewSummaryData {
  overallRating: number;
  reviewCount: number;
  summaryText: string;
  strengths: string[];
  weaknesses: string[];
}

export interface CenterReview {
  id: string;
  userName: string;
  avatar?: string;
  rating: number;
  date: string;
  reviewText: string;
  helpfulCount: number;
  ownerResponse?: string;
}

export type CenterCategory = "Authorized" | "Premium Partner" | "Unavailable";

export interface AuthorizedRepairCenter {
  id: string;
  name: string;
  logo: string;
  tagline?: string;
  category: CenterCategory;
  rating: number;
  reviewCount: number;
  status: "Open" | "Closed";
  workingHoursText: string;
  distanceKm: number;
  address: string;
  city: string;
  area: string;
  pincode: string;
  phone: string;
  website: string;
  lat: number;
  lng: number;
  expertise: string[];
  isCertified: boolean;
  certificationName: string;
  aiTrustScore: number;
  heroImage: string;
  photos: string[];
  waitingTime: string;
  repairCharges: RepairCharge[];
  brandsSupported: string[];
  perks: CenterPerks;
  aiReviewSummary: AIReviewSummaryData;
  reviews: CenterReview[];
}

export interface RecommendationAppointment {
  id: string;
  centerId: string;
  centerName: string;
  deviceName: string;
  issue: string;
  preferredDate: string;
  preferredTime: string;
  pickupRequired: boolean;
  address?: string;
  contactNumber: string;
  confirmationCode: string;
  status: "Confirmed" | "Pending";
}
