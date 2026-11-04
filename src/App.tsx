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
  ChevronDown,
  RefreshCw,
  Calendar,
  ShoppingBag,
  Flag,
  ShieldCheck,
  FileText
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

  // Initialize Lenis smooth inertial scrolling
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

  // Estimator / Scope Builder state
  const [scopeWebsite, setScopeWebsite] = useState<'starter-basic' | 'starter-immersive' | 'multipage' | 'redesign' | 'campaign' | 'none'>('starter-immersive');
  const [scopeAddons, setScopeAddons] = useState<{
    booking: boolean;
    catalog: boolean;
    brandAssets: boolean;
    posters3: boolean;
    posters8: boolean;
    maintenance: boolean;
  }>({
    booking: false,
    catalog: false,
    brandAssets: true,
    posters3: false,
    posters8: false,
    maintenance: false,
  });
  const [scopeRush, setScopeRush] = useState<boolean>(false);
  const [copiedEstimate, setCopiedEstimate] = useState<boolean>(false);

  // Toggle addon helper
  const toggleAddon = (key: keyof typeof scopeAddons) => {
    setScopeAddons((prev) => {
      if (key === 'posters3' && !prev.posters3) {
        return { ...prev, posters3: true, posters8: false };
      }
      if (key === 'posters8' && !prev.posters8) {
        return { ...prev, posters8: true, posters3: false };
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

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

  // Formatted Quotation Request Message
  const quoteSummaryText = useMemo(() => {
    const webNames: Record<string, string> = {
      'starter-basic': 'Single-Page Basic Website',
      'starter-immersive': 'Single-Page Immersive Website (Scroll Effects + 2 Launch Posters)',
      'multipage': 'Multi-Page Website (Up to 4 Pages + 4 Launch Posters)',
      'redesign': 'Website Redesign & Modernization (Site Makeover)',
      'campaign': 'Campaign & Event Landing Page',
      'none': 'No Website (Design & Media Assets Only)'
    };

    const addonsList: string[] = [];
    if (scopeAddons.booking) addonsList.push('Booking & Schedule System Integration');
    if (scopeAddons.catalog) addonsList.push('Digital Product Catalog / QR Menu');
    if (scopeAddons.brandAssets) addonsList.push('Brand & Social Launch Assets (Covers, Colors, QR Payment Cards)');
    if (scopeAddons.posters3) addonsList.push('Social Media Starter 3-Pack Posters');
    if (scopeAddons.posters8) addonsList.push('Social Media Campaign 8-Pack Posters');
    if (scopeAddons.maintenance) addonsList.push('Monthly Site Care & Content Updates');

    const timelineText = scopeRush ? 'Rush Priority (48–72 Hours)' : 'Standard (3–10 Days)';

    return `Hi The KPB Visuals! I would like to request a quotation for my project:
• Website Type: ${webNames[scopeWebsite] || 'Custom'}
• Features & Add-ons: ${addonsList.length > 0 ? addonsList.join(', ') : 'Standard package features'}
• Preferred Timeline: ${timelineText}

I would like to explain what my business does and discuss your quotation and availability!`;
  }, [scopeWebsite, scopeAddons, scopeRush]);

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
      q: 'How do I get a quotation for my website?',
      a: 'Simply send us a message on Facebook Messenger or through our contact form. Tell us a little about your business and what kind of website or features you need. We will review your requirements and send you a clear, honest quotation with a realistic timeframe.'
    },
    {
      q: 'How many revisions do we get while editing our website?',
      a: 'We offer 2 to 3 rounds of design revisions during the staging review phase so you can test everything and make sure it looks right before launch. We are flexible and easy to talk to—revisions are negotiable depending on what your project requires.'
    },
    {
      q: 'Do you create logos?',
      a: 'We do not offer logo creation. However, we do provide complete Brand & Social Launch Assets—including matching color palettes, typography pairings, Facebook and Instagram cover banners, and custom digital GCash or Maya QR payment cards to give your brand a cohesive, professional appearance.'
    },
    {
      q: 'What is the difference between Single-Page and Multi-Page websites?',
      a: 'A Single-Page website contains your intro, services, pricing, and contact buttons in one streamlined, fast-scrolling page. A Multi-Page website has dedicated individual pages (such as Home, About/Story, Services or Schedules, and Contact/Booking), which is ideal for academies, clinics, or businesses with deeper catalogs.'
    },
    {
      q: 'Can you redesign or update my existing website?',
      a: 'Yes! If you already have an existing website that feels slow, outdated, or hard to navigate on mobile phones, we can redesign and rebuild it with clean styling, quick load speeds, and straightforward messaging.'
    },
    {
      q: 'What are your payment terms and accepted methods?',
      a: 'We follow a simple 50/50 milestone: a 50% kickoff downpayment to start the design, and the remaining 50% only when your website is completed, approved on our private preview link, and ready to go live. We accept GCash, Maya, BDO, BPI, UnionBank, and PayPal.'
    },
    {
      q: 'Can I order social media posters or graphic design without a website?',
      a: 'Yes! We design standalone promotional posters, tournament announcements, class schedules, and event flyers. Send us a message with the details you want to include and we will prepare a quotation for your graphics.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2A1E17] font-sans selection:bg-[#E8DCCB] selection:text-[#1F1611] overflow-x-clip">
      {/* Top Simple Announcement */}
      <div className="bg-[#2A1E17] text-[#FBF9F5] text-xs py-2 px-4 text-center font-medium">
        <div className="max-w-6xl mx-auto flex items-center justify-center space-x-2">
          <span>Open for new projects · Send a message for a quotation · 50% kickoff / 50% live launch terms</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="border-b border-[#E8DFD3] bg-white/95 backdrop-blur-xs sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
              <span className="text-[11px] text-[#7C6958] font-medium block mt-0.5">Websites & Social Media</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-xs font-semibold text-[#6E5948] uppercase tracking-wider">
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
            className="px-4 py-2 rounded-lg text-xs font-bold bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors cursor-pointer shadow-2xs"
          >
            Send a Message
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header ref={heroRef} className="pt-14 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center space-y-6">
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
          <motion.div style={{ y: headlineY }} className="space-y-4 will-change-transform max-w-3xl mx-auto">
            <span className="text-xs font-bold tracking-wider text-[#7C6958] uppercase block">
              The KPB Visuals · Philippine Creative Studio
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F1611] tracking-tight leading-[1.15] text-balance">
              Simple, clean websites and social media graphics for your business.
            </h1>

            <p className="text-sm sm:text-base text-[#6E5948] leading-relaxed max-w-xl mx-auto text-pretty">
              We build clean, fast websites and eye-catching social media graphics for up-and-coming brands and growing small-to-medium businesses.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
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
              <span>View Website Packages</span>
            </button>
          </div>

          {/* 4 Feature Points Strip with aligned cards */}
          <motion.div 
            style={{ scale: heroVisualScale }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-8 text-left max-w-5xl mx-auto origin-top will-change-transform"
          >
            <div className="p-4 rounded-xl bg-white border border-[#E8DFD3] shadow-xs flex flex-col justify-between space-y-1.5">
              <span className="font-bold text-[#2A1E17] text-sm block">Mobile Friendly</span>
              <span className="text-xs text-[#6E5948] leading-relaxed text-pretty">100% responsive on smartphones, tablets, & laptops.</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8DFD3] shadow-xs flex flex-col justify-between space-y-1.5">
              <span className="font-bold text-[#2A1E17] text-sm block">GCash & Bank</span>
              <span className="text-xs text-[#6E5948] leading-relaxed text-pretty">Clear payment sections for GCash, Maya, and bank transfers.</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8DFD3] shadow-xs flex flex-col justify-between space-y-1.5">
              <span className="font-bold text-[#2A1E17] text-sm block">3 to 10 Days</span>
              <span className="text-xs text-[#6E5948] leading-relaxed text-pretty">Realistic, reliable turnaround to launch without delays.</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#E8DFD3] shadow-xs flex flex-col justify-between space-y-1.5">
              <span className="font-bold text-[#2A1E17] text-sm block">Zero Code Stress</span>
              <span className="text-xs text-[#6E5948] leading-relaxed text-pretty">We handle the technical setup, hosting, and launch details for you.</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Services Section - Clean & Focused on What We Deliver */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F3EDE3]/40 border-y border-[#E8DFD3]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A68] block">Our Services</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1611] tracking-tight">What We Can Build For You</h2>
            <p className="text-sm sm:text-base text-[#6E5948] leading-relaxed text-pretty">
              Practical digital services built for everyday businesses, coaches, academies, and rental shops. Simple, professional, and built to work smoothly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service 1: Website Creation */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D6C5] flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                  <Laptop className="w-5 h-5 text-[#8C7A68]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1611] tracking-tight">Website Creation</h3>
                <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                  Clean, fast websites tailored to your brand. From single-page landing sites to multi-page platforms with direct contact and payment instructions.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3C] pt-4 border-t border-[#F2ECE1]">
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Smooth mobile, tablet, and desktop layout</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Clear service offerings, rates, and contact forms</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Direct buttons to chat on Facebook Messenger or call</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>2–3 design revision rounds on staging (negotiable)</span>
                </li>
              </ul>
            </div>

            {/* Service 2: Website Redesign & Modernization */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D6C5] flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                  <RefreshCw className="w-5 h-5 text-[#8C7A68]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1611] tracking-tight">Website Redesign & Makeovers</h3>
                <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                  Already have an existing site that looks outdated or loads slowly on phones? We modernize your site with a fresh layout, quicker loading, and clearer copy.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3C] pt-4 border-t border-[#F2ECE1]">
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Modern, clean refresh of your old web pages</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Speed improvements and mobile layout fixes</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Simplified customer navigation and inquiry flow</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Preserves your domain and existing content</span>
                </li>
              </ul>
            </div>

            {/* Service 3: Booking & Schedule Integration */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D6C5] flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                  <Calendar className="w-5 h-5 text-[#8C7A68]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1611] tracking-tight">Booking & Schedule Systems</h3>
                <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                  Make it easy for clients to view your availability, pick dates, and submit booking requests—just like our live Merilles Chess and GET2GO projects.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3C] pt-4 border-t border-[#F2ECE1]">
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Class schedules & session batch listings</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Rental date selectors & curbside delivery requests</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Direct booking confirmation sent straight to Messenger</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Simple calendar management without complicated software</span>
                </li>
              </ul>
            </div>

            {/* Service 4: Digital Product Catalog & QR Menu */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D6C5] flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                  <ShoppingBag className="w-5 h-5 text-[#8C7A68]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1611] tracking-tight">Digital Catalog & QR Menu</h3>
                <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                  A mobile-friendly price list or menu customers can open instantly by scanning a QR code on their phone, complete with instant order and inquiry buttons.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3C] pt-4 border-t border-[#F2ECE1]">
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Clean mobile catalog with item photos and prices</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Custom printable QR code for your counter or tables</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Direct "Order via Messenger" button on each product</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Easy to update whenever prices or items change</span>
                </li>
              </ul>
            </div>

            {/* Service 5: Brand & Social Launch Assets */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D6C5] flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                  <Palette className="w-5 h-5 text-[#8C7A68]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1611] tracking-tight">Brand & Social Launch Assets</h3>
                <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                  Unify your online look across your website and social pages with matching color palettes, readable fonts, cover banners, and digital QR payment cards.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3C] pt-4 border-t border-[#F2ECE1]">
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Facebook cover banners & profile photo framing</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Digital GCash, Maya, & bank QR payment cards</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Curated color guide and clean typography rules</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>High-resolution exports ready for web and print</span>
                </li>
              </ul>
            </div>

            {/* Service 6: Campaign & Event Landing Pages */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D6C5] flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                  <Flag className="w-5 h-5 text-[#8C7A68]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1611] tracking-tight">Campaign & Event Pages</h3>
                <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                  Targeted single-page websites dedicated to an upcoming tournament, seasonal workshop, registration drive, or promotional sale.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3C] pt-4 border-t border-[#F2ECE1]">
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Focused design driving registrations or inquiries</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Countdown schedules, rules, prizes, and FAQs</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Fast 48–72 hour rush launch option available</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Integrated registration form & payment details</span>
                </li>
              </ul>
            </div>

            {/* Service 7: Social Media Graphics */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D6C5] flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                  <Smartphone className="w-5 h-5 text-[#8C7A68]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1611] tracking-tight">Social Media Graphics</h3>
                <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                  Clear, eye-catching posters for Facebook and Instagram so your followers stay informed about your schedules, promotions, and announcements.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3C] pt-4 border-t border-[#F2ECE1]">
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Tournament flyers, sale posters, & schedules</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Sized accurately for feed posts and stories</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Easy-to-read typography that gets attention</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Available in 3-pack and 8-pack bundles</span>
                </li>
              </ul>
            </div>

            {/* Service 8: Monthly Site Care */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2D6C5] flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-[#FBF9F5] border border-[#DDD1BE] flex items-center justify-center text-[#2A1E17]">
                  <Clock className="w-5 h-5 text-[#8C7A68]" />
                </div>
                <h3 className="text-xl font-bold text-[#1F1611] tracking-tight">Monthly Site Care & Updates</h3>
                <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                  Hands-off maintenance. We keep your website fast, running smoothly, and update your text, rates, or photos whenever your business changes.
                </p>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3C] pt-4 border-t border-[#F2ECE1]">
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Regular text, schedule, and photo updates</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Speed checks and uptime monitoring</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Optional monthly package with fresh social posters</span>
                </li>
                <li className="flex items-start gap-2.5 leading-snug">
                  <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>Direct support on Facebook Messenger</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Website Packages & Deliverables Section - Sticky Split-Screen Showcase */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Main Sticky Split-Screen Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column (Sticky Desktop - Pins Section Header & Package Selector) */}
            <div className="lg:col-span-5 relative">
              <div className="lg:sticky lg:top-28 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A68] block">Website Packages</span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-[#1F1611] tracking-tight">
                    Website Options
                  </h2>
                  <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                    Clean, mobile-first websites tailored to your business. Send a message explaining what website you want to build and we will send an honest quotation.
                  </p>
                </div>

                {/* Quotation Policy Badge */}
                <div className="flex items-center justify-between p-3.5 bg-white border border-[#D9CEBE] rounded-xl shadow-2xs">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-[#8C7A68]" />
                    <span className="text-xs font-semibold text-[#5C4A3C]">Pricing Model:</span>
                  </div>
                  <span className="text-xs font-bold text-[#2A1E17] bg-[#F3EDE3] px-2.5 py-1 rounded-md border border-[#D9CEBE]">
                    Send a message for a quotation
                  </span>
                </div>

                {/* Interactive Package Selector (Syncs with scroll & allows jump-click) */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#8C7A68] flex items-center justify-between">
                    <span>Website Options (Click to Jump):</span>
                    <span className="text-[11px] text-[#A39171] font-semibold">
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
                        <span className="font-bold text-sm">Single-Page Basic</span>
                      </div>
                      <span className={`text-xs block ${activeWebsiteTier === 'basic' ? 'text-[#D9CEBE]' : 'text-[#7C6958]'}`}>
                        Streamlined all-in-one scroll · 3–5 Days
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold block ${activeWebsiteTier === 'basic' ? 'text-[#FBF9F5]' : 'text-[#2A1E17]'}`}>
                        Quotation
                      </span>
                      <span className={`text-[11px] font-medium ${activeWebsiteTier === 'basic' ? 'text-[#C9BDAF]' : 'text-[#8C7A68]'}`}>via message</span>
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
                        <span className="font-bold text-sm flex items-center gap-1.5">
                          <span>Single-Page Immersive</span>
                          <Sparkles className="w-3.5 h-3.5 text-[#E6C687]" />
                        </span>
                      </div>
                      <span className={`text-xs block ${activeWebsiteTier === 'immersive' ? 'text-[#D9CEBE]' : 'text-[#7C6958]'}`}>
                        Scroll motion + 2 Free Posters · 5–7 Days
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold block ${activeWebsiteTier === 'immersive' ? 'text-[#FBF9F5]' : 'text-[#2A1E17]'}`}>
                        Quotation
                      </span>
                      <span className={`text-[11px] font-medium ${activeWebsiteTier === 'immersive' ? 'text-[#C9BDAF]' : 'text-[#8C7A68]'}`}>via message</span>
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
                        <span className="font-bold text-sm flex items-center gap-1.5">
                          <span>Multi-Page Website</span>
                          <Layers className="w-3.5 h-3.5 text-[#E6C687]" />
                        </span>
                      </div>
                      <span className={`text-xs block ${activeWebsiteTier === 'multipage' ? 'text-[#D9CEBE]' : 'text-[#7C6958]'}`}>
                        Up to 4 Pages + 4 Free Posters · 7–10 Days
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold block ${activeWebsiteTier === 'multipage' ? 'text-[#FBF9F5]' : 'text-[#2A1E17]'}`}>
                        Quotation
                      </span>
                      <span className={`text-[11px] font-medium ${activeWebsiteTier === 'multipage' ? 'text-[#C9BDAF]' : 'text-[#8C7A68]'}`}>via message</span>
                    </div>
                  </button>
                </div>

                {/* Honest Milestone & Fast Inquiry Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F1E9] border border-[#E2D6C5] space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#2A1E17]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>50% Kickoff / 50% Launch Milestone</span>
                  </div>
                  <p className="text-xs text-[#6E5948] leading-relaxed text-pretty">
                    50% downpayment upon kickoff to begin the design. The remaining 50% only when your website is completed, approved on private staging, and ready to launch. Includes 2–3 design revision rounds (negotiable based on your needs).
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSelectPackage(
                      activeWebsiteTier === 'basic' ? 'starter-basic' :
                      activeWebsiteTier === 'immersive' ? 'starter-immersive' : 'multipage'
                    )}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <span>Request Quotation for {
                      activeWebsiteTier === 'basic' ? 'Basic' :
                      activeWebsiteTier === 'immersive' ? 'Immersive' : 'Multi-Page'
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
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider block">Starter Option</span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      Clean & High-Converting
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F1611]">
                    Single-Page Basic
                  </h3>

                  <div className="space-y-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#2A1E17] block">
                      Send a message for a quotation
                    </span>
                    <span className="text-xs text-[#7C6958] font-medium block">
                      Tell us what kind of website you need for an exact quotation.
                    </span>
                  </div>

                  {/* 50/50 breakdown chip */}
                  <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F5EE] border border-[#E8DFD3] text-xs text-[#5C4A3C]">
                    <span className="font-semibold text-[#2A1E17]">Terms:</span>
                    <span>50% Kickoff Downpayment</span>
                    <span>·</span>
                    <span>50% Approved Live Launch</span>
                    <span>·</span>
                    <span>2–3 Revisions (negotiable)</span>
                  </div>

                  <p className="text-sm sm:text-base text-[#6E5948] leading-relaxed text-pretty">
                    Everything your customers need on one clean, fast-loading page. Easy for customers to browse, view your services, and contact you directly.
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-3 pt-4 border-t border-[#F2ECE1]">
                  <span className="text-xs font-bold text-[#2A1E17] block uppercase tracking-wider">
                    What You Get in Single-Page Basic:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#5C4A3C]">
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Single-page all-in-one scroll layout</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>100% mobile friendly on phones & tablets</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Contact form & direct Messenger links</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>GCash & bank transfer payment details</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Zero code stress: hosting & domain setup</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Realistic 3–5 day turnaround to launch</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>2–3 design revision rounds on staging (negotiable)</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => handleSelectPackage('starter-basic')}
                    className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <span>Request Quotation for Basic</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScopeWebsite('starter-basic');
                      scrollTo('estimator');
                    }}
                    className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#FBF9F5] border border-[#D9CEBE] text-[#2A1E17] hover:bg-[#EFE8DD] transition-colors cursor-pointer"
                  >
                    <span>Configure in Quote Builder</span>
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
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A39171] uppercase tracking-wider block">Enhanced Studio Option</span>
                    <span className="text-xs font-bold text-[#2A1E17] bg-[#F3EDE3] px-2.5 py-0.5 rounded border border-[#D9CEBE]">
                      ★ Most Popular Choice
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F1611] flex items-center gap-2">
                    <span>Single-Page Immersive</span>
                    <Sparkles className="w-5 h-5 text-[#A39171]" />
                  </h3>

                  <div className="space-y-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#2A1E17] block">
                      Send a message for a quotation
                    </span>
                    <span className="text-xs text-[#7C6958] font-medium block">
                      Includes custom scroll animations and 2 Free social media launch posters.
                    </span>
                  </div>

                  {/* 50/50 breakdown chip */}
                  <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F5EE] border border-[#E8DFD3] text-xs text-[#5C4A3C]">
                    <span className="font-semibold text-[#2A1E17]">Terms:</span>
                    <span>50% Kickoff Downpayment</span>
                    <span>·</span>
                    <span>50% Approved Live Launch</span>
                    <span>·</span>
                    <span>2–3 Revisions (negotiable)</span>
                  </div>

                  <p className="text-sm sm:text-base text-[#6E5948] leading-relaxed text-pretty">
                    A modern single-page site with smooth scrolling animations, custom styling, and 2 free social media launch posters.
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-3 pt-4 border-t border-[#F2ECE1]">
                  <span className="text-xs font-bold text-[#2A1E17] block uppercase tracking-wider">
                    Everything in Basic Plus:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#5C4A3C]">
                    <div className="flex items-start gap-2.5 leading-snug font-semibold text-[#2A1E17]">
                      <Sparkles className="w-4 h-4 text-[#A39171] mt-0.5 shrink-0" />
                      <span>Scroll motion & parallax depth cues</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug font-semibold text-[#2A1E17]">
                      <Sparkles className="w-4 h-4 text-[#A39171] mt-0.5 shrink-0" />
                      <span>2 Free Custom Social Media Posters</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Bespoke styling and refined typography</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Dedicated payment section for your GCash QR and bank details</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Full responsive layout for all mobile screens</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>5–7 business days turnaround</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>2–3 design revision rounds on staging (negotiable)</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => handleSelectPackage('starter-immersive')}
                    className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <span>Request Quotation for Immersive</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScopeWebsite('starter-immersive');
                      scrollTo('estimator');
                    }}
                    className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#FBF9F5] border border-[#D9CEBE] text-[#2A1E17] hover:bg-[#EFE8DD] transition-colors cursor-pointer"
                  >
                    <span>Configure in Quote Builder</span>
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
                      <span>7–10 Days · Up to 4 Pages</span>
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
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        🎁 4 Free Posters Included!
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#A39171] uppercase tracking-wider block">Comprehensive Platform</span>
                    <span className="text-xs font-semibold text-[#2A1E17] bg-[#F3EDE3] px-2.5 py-0.5 rounded border border-[#D9CEBE] flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Up to 4 Custom Pages</span>
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1F1611]">
                    Multi-Page Website
                  </h3>

                  <div className="space-y-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#2A1E17] block">
                      Send a message for a quotation
                    </span>
                    <span className="text-xs text-[#7C6958] font-medium block">
                      Custom quoted based on total pages and specific features requested.
                    </span>
                  </div>

                  {/* 50/50 breakdown chip */}
                  <div className="inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F8F5EE] border border-[#E8DFD3] text-xs text-[#5C4A3C]">
                    <span className="font-semibold text-[#2A1E17]">Terms:</span>
                    <span>50% Kickoff Downpayment</span>
                    <span>·</span>
                    <span>50% Approved Live Launch</span>
                    <span>·</span>
                    <span>2–3 Revisions (negotiable)</span>
                  </div>

                  <p className="text-sm sm:text-base text-[#6E5948] leading-relaxed text-pretty">
                    For businesses, academies, clinics, or coaches needing structured depth: Home, About/Story, Services/Catalog, and Contact.
                  </p>
                </div>

                {/* Deliverables Checklist */}
                <div className="space-y-3 pt-4 border-t border-[#F2ECE1]">
                  <span className="text-xs font-bold text-[#2A1E17] block uppercase tracking-wider">
                    What You Get in Multi-Page Website:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm text-[#5C4A3C]">
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Up to 4 custom pages (Home + 3 dedicated pages)</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Services / class schedules / catalog menu</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>GCash / bank payment details & reference flow</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug font-semibold text-[#2A1E17]">
                      <Sparkles className="w-4 h-4 text-[#A39171] mt-0.5 shrink-0" />
                      <span>Includes 4 Free Custom Social Media Posters</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Complete technical setup, hosting & domain linking</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>7–10 days turnaround with thorough staging review</span>
                    </div>
                    <div className="flex items-start gap-2.5 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>2–3 design revision rounds on staging (negotiable)</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => handleSelectPackage('multipage')}
                    className="flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#2A1E17] text-[#FBF9F5] hover:bg-[#3E2D23] transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <span>Request Quotation for Multi-Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScopeWebsite('multipage');
                      scrollTo('estimator');
                    }}
                    className="py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-[#FBF9F5] border border-[#D9CEBE] text-[#2A1E17] hover:bg-[#EFE8DD] transition-colors cursor-pointer"
                  >
                    <span>Configure in Quote Builder</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Complementary Services: Monthly Maintenance & Social Posters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-[#E8DFD3]">
            {/* Monthly Maintenance & Content Care */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E2D6C5] flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <span className="text-xs font-bold text-[#8C7A68] uppercase tracking-wider block">Ongoing Support</span>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1F1611]">
                    Monthly Website Care & Updates
                  </h3>
                  <div className="space-y-0.5">
                    <span className="text-xl sm:text-2xl font-extrabold text-[#2A1E17] block">
                      Send a message for a quotation
                    </span>
                    <span className="text-xs text-[#7C6958]">
                      Custom plans based on how frequently your content and schedules change.
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                  We look after your website speed, security, and update text, photos, and schedules whenever your business needs it.
                </p>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3C] pt-3 border-t border-[#F2ECE1]">
                  <li className="flex items-start gap-2.5 leading-snug">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Regular text, schedule, rate, and photo updates</span>
                  </li>
                  <li className="flex items-start gap-2.5 leading-snug font-semibold text-[#2A1E17]">
                    <Sparkles className="w-4 h-4 text-[#A39171] mt-0.5 shrink-0" />
                    <span>Optional Growth Plan: includes 4 fresh custom social media posters every month</span>
                  </li>
                  <li className="flex items-start gap-2.5 leading-snug">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Direct chat support on Facebook Messenger</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPackage('monthly-care')}
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold text-center bg-[#FBF9F5] border border-[#D9CEBE] text-[#2A1E17] hover:bg-[#2A1E17] hover:text-white transition-colors cursor-pointer shadow-2xs"
              >
                Inquire About Monthly Care
              </button>
            </div>

            {/* Standalone Social Media Poster Bundles */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#D9CEBE] flex flex-col justify-between space-y-5 shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C7A68]">
                  <Palette className="w-4 h-4 text-[#8C7A68]" />
                  <span>Standalone Graphic Design</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#1F1611]">Social Media Graphics & Flyers</h3>
                <p className="text-sm text-[#6E5948] leading-relaxed text-pretty">
                  Need eye-catching, ready-to-post graphics without getting a website? We design tailored promos, tournament flyers, event graphics, and announcements.
                </p>

                <div className="space-y-1">
                  <span className="text-xl sm:text-2xl font-extrabold text-[#2A1E17] block">
                    Send a message for a quotation
                  </span>
                  <span className="text-xs text-[#7C6958]">
                    Available in single posters, 3-packs, 8-packs, or custom quantities.
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4A3C] pt-3 border-t border-[#F2ECE1]">
                  <li className="flex items-start gap-2.5 leading-snug">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Sized for Facebook, Instagram, Messenger, and stories</span>
                  </li>
                  <li className="flex items-start gap-2.5 leading-snug">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>High-resolution exports in PNG and JPEG formats</span>
                  </li>
                  <li className="flex items-start gap-2.5 leading-snug">
                    <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <span>Includes 2 revision rounds per poster</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handleSelectPackage('posters')}
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#2A1E17] text-white hover:bg-[#3E2D23] transition-colors cursor-pointer text-center shadow-xs"
              >
                Inquire About Social Posters
              </button>
            </div>
          </div>

          {/* Honest Note About Domain and Hosting */}
          <div className="p-6 rounded-2xl bg-white border border-[#D9CEBE] text-[#6E5948] space-y-2 shadow-2xs">
            <h4 className="text-sm sm:text-base font-bold text-[#2A1E17] block">A quick note on domains and hosting:</h4>
            <p className="text-xs sm:text-sm leading-relaxed text-pretty">
              Our website services cover the complete design, build, and technical setup of your site. We host and manage your website files on fast, secure servers so you never have to deal with code. The only thing you pay for directly is your custom domain name (like yourbusiness.com via Namecheap or Cloudflare, usually around ₱600–₱900/year). We help you set it up so you own your domain name 100%, with zero lock-in.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Project Scope & Quotation Builder */}
      <section id="estimator" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F3EDE3]/40 border-t border-[#E8DFD3]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8C7A68]">
              <Calculator className="w-4 h-4 text-[#8C7A68]" />
              <span>Project Scope Builder</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1611] tracking-tight">
              Build Your Scope & Request a Quotation
            </h2>
            <p className="text-sm sm:text-base text-[#6E5948] leading-relaxed text-pretty">
              Select the website type and features you need. This generates a clear quotation request message you can send us directly on Facebook Messenger or using the form below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-5">
              {/* Step 1: Website Architecture */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D9CEBE] space-y-3.5 shadow-xs">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">
                  1. Choose Website Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScopeWebsite('starter-basic')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      scopeWebsite === 'starter-basic'
                        ? 'border-[#2A1E17] bg-[#FBF9F5] shadow-xs ring-1 ring-[#2A1E17]/10'
                        : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[#2A1E17]">Single-Page Basic</span>
                      <span className="text-xs font-bold text-[#8C7A68]">3–5 Days</span>
                    </div>
                    <p className="text-xs text-[#6E5948] mt-1.5 leading-normal text-pretty">Single-page layout, clean presentation, direct contact buttons.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeWebsite('starter-immersive')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      scopeWebsite === 'starter-immersive'
                        ? 'border-[#2A1E17] bg-[#FBF9F5] shadow-xs ring-1 ring-[#2A1E17]/10'
                        : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[#2A1E17] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#A39171]" />
                        Single-Page Immersive
                      </span>
                      <span className="text-xs font-bold text-[#8C7A68]">5–7 Days</span>
                    </div>
                    <p className="text-xs text-[#6E5948] mt-1.5 leading-normal text-pretty">Scroll animations, bespoke styling + 2 Free Launch Posters.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeWebsite('multipage')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      scopeWebsite === 'multipage'
                        ? 'border-[#2A1E17] bg-[#FBF9F5] shadow-xs ring-1 ring-[#2A1E17]/10'
                        : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[#2A1E17] flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#A39171]" />
                        Multi-Page Website
                      </span>
                      <span className="text-xs font-bold text-[#8C7A68]">7–10 Days</span>
                    </div>
                    <p className="text-xs text-[#6E5948] mt-1.5 leading-normal text-pretty">Home + 3 dedicated pages + 4 Free Launch Posters.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeWebsite('redesign')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      scopeWebsite === 'redesign'
                        ? 'border-[#2A1E17] bg-[#FBF9F5] shadow-xs ring-1 ring-[#2A1E17]/10'
                        : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[#2A1E17] flex items-center gap-1">
                        <RefreshCw className="w-3.5 h-3.5 text-[#8C7A68]" />
                        Website Redesign
                      </span>
                      <span className="text-xs font-bold text-[#8C7A68]">Makeover</span>
                    </div>
                    <p className="text-xs text-[#6E5948] mt-1.5 leading-normal text-pretty">Rebuilding an outdated website for faster mobile performance.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeWebsite('campaign')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      scopeWebsite === 'campaign'
                        ? 'border-[#2A1E17] bg-[#FBF9F5] shadow-xs ring-1 ring-[#2A1E17]/10'
                        : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[#2A1E17] flex items-center gap-1">
                        <Flag className="w-3.5 h-3.5 text-[#8C7A68]" />
                        Campaign / Event Page
                      </span>
                      <span className="text-xs font-bold text-[#8C7A68]">Targeted</span>
                    </div>
                    <p className="text-xs text-[#6E5948] mt-1.5 leading-normal text-pretty">High-impact single page for tournaments, workshops, or sales.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setScopeWebsite('none')}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      scopeWebsite === 'none'
                        ? 'border-[#2A1E17] bg-[#FBF9F5] shadow-xs ring-1 ring-[#2A1E17]/10'
                        : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-[#2A1E17]">No Website Needed</span>
                      <span className="text-xs text-[#7C6958]">Graphics Only</span>
                    </div>
                    <p className="text-xs text-[#6E5948] mt-1.5 leading-normal text-pretty">I only need social posters, brand assets, or monthly care.</p>
                  </button>
                </div>
              </div>

              {/* Step 2: Features & Add-ons */}
              <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D9CEBE] space-y-3.5 shadow-xs">
                <label className="text-xs font-bold uppercase tracking-wider text-[#2A1E17] block">
                  2. Select Features & Deliverables Needed
                </label>
                <div className="space-y-2.5">
                  {/* Booking */}
                  <div
                    onClick={() => toggleAddon('booking')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      scopeAddons.booking ? 'border-[#2A1E17] bg-[#FBF9F5]' : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-bold text-[#2A1E17] flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#8C7A68]" />
                        <span>Booking & Schedule System Integration</span>
                      </span>
                      <span className="text-xs text-[#7C6958] block">
                        Interactive appointment calendar, rental date selector, or batch schedules.
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${scopeAddons.booking ? 'bg-[#2A1E17] border-[#2A1E17] text-white' : 'border-[#D9CEBE]'}`}>
                      {scopeAddons.booking && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Catalog / QR Menu */}
                  <div
                    onClick={() => toggleAddon('catalog')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      scopeAddons.catalog ? 'border-[#2A1E17] bg-[#FBF9F5]' : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-bold text-[#2A1E17] flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-[#8C7A68]" />
                        <span>Digital Product Catalog & QR Menu</span>
                      </span>
                      <span className="text-xs text-[#7C6958] block">
                        Mobile-friendly catalog with instant Messenger order buttons and printable QR code.
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${scopeAddons.catalog ? 'bg-[#2A1E17] border-[#2A1E17] text-white' : 'border-[#D9CEBE]'}`}>
                      {scopeAddons.catalog && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Brand & Social Launch Assets */}
                  <div
                    onClick={() => toggleAddon('brandAssets')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      scopeAddons.brandAssets ? 'border-[#2A1E17] bg-[#FBF9F5]' : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-bold text-[#2A1E17] flex items-center gap-2">
                        <Palette className="w-4 h-4 text-[#8C7A68]" />
                        <span>Brand & Social Launch Assets</span>
                      </span>
                      <span className="text-xs text-[#7C6958] block">
                        Matching cover banners, color guide, typography, and digital GCash/Maya QR payment cards.
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${scopeAddons.brandAssets ? 'bg-[#2A1E17] border-[#2A1E17] text-white' : 'border-[#D9CEBE]'}`}>
                      {scopeAddons.brandAssets && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Social Posters */}
                  <div
                    onClick={() => toggleAddon('posters3')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      scopeAddons.posters3 ? 'border-[#2A1E17] bg-[#FBF9F5]' : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-bold text-[#2A1E17] flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#8C7A68]" />
                        <span>Social Media Posters Bundle (3-Pack)</span>
                      </span>
                      <span className="text-xs text-[#7C6958] block">
                        3 high-resolution graphics for Facebook/Instagram announcements or promos.
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${scopeAddons.posters3 ? 'bg-[#2A1E17] border-[#2A1E17] text-white' : 'border-[#D9CEBE]'}`}>
                      {scopeAddons.posters3 && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Campaign 8-Pack */}
                  <div
                    onClick={() => toggleAddon('posters8')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      scopeAddons.posters8 ? 'border-[#2A1E17] bg-[#FBF9F5]' : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-bold text-[#2A1E17] flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-[#8C7A68]" />
                        <span>Social Media Campaign Bundle (8-Pack)</span>
                      </span>
                      <span className="text-xs text-[#7C6958] block">
                        Full pack of 8 custom promo graphics, schedules, or event flyers.
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${scopeAddons.posters8 ? 'bg-[#2A1E17] border-[#2A1E17] text-white' : 'border-[#D9CEBE]'}`}>
                      {scopeAddons.posters8 && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  {/* Monthly Care */}
                  <div
                    onClick={() => toggleAddon('maintenance')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      scopeAddons.maintenance ? 'border-[#2A1E17] bg-[#FBF9F5]' : 'border-[#E8DFD3] hover:border-[#D9CEBE]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs sm:text-sm font-bold text-[#2A1E17] flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#8C7A68]" />
                        <span>Monthly Website Care & Content Updates</span>
                      </span>
                      <span className="text-xs text-[#7C6958] block">
                        Ongoing maintenance, speed checks, and regular schedule/text updates.
                      </span>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${scopeAddons.maintenance ? 'bg-[#2A1E17] border-[#2A1E17] text-white' : 'border-[#D9CEBE]'}`}>
                      {scopeAddons.maintenance && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Launch Timeline */}
              <div className="p-4 sm:p-5 rounded-xl bg-white border border-[#D9CEBE] flex items-center justify-between shadow-xs">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-[#2A1E17]">Expedited Priority Rush (48–72 Hours)</div>
                  <div className="text-xs text-[#7C6958]">Priority queue for urgent launches or upcoming deadlines.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setScopeRush(!scopeRush)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    scopeRush ? 'bg-[#2A1E17] text-[#FBF9F5]' : 'bg-[#F3EDE3] text-[#2A1E17] hover:bg-[#E8DFD3]'
                  }`}
                >
                  {scopeRush ? 'Rush Priority Selected' : 'Select Rush'}
                </button>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-5 sticky top-24 rounded-2xl bg-white border-2 border-[#2A1E17] p-6 sm:p-7 space-y-5 shadow-sm">
              <span className="text-xs font-bold text-[#A39171] uppercase tracking-wider block">
                Selected Scope & Quotation Request
              </span>

              <div className="space-y-3 py-3 border-y border-[#F2ECE1] text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-[#8C7A68] uppercase tracking-wider block">Website Type:</span>
                  <span className="font-bold text-[#2A1E17] block">
                    {scopeWebsite === 'starter-basic' && 'Single-Page Basic Website'}
                    {scopeWebsite === 'starter-immersive' && 'Single-Page Immersive (Scroll Effects + 2 Free Posters)'}
                    {scopeWebsite === 'multipage' && 'Multi-Page Website (Up to 4 Pages + 4 Free Posters)'}
                    {scopeWebsite === 'redesign' && 'Website Redesign & Modernization (Site Makeover)'}
                    {scopeWebsite === 'campaign' && 'Campaign & Event Landing Page'}
                    {scopeWebsite === 'none' && 'No Website (Graphics & Care Only)'}
                  </span>
                </div>

                <div className="space-y-1 pt-2 border-t border-[#F2ECE1]">
                  <span className="text-xs font-semibold text-[#8C7A68] uppercase tracking-wider block">Selected Features:</span>
                  <ul className="space-y-1 text-xs text-[#5C4A3C]">
                    {scopeAddons.booking && <li>✓ Booking & Schedule System Integration</li>}
                    {scopeAddons.catalog && <li>✓ Digital Product Catalog / QR Menu</li>}
                    {scopeAddons.brandAssets && <li>✓ Brand & Social Launch Assets (Covers, Colors, QR Payment Cards)</li>}
                    {scopeAddons.posters3 && <li>✓ Social Media Poster Bundle (3-Pack)</li>}
                    {scopeAddons.posters8 && <li>✓ Social Media Campaign Bundle (8-Pack)</li>}
                    {scopeAddons.maintenance && <li>✓ Monthly Site Care & Updates</li>}
                    {!scopeAddons.booking && !scopeAddons.catalog && !scopeAddons.brandAssets && !scopeAddons.posters3 && !scopeAddons.posters8 && !scopeAddons.maintenance && (
                      <li className="text-[#8C7A68] italic">Standard package inclusions</li>
                    )}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#F2ECE1] flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#8C7A68] uppercase tracking-wider">Timeline:</span>
                  <span className="font-bold text-[#2A1E17]">{scopeRush ? 'Priority Rush (48–72 Hours)' : 'Standard (3–10 Days)'}</span>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1] space-y-1">
                  <span className="text-xs font-semibold text-[#8C7A68] uppercase tracking-wider block">Quotation:</span>
                  <span className="text-xl sm:text-2xl font-black text-[#2A1E17] block">
                    Send a message for a quotation
                  </span>
                  <p className="text-xs text-[#7C6958]">
                    We will review your selected scope and reply with an honest quotation.
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#7C6958] space-y-1.5 leading-relaxed">
                <div>• 50% Kickoff Downpayment upon start of design</div>
                <div>• 2–3 revision rounds included on staging (negotiable)</div>
                <div>• 50% Remaining only upon your approval & live domain launch</div>
                <div>• Accepted: GCash, Maya, BDO, BPI, UnionBank, PayPal</div>
              </div>

              <div className="pt-2 space-y-2.5">
                <a
                  href="https://www.facebook.com/p.kxts/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#0084FF] hover:bg-[#0073e6] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via Facebook Messenger</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyQuote}
                  className="w-full py-3 px-4 rounded-xl bg-[#F3EDE3] hover:bg-[#E8DFD3] text-[#2A1E17] font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  {copiedEstimate ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedEstimate ? 'Copied Message to Clipboard!' : 'Copy Quotation Request Text'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ 
                      ...prev, 
                      service: scopeWebsite,
                      notes: quoteSummaryText 
                    }));
                    scrollTo('contact');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#2A1E17] hover:bg-[#3E2D23] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>Use This Scope in Form Below</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Work Section - Client Proof (Unique & Distinct) */}
      <section id="work" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A68] block">Client Proof</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1611] tracking-tight">Featured Real Projects</h2>
            <p className="text-sm sm:text-base text-[#6E5948] leading-relaxed text-pretty">
              Here are real websites and digital platforms we design and build for local Philippine coaches, academies, car rentals, and businesses.
            </p>
          </div>

          <div className="space-y-12 sm:space-y-14">
            {/* Project 1: Merilles Chess Academy */}
            <div className="rounded-2xl bg-white border border-[#D9CEBE] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Window title bar */}
              <div className="px-4 sm:px-6 py-3.5 bg-[#F6F2EB] border-b border-[#E8DFD3] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E57373]/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#81C784]/80"></span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#5C4A3C] ml-2 font-mono">
                    thekpbvisuals.com/showcase/merilles-chess-academy
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2A1E17] text-[#FBF9F5]">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  In Development
                </span>
              </div>

              {/* Updated website preview image */}
              <div className="w-full bg-[#0C1F38] border-b border-[#E8DFD3]">
                <img
                  src="/assets/aistudio/image_65e3049d.png"
                  alt="Featured Project: Merilles Chess Academy Website Preview"
                  className="w-full h-auto block object-cover"
                  loading="lazy"
                />
              </div>

              {/* Project Details Footer */}
              <div className="p-5 sm:p-6 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#1F1611]">Merilles Chess Academy (MCA)</h3>
                    <p className="text-xs sm:text-sm font-medium text-[#8C7A68]">
                      "Learn Chess with Purpose. Compete with Confidence." — Founded by Arena Grandmaster Nezil Arj M. Merilles
                    </p>
                  </div>
                  <span className="self-start sm:self-auto text-xs font-bold text-[#2A1E17] bg-[#F6F1E9] px-3 py-1 rounded-lg border border-[#E2D6C5]">
                    Multi-Page Academy Hub
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6E5948] leading-relaxed text-pretty">
                  Custom multi-page training platform featuring private 1-on-1 online lessons booking, weekend classroom batches in Calapan City, structured programs & rates, photo gallery, coach bio, and real-time Manila time synchronization.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-xs text-[#5C4A3C]">
                  <span className="px-2.5 py-1 rounded-md bg-[#FBF9F5] border border-[#E8DFD3] font-medium">✓ Multi-Page Architecture</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FBF9F5] border border-[#E8DFD3] font-medium">✓ Schedule & Enrollment Flow</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FBF9F5] border border-[#E8DFD3] font-medium">✓ Time-Sync Widget</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FBF9F5] border border-[#E8DFD3] font-medium">✓ 100% Mobile Responsive</span>
                </div>
              </div>
            </div>

            {/* Project 2: GET2GO Car Rentals */}
            <div className="rounded-2xl bg-white border border-[#D9CEBE] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Window title bar */}
              <div className="px-4 sm:px-6 py-3.5 bg-[#F6F2EB] border-b border-[#E8DFD3] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E57373]/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFB74D]/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#81C784]/80"></span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#5C4A3C] ml-2 font-mono">
                    thekpbvisuals.com/showcase/get2go-car-rentals
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#2A1E17] text-[#FBF9F5]">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Client Showcase
                </span>
              </div>

              {/* Website preview image */}
              <div className="w-full bg-[#0B0F12] border-b border-[#E8DFD3]">
                <img
                  src="/assets/aistudio/image_be82efdc.png"
                  alt="Featured Project: GET2GO Car Rentals Website Preview"
                  className="w-full h-auto block object-cover"
                  loading="lazy"
                />
              </div>

              {/* Project Details Footer */}
              <div className="p-5 sm:p-6 bg-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#1F1611]">GET2GO Car Rentals</h3>
                    <p className="text-xs sm:text-sm font-medium text-[#8C7A68]">
                      "Clean Cars. Cold AC. Zero Surprise Fees." — Calapan, Oriental Mindoro
                    </p>
                  </div>
                  <span className="self-start sm:self-auto text-xs font-bold text-[#2A1E17] bg-[#F6F1E9] px-3 py-1 rounded-lg border border-[#E2D6C5]">
                    Fleet & Booking Platform
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6E5948] leading-relaxed text-pretty">
                  Sleek, high-converting car rental platform serving Calapan Port, local hotels, and out-of-town/RoRo travelers heading to Puerto Galera, Southern Mindoro, and Batangas mainland. Features interactive date pickup calculator, fleet categories, and curbside delivery setup.
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-xs text-[#5C4A3C]">
                  <span className="px-2.5 py-1 rounded-md bg-[#FBF9F5] border border-[#E8DFD3] font-medium">✓ Quick Rental Date Estimator</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FBF9F5] border border-[#E8DFD3] font-medium">✓ Port & Hotel Curbside Delivery</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FBF9F5] border border-[#E8DFD3] font-medium">✓ Out-of-Town & RoRo Booking</span>
                  <span className="px-2.5 py-1 rounded-md bg-[#FBF9F5] border border-[#E8DFD3] font-medium">✓ Clean Dark Aesthetic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F3EDE3]/40 border-t border-[#E8DFD3]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8C7A68] block">Clear Answers</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F1611] tracking-tight">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-base text-[#6E5948] leading-relaxed text-pretty">
              Everything you need to know about how we work, deliver, and support your business.
            </p>
          </div>

          <div className="space-y-3.5 max-w-4xl">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-xl border border-[#D9CEBE] bg-white overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FBF9F5] transition-colors"
                  >
                    <span className="font-bold text-sm sm:text-base text-[#2A1E17]">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-[#2A1E17] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-3 text-xs sm:text-sm text-[#5C4A3C] leading-relaxed text-pretty border-t border-[#F2ECE1]">
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
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#2A1E17] text-[#FBF9F5]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs uppercase font-bold tracking-wider text-[#D8C3A5] block">Get In Touch</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">Let's Talk About Your Project</h2>
            <p className="text-sm sm:text-base text-[#D8C3A5]/80 leading-relaxed text-pretty">
              Feel free to message me on Facebook Messenger or send an email inquiry below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#1F1611] p-6 sm:p-8 rounded-2xl border border-[#483323]">
            {/* Contact links */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-1">
                <h4 className="font-bold text-white text-lg">The KPB Visuals</h4>
                <p className="text-xs sm:text-sm text-[#baa89a]">Websites & Social Media Graphics</p>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="text-[#baa89a] block text-xs font-semibold uppercase tracking-wider">Facebook Messenger:</span>
                  <a 
                    href="https://www.facebook.com/p.kxts/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-amber-300 hover:underline font-medium inline-flex items-center space-x-1"
                  >
                    <span>facebook.com/p.kxts</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-[#baa89a] block text-xs font-semibold uppercase tracking-wider">Email:</span>
                  <a href="mailto:thekpbvisuals@gmail.com" className="text-white hover:underline font-medium block">
                    thekpbvisuals@gmail.com
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-[#baa89a] block text-xs font-semibold uppercase tracking-wider">Turnaround:</span>
                  <span className="text-white block">3 to 10 days depending on package</span>
                </div>
              </div>

              <a 
                href="https://www.facebook.com/p.kxts/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full py-3 px-4 rounded-xl bg-[#0084FF] hover:bg-[#0073e6] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-colors cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Me on Facebook</span>
              </a>
            </div>

            {/* Simple Form */}
            <div className="lg:col-span-7">
              {formSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-[#2A1E17] rounded-xl border border-emerald-500/30 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  <h4 className="font-bold text-white text-base">Message Sent!</h4>
                  <p className="text-xs sm:text-sm text-[#d8c3a5] max-w-md">
                    Thanks, <strong>{formData.name}</strong>. I received your note regarding <strong>{formData.service}</strong> and will get back to you soon. You can also message me anytime on Facebook!
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="mt-4 px-5 py-2.5 bg-[#FBF9F5] text-[#2A1E17] text-xs font-bold rounded-lg cursor-pointer hover:bg-white transition-colors"
                  >
                    Submit Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#d8c3a5] block">Your Name *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your name"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2A1E17] border border-[#483323] text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#d8c3a5] block">Business / Brand Name</label>
                      <input 
                        type="text" 
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                        placeholder="What is your business?"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2A1E17] border border-[#483323] text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#d8c3a5] block">Email *</label>
                      <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2A1E17] border border-[#483323] text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#d8c3a5] block">Mobile Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="09XX-XXX-XXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2A1E17] border border-[#483323] text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#d8c3a5] block">Select Service</label>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2A1E17] border border-[#483323] text-white focus:outline-none focus:border-amber-400 cursor-pointer text-sm"
                      >
                        <option value="starter-basic">Single-Page Basic Website</option>
                        <option value="starter-immersive">Single-Page Immersive Website</option>
                        <option value="multipage">Multi-Page Website (Up to 4 Pages)</option>
                        <option value="redesign">Website Redesign & Modernization</option>
                        <option value="campaign">Campaign & Event Landing Page</option>
                        <option value="booking">Booking & Schedule System</option>
                        <option value="catalog">Digital Product Catalog & QR Menu</option>
                        <option value="brandAssets">Brand & Social Launch Assets</option>
                        <option value="posters">Social Media Graphics / Posters</option>
                        <option value="monthly-care">Monthly Website Care & Updates</option>
                        <option value="custom">Multiple Services / Custom Scope</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-[#d8c3a5] block">Launch Timeline</label>
                      <select 
                        value={formData.timeline}
                        onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#2A1E17] border border-[#483323] text-white focus:outline-none focus:border-amber-400 cursor-pointer text-sm"
                      >
                        <option value="standard">Standard (3–10 Days)</option>
                        <option value="urgent">Rush Priority (48–72 Hours)</option>
                        <option value="flexible">Flexible / Planning Stage</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#d8c3a5] block">Tell us about your project</label>
                    <textarea 
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Tell us about your business and what kind of website or graphics you need."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#2A1E17] border border-[#483323] text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 resize-none text-sm"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-stone-950 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message for Quotation</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8DFD3] py-8 px-4 sm:px-6 lg:px-8 text-xs text-[#7C6958]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#D9CEBE] bg-[#FBF9F5] p-0.5 shadow-xs">
              <img 
                src={KPB_LOGO_DATA_URL} 
                alt="The KPB Visuals Logo" 
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <span className="font-extrabold text-[#2A1E17] tracking-wider">THE KPB VISUALS</span>
          </div>

          <p className="text-xs text-[#8C7A68]">
            Websites & Social Media Graphics · <a href="https://www.facebook.com/p.kxts/" target="_blank" rel="noopener noreferrer" className="hover:underline text-[#2A1E17] font-medium">facebook.com/p.kxts</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
