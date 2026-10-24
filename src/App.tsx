import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';
import { KPB_LOGO_DATA_URL } from './assets/logoBase64';
import { 
  Laptop, 
  Smartphone, 
  Check, 
  ArrowRight, 
  MessageSquare, 
  Clock, 
  ExternalLink, 
  Send, 
  CheckCircle2,
  Sparkles,
  Layers,
  Palette,
  Calculator,
  Copy,
  ChevronDown
} from 'lucide-react';

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  // Scroll-driven animation for Hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  // Scale featured visual smoothly from 0.92 to 1.0 as user scrolls past Hero
  const heroVisualScale = useTransform(scrollYProgress, [0, 1], [0.92, 1.0]);
  // Subtle parallax upward drift for headline text
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Initialize Lenis buttery-smooth inertial scrolling
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Currency state (PHP default, USD supported)
  const [currency, setCurrency] = useState<'PHP' | 'USD'>('PHP');
  
  // Active website tier for sticky split-screen showcase
  const [activeWebsiteTier, setActiveWebsiteTier] = useState<'basic' | 'immersive' | 'multipage'>('basic');

  // Scroll spy to automatically highlight the active website tier on the left sidebar
  useEffect(() => {
    const handleScroll = () => {
      const tiers: ('basic' | 'immersive' | 'multipage')[] = ['basic', 'immersive', 'multipage'];
      const scrollY = window.scrollY;
      const triggerY = scrollY + 220; // Active threshold near pinned sidebar

      for (let i = tiers.length - 1; i >= 0; i--) {
        const el = document.getElementById(`tier-${tiers[i]}`);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollY;
          if (triggerY >= top) {
            setActiveWebsiteTier(tiers[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  // Starter tier toggle in pricing card (basic vs immersive)
  const [starterTier, setStarterTier] = useState<'basic' | 'immersive'>('immersive');

  // Maintenance plan selection in pricing
  const [activeMaintenance, setActiveMaintenance] = useState<'guardian' | 'growth'>('growth');

  // Estimator calculator state
  const [calcWebsite, setCalcWebsite] = useState<'none' | 'starter-basic' | 'starter-immersive' | 'multipage'>('starter-immersive');
  const [calcMaintenance, setCalcMaintenance] = useState<'none' | 'guardian' | 'growth'>('growth');
  const [calcPosters, setCalcPosters] = useState<number>(0);
  const [calcRush, setCalcRush] = useState<boolean>(false);
  const [copiedEstimate, setCopiedEstimate] = useState<boolean>(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Form submission state
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    service: 'starter-immersive',
    timeline: 'standard',
    notes: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Price formatting helper
  const formatPrice = (php: number, usd: number) => {
    if (currency === 'USD') {
      return `$${usd.toLocaleString()}`;
    }
    return `₱${php.toLocaleString()}`;
  };

  // Calculator price tables (Updated: Basic ₱9,999, Immersive ₱12,499, Multi-Page starting ₱17,999)
  const websitePrices = {
    'none': 0,
    'starter-basic': 9999,
    'starter-immersive': 12499,
    'multipage': 17999
  };

  const maintenancePrices = {
    'none': 0,
    'guardian': 999,
    'growth': 1999
  };

  const posterPrices: Record<number, number> = {
    0: 0,
    3: 999,
    6: 1899,
    8: 2499
  };

  const rushFee = 2000;

  const totalOneTimePHP = useMemo(() => {
    let sum = websitePrices[calcWebsite];
    sum += posterPrices[calcPosters] || 0;
    if (calcRush) sum += rushFee;
    return sum;
  }, [calcWebsite, calcPosters, calcRush]);

  const monthlyPHP = maintenancePrices[calcMaintenance];

  const totalOneTimeUSD = Math.round(totalOneTimePHP / 56);
  const monthlyUSD = Math.round(monthlyPHP / 56);

  const quoteSummaryText = useMemo(() => {
    const webName = 
      calcWebsite === 'starter-basic' ? 'Starter Basic Landing Page (₱9,999)' :
      calcWebsite === 'starter-immersive' ? 'Starter Immersive Landing Page (₱12,499)' :
      calcWebsite === 'multipage' ? 'Multi-Page Website (Starting at ₱17,999)' : 'No Website (Posters / Care only)';

    const maintName = 
      calcMaintenance === 'guardian' ? 'Site Guardian (₱999/mo - subject to client requests)' :
      calcMaintenance === 'growth' ? 'Growth Partner + 4 Social Posters (₱1,999/mo - subject to client requests)' : 'None';

    const posterName = calcPosters > 0 ? `${calcPosters} Extra Social Posters (+₱${posterPrices[calcPosters].toLocaleString()})` : 'None';
    const rushName = calcRush ? 'Yes (48–72h Rush +₱2,000)' : 'Standard';

    return `Hi The KPB Visuals! Here is my estimated project plan:
• Website: ${webName}
• Monthly Care: ${maintName}
• Extra Social Posters: ${posterName}
• Delivery Timeline: ${rushName}
• Estimated Total: ₱${totalOneTimePHP.toLocaleString()} one-time ${monthlyPHP > 0 ? `+ ₱${monthlyPHP.toLocaleString()}/mo` : ''}

I would like to discuss kickoff and availability!`;
  }, [calcWebsite, calcMaintenance, calcPosters, calcRush, totalOneTimePHP, monthlyPHP]);

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(quoteSummaryText);
    setCopiedEstimate(true);
    setTimeout(() => setCopiedEstimate(false), 2500);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: -20 });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const scrollToTier = (tier: 'basic' | 'immersive' | 'multipage') => {
    setActiveWebsiteTier(tier);
    const el = document.getElementById(`tier-${tier}`);
    if (el) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(el, { offset: -110 });
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSelectPackage = (serviceKey: string) => {
    setFormData((prev) => ({ ...prev, service: serviceKey }));
    scrollTo('contact');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormSubmitted(true);
  };

  const faqs = [
    {
      q: 'Do I need any coding knowledge to work with you?',
      a: 'None at all! We are not big corporate developers who complicate things. We create simple, clean, and functioning websites and handle all technical setup, domain connecting, and hosting configurations for you.'
    },
    {
      q: 'What is the difference between the Basic and Immersive Starter?',
      a: 'Both packages are complete single-page websites containing your services, about details, and contact inquiry form. The Basic tier (₱9,999) has a clean, static, fast-loading layout ready in 3–5 days. The Immersive tier (₱12,499) includes smooth scroll effects, parallax depth, tailored studio aesthetics, and includes 2 Free custom-designed social media posters ready in 5–7 days.'
    },
    {
      q: 'How does pricing work for the Multi-Page Website?',
      a: 'Multi-page websites start at ₱17,999 for up to 4 custom pages (Home, About/Story, Services/Catalog/Schedules, and Contact/Booking). The price adjusts depending on any additional requested pages or custom features. It includes 4 Free custom-designed launch social media posters, SEO setup, and mobile responsiveness in 7–10 days.'
    },
    {
      q: 'How does Monthly Maintenance & Content Care work?',
      a: 'Site Guardian starts at ₱999/mo (speed audits, uptime monitoring, and up to 3 text/photo updates every month). Digital Growth Partner starts at ₱1,999/mo and includes full website maintenance PLUS 4 fresh, custom-designed promotional posters/flyers every month ready to post on your social pages! Rates are subject to change depending on specific client requests and ongoing workload.'
    },
    {
      q: 'What are your payment terms and accepted methods?',
      a: 'We operate on a transparent 50/50 milestone: 50% downpayment upon kickoff to start the design, and the remaining 50% only when your website is completed, approved on a private staging link, and ready to go live. We accept GCash, Maya, BDO, BPI, UnionBank, and PayPal.'
    },
    {
      q: 'Can I order social media posters without a website?',
      a: 'Yes! We offer standalone poster bundles: our Starter 3-Pack (₱999) and our Campaign 8-Pack (₱2,499).'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2A1E17] font-sans selection:bg-[#E8DCCB] selection:text-[#1F1611] overflow-x-clip">
      {/* Top Simple Announcement */}
      <div className="bg-[#2A1E17] text-[#FBF9F5] text-xs py-2 px-4 text-center font-medium">
        <div className="max-w-5xl mx-auto flex items-center justify-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>Open for new projects • Sites starting at ₱9,999 • 50% kickoff / 50% live launch terms</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-[#E8DFD3] bg-white/95 backdrop-blur-xs sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => {
              if (lenisRef.current) {
                lenisRef.current.scrollTo(0);
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#D9CEBE] bg-[#FBF9F5] p-0.5 shadow-xs">
              <img 
                src={KPB_LOGO_DATA_URL} 
                alt="The KPB Visuals Logo" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <span className="font-extrabold tracking-wider text-base text-[#2A1E17] block leading-none">
                THE KPB VISUALS
              </span>
              <span className="text-[10px] text-[#7C6958] font-medium">Websites & Social Media</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-7 text-xs font-semibold text-[#6E5948] uppercase tracking-wider">
            <button onClick={() => scrollTo('services')} className="hover:text-[#2A1E17] transition-colors cursor-pointer">
              Services
            </button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-[#2A1E17] transition-colors cursor-pointer">
              Packages
            </button>
            <button onClick={() => scrollTo('estimator')} className="hover:text-[#2A1E17] transition-colors cursor-pointer">
              Estimator
            </button>
            <button onClick={() => scrollTo('work')} className="hover:text-[#2A1E17] transition-colors cursor-pointer">
              Sample Work
            </button>
            <button onClick={() => scrollTo('faq')} className="hover:text-[#2A1E17] transition-colors cursor-pointer">
              FAQ
            </button>
          </div>

          <button 
            onClick={() => scrollTo('contact')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors cursor-pointer"
          >
            Send a Message
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header ref={heroRef} className="pt-12 pb-16 px-4 sm:px-6 relative">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          {/* Prominent Official Brand Logo / Featured Visual */}
          <motion.div 
            style={{ scale: heroVisualScale }}
            className="flex justify-center mb-2 origin-center will-change-transform"
          >
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-[#D9CEBE] bg-[#FBF9F5] p-1 shadow-md hover:scale-105 transition-transform duration-300">
              <img 
                src={KPB_LOGO_DATA_URL} 
                alt="The KPB Visuals Official Logo" 
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </motion.div>

          {/* Headline Text with subtle parallax upward drift */}
          <motion.div style={{ y: headlineY }} className="space-y-4 will-change-transform">
            <span className="text-xs font-bold tracking-wide text-[#7C6958] uppercase block">
              The KPB Visuals • Philippine Creative Studio
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F1611] tracking-tight leading-tight">
              Simple, clean websites and social media graphics for your business.
            </h1>

            <p className="text-sm sm:text-base text-[#6E5948] leading-relaxed max-w-xl mx-auto">
              We build clean, fast websites and eye-catching social media graphics for up-and-coming brands and growing small-to-medium businesses.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button 
              onClick={() => scrollTo('contact')} 
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
            >
              <span>Talk About Your Project</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollTo('pricing')} 
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-white text-[#2A1E17] border border-[#D9CEBE] hover:bg-[#F3EDE3] transition-colors cursor-pointer"
            >
              <span>View Packages (From ₱9,999)</span>
            </button>
          </div>

          {/* Simple points */}
          <motion.div 
            style={{ scale: heroVisualScale }}
            className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-8 text-left text-xs text-[#5C4A3C] origin-top will-change-transform"
          >
            <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD3] shadow-xs">
              <span className="font-bold text-[#2A1E17] block mb-0.5">Mobile Friendly</span>
              <span>100% responsive on smartphones, tablets, & laptops.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD3] shadow-xs">
              <span className="font-bold text-[#2A1E17] block mb-0.5">GCash & Bank</span>
              <span>Clear instructions for customers to pay via GCash, Maya, or bank.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD3] shadow-xs">
              <span className="font-bold text-[#2A1E17] block mb-0.5">3 to 10 Days</span>
              <span>Realistic, reliable turnaround to launch without delays.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#E8DFD3] shadow-xs">
              <span className="font-bold text-[#2A1E17] block mb-0.5">Zero Code Stress</span>
              <span>We handle all the tech setup, domain linking, and launch details from start to finish.</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Services Section - Clean & Focused on What We Deliver */}
      <section id="services" className="py-14 px-4 sm:px-6 bg-[#F3EDE3]/40 border-y border-[#E8DFD3]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A68]">Our Core Services</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1611]">What We Create For You</h2>
            <p className="text-xs sm:text-sm text-[#6E5948]">
              Straightforward digital solutions built for everyday business growth without unnecessary complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Service 1: Websites */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2D6C5] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                <Laptop className="w-5 h-5 text-[#8C7A68]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F1611]">Website Creation</h3>
              <p className="text-xs text-[#6E5948] leading-relaxed">
                Clean, mobile-first websites tailored to your brand. Great for everything from a simple single-page site to a full multi-page website with appointment booking.
              </p>
              <ul className="space-y-2 text-xs text-[#5C4A3C]">
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Smooth mobile, tablet, and desktop experience.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Clear service offerings, pricing, & Google Maps.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Payment page showing your GCash QR & bank details.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>One-tap buttons to message you on Facebook or call your phone.</span>
                </li>
              </ul>
            </div>

            {/* Service 2: Social Media Graphics */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2D6C5] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                <Smartphone className="w-5 h-5 text-[#8C7A68]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F1611]">Social Media Graphics</h3>
              <p className="text-xs text-[#6E5948] leading-relaxed">
                Eye-catching, readable graphics for your Facebook page or Instagram feed so your business looks credible, organized, and professional.
              </p>
              <ul className="space-y-2 text-xs text-[#5C4A3C]">
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Class schedules, tournament flyers, or sale posters.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Facebook cover banners & story announcement graphics.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Consistent brand colors and clean, easy-to-read fonts.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>High-resolution exports ready for instant publishing.</span>
                </li>
              </ul>
            </div>

            {/* Service 3: Monthly Maintenance */}
            <div className="p-6 rounded-2xl bg-white border border-[#E2D6C5] space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                <Clock className="w-5 h-5 text-[#8C7A68]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F1611]">Monthly Site Care</h3>
              <p className="text-xs text-[#6E5948] leading-relaxed">
                Hands-off website maintenance. We keep your site fast, secure, and handle text or photo updates whenever your schedules or prices change.
              </p>
              <ul className="space-y-2 text-xs text-[#5C4A3C]">
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Speed audits, uptime checks, and security monitoring.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Schedule & content updates whenever you need them.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Our Growth Plan includes 4 custom social media posters every month.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Direct chat support via Facebook Messenger.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Website Packages & Deliverables Section - Sticky Split-Screen Showcase */}
      <section id="pricing" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Main Sticky Split-Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column (Sticky Desktop - Pins Section Header & Package Selector) */}
            <div className="lg:col-span-5 relative">
              <div className="lg:sticky lg:top-28 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A68]">Transparent Packages</span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F1611] tracking-tight">
                    Website Packages
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6E5948] leading-relaxed">
                    Clean, mobile-first websites tailored to your brand. Choose between streamlined single-page or a full multi-page website, all with simple 50/50 payment terms.
                  </p>
                </div>

                {/* Currency switcher */}
                <div className="flex items-center justify-between p-3 bg-white border border-[#D9CEBE] rounded-xl shadow-2xs">
                  <span className="text-xs font-semibold text-[#5C4A3C]">Display Currency:</span>
                  <div className="flex items-center gap-1 p-0.5 bg-[#FBF9F5] border border-[#E8DFD3] rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCurrency('PHP')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        currency === 'PHP' ? 'bg-[#2A1E17] text-white shadow-xs' : 'text-[#6E5948] hover:text-[#2A1E17]'
                      }`}
                    >
                      PHP (₱)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrency('USD')}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        currency === 'USD' ? 'bg-[#2A1E17] text-white shadow-xs' : 'text-[#6E5948] hover:text-[#2A1E17]'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                </div>

                {/* Interactive Package Selector (Syncs with scroll & allows jump-click) */}
                <div className="space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#8C7A68] flex items-center justify-between">
                    <span>Website Tiers (Click to Jump):</span>
                    <span className="text-[10px] text-[#A39171] font-semibold">
                      Viewing: {activeWebsiteTier === 'basic' ? 'Basic' : activeWebsiteTier === 'immersive' ? 'Immersive' : 'Multi-Page'}
                    </span>
                  </div>

                  {/* Tier 1 Selector Button */}
                  <button
                    type="button"
                    onClick={() => scrollToTier('basic')}
                    className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between group ${
                      activeWebsiteTier === 'basic'
                        ? 'bg-[#2A1E17] text-[#FBF9F5] border-[#2A1E17] shadow-md ring-2 ring-[#2A1E17]/20 scale-[1.01]'
                        : 'bg-white text-[#2A1E17] border-[#E8DFD3] hover:border-[#D9CEBE] hover:bg-[#FDFCFB]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${activeWebsiteTier === 'basic' ? 'bg-emerald-400 animate-pulse' : 'bg-[#D9CEBE]'}`}></span>
                        <span className="font-bold text-sm">Single-Page Basic</span>
                      </div>
                      <span className={`text-[11px] block ${activeWebsiteTier === 'basic' ? 'text-[#D9CEBE]' : 'text-[#7C6958]'}`}>
                        Streamlined all-in-one scroll • 3–5 Days
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-extrabold font-mono tabular-nums block ${activeWebsiteTier === 'basic' ? 'text-[#FBF9F5]' : 'text-[#2A1E17]'}`}>
                        {formatPrice(9999, 179)}
                      </span>
                      <span className={`text-[10px] font-medium ${activeWebsiteTier === 'basic' ? 'text-[#C9BDAF]' : 'text-[#8C7A68]'}`}>one-time</span>
                    </div>
                  </button>

                  {/* Tier 2 Selector Button */}
                  <button
                    type="button"
                    onClick={() => scrollToTier('immersive')}
                    className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between group ${
                      activeWebsiteTier === 'immersive'
                        ? 'bg-[#2A1E17] text-[#FBF9F5] border-[#2A1E17] shadow-md ring-2 ring-[#2A1E17]/20 scale-[1.01]'
                        : 'bg-white text-[#2A1E17] border-[#E8DFD3] hover:border-[#D9CEBE] hover:bg-[#FDFCFB]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${activeWebsiteTier === 'immersive' ? 'bg-amber-400 animate-pulse' : 'bg-[#D9CEBE]'}`}></span>
                        <span className="font-bold text-sm flex items-center gap-1.5">
                          <span>Single-Page Immersive</span>
                          <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
                        </span>
                      </div>
                      <span className={`text-[11px] block ${activeWebsiteTier === 'immersive' ? 'text-[#D9CEBE]' : 'text-[#7C6958]'}`}>
                        Scroll motion + 2 Free Posters • 5–7 Days
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-extrabold font-mono tabular-nums block ${activeWebsiteTier === 'immersive' ? 'text-[#FBF9F5]' : 'text-[#2A1E17]'}`}>
                        {formatPrice(12499, 225)}
                      </span>
                      <span className={`text-[10px] font-medium ${activeWebsiteTier === 'immersive' ? 'text-[#C9BDAF]' : 'text-[#8C7A68]'}`}>one-time</span>
                    </div>
                  </button>

                  {/* Tier 3 Selector Button */}
                  <button
                    type="button"
                    onClick={() => scrollToTier('multipage')}
                    className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between group ${
                      activeWebsiteTier === 'multipage'
                        ? 'bg-[#2A1E17] text-[#FBF9F5] border-[#2A1E17] shadow-md ring-2 ring-[#2A1E17]/20 scale-[1.01]'
                        : 'bg-white text-[#2A1E17] border-[#E8DFD3] hover:border-[#D9CEBE] hover:bg-[#FDFCFB]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${activeWebsiteTier === 'multipage' ? 'bg-blue-400 animate-pulse' : 'bg-[#D9CEBE]'}`}></span>
                        <span className="font-bold text-sm flex items-center gap-1.5">
                          <span>Multi-Page Website</span>
                          <Layers className="w-3.5 h-3.5 text-[#E6C687]" />
                        </span>
                      </div>
                      <span className={`text-[11px] block ${activeWebsiteTier === 'multipage' ? 'text-[#D9CEBE]' : 'text-[#7C6958]'}`}>
                        Up to 4 Pages + 4 Free Posters • 7–10 Days
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-base font-extrabold font-mono tabular-nums block ${activeWebsiteTier === 'multipage' ? 'text-[#FBF9F5]' : 'text-[#2A1E17]'}`}>
                        Starts {formatPrice(17999, 320)}
                      </span>
                      <span className={`text-[10px] font-medium ${activeWebsiteTier === 'multipage' ? 'text-[#C9BDAF]' : 'text-[#8C7A68]'}`}>one-time</span>
                    </div>
                  </button>
                </div>

                {/* Honest Milestone & Fast Inquiry Box */}
                <div className="p-4 rounded-2xl bg-[#F6F1E9] border border-[#E2D6C5] space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#2A1E17]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>50% Kickoff / 50% Launch Milestone</span>
                  </div>
                  <p className="text-[11px] text-[#6E5948] leading-relaxed">
                    50% downpayment upon kickoff to begin the design. The remaining 50% only when your website is completed, approved on private staging, and ready to launch.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectPackage(
                      activeWebsiteTier === 'basic' ? 'starter-basic' :
                      activeWebsiteTier === 'immersive' ? 'starter-immersive' : 'multipage'
                    )}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <span>Inquire About {
                      activeWebsiteTier === 'basic' ? 'Basic (₱9,999)' :
                      activeWebsiteTier === 'immersive' ? 'Immersive (₱12,499)' : 'Multi-Page (Starts ₱17,999)'
                    }</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column (Stacked Large Visual Cards with Scroll-Triggered Transitions) */}
            <div className="lg:col-span-7 space-y-12 sm:space-y-16">
              {/* Card 1: Single-Page Basic */}
              <motion.div
                id="tier-basic"
                initial={{ opacity: 0.6, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl bg-white border border-[#D9CEBE] p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Visual Mockup Header Bar */}
                <div className="rounded-xl border border-[#E8DFD3] bg-[#FBF9F5] p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="text-[11px] font-mono text-[#7C6958] ml-2">thekpbvisuals.com/single-page-basic</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#5C4A3C] bg-white px-2 py-0.5 rounded border border-[#E2D6C5] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8C7A68]" />
                      <span>3–5 Days Turnaround</span>
                    </span>
                  </div>

                  {/* Visual Wireframe Preview Layout */}
                  <div className="p-3 bg-white rounded-lg border border-[#EFE8DD] grid grid-cols-12 gap-2 text-[10px] text-[#7C6958]">
                    <div className="col-span-12 p-2 bg-[#F6F2EB] rounded text-center font-bold text-[#2A1E17]">
                      Hero Section • Brand Identity • Direct Contact Action
                    </div>
                    <div className="col-span-8 p-2 bg-[#FBF9F5] rounded border border-dashed border-[#DDD1BE]">
                      Core Offerings & Pricing Matrix
                    </div>
                    <div className="col-span-4 p-2 bg-[#FBF9F5] rounded border border-dashed border-[#DDD1BE] text-center">
                      GCash QR & Bank
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider block">Starter Tier</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Clean & High-Converting
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F1611]">
                    Single-Page Basic
                  </h3>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#2A1E17] font-mono tabular-nums">
                      {formatPrice(9999, 179)}
                    </span>
                    <span className="text-xs text-[#7C6958] font-medium">one-time investment</span>
                  </div>

                  {/* 50/50 breakdown chip */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F5EE] border border-[#E8DFD3] text-xs text-[#5C4A3C]">
                    <span className="font-semibold text-[#2A1E17]">Milestone:</span>
                    <span>50% Kickoff ({formatPrice(4999.5, 89.5)})</span>
                    <span>•</span>
                    <span>50% Live Approval ({formatPrice(4999.5, 89.5)})</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#6E5948] leading-relaxed">
                    Everything your customers need on one clean, fast-loading page. Easy for customers to browse, view your services, and contact you directly.
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2.5 pt-4 border-t border-[#F2ECE1]">
                  <span className="text-xs font-bold text-[#2A1E17] block uppercase tracking-wider">
                    What You Get in Single-Page Basic:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#5C4A3C]">
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Single-page all-in-one scroll layout</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>100% mobile friendly on phones & tablets</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Contact form & direct Messenger links</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>GCash & bank transfer payment details</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Zero code stress: hosting & domain setup</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Realistic 3–5 day turnaround to launch</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPackage('starter-basic')}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <span>Inquire About Basic ({formatPrice(9999, 179)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcWebsite('starter-basic');
                      scrollTo('estimator');
                    }}
                    className="py-3 px-4 rounded-xl text-xs font-bold bg-[#FBF9F5] border border-[#D9CEBE] text-[#2A1E17] hover:bg-[#EFE8DD] transition-colors cursor-pointer"
                  >
                    <span>Calculate in Estimator</span>
                  </button>
                </div>
              </motion.div>

              {/* Card 2: Single-Page Immersive */}
              <motion.div
                id="tier-immersive"
                initial={{ opacity: 0.6, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl bg-white border-2 border-[#2A1E17] p-6 sm:p-8 space-y-6 shadow-md relative overflow-hidden"
              >
                {/* Visual Mockup Header Bar with Motion Cues */}
                <div className="rounded-xl border border-[#D9CEBE] bg-[#FBF9F5] p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="text-[11px] font-mono text-[#7C6958] ml-2">thekpbvisuals.com/single-page-immersive</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#A39171] bg-[#F3EDE3] px-2.5 py-0.5 rounded border border-[#D9CEBE] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>5–7 Days • 2 Free Posters</span>
                    </span>
                  </div>

                  {/* Visual Wireframe Preview Layout with motion indicator */}
                  <div className="p-3 bg-white rounded-lg border border-[#EFE8DD] space-y-2 text-[10px] text-[#7C6958]">
                    <div className="p-2 bg-[#2A1E17] text-[#FBF9F5] rounded text-center font-bold flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
                      <span>Scroll-Driven Motion & Smooth Parallax Visuals</span>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-7 p-2 bg-[#FBF9F5] rounded border border-dashed border-[#DDD1BE]">
                        Interactive Product/Service Showcase
                      </div>
                      <div className="col-span-5 p-2 bg-emerald-50 text-emerald-800 rounded font-semibold text-center border border-emerald-200">
                        🎁 2 Free Launch Posters
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A39171] uppercase tracking-wider block">Enhanced Studio Tier</span>
                    <span className="text-[11px] font-bold text-[#2A1E17] bg-[#F3EDE3] px-2 py-0.5 rounded border border-[#D9CEBE]">
                      ★ Most Popular Choice
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F1611] flex items-center gap-2">
                    <span>Single-Page Immersive</span>
                    <Sparkles className="w-5 h-5 text-[#A39171]" />
                  </h3>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#2A1E17] font-mono tabular-nums">
                      {formatPrice(12499, 225)}
                    </span>
                    <span className="text-xs text-[#7C6958] font-medium">one-time investment</span>
                  </div>

                  {/* 50/50 breakdown chip */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F5EE] border border-[#E8DFD3] text-xs text-[#5C4A3C]">
                    <span className="font-semibold text-[#2A1E17]">Milestone:</span>
                    <span>50% Kickoff ({formatPrice(6249.5, 112.5)})</span>
                    <span>•</span>
                    <span>50% Live Approval ({formatPrice(6249.5, 112.5)})</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#6E5948] leading-relaxed">
                    A modern single-page site with smooth scrolling animations, custom styling, and 2 free social media launch posters.
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2.5 pt-4 border-t border-[#F2ECE1]">
                  <span className="text-xs font-bold text-[#2A1E17] block uppercase tracking-wider">
                    Everything in Basic Plus:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#5C4A3C]">
                    <div className="flex items-start space-x-2 font-semibold text-[#2A1E17]">
                      <Sparkles className="w-3.5 h-3.5 text-[#A39171] mt-0.5 shrink-0" />
                      <span>Scroll motion & parallax depth cues</span>
                    </div>
                    <div className="flex items-start space-x-2 font-semibold text-[#2A1E17]">
                      <Sparkles className="w-3.5 h-3.5 text-[#A39171] mt-0.5 shrink-0" />
                      <span>2 Free Custom Social Media Posters</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Bespoke styling and refined typography</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Dedicated payment section for your GCash QR, bank details, and proof of payment instructions.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Full responsive layout for all mobile screens</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>5–7 business days turnaround</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPackage('starter-immersive')}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <span>Inquire About Immersive ({formatPrice(12499, 225)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcWebsite('starter-immersive');
                      scrollTo('estimator');
                    }}
                    className="py-3 px-4 rounded-xl text-xs font-bold bg-[#FBF9F5] border border-[#D9CEBE] text-[#2A1E17] hover:bg-[#EFE8DD] transition-colors cursor-pointer"
                  >
                    <span>Calculate in Estimator</span>
                  </button>
                </div>
              </motion.div>

              {/* Card 3: Multi-Page Website */}
              <motion.div
                id="tier-multipage"
                initial={{ opacity: 0.6, scale: 0.94 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-3xl bg-white border border-[#D9CEBE] p-6 sm:p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Visual Mockup Header Bar with Multi-Page Tabs */}
                <div className="rounded-xl border border-[#E8DFD3] bg-[#FBF9F5] p-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      <span className="text-[11px] font-mono text-[#7C6958] ml-2">thekpbvisuals.com/multi-page-hub</span>
                    </div>
                    <span className="text-[11px] font-semibold text-[#5C4A3C] bg-white px-2 py-0.5 rounded border border-[#E2D6C5] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8C7A68]" />
                      <span>7–10 Days • Up to 4 Pages</span>
                    </span>
                  </div>

                  {/* Multi-Tab navigation preview */}
                  <div className="p-2.5 bg-white rounded-lg border border-[#EFE8DD] space-y-2 text-[10px]">
                    <div className="flex items-center space-x-1 border-b border-[#F2ECE1] pb-2">
                      <span className="px-2.5 py-1 rounded bg-[#2A1E17] text-white font-bold">Home</span>
                      <span className="px-2.5 py-1 rounded bg-[#FBF9F5] text-[#6E5948] font-medium border border-[#E8DFD3]">About / Story</span>
                      <span className="px-2.5 py-1 rounded bg-[#FBF9F5] text-[#6E5948] font-medium border border-[#E8DFD3]">Services / Catalog</span>
                      <span className="px-2.5 py-1 rounded bg-[#FBF9F5] text-[#6E5948] font-medium border border-[#E8DFD3]">Contact</span>
                    </div>
                    <div className="flex items-center justify-between text-[#7C6958] px-1">
                      <span>Structured Architecture & Navigation Menu</span>
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        🎁 4 Free Posters Included!
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A39171] uppercase tracking-wider block">Comprehensive Platform</span>
                    <span className="text-[11px] font-semibold text-[#2A1E17] bg-[#F3EDE3] px-2 py-0.5 rounded border border-[#D9CEBE] flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      <span>Up to 4 Custom Pages</span>
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F1611]">
                    Multi-Page Website
                  </h3>

                  <div className="flex items-baseline space-x-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#2A1E17] font-mono tabular-nums">
                      Starts at {formatPrice(17999, 320)}
                    </span>
                    <span className="text-xs text-[#7C6958] font-medium">one-time starting offer</span>
                  </div>

                  <p className="text-[11px] text-[#8C7A68] font-medium">
                    *Starting price; will adjust depending on specific client requests and total pages required.
                  </p>

                  {/* 50/50 breakdown chip */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F5EE] border border-[#E8DFD3] text-xs text-[#5C4A3C]">
                    <span className="font-semibold text-[#2A1E17]">Milestone:</span>
                    <span>50% Kickoff (~{formatPrice(8999.5, 160)})</span>
                    <span>•</span>
                    <span>50% Live Approval (~{formatPrice(8999.5, 160)})</span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#6E5948] leading-relaxed">
                    For businesses, academies, clinics, or coaches needing structured depth: Home, About/Story, Services/Catalog, and Contact.
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-2.5 pt-4 border-t border-[#F2ECE1]">
                  <span className="text-xs font-bold text-[#2A1E17] block uppercase tracking-wider">
                    What You Get in Multi-Page Website:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#5C4A3C]">
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Up to 4 custom pages (Home + 3 dedicated pages)</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Services / class schedules / catalog menu</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>GCash / bank payment details & reference flow</span>
                    </div>
                    <div className="flex items-start space-x-2 font-semibold text-[#2A1E17]">
                      <Sparkles className="w-3.5 h-3.5 text-[#A39171] mt-0.5 shrink-0" />
                      <span>Includes 4 Free Custom Social Media Posters</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Complete technical setup, hosting & domain linking</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>7–10 days turnaround with thorough staging review</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPackage('multipage')}
                    className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <span>Inquire About Multi-Page (Starts {formatPrice(17999, 320)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcWebsite('multipage');
                      scrollTo('estimator');
                    }}
                    className="py-3 px-4 rounded-xl text-xs font-bold bg-[#FBF9F5] border border-[#D9CEBE] text-[#2A1E17] hover:bg-[#EFE8DD] transition-colors cursor-pointer"
                  >
                    <span>Calculate in Estimator</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Complementary Services: Monthly Maintenance & Social Posters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#E8DFD3]">
            {/* Monthly Maintenance & Content Care */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D6C5] flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#8C7A68] uppercase block">Monthly Maintenance and Design</span>

                <div className="p-1 bg-[#FBF9F5] border border-[#E8DFD3] rounded-lg flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveMaintenance('guardian')}
                    className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      activeMaintenance === 'guardian' ? 'bg-[#2A1E17] text-white' : 'text-[#6E5948] hover:text-[#2A1E17]'
                    }`}
                  >
                    Site Guardian
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMaintenance('growth')}
                    className={`flex-1 py-1.5 px-2 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      activeMaintenance === 'growth' ? 'bg-[#2A1E17] text-white' : 'text-[#6E5948] hover:text-[#2A1E17]'
                    }`}
                  >
                    Web + 4 Posters
                  </button>
                </div>

                <h3 className="text-xl font-bold text-[#1F1611]">
                  {activeMaintenance === 'guardian' ? 'Site Guardian' : 'Growth Partner (Web + Posters)'}
                </h3>

                <div>
                  <span className="text-2xl font-bold text-[#2A1E17] tabular-nums">
                    {activeMaintenance === 'guardian' ? formatPrice(999, 18) : formatPrice(1999, 36)}
                  </span>
                  <span className="text-xs text-[#7C6958] ml-1">/ month</span>
                  <p className="text-[11px] text-[#8C7A68] mt-1 font-medium">
                    *Starting rate; subject to change depending on client requests.
                  </p>
                </div>

                <p className="text-xs text-[#6E5948] leading-relaxed">
                  {activeMaintenance === 'guardian'
                    ? 'Speed, security, uptime checks, and up to 3 text/photo revisions every month.'
                    : 'Full website care PLUS 4 fresh, custom-designed social media posters designed every month!'}
                </p>

                <ul className="space-y-2 text-xs text-[#5C4A3C] pt-2 border-t border-[#F2ECE1]">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Regular text, schedule, and photo updates (up to 4 update requests per month)</span>
                  </li>
                  {activeMaintenance === 'growth' ? (
                    <li className="flex items-center space-x-2 font-semibold text-[#2A1E17]">
                      <Sparkles className="w-3.5 h-3.5 text-[#A39171] shrink-0" />
                      <span>Complete website care plus 4 fresh, custom social media posters every month.</span>
                    </li>
                  ) : (
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Up to 3 minor site revisions/month</span>
                    </li>
                  )}
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Direct messaging whenever you have questions</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPackage(`maintenance-${activeMaintenance}`)}
                className="w-full py-2.5 rounded-lg text-xs font-semibold text-center bg-[#FBF9F5] border border-[#D9CEBE] text-[#2A1E17] hover:bg-[#2A1E17] hover:text-white transition-colors cursor-pointer"
              >
                Inquire About {activeMaintenance === 'guardian' ? 'Site Guardian (Starts ₱999)' : 'Growth Partner (Starts ₱1,999)'}
              </button>
            </div>

            {/* Standalone Social Media Poster Bundles */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#D9CEBE] flex flex-col justify-between space-y-4 shadow-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#8C7A68]">
                  <Palette className="w-4 h-4 text-[#8C7A68]" />
                  <span>Standalone Graphic Design</span>
                </div>
                <h3 className="text-xl font-bold text-[#1F1611]">Social Media Poster Bundles</h3>
                <p className="text-xs text-[#6E5948] leading-relaxed">
                  Need eye-catching, ready-to-post graphics without getting a website? We craft tailored promos, event flyers, tournament graphics, or announcements.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#FBF9F5] border border-[#E8DFD3] rounded-xl text-center">
                    <span className="text-xs font-bold text-[#2A1E17] block">Starter 3-Pack</span>
                    <span className="text-lg font-black text-[#2A1E17] font-mono block mt-0.5">₱999</span>
                    <span className="text-[10px] text-[#7C6958]">₱333 per poster</span>
                  </div>
                  <div className="p-3 bg-[#FBF9F5] border border-[#E8DFD3] rounded-xl text-center">
                    <span className="text-xs font-bold text-[#2A1E17] block">Campaign 8-Pack</span>
                    <span className="text-lg font-black text-[#2A1E17] font-mono block mt-0.5">₱2,499</span>
                    <span className="text-[10px] text-[#7C6958]">₱312 per poster</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-[#5C4A3C] pt-2 border-t border-[#F2ECE1]">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Sized perfectly for Facebook, Instagram, Messenger, and TikTok.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>High-resolution exports in PNG/JPEG</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Includes 2 revision rounds per poster</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPackage('posters-starter')}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-[#FBF9F5] border border-[#D9CEBE] text-[#2A1E17] hover:bg-[#EFE8DD] transition-colors cursor-pointer text-center"
                >
                  Order 3-Pack (₱999)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectPackage('posters-campaign')}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold bg-[#2A1E17] text-white hover:bg-[#3E2D23] transition-colors cursor-pointer text-center"
                >
                  Order 8-Pack (₱2,499)
                </button>
              </div>
            </div>
          </div>

          {/* Honest Note About Domain and Hosting */}
          <div className="p-5 rounded-2xl bg-white border border-[#D9CEBE] text-xs text-[#6E5948] space-y-1.5 shadow-2xs">
            <strong className="text-[#2A1E17] block text-sm">A quick note on domains and hosting:</strong>
            <p className="leading-relaxed">
              Our package prices cover the complete design, build, and setup of your website. We host and manage your website files on our fast servers so you never have to deal with code or monthly hosting fees. The only thing you pay for directly is your custom domain name (like yourbusiness.com via Namecheap or Cloudflare, usually around ₱600–₱900/year). We'll help you set it up so you own your domain name 100%, with zero lock-in.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Project Cost Estimator & Quote Generator */}
      <section id="estimator" className="py-14 px-4 sm:px-6 bg-[#F3EDE3]/40 border-t border-[#E8DFD3]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C7A68]">
              <Calculator className="w-4 h-4 text-[#8C7A68]" />
              <span>Interactive Estimator</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1611]">Customize Your Project & Get an Instant Estimate</h2>
            <p className="text-xs sm:text-sm text-[#6E5948]">
              Select what your business needs to calculate your exact one-time investment and optional monthly maintenance plan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Controls */}
            <div className="md:col-span-7 space-y-5">
              {/* Step 1: Website */}
              <div className="p-5 rounded-2xl bg-white border border-[#D9CEBE] space-y-3 shadow-xs">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">
                  1. Choose Website Architecture
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCalcWebsite('starter-basic')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      calcWebsite === 'starter-basic'
                        ? 'border-[#2A1E17] bg-[#FBF9F5] shadow-xs'
                        : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#2A1E17]">Starter: Basic</span>
                      <span className="font-mono text-xs font-bold text-[#8C7A68]">{formatPrice(9999, 179)}</span>
                    </div>
                    <p className="text-[11px] text-[#6E5948] mt-1">Single page, static clean layout, 3–5 days.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcWebsite('starter-immersive')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      calcWebsite === 'starter-immersive'
                        ? 'border-[#2A1E17] bg-[#FBF9F5] shadow-xs'
                        : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#2A1E17] flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#A39171]" />
                        Starter: Immersive
                      </span>
                      <span className="font-mono text-xs font-bold text-[#8C7A68]">{formatPrice(12499, 225)}</span>
                    </div>
                    <p className="text-[11px] text-[#6E5948] mt-1">Scroll motion + 2 Free Launch Posters.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcWebsite('multipage')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      calcWebsite === 'multipage'
                        ? 'border-[#2A1E17] bg-[#FBF9F5] shadow-xs'
                        : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#2A1E17]">Multi-Page Website</span>
                      <span className="font-mono text-xs font-bold text-[#8C7A68]">Starts {formatPrice(17999, 320)}</span>
                    </div>
                    <p className="text-[11px] text-[#6E5948] mt-1">Home + 3 pages + 4 Free Launch Posters.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcWebsite('none')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      calcWebsite === 'none'
                        ? 'border-[#2A1E17] bg-[#FBF9F5] shadow-xs'
                        : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-[#2A1E17]">No Website Needed</span>
                      <span className="font-mono text-xs text-[#7C6958]">{formatPrice(0, 0)}</span>
                    </div>
                    <p className="text-[11px] text-[#6E5948] mt-1">I only need posters or monthly care.</p>
                  </button>
                </div>
              </div>

              {/* Step 2: Monthly Care */}
              <div className="p-5 rounded-2xl bg-white border border-[#D9CEBE] space-y-3 shadow-xs">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">
                  2. Monthly Maintenance & Content Care (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCalcMaintenance('none')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      calcMaintenance === 'none' ? 'border-[#2A1E17] bg-[#FBF9F5]' : 'border-[#E8DFD3]'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#2A1E17] block">No Monthly Care</span>
                    <span className="text-[10px] text-[#7C6958]">One-time delivery only</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcMaintenance('guardian')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      calcMaintenance === 'guardian' ? 'border-[#2A1E17] bg-[#FBF9F5]' : 'border-[#E8DFD3]'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#2A1E17] block">Site Guardian</span>
                    <span className="font-mono text-xs font-bold text-[#8C7A68] block">Starts {formatPrice(999, 18)}/mo</span>
                    <span className="text-[10px] text-[#7C6958]">Speed, uptime, 3 updates*</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcMaintenance('growth')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      calcMaintenance === 'growth' ? 'border-[#2A1E17] bg-[#FBF9F5]' : 'border-[#E8DFD3]'
                    }`}
                  >
                    <span className="font-bold text-xs text-[#2A1E17] block">Growth Partner</span>
                    <span className="font-mono text-xs font-bold text-[#8C7A68] block">Starts {formatPrice(1999, 36)}/mo</span>
                    <span className="text-[10px] text-[#A39171] font-semibold">Web care + 4 Posters/mo*</span>
                  </button>
                </div>
                <p className="text-[10px] text-[#8C7A68] italic">
                  *Monthly care rates are starting estimates; subject to change depending on client requests.
                </p>
              </div>

              {/* Step 3: Social Media Posters */}
              <div className="p-5 rounded-2xl bg-white border border-[#D9CEBE] space-y-3 shadow-xs">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">
                  3. Extra Social Media Posters / Flyers
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { count: 0, label: 'None', price: 0 },
                    { count: 3, label: '3 Posters', price: 999 },
                    { count: 6, label: '6 Posters', price: 1899 },
                    { count: 8, label: '8 Posters', price: 2499 }
                  ].map((item) => (
                    <button
                      key={item.count}
                      type="button"
                      onClick={() => setCalcPosters(item.count)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        calcPosters === item.count ? 'border-[#2A1E17] bg-[#FBF9F5]' : 'border-[#E8DFD3]'
                      }`}
                    >
                      <span className="font-bold text-xs text-[#2A1E17] block">{item.label}</span>
                      <span className="font-mono text-[11px] text-[#8C7A68] block mt-0.5">
                        {item.price === 0 ? '₱0' : `+${formatPrice(item.price, Math.round(item.price / 56))}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Rush option */}
              <div className="p-4 rounded-xl bg-white border border-[#D9CEBE] flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-xs font-bold text-[#2A1E17]">Expedited Rush Delivery (48–72 Hours)</div>
                  <div className="text-[11px] text-[#7C6958]">Priority queue for upcoming campaign launches.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setCalcRush(!calcRush)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer ${
                    calcRush ? 'bg-[#2A1E17] text-[#FBF9F5]' : 'bg-[#F3EDE3] text-[#2A1E17] hover:bg-[#E8DFD3]'
                  }`}
                >
                  {calcRush ? `Added (+${formatPrice(2000, 36)})` : `Add +${formatPrice(2000, 36)}`}
                </button>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="md:col-span-5 sticky top-20 rounded-2xl bg-white border-2 border-[#2A1E17] p-6 space-y-4 shadow-sm">
              <span className="text-xs font-bold text-[#A39171] uppercase tracking-wider block">
                Itemized Estimate Summary
              </span>

              <div className="space-y-3 py-3 border-y border-[#F2ECE1] text-xs">
                <div className="flex justify-between items-center text-[#5C4A3C]">
                  <span>Website Base:</span>
                  <span className="font-mono font-bold text-[#2A1E17]">
                    {formatPrice(websitePrices[calcWebsite], Math.round(websitePrices[calcWebsite] / 56))}
                  </span>
                </div>

                {calcPosters > 0 && (
                  <div className="flex justify-between items-center text-[#5C4A3C]">
                    <span>{calcPosters} Extra Social Posters:</span>
                    <span className="font-mono font-bold text-[#2A1E17]">
                      {formatPrice(posterPrices[calcPosters], Math.round(posterPrices[calcPosters] / 56))}
                    </span>
                  </div>
                )}

                {calcRush && (
                  <div className="flex justify-between items-center text-[#5C4A3C]">
                    <span>Rush Expedited Service:</span>
                    <span className="font-mono font-bold text-[#2A1E17]">
                      {formatPrice(rushFee, 36)}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#F2ECE1] flex justify-between items-baseline">
                  <span className="font-bold text-[#2A1E17]">One-Time Total:</span>
                  <span className="text-2xl font-black text-[#2A1E17] font-mono tabular-nums">
                    {formatPrice(totalOneTimePHP, totalOneTimeUSD)}
                  </span>
                </div>

                {monthlyPHP > 0 && (
                  <div className="p-3 rounded-lg bg-[#FBF9F5] border border-[#E8DFD3] flex justify-between items-center">
                    <div>
                      <span className="font-bold text-[#2A1E17] block">Monthly Care Plan:</span>
                      <span className="text-[11px] text-[#7C6958]">
                        {calcMaintenance === 'guardian' ? 'Site Guardian' : 'Growth (Site + 4 Posters/mo)'}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-[#2A1E17] text-base">
                      {formatPrice(monthlyPHP, monthlyUSD)}/mo
                    </span>
                  </div>
                )}
              </div>

              <div className="text-[11px] text-[#7C6958] space-y-1">
                <div>• 50% Kickoff Deposit (₱{Math.round(totalOneTimePHP / 2).toLocaleString()}) to begin</div>
                <div>• 50% Remaining only upon your approval & live domain launch</div>
                <div>• Accepted: GCash, Maya, BDO, BPI, UnionBank, PayPal</div>
              </div>

              <div className="pt-2 space-y-2">
                <a
                  href="https://www.facebook.com/p.kxts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg bg-[#0084FF] hover:bg-[#0073e6] text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send via Facebook Messenger</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#F3EDE3] hover:bg-[#E8DFD3] text-[#2A1E17] font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  {copiedEstimate ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEstimate ? 'Copied to Clipboard!' : 'Copy Quote for Messenger / Notes'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, notes: quoteSummaryText }));
                    scrollTo('contact');
                  }}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#2A1E17] hover:bg-[#3E2D23] text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Use This Estimate in Form Below</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Work Section - Client Proof (Unique & Distinct) */}
      <section id="work" className="py-14 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A68]">Client Proof</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1611]">Featured Real Projects</h2>
            <p className="text-xs sm:text-sm text-[#6E5948]">
              Here is an example of what we build for local Philippine coaches, academies, and business brands.
            </p>
          </div>

          {/* Project 1: Ongoing Project Showcase */}
          <div className="rounded-2xl bg-white border border-[#D9CEBE] overflow-hidden shadow-sm">
            {/* Window title bar */}
            <div className="px-4 sm:px-6 py-3 bg-[#F6F2EB] border-b border-[#E8DFD3] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E57373]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#81C784]/80"></span>
                </div>
                <span className="text-xs font-semibold text-[#5C4A3C] ml-2">
                  Ongoing Project — Merilles Chess Academy
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#2A1E17] text-[#FBF9F5]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                In Development
              </span>
            </div>

            {/* Actual ongoing website preview image */}
            <div className="w-full bg-[#071931]">
              <img
                src="/assets/aistudio/image_83f664db.png"
                alt="Ongoing Project: Merilles Chess Academy Website Preview"
                className="w-full h-auto block object-cover"
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-14 px-4 sm:px-6 bg-[#F3EDE3]/40 border-t border-[#E8DFD3]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1 text-center">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A68]">Clear Answers</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F1611]">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-[#6E5948]">
              Everything you need to know about how we work, deliver, and support your business.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-xl border border-[#D9CEBE] bg-white overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FBF9F5]"
                  >
                    <span className="font-bold text-xs sm:text-sm text-[#2A1E17]">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#2A1E17] shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-[#6E5948] leading-relaxed border-t border-[#F2ECE1]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-14 px-4 sm:px-6 bg-[#2A1E17] text-[#FBF9F5]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs uppercase font-bold tracking-wider text-[#D8C3A5]">Get In Touch</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Let's Talk About Your Project</h2>
            <p className="text-xs sm:text-sm text-[#D8C3A5]/80">
              Feel free to message me on Facebook Messenger or send an email inquiry below.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 bg-[#1F1611] p-6 sm:p-8 rounded-2xl border border-[#483323]">
            {/* Contact links */}
            <div className="md:col-span-2 space-y-5">
              <div>
                <h4 className="font-bold text-white text-base">The KPB Visuals</h4>
                <p className="text-xs text-[#baa89a]">Websites & Social Media Graphics</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[#baa89a] block text-[11px]">Facebook Messenger:</span>
                  <a 
                    href="https://www.facebook.com/p.kxts/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-amber-300 hover:underline font-medium inline-flex items-center space-x-1 mt-0.5"
                  >
                    <span>facebook.com/p.kxts</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div>
                  <span className="text-[#baa89a] block text-[11px]">Email:</span>
                  <a href="mailto:thekpbvisuals@gmail.com" className="text-white hover:underline font-medium">
                    thekpbvisuals@gmail.com
                  </a>
                </div>

                <div>
                  <span className="text-[#baa89a] block text-[11px]">Turnaround:</span>
                  <span className="text-white">3 to 10 days depending on package</span>
                </div>
              </div>

              <a 
                href="https://www.facebook.com/p.kxts/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-2.5 px-3 rounded-lg bg-[#0084FF] hover:bg-[#0073e6] text-white font-semibold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Me on Facebook</span>
              </a>
            </div>

            {/* Simple Form */}
            <div className="md:col-span-3">
              {formSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#2A1E17] rounded-xl border border-emerald-500/30 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  <h4 className="font-bold text-white text-sm">Message Sent!</h4>
                  <p className="text-xs text-[#d8c3a5]">
                    Thanks, <strong>{formData.name}</strong>. I received your note regarding <strong>{formData.service}</strong> and will get back to you soon. You can also message me anytime on Facebook!
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="mt-3 px-4 py-2 bg-[#FBF9F5] text-[#2A1E17] text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Submit Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#d8c3a5]">Your Name *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your name"
                        className="w-full px-3 py-2 rounded-lg bg-[#2A1E17] border border-[#483323] text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#d8c3a5]">Business / Brand Name</label>
                      <input 
                        type="text" 
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        placeholder="What is your business?"
                        className="w-full px-3 py-2 rounded-lg bg-[#2A1E17] border border-[#483323] text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#d8c3a5]">Email *</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        className="w-full px-3 py-2 rounded-lg bg-[#2A1E17] border border-[#483323] text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#d8c3a5]">Mobile Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="09XX-XXX-XXXX"
                        className="w-full px-3 py-2 rounded-lg bg-[#2A1E17] border border-[#483323] text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] text-[#d8c3a5]">Select Package</label>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-[#2A1E17] border border-[#483323] text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="starter-basic">Starter: Basic Landing Page (₱9,999)</option>
                        <option value="starter-immersive">Starter: Immersive Experience (₱12,499)</option>
                        <option value="multipage">Multi-Page Website (Starts at ₱17,999)</option>
                        <option value="maintenance-guardian">Monthly: Site Guardian (Starts at ₱999/mo - subject to request)</option>
                        <option value="maintenance-growth">Monthly: Growth Partner (Web + 4 Posters) (Starts at ₱1,999/mo - subject to request)</option>
                        <option value="posters-starter">Social Media: Starter 3-Pack (₱999)</option>
                        <option value="posters-campaign">Social Media: Campaign 8-Pack (₱2,499)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-[#d8c3a5]">Launch Timeline</label>
                      <select 
                        value={formData.timeline}
                        onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg bg-[#2A1E17] border border-[#483323] text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                      >
                        <option value="urgent">Rush (48–72 Hours)</option>
                        <option value="standard">Standard (3–10 Days)</option>
                        <option value="flexible">Flexible / Planning</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-[#d8c3a5]">Tell me a little about your project</label>
                    <textarea 
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="What kind of website or graphics are you looking for?"
                      className="w-full px-3 py-2 rounded-lg bg-[#2A1E17] border border-[#483323] text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 rounded-lg font-bold text-xs bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8DFD3] py-8 px-4 sm:px-6 text-xs text-[#7C6958]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#D9CEBE] bg-[#FBF9F5] p-0.5 shadow-xs">
              <img 
                src={KPB_LOGO_DATA_URL} 
                alt="The KPB Visuals Logo" 
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <span className="font-extrabold text-[#2A1E17]">THE KPB VISUALS</span>
          </div>

          <p className="text-[11px] text-[#8C7A68]">
            Websites & Social Media Graphics • <a href="https://www.facebook.com/p.kxts/" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#2A1E17]">facebook.com/p.kxts</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
