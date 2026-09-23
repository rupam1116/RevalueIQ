import { MarketplaceProduct, EnvironmentalImpactMetrics } from './types';

export const PLATFORM_IMPACT_METRICS: EnvironmentalImpactMetrics = {
  totalCo2AvoidedKg: 14250.8,
  totalEwasteDivertedKg: 1840.5,
  totalWaterSavedLiters: 485000,
  circularPlatformIndex: 96.4,
  totalDevicesRefurbished: 1240,
};

export const INITIAL_PRODUCTS: MarketplaceProduct[] = [];

export const INITIAL_MY_LISTINGS: MarketplaceProduct[] = [];

export const MOCK_NOTIFICATIONS: { id: string; title: string; desc: string; time: string; read: boolean }[] = [];
