export type Currency = 'PHP' | 'USD';

export interface PricingPlan {
  id: string;
  name: string;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  basePricePHP: number;
  basePriceUSD: number;
  turnaroundDays: string;
  description: string;
  features: string[];
  deliverables: string[];
  type: 'starter' | 'multipage' | 'maintenance' | 'posters';
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: 'web' | 'posters' | 'branding';
  image: string;
  description: string;
  metrics?: string;
  deliverables: string[];
  tags: string[];
}

export interface QuoteCustomization {
  websiteType: 'none' | 'starter-basic' | 'starter-immersive' | 'multipage';
  maintenancePlan: 'none' | 'guardian' | 'growth';
  socialPostersCount: number;
  rushDelivery: boolean;
  currency: Currency;
}
