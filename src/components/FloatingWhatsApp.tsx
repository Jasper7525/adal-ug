import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, Check } from 'lucide-react';
import { AdalLogo } from './AdalLogo';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const phone = '256772123456';

  const quickMessages = [
    'Hello Adal Uganda, I need an urgent cooking gas refill in Mbarara.',
    'Please send me the current price list for complete cylinders.',
    'I manage a restaurant in Mbarara and need bulk commercial 38kg supply.',
    'Can a technician check my regulator for leaks today?'
  ];

  const handleSend = (text: string) => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Chat Window */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white p-1.5 flex items-center justify-center shadow-md">
                  <AdalLogo variant="icon" size="sm" className="w-full h-full" />
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-300 border-2 border-emerald-700 absolute bottom-0 right-0"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm">Adal Mbarara Dispatch</h4>
                <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-ping"></span>
                  Typically replies in 2 minutes
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-slate-50 space-y-3">
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 shadow-2xl">
              <p className="font-semibold text-slate-900 mb-1">👋 Welcome to Adal Uganda!</p>
              <p className="text-slate-600">
                How can our Mbarara distribution team assist your home or kitchen today? Tap a quick option below:
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="space-y-1.5">
              {quickMessages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(msg)}
                  className="w-full text-left p-2 rounded-xl bg-white hover:bg-emerald-50 text-[11px] font-medium text-slate-800 hover:text-emerald-900 border border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-between group"
                >
                  <span className="truncate pr-2">{msg}</span>
                  <Send className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="pt-2 flex items-center gap-1.5">
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customMsg.trim()) {
                    handleSend(customMsg);
                    setCustomMsg('');
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                onClick={() => {
                  if (customMsg.trim()) {
                    handleSend(customMsg);
                    setCustomMsg('');
                  }
                }}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow transition-colors"
                aria-label="Send WhatsApp message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-slate-100 text-center border-t border-slate-200 text-[10px] text-slate-500">
            Official WhatsApp Hotline: +256 772 123 456
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="floating-whatsapp-btn"
        className="relative group flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Open WhatsApp Chat with Mbarara Dispatch"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
        </span>

        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden sm:inline text-xs font-bold tracking-wide pr-1">
          Chat with Mbarara Dispatch
        </span>
      </button>
    </div>
  );
};
