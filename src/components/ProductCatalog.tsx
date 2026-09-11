import React, { useState } from 'react';
import {
  Star,
  Phone,
} from 'lucide-react';
import { CYLINDER_PRODUCTS, ACCESSORY_PRODUCTS } from '../data/products';
import { ProductCategory } from '../types';

interface ProductCatalogProps {
  onContactDepot: () => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onContactDepot }) => {
  const [activeTab, setActiveTab] = useState<ProductCategory>('all');
  const [openDetailsId, setOpenDetailsId] = useState<string | null>(null);

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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              LPG Cylinders & Accessories
            </h2>
            <p className="mt-2 text-base text-slate-600 max-w-2xl">
              Adal Uganda supplies cylinders and accessories through the Mbarara depot for gas points, kitchens and commercial service teams.
            </p>
          </div>

          <button
            onClick={onContactDepot}
            className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-colors"
          >
            <Phone className="w-4 h-4 text-orange-400" />
            <span>Request Supply List</span>
          </button>
        </div>

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
                Certified LPG stock for gas points and commercial kitchens
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCylinders.map(product => {
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                        <div className="absolute top-1 left-1 flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-900/90 text-white backdrop-blur-sm border border-slate-700">
                            {product.sizeKg}kg LPG
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-900/90 text-emerald-200 backdrop-blur-sm">
                            In Stock
                          </span>
                        </div>
                      </div>

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

                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            Direct Supply Price
                          </span>
                          <p className="text-xl font-extrabold text-slate-900 font-display">
                            {formatUGX(product.refillPriceUGX)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0 space-y-2">
                      <button
                        onClick={() => {
                          setOpenDetailsId(openDetailsId === product.id ? null : product.id);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 shadow-sm"
                        aria-expanded={openDetailsId === product.id}
                      >
                        <span>{openDetailsId === product.id ? 'Hide Details' : 'Details'}</span>
                      </button>

                      {openDetailsId === product.id && (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-[11px] text-slate-700">
                          <div className="mb-2 flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="font-bold uppercase tracking-wide text-slate-500">Purchase Type</span>
                            <span className="font-bold uppercase tracking-wide text-slate-500">UGX Price</span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold text-slate-700">Refill Only</span>
                              <span className="font-bold text-slate-900">{formatUGX(product.refillPriceUGX)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold text-slate-700">Cylinder + Gas</span>
                              <span className="font-bold text-slate-900">{formatUGX(product.completePriceUGX)}</span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-semibold text-slate-700">Complete Package</span>
                              <span className="font-bold text-slate-900">{formatUGX(product.completePriceUGX + 100000)}</span>
                            </div>
                          </div>

                          <div className="mt-3 border-t border-slate-200 pt-2 text-[10px] leading-5 text-slate-600">
                            <span className="font-extrabold text-slate-900">Refill Exchange Notice:</span> Please ensure you have an empty cylinder of the same size ready for exchange upon delivery.
                          </div>
                        </div>
                      )}

                      <button
                        onClick={onContactDepot}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                      >
                        <Phone className="w-3 h-3 text-orange-400" />
                        <span>Request Supply</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {showAccessories && (
          <div id="accessories">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
                  <span>Safety Accessories</span>
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
                return (
                  <div
                    key={accessory.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                        <img
                          src={accessory.image}
                          alt={accessory.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

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
                        onClick={onContactDepot}
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
                      >
                        <Phone className="w-4 h-4 text-orange-400" />
                        <span>Request Accessory</span>
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
