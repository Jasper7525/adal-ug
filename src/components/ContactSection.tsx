import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp,
  Award,
  ExternalLink
} from 'lucide-react';
import { SAFETY_TIPS, TESTIMONIALS } from '../data/products';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    inquiryType: 'domestic',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.emailOrPhone || !formData.message) return;

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        emailOrPhone: '',
        inquiryType: 'domestic',
        message: '',
      });
    }, 4000);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Testimonials Header & Carousel Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
              Real Stories from Western Uganda
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              What Mbarara Residents & Businesses Say
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(item => (
              <div 
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(item.rating)].map((_, i) => (
                      <span key={i} className="text-sm">★</span>
                    ))}
                    <span className="text-xs font-bold text-slate-500 ml-2">5.0 Star</span>
                  </div>
                  <p className="text-sm text-slate-700 italic leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{item.name}</h5>
                    <p className="text-[11px] text-slate-500">{item.role}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {item.cylinder}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiries & Contact Dual-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Clean Contact Form with Floating Labels (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase text-orange-600 tracking-wider">
                Direct Inquiries & Support
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
                Send Us a Message
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Have a question about bulk commercial supply, cylinder safety, or dealership in Mbarara? 
                We respond promptly within minutes during business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-emerald-900">Message Received!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you for reaching out to Adal Uganda. Our Mbarara customer liaison will call or WhatsApp you shortly.
                </p>
              </div>
            ) : (
              <form id="contact-form" onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name */}
                <div className="relative">
                  <input
                    type="text"
                    id="contact-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder=" "
                    className="block w-full px-4 pt-5 pb-2 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white peer transition-all"
                  />
                  <label 
                    htmlFor="contact-name"
                    className="absolute text-xs text-slate-500 duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange-600"
                  >
                    Your Full Name *
                  </label>
                </div>

                {/* Contact: Phone or Email */}
                <div className="relative">
                  <input
                    type="text"
                    id="contact-details"
                    value={formData.emailOrPhone}
                    onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                    required
                    placeholder=" "
                    className="block w-full px-4 pt-5 pb-2 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white peer transition-all"
                  />
                  <label 
                    htmlFor="contact-details"
                    className="absolute text-xs text-slate-500 duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange-600"
                  >
                    Phone Number or Email Address *
                  </label>
                </div>

                {/* Inquiry Type Select */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Subject / Nature of Inquiry
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-4 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="domestic">Domestic Home Refill & Delivery</option>
                    <option value="commercial">Commercial Supply (Restaurants, Hotels & Bakeries)</option>
                    <option value="dealership">Retail Reseller & Dealership Partnership</option>
                    <option value="safety">Safety Inspection or Gas Leak Report</option>
                    <option value="other">General Customer Inquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div className="relative">
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    placeholder=" "
                    className="block w-full px-4 pt-5 pb-2 text-sm text-slate-900 bg-slate-50 border border-slate-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white peer transition-all resize-none"
                  />
                  <label 
                    htmlFor="contact-message"
                    className="absolute text-xs text-slate-500 duration-200 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-orange-600"
                  >
                    How can we assist you in Mbarara? *
                  </label>
                </div>

                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="w-full py-3.5 px-6 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <Send className="w-4 h-4 text-orange-400" />
                  <span>Send Inquiry to Mbarara Team</span>
                </button>

                <p className="text-[11px] text-center text-slate-500">
                  For immediate emergency gas refills, please call our hotline: <strong>+256 772 123 456</strong>
                </p>
              </form>
            )}
          </div>

          {/* Right Column: Local Contact Cards (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              <span className="text-xs font-bold uppercase text-cyan-700 tracking-wider">
                Physical Location & Dispatch Hub
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 font-display mt-1">
                Adal Uganda Main Depot
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Centrally located in Mbarara City for rapid distribution across all divisions.
              </p>
            </div>

            {/* Depot Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Mbarara Depot & Showroom</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Plot 14, Mbarara-Masaka Highway, Near Shell Malindi & Mbarara Central Market,
                    Mbarara City, Western Uganda.
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                    Direct pickup & exchange available
                  </span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Operating Hours</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong>Monday – Saturday:</strong> 7:00 AM – 9:30 PM<br />
                    <strong>Sunday:</strong> 8:00 AM – 8:30 PM<br />
                    <span className="text-orange-600 font-semibold">24/7 Emergency Commercial & Hospital Refill Hotline</span>
                  </p>
                </div>
              </div>

              {/* Google Map Embed */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-slate-900">Find Us on Google Maps</h4>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Plot%2014%2C%20Mbarara-Masaka%20Highway%2C%20Mbarara%20City%2C%20Uganda"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-800 hover:text-cyan-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Map</span>
                  </a>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
                  <iframe
                    title="Adal Uganda Mbarara Depot Map"
                    src="https://www.google.com/maps?q=Plot%2014%2C%20Mbarara-Masaka%20Highway%2C%20Mbarara%20City%2C%20Uganda&output=embed"
                    className="w-full h-56 border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              {/* Telephone hotlines */}
              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Direct Phone Contacts</h4>
                  <div className="flex flex-col sm:flex-row gap-2 mt-1">
                    <a 
                      href="tel:+256772123456" 
                      className="text-xs font-bold text-slate-900 hover:text-cyan-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
                    >
                      +256 772 123 456 (Dispatch)
                    </a>
                    <a 
                      href="tel:+256701987654" 
                      className="text-xs font-bold text-slate-900 hover:text-cyan-800 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
                    >
                      +256 701 987 654 (Admin)
                    </a>
                  </div>
                </div>
              </div>

              {/* Email & Registration */}
              <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Official Company Email</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    info@adaluganda.co.ug • sales@adaluganda.co.ug
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Adal Uganda Company Limited (Reg. URSB No. 8002000349182)
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Safety Tips Accordion */}
            <div id="safety" className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 font-display">
                <ShieldAlert className="w-4 h-4 text-orange-500" />
                <span>Essential LPG Safety Guidelines</span>
              </h4>

              <div className="space-y-2">
                {SAFETY_TIPS.map((tip, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div 
                      key={index}
                      className="border border-slate-200/80 rounded-xl overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                        className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between gap-2 text-xs font-bold text-slate-800"
                      >
                        <span>{tip.title}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </button>
                      {isOpen && (
                        <div className="p-3.5 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                          {tip.detail}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
