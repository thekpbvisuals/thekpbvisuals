import React from 'react';
import { MessageSquare, Shield, Code, Palette, Rocket } from 'lucide-react';

export const ProcessSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Free Discovery Chat',
      desc: 'We discuss your business, goals, preferred style, and must-have features on Messenger, Viber, or Email.',
      icon: MessageSquare
    },
    {
      num: '02',
      title: '50% Kickoff Deposit',
      desc: 'Clear scope with zero hidden costs. Settle a 50% downpayment via GCash, Maya, BDO, BPI, or PayPal.',
      icon: Shield
    },
    {
      num: '03',
      title: 'Design & Build',
      desc: 'We craft your mobile-ready website and design your social media posters according to your brand colors.',
      icon: Code
    },
    {
      num: '04',
      title: 'Review & Refine',
      desc: 'You test the private live staging link on your phone and laptop. We fine-tune until it looks perfect.',
      icon: Palette
    },
    {
      num: '05',
      title: 'Live Launch',
      desc: 'Settle the final 50% balance. We connect your custom domain name and hand over all social poster files.',
      icon: Rocket
    }
  ];

  return (
    <section id="services" className="py-24 border-t border-[#E6E0D6] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#735A47] mb-2">
            How We Work
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#231A14] text-balance">
            Simple 5-Step Process
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#554539]">
            Zero technical stress. You focus on running your business, we handle every piece of code and graphic design.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="rounded-2xl border border-[#E0D8CB] bg-[#FAF8F5] p-6 flex flex-col justify-between hover:border-[#231A14] transition-all duration-300 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[#231A14] font-mono text-xs font-black">
                    <span className="text-base text-[#8A6A4E]">{step.num}</span>
                    <Icon className="w-4 h-4 text-[#8A7667]" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#231A14]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#6B574A] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
