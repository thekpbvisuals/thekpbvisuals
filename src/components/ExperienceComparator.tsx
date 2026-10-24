import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, Eye } from 'lucide-react';

interface ExperienceComparatorProps {
  onSelectPlan: (planId: 'starter-basic' | 'starter-immersive') => void;
}

export const ExperienceComparator: React.FC<ExperienceComparatorProps> = ({ onSelectPlan }) => {
  const [activeMode, setActiveMode] = useState<'basic' | 'immersive'>('immersive');

  return (
    <section id="comparator" className="py-20 border-t border-[#E6E0D6] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Simple Header */}
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#735A47] mb-2">
            The Starter Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#231A14] text-balance">
            Basic vs. Immersive Landing Page
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#554539] leading-relaxed">
            Both options package your entire business into one single landing page. Pick the visual style that fits your budget and brand.
          </p>
        </div>

        {/* Clean Interactive Mode Selector */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-[#FAF8F5] rounded-xl border border-[#E0D8CB]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMode('basic')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeMode === 'basic'
                  ? 'bg-[#231A14] text-[#FAF8F5] shadow-xs'
                  : 'text-[#6B574A] hover:text-[#231A14] hover:bg-[#EFE8DD]'
              }`}
            >
              Basic Landing Page (₱4,999)
            </button>
            <button
              onClick={() => setActiveMode('immersive')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeMode === 'immersive'
                  ? 'bg-[#231A14] text-[#FAF8F5] shadow-xs'
                  : 'text-[#6B574A] hover:text-[#231A14] hover:bg-[#EFE8DD]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4B08C]" />
              <span>Immersive Experience (₱8,999)</span>
            </button>
          </div>

          <div className="text-xs font-medium text-[#735A47] px-3">
            {activeMode === 'basic' ? 'Static clean layout · 3–5 Days' : 'Scroll animations + 2 Free Posters · 5–7 Days'}
          </div>
        </div>

        {/* Live Visual Comparison */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Simulated Screen */}
          <div className="lg:col-span-7 rounded-2xl border border-[#E0D8CB] bg-[#FAF8F5] p-6 flex flex-col justify-between shadow-xs">
            {/* Screen Header Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E6E0D6] text-xs text-[#735A47]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4C3B3]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#B8A696]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#8A7667]" />
                <span className="ml-2 font-mono text-[11px] text-[#6B574A]">
                  thekpbvisuals.com/preview/{activeMode}
                </span>
              </div>
              <span className="font-semibold text-[11px] uppercase tracking-wider">
                {activeMode === 'basic' ? 'Static Single Page' : 'Interactive Scroll Motion'}
              </span>
            </div>

            {/* Canvas Demo */}
            <div className="my-6 min-h-[260px] flex flex-col justify-center transition-all duration-200">
              {activeMode === 'basic' ? (
                /* Basic Demo */
                <div className="space-y-4">
                  <div className="p-5 rounded-xl border border-[#E6E0D6] bg-white shadow-xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#8A7667]">Manila Business</div>
                    <div className="mt-1 text-lg font-bold text-[#231A14]">Clear Value Proposition</div>
                    <p className="mt-1 text-xs text-[#6B574A]">Clean, readable typography for straightforward lead inquiries.</p>
                    <div className="mt-4 flex gap-2">
                      <div className="px-3 py-1.5 bg-[#231A14] text-white text-xs font-medium rounded-md">Inquire Now</div>
                      <div className="px-3 py-1.5 border border-[#DCD5CA] text-[#231A14] text-xs font-medium rounded-md">Learn More</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg border border-[#E6E0D6] bg-white text-xs text-[#554539]">
                      <div className="font-bold text-[#231A14]">Fast Speed</div>
                      <div className="mt-0.5 text-[11px] text-[#7A6A5E]">Quick loading</div>
                    </div>
                    <div className="p-3 rounded-lg border border-[#E6E0D6] bg-white text-xs text-[#554539]">
                      <div className="font-bold text-[#231A14]">Mobile-Ready</div>
                      <div className="mt-0.5 text-[11px] text-[#7A6A5E]">Fits every phone</div>
                    </div>
                    <div className="p-3 rounded-lg border border-[#E6E0D6] bg-white text-xs text-[#554539]">
                      <div className="font-bold text-[#231A14]">Contact Form</div>
                      <div className="mt-0.5 text-[11px] text-[#7A6A5E]">Direct inquiries</div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Immersive Demo */
                <div className="space-y-4">
                  <div className="p-6 rounded-xl border border-[#D5C6B5] bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5EFE6] shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A4E]">Parallax & Motion Cues</span>
                      <span className="text-[10px] font-semibold text-[#8A6A4E] bg-[#EFE6DB] px-2 py-0.5 rounded">Interactive</span>
                    </div>
                    <div className="mt-2 text-xl font-extrabold text-[#231A14]">
                      Dynamic Visual Depth
                    </div>
                    <p className="mt-1 text-xs text-[#6B574A] leading-relaxed">
                      Fluid scroll reveals, depth layers, custom studio styling, and 2 Free launch posters.
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <button className="px-4 py-2 bg-[#231A14] text-white text-xs font-bold rounded-lg shadow-xs">
                        Explore Brand
                      </button>
                      <span className="text-xs font-medium text-[#7A6049]">+2 Free Launch Posters Included</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl border border-[#E0D8CB] bg-white shadow-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A4E]">01. Motion</div>
                      <div className="font-bold text-xs text-[#231A14] mt-0.5">Scroll Parallax</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-[#E0D8CB] bg-white shadow-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A4E]">02. Style</div>
                      <div className="font-bold text-xs text-[#231A14] mt-0.5">Custom Aesthetic</div>
                    </div>
                    <div className="p-3.5 rounded-xl border border-[#E0D8CB] bg-white shadow-xs">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A6A4E]">03. Social</div>
                      <div className="font-bold text-xs text-[#231A14] mt-0.5">2 Free Posters</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Note */}
            <div className="pt-4 border-t border-[#E6E0D6] flex items-center justify-between text-xs text-[#735A47]">
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#231A14]" />
                <span>Switch tabs to compare</span>
              </span>
              <span className="font-bold text-[#231A14]">
                {activeMode === 'basic' ? '3–5 Days Turnaround' : '5–7 Days Turnaround'}
              </span>
            </div>
          </div>

          {/* Right Spec Card */}
          <div className="lg:col-span-5 rounded-2xl border border-[#E0D8CB] bg-[#FAF8F5] p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#735A47]">
                  {activeMode === 'basic' ? 'Basic Starter' : 'Immersive Starter'}
                </span>
                <span className="text-2xl font-black text-[#231A14] tabular-nums">
                  {activeMode === 'basic' ? '₱4,999' : '₱8,999'}
                </span>
              </div>

              <h3 className="mt-2 text-xl font-bold text-[#231A14]">
                {activeMode === 'basic' ? 'Basic Single Landing Page' : 'Immersive Dynamic Landing Page'}
              </h3>
              
              <p className="mt-2 text-xs text-[#6B574A] leading-relaxed">
                {activeMode === 'basic'
                  ? 'Great for fast launches, clinics, local stores, and simple service offerings needing instant credibility.'
                  : 'Engineered for modern brands, creative studios, and lifestyle products that want an unforgettable impression.'}
              </p>

              {/* Simple Feature Checklist */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-[#44352B]">
                  <Check className="w-4 h-4 text-[#231A14] shrink-0 mt-0.5" />
                  <span>Single all-in-one scroll page (Hero, Services, About, Contact)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#44352B]">
                  <Check className="w-4 h-4 text-[#231A14] shrink-0 mt-0.5" />
                  <span>100% Mobile & tablet responsive display</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#44352B]">
                  <Check className="w-4 h-4 text-[#231A14] shrink-0 mt-0.5" />
                  <span>Click-to-Chat (Viber, WhatsApp, FB Messenger)</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-[#44352B]">
                  <Check className="w-4 h-4 text-[#231A14] shrink-0 mt-0.5" />
                  <span>Location map & lead inquiry contact form</span>
                </div>
                {activeMode === 'immersive' && (
                  <>
                    <div className="flex items-start gap-2.5 text-xs text-[#231A14] font-semibold">
                      <Sparkles className="w-4 h-4 text-[#8A5E38] shrink-0 mt-0.5" />
                      <span>Scroll parallax, reveals & depth micro-animations</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-xs text-[#231A14] font-semibold">
                      <Sparkles className="w-4 h-4 text-[#8A5E38] shrink-0 mt-0.5" />
                      <span>Includes 2 Free Custom Social Media Posters for launch</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#E6E0D6]">
              <button
                onClick={() => onSelectPlan(activeMode === 'basic' ? 'starter-basic' : 'starter-immersive')}
                className="w-full py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider bg-[#231A14] hover:bg-[#3D2C22] text-[#FAF8F5] flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <span>Select {activeMode === 'basic' ? 'Basic (₱4,999)' : 'Immersive (₱8,999)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
