import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onExplorePricing: () => void;
  onExploreComparator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplorePricing, onExploreComparator }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subtle warm ambient particles matching the cream & espresso palette
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const count = Math.min(35, Math.floor(window.innerWidth / 38));
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.6 + 0.8,
      alpha: Math.random() * 0.2 + 0.08,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(35, 26, 20, ${0.07 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(35, 26, 20, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-12 pb-16 overflow-hidden">
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-80"
      />

      {/* Warm ambient glow */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-tr from-[#E8DEC8]/50 via-[#EDE2CE]/30 to-transparent blur-[120px] rounded-full"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full flex-1 flex flex-col justify-center">
        {/* Simple Brand Eyebrow */}
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#735A47] mb-5">
          <span>The KPB Visuals</span>
          <span aria-hidden="true">·</span>
          <span>Philippine Studio</span>
          <span aria-hidden="true">·</span>
          <span>Websites & Social Media</span>
        </div>

        {/* Clean, High-Impact Headline */}
        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#231A14] text-balance leading-[1.12]">
            High-Impact Websites & <br />
            <span className="text-[#6D4930]">Striking Social Media Content.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-[#554539] max-w-2xl leading-relaxed">
            We build mobile-friendly websites and design eye-catching social media posters for growing Philippine businesses. Fast turnaround, zero technical headaches.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={onExplorePricing}
            className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FAF8F5] bg-[#231A14] hover:bg-[#3D2C22] active:scale-98 rounded-lg shadow-sm transition-all duration-150 cursor-pointer whitespace-nowrap"
          >
            View Pricing (From ₱4,999)
          </button>
          <button
            onClick={onExploreComparator}
            className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#231A14] hover:bg-[#EDE7DC] bg-[#FAF8F5] border border-[#DDD5C7] rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap"
          >
            Compare Basic vs. Immersive
          </button>
        </div>

        {/* Showcase Grid: Official Logo Feature + Responsive Visuals */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Logo Card */}
          <div className="md:col-span-4 rounded-2xl border border-[#E0D8CB] bg-[#FAF8F5] p-6 flex flex-col items-center justify-center text-center shadow-xs">
            <img
              src="/assets/aistudio/The_KPB_Visuals_-_Business_Logo_8f34506e.jpg"
              alt="The KPB Visuals Official Logo"
              className="w-44 h-44 object-contain rounded-xl p-2"
            />
            <div className="mt-4">
              <h3 className="text-base font-bold text-[#231A14]">The KPB Visuals</h3>
              <p className="text-xs text-[#6B574A] mt-1 font-medium">
                Official Creative Studio Mark · Manila, Philippines
              </p>
            </div>
          </div>

          {/* Device Showcase Image */}
          <div className="md:col-span-8 rounded-2xl overflow-hidden border border-[#E0D8CB] bg-[#FAF8F5] shadow-xs relative group">
            <div className="relative aspect-[16/9] w-full h-full overflow-hidden bg-[#231A14]">
              <img
                src="/src/assets/images/kpb_hero_showcase_1792733851747.jpg"
                alt="The KPB Visuals website and social content showcase"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#231A14]/85 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-[#EDE7DC]">
                <span className="font-semibold text-white">Full-Stack Digital Output</span>
                <span className="text-[11px] text-[#D4C3B3]">Websites · Posters · Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Simple Trust Points */}
        <div className="mt-12 pt-8 border-t border-[#E4DDD1] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-[#231A14]">3–7 Day Delivery</div>
            <div className="mt-1 text-xs text-[#6B574A]">Fast turnaround so your business launches on time.</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-[#231A14]">50% Kickoff / 50% Launch</div>
            <div className="mt-1 text-xs text-[#6B574A]">Clear milestones with zero hidden surprise fees.</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-[#231A14]">Philippine Payments</div>
            <div className="mt-1 text-xs text-[#6B574A]">GCash, Maya, BDO, BPI, UnionBank, or PayPal.</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider font-bold text-[#231A14]">Zero Code Headache</div>
            <div className="mt-1 text-xs text-[#6B574A]">We handle all setup, hosting, and graphic exports.</div>
          </div>
        </div>
      </div>

      {/* Down indicator */}
      <div className="relative z-10 flex justify-center mt-6">
        <button
          onClick={onExploreComparator}
          aria-label="Scroll down"
          className="text-[#8C7462] hover:text-[#231A14] transition-colors p-2 cursor-pointer"
        >
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
