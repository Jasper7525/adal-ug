import React from 'react';
import { 
  CheckCircle2, 
  X, 
  Phone, 
  Share2, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageCircle, 
  Copy, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { CustomerOrderForm, OrderItem } from '../types';
import { AdalLogo } from './AdalLogo';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    referenceNumber: string;
    form: CustomerOrderForm;
    items: OrderItem[];
    totalUGX: number;
    deliveryFeeUGX: number;
  } | null;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  orderData,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !orderData) return null;

  const { referenceNumber, form, items, totalUGX, deliveryFeeUGX } = orderData;

  const formatUGX = (val: number) => 'UGX ' + val.toLocaleString('en-US');

  // Generate WhatsApp dispatch message
  const itemsText = items.map(i => `• ${i.quantity}x ${i.title} (${formatUGX(i.unitPriceUGX * i.quantity)})`).join('%0A');
  const whatsappMessage = 
    `*NEW ORDER - ADAL UGANDA (MBARARA)*%0A%0A` +
    `*Order Ref:* %23${referenceNumber}%0A` +
    `*Customer Name:* ${encodeURIComponent(form.fullName)}%0A` +
    `*Phone:* ${encodeURIComponent(form.phoneNumber)}%0A` +
    `*Delivery Zone:* ${encodeURIComponent(form.deliveryZone.replace('zone-', ''))}%0A` +
    `*Address / Landmark:* ${encodeURIComponent(form.streetAddress)}%0A` +
    `*Speed:* ${encodeURIComponent(form.deliverySpeed)}%0A` +
    `*Payment Method:* ${encodeURIComponent(form.paymentMethod)}%0A%0A` +
    `*Items:*%0A${itemsText}%0A%0A` +
    `*Total Payable:* ${encodeURIComponent(formatUGX(totalUGX))}%0A` +
    `*Free Safety Leak Check:* ${form.requestSafetyCheck ? 'Yes (Requested)' : 'No'}%0A%0A` +
    `Please dispatch rider to my location in Mbarara.`;

  const whatsappUrl = `https://wa.me/256772123456?text=${whatsappMessage}`;

  const copyRef = () => {
    navigator.clipboard?.writeText(referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-between pr-8 mb-4 pb-3 border-b border-slate-800">
            <AdalLogo variant="horizontal" theme="dark" size="sm" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
              Official Dispatch
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Order Received & Queued
              </span>
              <h3 className="text-xl font-extrabold font-display">
                Mbarara Dispatch Alerted!
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 mt-1">
            Thank you, <strong className="text-white">{form.fullName}</strong>. Our dispatch officer is 
            preparing your cylinder with digital scale verification.
          </p>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* Reference Card */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Order Reference</span>
              <p className="text-lg font-black font-mono text-slate-900 tracking-wider">
                #{referenceNumber}
              </p>
            </div>
            <button
              onClick={copyRef}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Delivery Details Snapshot */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-cyan-50/70 border border-cyan-100 text-cyan-950">
              <span className="text-slate-500 flex items-center gap-1 mb-1 font-semibold">
                <Clock className="w-3.5 h-3.5 text-cyan-600" />
                ETA in Mbarara
              </span>
              <p className="font-bold text-sm text-cyan-900">30–45 Mins</p>
              <p className="text-[11px] text-cyan-700">Rider on bike/van</p>
            </div>

            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100 text-orange-950">
              <span className="text-slate-500 flex items-center gap-1 mb-1 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-orange-600" />
                Delivery Location
              </span>
              <p className="font-bold text-sm text-orange-900 truncate">
                {form.streetAddress || 'Mbarara City'}
              </p>
              <p className="text-[11px] text-orange-700">Zone: {form.deliveryZone.replace('zone-', '')}</p>
            </div>
          </div>

          {/* Ordered Items Summary */}
          <div className="border border-slate-200 rounded-2xl p-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100">
              <span>Items Ordered</span>
              <span>Subtotal</span>
            </div>
            <div className="divide-y divide-slate-100 py-2 space-y-2">
              {items.map(item => (
                <div key={item.id} className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-800 font-medium">
                    {item.quantity}x {item.title}
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatUGX(item.unitPriceUGX * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="text-xs font-extrabold text-slate-900 uppercase">Total Payable on Delivery:</span>
              <span className="text-lg font-black text-orange-600 font-display">
                {formatUGX(totalUGX)}
              </span>
            </div>
          </div>

          {/* Safety guarantee */}
          {form.requestSafetyCheck && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Complimentary Safety Check Included:</strong> Our rider will test your valve and connection for free.
              </span>
            </div>
          )}

          {/* CTAs */}
          <div className="space-y-2.5 pt-2">
            {/* Primary Action: Direct WhatsApp Dispatch Notification */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Notify Dispatch via WhatsApp (Instant Rider Assignment)</span>
            </a>

            {/* Call Dispatch Button */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="tel:+256772123456"
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-cyan-700" />
                <span>Call Hotline</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                Done / Back to Website
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
