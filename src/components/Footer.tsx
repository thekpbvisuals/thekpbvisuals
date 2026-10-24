import React from 'react';

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-[#E6E0D6] bg-[#F1EDE4] py-14 text-xs text-[#6B574A]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-[#E0D8CB]">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/The_KPB_Visuals_-_Business_Logo_8f34506e.jpg"
              alt="The KPB Visuals"
              className="w-10 h-10 rounded-lg object-contain border border-[#DDD5C7] bg-[#FAF8F5] p-0.5"
            />
            <div>
              <div className="text-base font-bold text-[#231A14]">
                The KPB Visuals
              </div>
              <div className="text-[11px] text-[#7A6A5E]">
                Websites & Social Media Content · Philippines
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-[#554539] font-semibold uppercase tracking-wider text-[11px]">
            <button onClick={() => scrollTo('services')} className="hover:text-[#231A14] transition-colors cursor-pointer">
              Services
            </button>
            <button onClick={() => scrollTo('comparator')} className="hover:text-[#231A14] transition-colors cursor-pointer">
              Basic vs. Immersive
            </button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-[#231A14] transition-colors cursor-pointer">
              Pricing
            </button>
            <button onClick={() => scrollTo('maintenance')} className="hover:text-[#231A14] transition-colors cursor-pointer">
              Maintenance
            </button>
            <button onClick={() => scrollTo('portfolio')} className="hover:text-[#231A14] transition-colors cursor-pointer">
              Work
            </button>
            <button onClick={() => scrollTo('faq')} className="hover:text-[#231A14] transition-colors cursor-pointer">
              FAQ
            </button>
            <button onClick={() => scrollTo('contact')} className="hover:text-[#231A14] transition-colors cursor-pointer">
              Contact
            </button>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[#7A6A5E] text-[11px]">
          <div>
            © {new Date().getFullYear()} The KPB Visuals. All rights reserved. Metro Manila, Philippines.
          </div>
          <div className="flex items-center gap-4">
            <span>Hours: Mon–Sat, 9:00 AM – 7:00 PM PHT</span>
            <span aria-hidden="true">·</span>
            <a href="mailto:thekpbvisuals@gmail.com" className="text-[#231A14] font-semibold hover:underline">
              thekpbvisuals@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
