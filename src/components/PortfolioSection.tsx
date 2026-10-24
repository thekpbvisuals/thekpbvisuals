import React, { useState } from 'react';
import { PORTFOLIO_ITEMS } from '../data/portfolio';
import { PortfolioItem } from '../types';
import { X, Check, Eye } from 'lucide-react';

export const PortfolioSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'web' | 'posters'>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const filteredItems = PORTFOLIO_ITEMS.filter((item) => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  return (
    <section id="portfolio" className="py-24 border-t border-[#E6E0D6] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#E6E0D6]">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#735A47] mb-2">
              Featured Client Work
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#231A14] text-balance">
              Recent Websites & Social Media Content
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#554539]">
              High-converting landing pages, structured platforms, and promotional social posters for local businesses.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF8F5] border border-[#E0D8CB] rounded-lg self-start md:self-end">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'all' ? 'bg-[#231A14] text-[#FAF8F5]' : 'text-[#6B574A] hover:text-[#231A14]'
              }`}
            >
              All Projects ({PORTFOLIO_ITEMS.length})
            </button>
            <button
              onClick={() => setFilter('web')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'web' ? 'bg-[#231A14] text-[#FAF8F5]' : 'text-[#6B574A] hover:text-[#231A14]'
              }`}
            >
              Websites
            </button>
            <button
              onClick={() => setFilter('posters')}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                filter === 'posters' ? 'bg-[#231A14] text-[#FAF8F5]' : 'text-[#6B574A] hover:text-[#231A14]'
              }`}
            >
              Social Posters
            </button>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group rounded-2xl border border-[#E0D8CB] bg-[#FAF8F5] overflow-hidden flex flex-col justify-between hover:border-[#231A14] transition-all duration-300 cursor-pointer shadow-xs"
            >
              <div>
                {/* Image Container with Fallback */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#231A14]">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#231A14]/70 via-transparent to-transparent opacity-60" />
                  
                  {/* Hover Inspect badge */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-[#231A14] text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm font-semibold">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-[#735A47] mb-2 font-medium">
                    <span className="font-bold text-[#8A6A4E] uppercase tracking-wider">
                      {item.category === 'web' ? 'Website Design' : 'Social Media Content'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.client}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#231A14] group-hover:text-[#6D4930] transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs text-[#6B574A] leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {item.metrics && (
                    <div className="mt-4 pt-4 border-t border-[#E6E0D6] text-xs font-bold text-[#231A14] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8A6A4E]" />
                      <span>{item.metrics}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom tag row */}
              <div className="px-6 pb-6 pt-2 flex flex-wrap gap-2 text-[11px] text-[#7A6A5E]">
                {item.tags.map((tag, i) => (
                  <span key={i} className="bg-[#EFE8DD] text-[#554539] px-2 py-0.5 rounded font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedItem && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-[#FAF8F5] border border-[#DDD5C7] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full bg-[#231A14]">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 p-2 rounded-full bg-[#231A14]/80 text-white hover:bg-[#231A14] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#8A6A4E]">
                  {selectedItem.client}
                </div>
                <h3 className="text-2xl font-black text-[#231A14] mt-1">
                  {selectedItem.title}
                </h3>
              </div>

              <p className="text-sm text-[#554539] leading-relaxed">
                {selectedItem.description}
              </p>

              {selectedItem.metrics && (
                <div className="p-3.5 rounded-xl bg-[#EFE8DD] border border-[#DCD3C5] text-xs text-[#231A14] font-semibold">
                  Outcome: <strong>{selectedItem.metrics}</strong>
                </div>
              )}

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#231A14] mb-2.5">
                  Scope & Deliverables:
                </div>
                <div className="space-y-2">
                  {selectedItem.deliverables.map((del, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#554539]">
                      <Check className="w-4 h-4 text-[#231A14]" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6E0D6] flex items-center justify-between">
                <span className="text-xs text-[#7A6A5E]">
                  Ready to craft something similar?
                </span>
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-[#231A14] hover:bg-[#3D2C22] text-[#FAF8F5] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Start Your Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
