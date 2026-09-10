import React, { useState } from 'react';
import { 
  Flame, 
  Check, 
  ShoppingBag, 
  Sparkles, 
  Layers, 
  Info, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';
import { CYLINDER_PRODUCTS, ACCESSORY_PRODUCTS } from '../data/products';
import { Product, AccessoryItem, ProductCategory, OrderItem } from '../types';

interface ProductCatalogProps {
  onAddToCart: (item: OrderItem) => void;
  onOpenOrderModal: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart, onOpenOrderModal }) => {
  const [activeTab, setActiveTab] = useState<ProductCategory>('all');
  
  // Track selected type (refill vs complete) per cylinder ID
  const [selectedTypes, setSelectedTypes] = useState<Record<string, 'refill' | 'complete'>>({
    'lpg-3kg': 'refill',
    'lpg-6kg': 'refill',
    'lpg-12.5kg': 'refill',
    'lpg-38kg': 'refill',
  });

  // Track added animation feedback per product
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const toggleCylinderType = (cylinderId: string, type: 'refill' | 'complete') => {
    setSelectedTypes(prev => ({
      ...prev,
      [cylinderId]: type
    }));
  };

  const handleAddCylinder = (product: Product) => {
    const currentType = selectedTypes[product.id] || 'refill';
    const price = currentType === 'refill' ? product.refillPriceUGX : product.completePriceUGX;
    const title = `${product.name} (${currentType === 'refill' ? 'Gas Refill' : 'Complete Cylinder Set'})`;

    onAddToCart({
      id: `${product.id}-${currentType}-${Date.now()}`,
      productId: product.id,
      title,
      type: currentType,
      size: `${product.sizeKg}kg`,
      unitPriceUGX: price,
      quantity: 1,
      image: product.image
    });

    setAddedNotice(product.id);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  const handleAddAccessory = (accessory: AccessoryItem) => {
    onAddToCart({
      id: `${accessory.id}-${Date.now()}`,
      productId: accessory.id,
      title: accessory.name,
      type: 'accessory',
      unitPriceUGX: accessory.priceUGX,
      quantity: 1,
      image: accessory.image
    });

    setAddedNotice(accessory.id);
    setTimeout(() => setAddedNotice(null), 2000);
  };

  // Filter cylinders and accessories based on active tab
  const filteredCylinders = CYLINDER_PRODUCTS.filter(c => {
    if (activeTab === 'all' || activeTab === 'cylinders') return true;
    return c.category === activeTab;
  });

  const showAccessories = activeTab === 'all' || activeTab === 'accessories';

  const formatUGX = (val: number) => {
    return 'UGX ' + val.toLocaleString('en-US');
  };

  return (
    <section id="catalog" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 text-orange-600 fill-orange-600" />
              Direct Pricing in Ugandan Shillings (UGX)
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              LPG Cylinders & Certified Accessories
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Choose from standard domestic sizes or high-output commercial tanks. 
              Toggle between a <strong className="text-slate-800">Refill</strong> (bring your empty cylinder or swap) 
              and a <strong className="text-slate-800">Complete Set</strong> (new cylinder + gas + burner/regulator).
            </p>
          </div>

          <button
            onClick={onOpenOrderModal}
            className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-orange-400" />
            <span>Open Dynamic Order Builder</span>
          </button>
        </div>

        {/* Category Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 border-b border-slate-200 scrollbar-none">
          {[
            { id: 'all', label: 'All Catalog' },
            { id: 'cylinders', label: 'All Cylinders' },
            { id: '3kg', label: '3kg Compact' },
            { id: '6kg', label: '6kg Domestic' },
            { id: '12.5kg', label: '12.5kg Family' },
            { id: '38kg', label: '38kg Commercial' },
            { id: 'accessories', label: 'Safety Accessories' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ProductCategory)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-slate-900 to-cyan-950 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cylinders Grid */}
        {filteredCylinders.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                <span>Cooking Gas Cylinders</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                  {filteredCylinders.length} Sizes Available
                </span>
              </h3>
              <p className="text-xs text-slate-500 hidden sm:block">
                All cylinders pressure tested & certified by UNBS
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCylinders.map(product => {
                const currentType = selectedTypes[product.id] || 'refill';
                const activePrice = currentType === 'refill' ? product.refillPriceUGX : product.completePriceUGX;
                const isAdded = addedNotice === product.id;

                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image Header with badges */}
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                        {/* Top Badges */}
                        <div className="absolute top-1 left-1 flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-900/90 text-white backdrop-blur-sm border border-slate-700">
                            {product.sizeKg}kg LPG
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-900/90 text-emerald-200 backdrop-blur-sm">
                            In Stock
                          </span>
                        </div>

                        {/* Bottom image overlay specs */}
                      </div>

                      {/* Card Body */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {product.bestFor}
                          </span>
                          <div className="flex items-center gap-1 text-[8px] text-amber-500 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-slate-400 text-[7px]">({product.reviewsCount})</span>
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-cyan-800 transition-colors font-display line-clamp-2">
                          {product.name}
                        </h4>

                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Refill vs Complete Segmented Control */}
                        <div className="mt-4 p-1 rounded-lg bg-slate-100 border border-slate-200 flex items-center">
                          <button
                            type="button"
                            onClick={() => toggleCylinderType(product.id, 'refill')}
                            className={`flex-1 py-1 px-1 rounded text-[8px] font-bold transition-all duration-200 text-center ${
                              currentType === 'refill'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            Refill
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleCylinderType(product.id, 'complete')}
                            className={`flex-1 py-1 px-1 rounded text-[8px] font-bold transition-all duration-200 text-center ${
                              currentType === 'complete'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                            }`}
                          >
                            Complete
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Card Footer Action */}
                    <div className="p-5 pt-0">
                      <button
                        onClick={() => handleAddCylinder(product)}
                        id={`add-cylinder-${product.id}`}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Accessories Grid */}
        {showAccessories && (
          <div id="accessories">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                  <span>Certified Cylinder Safety Accessories</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800">
                    4 Safety Essentials
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  High-grade regulators, steel-braided safety hoses, stands and spark lighters
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {ACCESSORY_PRODUCTS.map(accessory => {
                const isAdded = addedNotice === accessory.id;

                return (
                  <div
                    key={accessory.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={accessory.image}
                          alt={accessory.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 rounded-md text-[10px] font-extrabold bg-slate-900/90 text-white backdrop-blur-sm">
                            Certified Safety Part
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Universal Compatibility
                          </span>
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{accessory.rating}</span>
                          </div>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 group-hover:text-cyan-800 transition-colors font-display line-clamp-2">
                          {accessory.name}
                        </h4>

                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                          {accessory.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Direct Unit Price
                          </span>
                          <p className="text-xl font-extrabold text-slate-900 font-display">
                            {formatUGX(accessory.priceUGX)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => handleAddAccessory(accessory)}
                        id={`add-accessory-${accessory.id}`}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added to Order!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 text-orange-400" />
                            <span>Add Accessory</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
