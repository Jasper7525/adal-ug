import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Flame,
  AlertCircle,
  HelpCircle,
  FileText
} from 'lucide-react';
import { OrderItem, CustomerOrderForm } from '../types';
import { MBARARA_DELIVERY_ZONES, CYLINDER_PRODUCTS, ACCESSORY_PRODUCTS } from '../data/products';
import { AdalLogo } from './AdalLogo';

interface OrderSystemProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onAddItem: (item: OrderItem) => void;
  onSubmitOrder: (formData: CustomerOrderForm, items: OrderItem[], totalUGX: number, deliveryFeeUGX: number) => void;
}

export const OrderSystem: React.FC<OrderSystemProps> = ({
  orderItems,
  onUpdateQuantity,
  onRemoveItem,
  onAddItem,
  onSubmitOrder,
}) => {
  const [formData, setFormData] = useState<CustomerOrderForm>({
    fullName: '',
    phoneNumber: '',
    altPhoneNumber: '',
    deliveryZone: 'zone-city',
    streetAddress: '',
    specialInstructions: '',
    paymentMethod: 'cash_on_delivery',
    deliverySpeed: 'express',
    requestSafetyCheck: true,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick picker state within the form
  const [quickPickTab, setQuickPickTab] = useState<'refills' | 'complete' | 'accessories'>('refills');

  const selectedZone = MBARARA_DELIVERY_ZONES.find(z => z.id === formData.deliveryZone) || MBARARA_DELIVERY_ZONES[0];

  const subtotalUGX = orderItems.reduce((sum, item) => sum + (item.unitPriceUGX * item.quantity), 0);
  const deliveryFeeUGX = orderItems.length > 0 ? selectedZone.deliveryFeeUGX : 0;
  const totalUGX = subtotalUGX + deliveryFeeUGX;

  const handleInputChange = (field: keyof CustomerOrderForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleQuickAdd = (type: 'refill' | 'complete', product: typeof CYLINDER_PRODUCTS[0]) => {
    const price = type === 'refill' ? product.refillPriceUGX : product.completePriceUGX;
    onAddItem({
      id: `${product.id}-${type}-${Date.now()}`,
      productId: product.id,
      title: `${product.name} (${type === 'refill' ? 'Gas Refill' : 'Complete Cylinder'})`,
      type,
      size: `${product.sizeKg}kg`,
      unitPriceUGX: price,
      quantity: 1,
      image: product.image
    });
  };

  const handleQuickAddAccessory = (accessory: typeof ACCESSORY_PRODUCTS[0]) => {
    onAddItem({
      id: `${accessory.id}-${Date.now()}`,
      productId: accessory.id,
      title: accessory.name,
      type: 'accessory',
      unitPriceUGX: accessory.priceUGX,
      quantity: 1,
      image: accessory.image
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      errors.fullName = 'Please enter your recipient name';
    }
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Valid phone number is required for dispatch';
    } else if (formData.phoneNumber.replace(/\D/g, '').length < 9) {
      errors.phoneNumber = 'Please enter a valid phone number (e.g. 0772123456 or +256...)';
    }
    if (!formData.streetAddress.trim()) {
      errors.streetAddress = 'Please specify your building, hostel, or nearby landmark in Mbarara';
    }
    if (orderItems.length === 0) {
      errors.items = 'Please select at least one gas cylinder or accessory to place an order';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmitOrder(formData, orderItems, totalUGX, deliveryFeeUGX);
    }, 600);
  };

  const formatUGX = (val: number) => {
    return 'UGX ' + val.toLocaleString('en-US');
  };

  return (
    <section id="order" className="py-20 bg-slate-900 text-white relative">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Truck className="w-3.5 h-3.5" />
            Seamless Doorstep Order System
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white">
            Order Your Cooking Gas in Mbarara
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Build your order, select your Mbarara neighborhood, and our mobile dispatch rider will 
            arrive with an authenticated digital scale and complimentary safety leak inspection.
          </p>
        </div>

        {/* Form & Sticky Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Form & Item Selector (8 cols) */}
          <div className="lg:col-span-7 space-y-8">

            {/* Step 1: Quick Add Items Card */}
            <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-slate-950 text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <span>Select Cooking Gas or Accessories</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click to add your required cylinder sizes or safety gear
                  </p>
                </div>

                {/* Sub tabs */}
                <div className="flex p-1 bg-slate-900/90 rounded-xl border border-slate-700/80 self-start">
                  <button
                    type="button"
                    onClick={() => setQuickPickTab('refills')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      quickPickTab === 'refills'
                        ? 'bg-orange-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Gas Refills
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickPickTab('complete')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      quickPickTab === 'complete'
                        ? 'bg-orange-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Complete Sets
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickPickTab('accessories')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      quickPickTab === 'accessories'
                        ? 'bg-orange-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Accessories
                  </button>
                </div>
              </div>

              {/* Items Grid for Fast Selection */}
              {quickPickTab === 'refills' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CYLINDER_PRODUCTS.map(cylinder => (
                    <button
                      key={`refill-${cylinder.id}`}
                      type="button"
                      onClick={() => handleQuickAdd('refill', cylinder)}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/50 text-left transition-all duration-200 group flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-orange-400 block mb-0.5">
                          {cylinder.sizeKg}kg Refill
                        </span>
                        <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                          {cylinder.name}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white">
                          {formatUGX(cylinder.refillPriceUGX)}
                        </span>
                        <span className="w-5 h-5 rounded-md bg-orange-500/20 group-hover:bg-orange-500 text-orange-400 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {quickPickTab === 'complete' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CYLINDER_PRODUCTS.map(cylinder => (
                    <button
                      key={`complete-${cylinder.id}`}
                      type="button"
                      onClick={() => handleQuickAdd('complete', cylinder)}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 text-left transition-all duration-200 group flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-cyan-400 block mb-0.5">
                          {cylinder.sizeKg}kg Complete
                        </span>
                        <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                          {cylinder.name}
                        </p>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white">
                          {formatUGX(cylinder.completePriceUGX)}
                        </span>
                        <span className="w-5 h-5 rounded-md bg-cyan-500/20 group-hover:bg-cyan-500 text-cyan-400 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {quickPickTab === 'accessories' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACCESSORY_PRODUCTS.map(acc => (
                    <button
                      key={`acc-${acc.id}`}
                      type="button"
                      onClick={() => handleQuickAddAccessory(acc)}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-700 border border-slate-700 hover:border-orange-500/50 text-left transition-all duration-200 group flex items-center justify-between"
                    >
                      <div className="pr-2">
                        <p className="text-xs font-bold text-slate-200 line-clamp-1">
                          {acc.name}
                        </p>
                        <span className="text-xs font-extrabold text-orange-400">
                          {formatUGX(acc.priceUGX)}
                        </span>
                      </div>
                      <span className="w-6 h-6 rounded-md bg-slate-800 group-hover:bg-orange-500 text-slate-300 group-hover:text-slate-950 flex items-center justify-center shrink-0 transition-colors">
                        <Plus className="w-4 h-4" />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Items in Basket Notice or Validation error */}
              {formErrors.items && (
                <div className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formErrors.items}</span>
                </div>
              )}
            </div>

            {/* Step 2: Delivery & Contact Form */}
            <form onSubmit={handleSubmit} className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-lg space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-orange-500 text-slate-950 text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <span>Recipient & Delivery Details in Mbarara</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Our dispatch team calls to confirm exact coordinates before departure
                </p>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="e.g. Kenneth Muhwezi"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                        formErrors.fullName ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                {/* Primary Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone Number (for Mbarara Dispatch) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="0772 123 456 or +256..."
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                        formErrors.phoneNumber ? 'border-rose-500' : 'border-slate-700'
                      }`}
                    />
                  </div>
                  {formErrors.phoneNumber && (
                    <p className="text-[11px] text-rose-400 mt-1">{formErrors.phoneNumber}</p>
                  )}
                </div>

              </div>

              {/* Mbarara Delivery Zone Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Delivery Zone in Mbarara *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.deliveryZone}
                    onChange={(e) => handleInputChange('deliveryZone', e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                  >
                    {MBARARA_DELIVERY_ZONES.map(zone => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name} — {zone.deliveryFeeUGX === 0 ? 'FREE Delivery' : `+${formatUGX(zone.deliveryFeeUGX)} fee`} (ETA: {zone.estTime})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Landmarks in selected zone: <span className="text-slate-300">{selectedZone.popularLandmarks}</span>
                </p>
              </div>

              {/* Detailed Street Address / Hostel / Landmark */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Specific Street / Landmark / Hostel / House Number *
                </label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  placeholder="e.g. Opposite Ntare School main gate, Green Gate Compound / Room 14"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                    formErrors.streetAddress ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.streetAddress && (
                  <p className="text-[11px] text-rose-400 mt-1">{formErrors.streetAddress}</p>
                )}
              </div>

              {/* Delivery Speed / Priority Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Delivery Urgency
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'express', label: 'Express Delivery', detail: `Arrives in ${selectedZone.estTime}`, highlight: true },
                    { id: 'standard', label: 'Standard Today', detail: 'Within 2–3 hours' },
                    { id: 'scheduled', label: 'Schedule Evening', detail: 'After 6:00 PM' },
                  ].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleInputChange('deliverySpeed', option.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.deliverySpeed === option.id
                          ? 'bg-orange-500/15 border-orange-500 text-white'
                          : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white">{option.label}</p>
                        {formData.deliverySpeed === option.id && (
                          <CheckCircle className="w-3.5 h-3.5 text-orange-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{option.detail}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Payment Method (Pay On Delivery)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'cash_on_delivery', title: 'Cash on Delivery', desc: 'Pay rider in cash' },
                    { id: 'mobile_money', title: 'MTN MoMo', desc: 'Instant MoMo Pay' },
                    { id: 'airtel_money', title: 'Airtel Money', desc: 'Merchant Till/Code' },
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => handleInputChange('paymentMethod', method.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.paymentMethod === method.id
                          ? 'bg-cyan-500/15 border-cyan-400 text-white'
                          : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-white">{method.title}</p>
                        {formData.paymentMethod === method.id && (
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{method.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Safety Checkbox */}
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.requestSafetyCheck}
                  onChange={(e) => handleInputChange('requestSafetyCheck', e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-orange-500 bg-slate-800 border-slate-600 rounded focus:ring-orange-400"
                />
                <div className="text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Complimentary On-Site Safety Leak Inspection (FREE)
                  </span>
                  <p className="text-slate-400 mt-0.5">
                    Our certified technician will check your regulator, test the rubber safety seal with soapy water, 
                    and confirm zero gas leaks before handing over.
                  </p>
                </div>
              </label>

              {/* Submit Button on Mobile (also in sticky desktop sidebar) */}
              <div className="lg:hidden pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl text-base font-bold text-slate-950 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-300 hover:to-amber-400 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <Flame className="w-5 h-5 fill-slate-950" />
                  <span>Confirm Delivery Order ({formatUGX(totalUGX)})</span>
                </button>
              </div>

            </form>

          </div>

          {/* Right Column: Sticky Order Summary Widget (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="bg-slate-800/95 rounded-2xl p-6 border border-slate-700 shadow-2xl backdrop-blur-md">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <AdalLogo variant="icon" size="sm" />
                  <div>
                    <h3 className="font-bold text-white text-base font-display">Order Summary</h3>
                    <p className="text-[11px] text-slate-400">
                      {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'} in basket
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Ready to Dispatch
                </span>
              </div>

              {/* Itemized list */}
              <div className="py-4 space-y-3 max-h-72 overflow-y-auto pr-1">
                {orderItems.length === 0 ? (
                  <div className="text-center py-8 px-4 border border-dashed border-slate-700 rounded-xl">
                    <Flame className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-300">Your basket is empty</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Select a cylinder refill, new complete set, or accessory from Step 1 or the catalog above.
                    </p>
                  </div>
                ) : (
                  orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {formatUGX(item.unitPriceUGX)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity adjustment */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="w-6 h-6 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 flex items-center justify-center transition-colors ml-1"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Calculation breakdown */}
              <div className="pt-4 border-t border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-slate-200">{formatUGX(subtotalUGX)}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <span>Delivery ({selectedZone.name.split('&')[0]})</span>
                  </span>
                  <span className="font-semibold text-slate-200">
                    {deliveryFeeUGX === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      formatUGX(deliveryFeeUGX)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Safety Inspection & Scale Check</span>
                  <span className="text-emerald-400 font-bold">FREE (Complimentary)</span>
                </div>

                {/* Total */}
                <div className="pt-3 border-t border-slate-700 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Total Payable (UGX)
                    </span>
                    <span className="text-[11px] text-slate-400">Pay upon delivery</span>
                  </div>
                  <span className="text-2xl font-extrabold text-white font-display text-orange-400">
                    {formatUGX(totalUGX)}
                  </span>
                </div>
              </div>

              {/* Delivery ETA Badge */}
              <div className="mt-4 p-3 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center gap-2.5 text-xs text-cyan-200">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <p className="font-semibold">Estimated Arrival: {selectedZone.estTime}</p>
                  <p className="text-[11px] text-cyan-300/80">Direct dispatch from Mbarara Depot</p>
                </div>
              </div>

              {/* Desktop Submit Button */}
              <div className="hidden lg:block mt-5">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  id="order-summary-submit-btn"
                  className="w-full py-4 px-6 rounded-xl text-base font-bold text-slate-950 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 hover:from-orange-300 hover:to-amber-400 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/35 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Flame className="w-5 h-5 fill-slate-950" />
                  <span>
                    {isSubmitting ? 'Processing Dispatch...' : `Confirm Order • ${formatUGX(totalUGX)}`}
                  </span>
                </button>
              </div>

              {/* Security reassurance */}
              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero advance deposit required • Pay when satisfied</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
