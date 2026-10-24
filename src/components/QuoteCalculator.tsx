import React, { useState, useMemo } from 'react';
import { Calculator, Send, Copy, Check, Sparkles } from 'lucide-react';
import { Currency } from '../types';

interface QuoteCalculatorProps {
  currency: Currency;
  onSendToForm: (quoteSummary: string, totalOneTime: number, monthlyRate: number) => void;
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ currency, onSendToForm }) => {
  const [websiteType, setWebsiteType] = useState<'none' | 'starter-basic' | 'starter-immersive' | 'multipage'>('starter-immersive');
  const [maintenancePlan, setMaintenancePlan] = useState<'none' | 'guardian' | 'growth'>('growth');
  const [extraPosters, setExtraPosters] = useState<number>(0);
  const [rushDelivery, setRushDelivery] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const websitePrices = {
    'none': 0,
    'starter-basic': 4999,
    'starter-immersive': 8999,
    'multipage': 14999
  };

  const maintenancePrices = {
    'none': 0,
    'guardian': 2499,
    'growth': 4999
  };

  const posterPrices: Record<number, number> = {
    0: 0,
    3: 1499,
    6: 2799,
    8: 3499
  };

  const rushFee = 2000;

  const totalOneTimePHP = useMemo(() => {
    let sum = websitePrices[websiteType];
    sum += posterPrices[extraPosters] || 0;
    if (rushDelivery) sum += rushFee;
    return sum;
  }, [websiteType, extraPosters, rushDelivery]);

  const monthlyPHP = maintenancePrices[maintenancePlan];

  const totalOneTimeUSD = Math.round(totalOneTimePHP / 56);
  const monthlyUSD = Math.round(monthlyPHP / 56);

  const formatAmount = (php: number, usd: number) => {
    if (currency === 'USD') return `$${usd.toLocaleString()}`;
    return `₱${php.toLocaleString()}`;
  };

  const quoteText = useMemo(() => {
    const webLabel = 
      websiteType === 'starter-basic' ? 'Starter Basic Landing Page' :
      websiteType === 'starter-immersive' ? 'Starter Immersive Landing Page' :
      websiteType === 'multipage' ? 'Multi-Page Website (Up to 4 Pages)' : 'No Website';

    const maintLabel = 
      maintenancePlan === 'guardian' ? 'Site Guardian (₱2,499/mo)' :
      maintenancePlan === 'growth' ? 'Growth Partner + 4 Social Posters (₱4,999/mo)' : 'None';

    const posterLabel = extraPosters > 0 ? `${extraPosters} Extra Social Media Posters` : 'None';
    const rushLabel = rushDelivery ? 'Yes (48-72h Rush)' : 'Standard';

    return `Hi The KPB Visuals! Here is my estimated project:
- Website: ${webLabel}
- Monthly Care: ${maintLabel}
- Extra Social Posters: ${posterLabel}
- Rush Delivery: ${rushLabel}
- Total: ₱${totalOneTimePHP.toLocaleString()} one-time ${monthlyPHP > 0 ? `+ ₱${monthlyPHP.toLocaleString()}/mo` : ''}

I would like to discuss kickoff!`;
  }, [websiteType, maintenancePlan, extraPosters, rushDelivery, totalOneTimePHP, monthlyPHP]);

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="calculator" className="py-20 border-t border-[#E6E0D6] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#735A47] mb-2 flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#231A14] text-balance">
            Project Cost Estimator
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#554539]">
            Configure your package in seconds to see your exact one-time investment and optional monthly care plan.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Website */}
            <div className="p-6 rounded-2xl border border-[#E0D8CB] bg-[#FAF8F5]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#231A14] block mb-3">
                1. Choose Website Architecture
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWebsiteType('starter-basic')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    websiteType === 'starter-basic'
                      ? 'border-[#231A14] bg-white shadow-xs'
                      : 'border-[#E6E0D6] bg-[#FAF8F5] text-[#554539] hover:border-[#C4B7A5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#231A14]">Starter: Basic</span>
                    <span className="font-mono text-xs font-bold text-[#8A6A4E]">{formatAmount(4999, 89)}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#6B574A] leading-normal">
                    Single-page, clean layout, essential conversion, 3-5 days.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setWebsiteType('starter-immersive')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    websiteType === 'starter-immersive'
                      ? 'border-[#231A14] bg-white shadow-xs'
                      : 'border-[#E6E0D6] bg-[#FAF8F5] text-[#554539] hover:border-[#C4B7A5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#231A14] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#8A6A4E]" />
                      Starter: Immersive
                    </span>
                    <span className="font-mono text-xs font-bold text-[#8A6A4E]">{formatAmount(8999, 160)}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#6B574A] leading-normal">
                    Scroll motion, custom visual depth + 2 Free Launch Posters.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setWebsiteType('multipage')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    websiteType === 'multipage'
                      ? 'border-[#231A14] bg-white shadow-xs'
                      : 'border-[#E6E0D6] bg-[#FAF8F5] text-[#554539] hover:border-[#C4B7A5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#231A14]">Multi-Page (Up to 4)</span>
                    <span className="font-mono text-xs font-bold text-[#8A6A4E]">{formatAmount(14999, 269)}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#6B574A] leading-normal">
                    Home + 3 dedicated pages + 4 Free Launch Posters.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setWebsiteType('none')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    websiteType === 'none'
                      ? 'border-[#231A14] bg-white shadow-xs'
                      : 'border-[#E6E0D6] bg-[#FAF8F5] text-[#554539] hover:border-[#C4B7A5]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#231A14]">No Website</span>
                    <span className="font-mono text-xs text-[#7A6A5E]">{formatAmount(0, 0)}</span>
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#6B574A] leading-normal">
                    I only need social posters or monthly maintenance.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Maintenance */}
            <div className="p-6 rounded-2xl border border-[#E0D8CB] bg-[#FAF8F5]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#231A14] block mb-3">
                2. Monthly Maintenance & Content Care (Optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMaintenancePlan('none')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    maintenancePlan === 'none'
                      ? 'border-[#231A14] bg-white shadow-xs'
                      : 'border-[#E6E0D6] bg-[#FAF8F5] text-[#554539] hover:border-[#C4B7A5]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#231A14]">No Monthly Care</div>
                  <div className="text-[11px] text-[#7A6A5E] mt-1">One-off handoff only</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMaintenancePlan('guardian')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    maintenancePlan === 'guardian'
                      ? 'border-[#231A14] bg-white shadow-xs'
                      : 'border-[#E6E0D6] bg-[#FAF8F5] text-[#554539] hover:border-[#C4B7A5]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#231A14]">Site Guardian</div>
                  <div className="font-mono text-xs font-bold text-[#8A6A4E] mt-0.5">{formatAmount(2499, 45)}/mo</div>
                  <div className="text-[10px] text-[#7A6A5E] mt-1">Speed, uptime, 3 updates/mo</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMaintenancePlan('growth')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    maintenancePlan === 'growth'
                      ? 'border-[#231A14] bg-white shadow-xs'
                      : 'border-[#E6E0D6] bg-[#FAF8F5] text-[#554539] hover:border-[#C4B7A5]'
                  }`}
                >
                  <div className="font-bold text-xs text-[#231A14]">Growth Partner</div>
                  <div className="font-mono text-xs font-bold text-[#8A6A4E] mt-0.5">{formatAmount(4999, 89)}/mo</div>
                  <div className="text-[10px] text-[#8A6A4E] font-medium mt-1">Web care + 4 Posters/mo</div>
                </button>
              </div>
            </div>

            {/* Step 3: Social Media Posters */}
            <div className="p-6 rounded-2xl border border-[#E0D8CB] bg-[#FAF8F5]">
              <label className="text-xs font-bold uppercase tracking-wider text-[#231A14] block mb-3">
                3. Extra Social Media Posters
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { count: 0, label: 'None', price: 0 },
                  { count: 3, label: '3 Posters', price: 1499 },
                  { count: 6, label: '6 Posters', price: 2799 },
                  { count: 8, label: '8 Posters', price: 3499 }
                ].map((item) => (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => setExtraPosters(item.count)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      extraPosters === item.count
                        ? 'border-[#231A14] bg-white shadow-xs'
                        : 'border-[#E6E0D6] bg-[#FAF8F5] text-[#554539] hover:border-[#C4B7A5]'
                    }`}
                  >
                    <div className="font-bold text-xs text-[#231A14]">{item.label}</div>
                    <div className="font-mono text-[11px] font-semibold text-[#8A6A4E] mt-1">
                      {item.price === 0 ? '₱0' : `+${formatAmount(item.price, Math.round(item.price / 56))}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Rush Delivery */}
            <div className="p-4 rounded-xl border border-[#E0D8CB] bg-[#FAF8F5] flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#231A14]">Expedited Rush Delivery (48–72 Hours)</div>
                <div className="text-[11px] text-[#7A6A5E]">Priority queue for upcoming campaign launches.</div>
              </div>
              <button
                type="button"
                onClick={() => setRushDelivery(!rushDelivery)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  rushDelivery
                    ? 'bg-[#231A14] text-[#FAF8F5]'
                    : 'bg-[#EFE8DD] text-[#231A14] hover:bg-[#E2D8CA]'
                }`}
              >
                {rushDelivery ? `Added (+${formatAmount(2000, 36)})` : `Add +${formatAmount(2000, 36)}`}
              </button>
            </div>
          </div>

          {/* Estimate Card */}
          <div className="lg:col-span-5 sticky top-24 rounded-2xl border border-[#D5C6B5] bg-[#FAF8F5] p-6 sm:p-8 shadow-xs">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8A6A4E] mb-2">
              Itemized Estimate
            </div>
            
            <div className="space-y-3.5 py-4 border-y border-[#E6E0D6] text-xs">
              <div className="flex justify-between items-center text-[#554539]">
                <span>Website Base:</span>
                <span className="font-mono font-bold text-[#231A14]">
                  {formatAmount(websitePrices[websiteType], Math.round(websitePrices[websiteType] / 56))}
                </span>
              </div>

              {extraPosters > 0 && (
                <div className="flex justify-between items-center text-[#554539]">
                  <span>{extraPosters} Extra Social Posters:</span>
                  <span className="font-mono font-bold text-[#231A14]">
                    {formatAmount(posterPrices[extraPosters], Math.round(posterPrices[extraPosters] / 56))}
                  </span>
                </div>
              )}

              {rushDelivery && (
                <div className="flex justify-between items-center text-[#554539]">
                  <span>Expedited Rush Fee:</span>
                  <span className="font-mono font-bold text-[#231A14]">
                    {formatAmount(rushFee, 36)}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-[#E6E0D6] flex justify-between items-baseline">
                <span className="font-bold text-[#231A14]">One-Time Total:</span>
                <span className="text-2xl font-black text-[#231A14] font-mono">
                  {formatAmount(totalOneTimePHP, totalOneTimeUSD)}
                </span>
              </div>

              {monthlyPHP > 0 && (
                <div className="p-3 rounded-lg bg-[#EFE8DD] border border-[#DCD3C5] flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#231A14] block">Monthly Care Plan:</span>
                    <span className="text-[11px] text-[#7A6A5E]">
                      {maintenancePlan === 'guardian' ? 'Site Guardian' : 'Growth (Site + 4 Posters/mo)'}
                    </span>
                  </div>
                  <span className="font-mono font-black text-[#231A14] text-base">
                    {formatAmount(monthlyPHP, monthlyUSD)}/mo
                  </span>
                </div>
              )}
            </div>

            {/* Payment Term Notes */}
            <div className="mt-4 text-[11px] text-[#7A6A5E] space-y-1">
              <div>• 50% Kickoff Deposit (₱{Math.round(totalOneTimePHP / 2).toLocaleString()}) to begin</div>
              <div>• 50% Balance only upon your final live approval</div>
              <div>• GCash, Maya, BDO, BPI, UnionBank, PayPal</div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={() => onSendToForm(quoteText, totalOneTimePHP, monthlyPHP)}
                className="w-full py-3 px-4 bg-[#231A14] hover:bg-[#3D2C22] text-[#FAF8F5] rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit This Project Brief</span>
              </button>

              <button
                type="button"
                onClick={handleCopyQuote}
                className="w-full py-2.5 px-4 bg-[#EFE8DD] hover:bg-[#E5DBCB] text-[#231A14] rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#231A14]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Estimate Copied!' : 'Copy for Messenger / Viber'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
