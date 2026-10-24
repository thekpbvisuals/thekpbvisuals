import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do I need any coding knowledge?',
      a: 'None at all. We set up your website, configure your domain, and manage hosting. If you subscribe to our Monthly Maintenance plan, simply message us your text, price, or photo changes and we update it for you.'
    },
    {
      q: 'What is the difference between Basic and Immersive Starter?',
      a: 'Both are complete single-page websites with your services, about info, location, and inquiry form. Basic (₱4,999) has a clean, static layout ready in 3–5 days. Immersive (₱8,999) features smooth scroll animations, custom visual depth, and includes 2 Free custom-designed launch posters ready in 5–7 days.'
    },
    {
      q: 'What is included in the Multi-Page Website (₱14,999)?',
      a: 'Up to 4 custom pages (Home, About, Services/Menu/Catalog, and Contact). It also includes 4 Free custom-designed social media launch posters and full Google Analytics setup.'
    },
    {
      q: 'How does Monthly Maintenance work?',
      a: 'Site Guardian (₱2,499/mo) covers uptime monitoring, security checks, and up to 3 content revisions/mo. Growth Partner (₱4,999/mo) covers full website maintenance PLUS 4 fresh, custom-designed social media posters every month for your Facebook and Instagram.'
    },
    {
      q: 'What are your payment terms and methods?',
      a: '50% downpayment to start, and 50% only after you approve the staging site for launch. We accept GCash, Maya, BDO, BPI, UnionBank, and PayPal.'
    },
    {
      q: 'Can I order social media posters without a website?',
      a: 'Yes! We offer standalone poster bundles: Starter 3-Pack (₱1,499) and Campaign 8-Pack (₱3,499).'
    }
  ];

  return (
    <section id="faq" className="py-24 border-t border-[#E6E0D6] relative">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#735A47] mb-2 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#231A14] text-balance">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-[#554539]">
            Quick answers about our packages, deliverables, and payment terms.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[#E0D8CB] bg-[#FAF8F5] overflow-hidden transition-all duration-150"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F2ECE1]"
                >
                  <span className="font-bold text-sm text-[#231A14]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#231A14] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-[#554539] leading-relaxed border-t border-[#E6E0D6]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
