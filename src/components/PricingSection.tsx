import React, { useState } from 'react';
import { Check, Sparkles, Clock, ArrowRight, Palette } from 'lucide-react';
import { Currency } from '../types';
import { 
  STARTER_BASIC_PLAN, 
  STARTER_IMMERSIVE_PLAN, 
  MULTI_PAGE_PLAN, 
  MAINTENANCE_PLANS,
  SOCIAL_POSTER_PACKS
} from '../data/packages';

interface PricingSectionProps {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onSelectPlan: (planId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  currency,
  onCurrencyChange,
  onSelectPlan
}) => {
  const [starterTier, setStarterTier] = useState<'basic' | 'immersive'>('immersive');
  const [activeMaintenanceTier, setActiveMaintenanceTier] = useState<string>('growth');

  const formatPrice = (php: number, usd: number) => {
    if (currency === 'USD') return `$${usd.toLocaleString()}`;
    return `₱${php.toLocaleString()}`;
  };

  const currentStarter = starterTier === 'basic' ? STARTER_BASIC_PLAN : STARTER_IMMERSIVE_PLAN;

  return (
    <section id="pricing" className="py-24 border-t border-[#E6E0D6] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header & Currency Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#E6E0D6]">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#735A47] mb-2">
              Transparent Pricing
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#231A14] text-balance">
              Simple, Straightforward Packages
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#554539]">
              Fixed rates, zero surprise charges, and 50/50 milestone terms. Philippine Peso & USD supported.
            </p>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-1.5 self-start md:self-end bg-[#FAF8F5] border border-[#E0D8CB] rounded-lg p-1">
            <button
              onClick={() => onCurrencyChange('PHP')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                currency === 'PHP'
                  ? 'bg-[#231A14] text-[#FAF8F5]'
                  : 'text-[#6B574A] hover:text-[#231A14]'
              }`}
            >
              PHP (₱)
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                currency === 'USD'
                  ? 'bg-[#231A14] text-[#FAF8F5]'
                  : 'text-[#6B574A] hover:text-[#231A14]'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Primary Packages Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Starter Landing Page (Basic vs Immersive toggle inside) */}
          <div className="rounded-2xl border border-[#D5C6B5] bg-[#FAF8F5] p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A6A4E]">
                  01 · Starter Landing Page
                </span>
                <span className="text-xs font-medium text-[#735A47] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#231A14]" />
                  <span>{currentStarter.turnaroundDays}</span>
                </span>
              </div>

              {/* Sub-tier selector */}
              <div className="mt-4 p-1 bg-[#EFE8DD] rounded-xl border border-[#DCD3C5] flex items-center gap-1">
                <button
                  onClick={() => setStarterTier('basic')}
                  className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap text-center ${
                    starterTier === 'basic'
                      ? 'bg-[#231A14] text-[#FAF8F5] shadow-xs'
                      : 'text-[#6B574A] hover:text-[#231A14]'
                  }`}
                >
                  Basic (₱4,999)
                </button>
                <button
                  onClick={() => setStarterTier('immersive')}
                  className={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap text-center flex items-center justify-center gap-1.5 ${
                    starterTier === 'immersive'
                      ? 'bg-[#231A14] text-[#FAF8F5] shadow-xs'
                      : 'text-[#6B574A] hover:text-[#231A14]'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-[#D4B08C]" />
                  <span>Immersive (₱8,999)</span>
                </button>
              </div>

              {/* Price display */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#231A14] tabular-nums tracking-tight">
                  {formatPrice(currentStarter.basePricePHP, currentStarter.basePriceUSD)}
                </span>
                <span className="text-xs text-[#735A47] font-medium">one-time project investment</span>
              </div>

              <h3 className="mt-3 text-xl font-bold text-[#231A14]">
                {currentStarter.name}
              </h3>
              <p className="mt-2 text-xs text-[#6B574A] leading-relaxed">
                {currentStarter.description}
              </p>

              {/* Deliverables List */}
              <div className="mt-6 pt-6 border-t border-[#E6E0D6] space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#231A14]">
                  What You Get:
                </div>
                {currentStarter.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#44352B]">
                    <Check className="w-4 h-4 text-[#231A14] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E6E0D6]">
              <button
                onClick={() => onSelectPlan(currentStarter.id)}
                className="w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider text-[#FAF8F5] bg-[#231A14] hover:bg-[#3D2C22] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Select {starterTier === 'basic' ? 'Basic (₱4,999)' : 'Immersive (₱8,999)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Multi-Page Website (Up to 4 Pages Max) */}
          <div className="rounded-2xl border border-[#D5C6B5] bg-[#FAF8F5] p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8A6A4E]">
                  02 · Multi-Page Website
                </span>
                <span className="text-xs font-medium text-[#735A47] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#231A14]" />
                  <span>{MULTI_PAGE_PLAN.turnaroundDays}</span>
                </span>
              </div>

              <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#8A6A4E] bg-[#EFE8DD] border border-[#DCD3C5] px-3 py-1.5 rounded-lg">
                <Sparkles className="w-3.5 h-3.5 text-[#8A6A4E]" />
                <span>Up to 4 Pages Max (Home + 3 Dedicated Pages)</span>
              </div>

              {/* Price display */}
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#231A14] tabular-nums tracking-tight">
                  {formatPrice(MULTI_PAGE_PLAN.basePricePHP, MULTI_PAGE_PLAN.basePriceUSD)}
                </span>
                <span className="text-xs text-[#735A47] font-medium">one-time project investment</span>
              </div>

              <h3 className="mt-3 text-xl font-bold text-[#231A14]">
                {MULTI_PAGE_PLAN.name}
              </h3>
              <p className="mt-2 text-xs text-[#6B574A] leading-relaxed">
                {MULTI_PAGE_PLAN.description}
              </p>

              {/* Deliverables List */}
              <div className="mt-6 pt-6 border-t border-[#E6E0D6] space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#231A14]">
                  Included Deliverables:
                </div>
                {MULTI_PAGE_PLAN.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-[#44352B]">
                    <Check className="w-4 h-4 text-[#231A14] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E6E0D6]">
              <button
                onClick={() => onSelectPlan(MULTI_PAGE_PLAN.id)}
                className="w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider text-[#FAF8F5] bg-[#231A14] hover:bg-[#3D2C22] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Select Multi-Page (₱14,999)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Monthly Maintenance & Content Care */}
        <div id="maintenance" className="mt-20 pt-16 border-t border-[#E6E0D6]">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#735A47] mb-2">
              Ongoing Peace of Mind
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#231A14] text-balance">
              Monthly Website Maintenance & Content Care
            </h3>
            <p className="mt-2 text-sm text-[#554539] leading-relaxed">
              We handle text updates, photo revisions, security checks, and design fresh social media posters every month so your brand stays active.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {MAINTENANCE_PLANS.map((plan) => {
              const isSelected = activeMaintenanceTier === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setActiveMaintenanceTier(plan.id)}
                  className={`rounded-2xl p-7 flex flex-col justify-between transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-[#231A14] bg-white shadow-sm'
                      : 'border-[#E0D8CB] bg-[#FAF8F5] hover:border-[#C4B7A5]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8A6A4E]">
                        {plan.id === 'guardian' ? 'Tier 1 · Site Only' : 'Tier 2 · Web + 4 Social Posters'}
                      </span>
                      {plan.isPopular && (
                        <span className="text-[11px] font-bold text-[#8A6A4E] bg-[#EFE8DD] px-2 py-0.5 rounded">
                          Best Value
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#231A14] tabular-nums">
                        {formatPrice(plan.basePricePHP, plan.basePriceUSD)}
                      </span>
                      <span className="text-xs font-semibold text-[#735A47]">{plan.billingPeriod}</span>
                    </div>

                    <h4 className="mt-2 text-lg font-bold text-[#231A14]">{plan.name}</h4>
                    <p className="mt-1 text-xs text-[#6B574A] leading-relaxed">{plan.description}</p>

                    <div className="mt-5 pt-5 border-t border-[#E6E0D6] space-y-2">
                      {plan.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-[#44352B]">
                          <Check className="w-3.5 h-3.5 text-[#231A14] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 pt-5 border-t border-[#E6E0D6]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlan(`maintenance-${plan.id}`);
                      }}
                      className="w-full py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider text-[#231A14] bg-[#EFE8DD] hover:bg-[#E5DBCB] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Inquire for {plan.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Standalone Social Media Poster Packs */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl border border-[#E0D8CB] bg-[#FAF8F5] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8A6A4E] mb-1">
              <Palette className="w-4 h-4 text-[#8A6A4E]" />
              <span>Need Only Social Media Posters?</span>
            </div>
            <h4 className="text-lg font-bold text-[#231A14]">Bespoke Social Media Poster Bundles</h4>
            <p className="mt-1 text-xs text-[#6B574A]">
              Get custom graphics for your promos, menu drops, and sales on Facebook & Instagram.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectPlan('posters-starter')}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#231A14] bg-white hover:bg-[#F2ECE1] border border-[#DDD5C7] rounded-lg transition-colors cursor-pointer"
            >
              Starter 3-Pack (₱1,499)
            </button>
            <button
              onClick={() => onSelectPlan('posters-campaign')}
              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FAF8F5] bg-[#231A14] hover:bg-[#3D2C22] rounded-lg transition-colors cursor-pointer"
            >
              Campaign 8-Pack (₱3,499)
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
