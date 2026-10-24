import React, { useState, useEffect } from 'react';
import { Send, Mail, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface ContactSectionProps {
  initialPackage?: string;
  initialNotes?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialPackage,
  initialNotes
}) => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    packageType: initialPackage || 'starter-immersive',
    timeline: 'normal',
    notes: initialNotes || ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialPackage) {
      setFormData((prev) => ({ ...prev, packageType: initialPackage }));
    }
    if (initialNotes) {
      setFormData((prev) => ({ ...prev, notes: initialNotes }));
    }
  }, [initialPackage, initialNotes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const emailSubject = encodeURIComponent(`Project Inquiry: ${formData.packageType} - ${formData.businessName || formData.name}`);
  const emailBody = encodeURIComponent(`Hi The KPB Visuals,

Name: ${formData.name}
Business: ${formData.businessName}
Email: ${formData.email}
Phone/Viber: ${formData.phone}
Package: ${formData.packageType}
Timeline: ${formData.timeline}

Project Notes:
${formData.notes}
`);

  return (
    <section id="contact" className="py-24 border-t border-[#E6E0D6] relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#735A47] mb-2">
                Start Your Project
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#231A14] text-balance">
                Let's Build Something Great.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#554539] leading-relaxed">
                Send us your project details or chat directly. We respond within a few hours with a clear kickoff proposal.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-3 pt-2">
              <a
                href="mailto:thekpbvisuals@gmail.com"
                className="flex items-center gap-3 p-4 rounded-xl border border-[#E0D8CB] bg-[#FAF8F5] hover:border-[#231A14] hover:bg-white transition-all text-[#231A14] group shadow-xs"
              >
                <div className="p-2.5 rounded-lg bg-[#EFE8DD] text-[#231A14] group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-[#7A6A5E] font-medium">Direct Email</div>
                  <div className="text-sm font-bold text-[#231A14]">
                    thekpbvisuals@gmail.com
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-3 p-4 rounded-xl border border-[#E0D8CB] bg-[#FAF8F5] text-[#231A14] shadow-xs">
                <div className="p-2.5 rounded-lg bg-[#EFE8DD] text-[#231A14]">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-[#7A6A5E] font-medium">Chat Channels</div>
                  <div className="text-sm font-bold text-[#231A14]">
                    FB Messenger · WhatsApp · Viber
                  </div>
                </div>
              </div>
            </div>

            {/* Studio Guarantee */}
            <div className="p-5 rounded-xl border border-[#E0D8CB] bg-[#FAF8F5] text-xs text-[#554539] space-y-1.5 shadow-xs">
              <div className="font-bold text-[#231A14]">Our Promise:</div>
              <div>• Fast response within 2–4 hours (Manila Time PHT)</div>
              <div>• 50% downpayment only after agreed project scope</div>
              <div>• Private staging link to test before going live</div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#E0D8CB] bg-[#FAF8F5] p-6 sm:p-9 shadow-xs">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#EFE8DD] text-[#231A14] flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#231A14]">Inquiry Received!</h3>
                  <p className="text-xs sm:text-sm text-[#554539] max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#231A14]">{formData.name}</strong>. We received your request for <strong className="text-[#231A14]">{formData.packageType}</strong>. We will email our proposal to <span className="text-[#231A14] font-semibold">{formData.email}</span> shortly.
                  </p>
                  <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`mailto:thekpbvisuals@gmail.com?subject=${emailSubject}&body=${emailBody}`}
                      className="px-4 py-2.5 bg-[#231A14] hover:bg-[#3D2C22] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <span>Send Direct Email Copy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-4 py-2.5 bg-[#EFE8DD] hover:bg-[#E2D8CA] text-[#231A14] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#231A14] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Maria Santos"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-[#231A14] text-xs focus:outline-none focus:border-[#231A14] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#231A14] mb-1.5">
                        Business or Brand Name
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="e.g. Artisan Cafe"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-[#231A14] text-xs focus:outline-none focus:border-[#231A14] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#231A14] mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@email.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-[#231A14] text-xs focus:outline-none focus:border-[#231A14] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#231A14] mb-1.5">
                        Mobile / Viber / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+63 9XX XXX XXXX"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-[#231A14] text-xs focus:outline-none focus:border-[#231A14] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#231A14] mb-1.5">
                        Select Package
                      </label>
                      <select
                        value={formData.packageType}
                        onChange={(e) => setFormData({ ...formData, packageType: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-[#231A14] text-xs focus:outline-none focus:border-[#231A14] transition-colors cursor-pointer"
                      >
                        <option value="starter-basic">Starter: Basic Landing Page (₱4,999)</option>
                        <option value="starter-immersive">Starter: Immersive Experience (₱8,999)</option>
                        <option value="multipage">Multi-Page Website (Up to 4 Pages) (₱14,999)</option>
                        <option value="maintenance-guardian">Monthly: Site Guardian (₱2,499/mo)</option>
                        <option value="maintenance-growth">Monthly: Growth Partner (Web + 4 Posters) (₱4,999/mo)</option>
                        <option value="posters-starter">Social Media: Starter 3-Pack (₱1,499)</option>
                        <option value="posters-campaign">Social Media: Campaign 8-Pack (₱3,499)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#231A14] mb-1.5">
                        Launch Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-[#231A14] text-xs focus:outline-none focus:border-[#231A14] transition-colors cursor-pointer"
                      >
                        <option value="urgent">Rush (Within 48–72 Hours)</option>
                        <option value="normal">Standard (3–7 Days)</option>
                        <option value="flexible">Flexible / Planning Phase</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#231A14] mb-1.5">
                      Project Notes or Questions
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Tell us what you want to build and any style preferences..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#DCD3C5] text-[#231A14] text-xs focus:outline-none focus:border-[#231A14] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-6 bg-[#231A14] hover:bg-[#3D2C22] disabled:opacity-50 text-[#FAF8F5] font-bold text-xs uppercase tracking-wider rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? 'Submitting...' : 'Send Project Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
