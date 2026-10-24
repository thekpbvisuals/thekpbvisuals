import { PricingPlan } from '../types';

export const STARTER_BASIC_PLAN: PricingPlan = {
  id: 'starter-basic',
  name: 'Starter: Basic Landing Page',
  tagline: 'High-speed, single-page website with essential conversion flow.',
  basePricePHP: 9999,
  basePriceUSD: 179,
  turnaroundDays: '3 to 5 business days',
  description: 'Everything your business needs in one streamlined, high-converting single page. Perfect for local shops, clinics, single products, and service providers who need a professional online presence fast.',
  deliverables: [
    'Single all-in-one scroll landing page',
    'Hero, Value Proposition, Services, About & Contact Form',
    '100% Mobile & Tablet responsive architecture',
    'Click-to-Chat (Viber, WhatsApp, FB Messenger)',
    'Google Maps & Location Embed',
    'Basic On-Page SEO meta setup',
    'Free domain connection & hosting setup guidance',
    '2 Rounds of revisions included'
  ],
  features: [
    'Fast 3-5 days delivery',
    'Single page architecture',
    'Clean static layout',
    'Lead capture inquiry form',
    'Mobile-first responsive'
  ],
  type: 'starter'
};

export const STARTER_IMMERSIVE_PLAN: PricingPlan = {
  id: 'starter-immersive',
  name: 'Starter: Immersive Experience',
  tagline: 'Single landing page with dynamic scroll animations & visual depth.',
  badge: 'Recommended for High Impact',
  isPopular: true,
  basePricePHP: 12499,
  basePriceUSD: 225,
  turnaroundDays: '5 to 7 business days',
  description: 'Elevate your brand with rich scroll effects, interactive micro-animations, bespoke dark or studio aesthetic styling, and immersive visual storytelling that commands client attention.',
  deliverables: [
    'Single immersive scroll landing page',
    'Interactive scroll effects (parallax, reveals & depth cues)',
    'Bespoke studio aesthetics matching your brand identity',
    'Interactive component (custom filter, calculator, or interactive tabs)',
    '2 Free Custom Branded Social Media Posters for your launch!',
    'Click-to-Chat (Viber, WhatsApp, FB Messenger)',
    'Advanced On-Page SEO meta & social share card setup',
    'High-speed asset optimization',
    '3 Rounds of revisions included'
  ],
  features: [
    'Interactive scroll animations',
    'Bespoke visual styling',
    'Includes 2 social media launch posters',
    'Interactive component',
    'Full mobile optimization'
  ],
  type: 'starter'
};

export const MULTI_PAGE_PLAN: PricingPlan = {
  id: 'multipage',
  name: 'Multi-Page Website (Up to 4 Pages)',
  tagline: 'Starts at ₱17,999 (adjusted depending on request and scope).',
  basePricePHP: 17999,
  basePriceUSD: 320,
  turnaroundDays: '7 to 10 business days',
  description: 'A multi-page experience designed for businesses requiring structured depth: dedicated Home, About/Story, Services/Catalog, and Contact/Booking pages.',
  deliverables: [
    'Up to 4 dedicated custom pages (Home, About, Services/Menu, Contact)',
    'Structured navigation with fluid page transitions',
    'Class schedule booking or filterable service catalog',
    'Integrated multi-channel inquiry & booking form',
    '4 Free Custom Branded Social Media Launch Posters (FB/IG ready)',
    'Comprehensive SEO structure & Google Analytics 4 integration',
    'Custom favicon & OpenGraph social share card preview',
    'Complimentary 30-day post-launch technical support',
    'Adjusts based on custom requested pages and features'
  ],
  features: [
    'Up to 4 custom pages (Home + 3)',
    'Structured page hierarchy',
    'Includes 4 social media launch posters',
    'Full SEO & Analytics setup',
    '30-day post-launch support'
  ],
  type: 'multipage'
};

export const MAINTENANCE_PLANS = [
  {
    id: 'guardian',
    name: 'Site Guardian',
    tagline: 'Essential website health, speed, and upkeep (Starts at ₱999/mo; subject to change depending on client requests).',
    basePricePHP: 999,
    basePriceUSD: 18,
    billingPeriod: '/month',
    description: 'Keep your website secure, blazing fast, and always up-to-date without needing to touch or understand code.',
    deliverables: [
      'Monthly uptime & performance monitoring',
      'Up to 3 content revisions/month (text, photos, price updates)',
      'Broken link & form delivery testing',
      'Domain renewal & DNS support',
      'Priority direct assistance via Facebook Messenger',
      'Subject to adjustment based on specific client requests'
    ]
  },
  {
    id: 'growth',
    name: 'Digital Growth Partner (Web + Social Posters)',
    tagline: 'Full site maintenance PLUS 4 bespoke social media posters every month (Starts at ₱1,999/mo; subject to change depending on client requests).',
    badge: 'Best Value for Philippine Businesses',
    isPopular: true,
    basePricePHP: 1999,
    basePriceUSD: 36,
    billingPeriod: '/month',
    description: 'The complete care package for Philippine businesses that need both an updated website and an active, eye-catching presence on Facebook & Instagram.',
    deliverables: [
      'Everything in Site Guardian',
      '4 Fresh Custom Branded Social Media Posters per month (FB/IG size)',
      'Unlimited minor website text and photo updates',
      'Monthly promotional banner updates on your site',
      'Monthly traffic & inquiry check-in report',
      'VIP turnaround (under 24 hours for urgent revisions)',
      'Subject to adjustment based on specific client requests'
    ]
  }
];

export const SOCIAL_POSTER_PACKS = [
  {
    id: 'starter-posters',
    name: 'Starter Poster Trio',
    count: 3,
    basePricePHP: 999,
    basePriceUSD: 18,
    description: '3 bespoke high-resolution promotional posters for Facebook, Instagram feed, or promotional stories.',
    deliverables: ['3 custom designed graphics', 'Square (1:1) & Story (9:16) export', 'High-res JPG/PNG + ready to publish']
  },
  {
    id: 'campaign-posters',
    name: 'Campaign Suite',
    count: 8,
    basePricePHP: 2499,
    basePriceUSD: 45,
    description: '8 cohesive social media posters, promotional sale flyers, or carousel slides for a full marketing campaign.',
    deliverables: ['8 custom designed graphics', 'Cohesive visual identity & typography', 'Source files & multi-platform exports', 'Carousel sequences included']
  }
];

export const PHILIPPINES_TRUST_POINTS = [
  { label: 'Local Studio', detail: 'Crafted in the Philippines for local & global businesses' },
  { label: 'Flexible Terms', detail: '50% downpayment upon kickoff, 50% upon live launch' },
  { label: 'Local Payment', detail: 'GCash, Maya, BDO, BPI, UnionBank, & PayPal' },
  { label: 'Zero Code Stress', detail: 'You focus on your business, we handle technical setup' }
];
