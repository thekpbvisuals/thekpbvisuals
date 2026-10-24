import React, { useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onInquireClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onInquireClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#F8F6F1]/90 border-b border-[#E6E0D6] transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark with official logo emblem */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 whitespace-nowrap shrink-0 group"
        >
          <img
            src="/assets/aistudio/The_KPB_Visuals_-_Business_Logo_8f34506e.jpg"
            alt="The KPB Visuals Logo"
            className="w-9 h-9 rounded-lg object-contain border border-[#E0D8CB] bg-[#FAF8F5] p-0.5 shadow-xs"
          />
          <div className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight text-[#231A14] group-hover:text-[#6E4B33] transition-colors">
              The KPB Visuals
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#7A6A5E] font-medium mt-0.5">
              Websites & Social Media
            </span>
          </div>
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-[#5A493D]">
          <button 
            onClick={() => scrollTo('services')} 
            className="hover:text-[#231A14] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Services
          </button>
          <button 
            onClick={() => scrollTo('comparator')} 
            className="hover:text-[#231A14] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Basic vs. Immersive
          </button>
          <button 
            onClick={() => scrollTo('pricing')} 
            className="hover:text-[#231A14] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollTo('calculator')} 
            className="hover:text-[#231A14] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Estimator
          </button>
          <button 
            onClick={() => scrollTo('portfolio')} 
            className="hover:text-[#231A14] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Work
          </button>
          <button 
            onClick={() => scrollTo('faq')} 
            className="hover:text-[#231A14] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Zone 3: Primary CTA */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onInquireClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FAF8F5] bg-[#231A14] hover:bg-[#3D2C22] active:scale-95 rounded-lg transition-all duration-150 shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Get a Quote</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 text-[#231A14] hover:bg-[#ECE6DC] rounded-lg transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation tray */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E6E0D6] bg-[#FAF8F5] px-6 py-5 flex flex-col gap-4 text-xs font-semibold uppercase tracking-wider text-[#5A493D]">
          <button onClick={() => scrollTo('services')} className="text-left py-1 hover:text-[#231A14]">
            Services
          </button>
          <button onClick={() => scrollTo('comparator')} className="text-left py-1 hover:text-[#231A14]">
            Basic vs. Immersive
          </button>
          <button onClick={() => scrollTo('pricing')} className="text-left py-1 hover:text-[#231A14]">
            Pricing
          </button>
          <button onClick={() => scrollTo('calculator')} className="text-left py-1 hover:text-[#231A14]">
            Estimator
          </button>
          <button onClick={() => scrollTo('portfolio')} className="text-left py-1 hover:text-[#231A14]">
            Work
          </button>
          <button onClick={() => scrollTo('faq')} className="text-left py-1 hover:text-[#231A14]">
            FAQ
          </button>
          <div className="pt-2 border-t border-[#E6E0D6]">
            <button
              onClick={() => { setMobileMenuOpen(false); onInquireClick(); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#FAF8F5] bg-[#231A14] rounded-lg hover:bg-[#3D2C22] transition-colors"
            >
              <span>Get a Quote</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
