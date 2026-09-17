import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ImageOff, Package, Phone, RefreshCw, ShieldCheck, Wrench } from 'lucide-react';

interface ProductCatalogProps { onContactDepot: () => void; }
interface CatalogProduct { id: number; code: string; name: string; size?: string; category: string; price: number; description?: string; image_url?: string; }
type Filter = 'all' | 'cylinders' | '3kg' | '6kg' | '12.5kg' | '38kg' | 'accessories';

const fallbackProducts: CatalogProduct[] = [
  { id: 1, code: '3KG', name: '3kg Camping Cylinder', size: '3kg', category: '3kg', price: 32000, description: 'Portable LPG cylinder.', image_url: '/uploads/default-3kg.jpg' },
  { id: 2, code: '6KG', name: '6kg Domestic Cylinder', size: '6kg', category: '6kg', price: 55000, description: 'Household LPG cylinder.', image_url: '/uploads/default-6kg.jpg' },
  { id: 3, code: '12.5KG', name: '12.5kg Family Cylinder', size: '12.5kg', category: '12.5kg', price: 90000, description: 'Family LPG cylinder.', image_url: '/uploads/1789549049679-12-5kg.jpg' },
  { id: 4, code: '38KG', name: '38kg Commercial Cylinder', size: '38kg', category: '38kg', price: 180000, description: 'Commercial LPG cylinder.', image_url: '/uploads/1789549017989-38kg.png' },
  { id: 5, code: 'ACCESSORIES', name: 'Gas Accessories', size: 'accessories', category: 'accessories', price: 0, description: 'Gas accessories and safety equipment.', image_url: '/uploads/default-accessories.svg' },
];

const fallbackImages: Record<string, string> = {
  '3KG': '/uploads/default-3kg.jpg',
  '6KG': '/uploads/default-6kg.jpg',
  '12.5KG': '/uploads/1789549049679-12-5kg.jpg',
  '38KG': '/uploads/1789549017989-38kg.png',
  ACCESSORIES: '/uploads/default-accessories.svg',
};

const imageForProduct = (product: CatalogProduct) => product.image_url || fallbackImages[String(product.code || '').trim().toUpperCase()] || '/uploads/default-accessories.svg';

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ onContactDepot }) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [products, setProducts] = useState<CatalogProduct[]>(fallbackProducts);
  const [openId, setOpenId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try { const response = await fetch('/api/products'); if (!response.ok) throw new Error('Catalogue unavailable'); const rows = await response.json(); if (Array.isArray(rows) && rows.length) setProducts(rows); }
    catch { setProducts(fallbackProducts); }
    finally { setLoading(false); }
  };
  useEffect(() => { loadProducts(); }, []);

  const filtered = useMemo(() => products.filter(product => {
    const category = String(product.category || '').toLowerCase();
    if (filter === 'all') return true;
    if (filter === 'cylinders') return category !== 'accessories' && category !== 'accessory';
    return category === filter;
  }), [products, filter]);

  const cylinders = filtered.filter(p => !['accessories', 'accessory'].includes(String(p.category).toLowerCase()));
  const accessories = filtered.filter(p => ['accessories', 'accessory'].includes(String(p.category).toLowerCase()));
  const formatUGX = (value: number) => value > 0 ? `UGX ${Number(value).toLocaleString('en-US')}` : 'Contact for price';

  const ProductCard = ({ product, accessory = false }: { product: CatalogProduct; accessory?: boolean }) => {
    const expanded = openId === product.id;
    const image = imageForProduct(product);
    return <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden"><img src={image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" onError={e => { const target = e.currentTarget; const fallback = fallbackImages[String(product.code || '').trim().toUpperCase()] || '/uploads/default-accessories.svg'; if (target.src.endsWith(fallback)) { target.style.display = 'none'; target.nextElementSibling?.classList.remove('hidden'); } else { target.src = fallback; } }} /><div className="hidden absolute inset-0 items-center justify-center"><ImageOff className="h-10 w-10 text-slate-300" /></div><div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/70 to-transparent"><span className="inline-flex rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase text-slate-800">{product.code}</span></div></div>
      <div className="p-5 flex-1 flex flex-col"><div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-orange-600"><span>{accessory ? <Wrench className="inline h-3.5 w-3.5"/> : <Package className="inline h-3.5 w-3.5"/>} {product.category}</span><span className="text-slate-300">•</span><span className="text-emerald-600">Available</span></div><h3 className="mt-2 text-lg font-black text-slate-900">{product.name}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-3">{product.description || 'Professional LPG supply item available from Adal Uganda.'}</p><div className="mt-4 pt-4 border-t border-slate-100"><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Direct supply price</p><p className="text-xl font-black text-slate-900">{formatUGX(product.price)}</p></div><div className="mt-4 grid grid-cols-2 gap-2"><button onClick={() => setOpenId(expanded ? null : product.id)} className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-300 px-3 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50">Details <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} /></button><button onClick={onContactDepot} className="inline-flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-black text-white hover:bg-orange-600"><Phone className="h-3.5 w-3.5 text-orange-400"/> Request Supply</button></div>{expanded && <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600"><div className="flex items-center gap-2 font-bold text-slate-800"><ShieldCheck className="h-4 w-4 text-emerald-600"/> Product information</div><p className="mt-2">Code: <strong>{product.code}</strong>{product.size ? ` • Size: ${product.size}` : ''}</p><p className="mt-1">Click Request Supply to send an inquiry to the Adal depot for current availability and delivery arrangements.</p></div>}</div>
    </article>;
  };

  return <section id="catalog" className="py-20 bg-white scroll-mt-24"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"><div><div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-orange-600"><Package className="h-4 w-4"/> Adal Catalogue</div><h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 font-display">LPG Cylinders & Accessories</h2><p className="mt-2 text-base text-slate-600 max-w-2xl">Browse current stock managed by the Adal operations team. Product names, prices, descriptions and images are connected to the admin catalogue.</p></div></div><div className="flex gap-2 overflow-x-auto pb-3 border-b border-slate-200 mb-10">{[['all','All'],['cylinders','Cylinders'],['3kg','3kg'],['6kg','6kg'],['12.5kg','12.5kg'],['38kg','38kg'],['accessories','Accessories']].map(([id,label]) => <button key={id} onClick={()=>setFilter(id as Filter)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-black ${filter===id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{label}</button>)}</div>{loading && <div className="flex items-center justify-center py-8 text-sm text-slate-500"><RefreshCw className="mr-2 h-4 w-4 animate-spin"/> Loading catalogue…</div>}{!loading && cylinders.length > 0 && <div className="mb-14"><div className="flex items-center justify-between mb-6"><h3 className="text-xl font-black text-slate-900">Cooking Gas Cylinders</h3><span className="text-xs font-bold text-slate-500">{cylinders.length} item{cylinders.length===1?'':'s'}</span></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{cylinders.map(product => <ProductCard key={product.id} product={product}/>)}</div></div>}{!loading && accessories.length > 0 && <div id="accessories" className="scroll-mt-28"><div className="flex items-center justify-between mb-6"><div><h3 className="text-xl font-black text-slate-900">Safety Accessories</h3><p className="mt-1 text-sm text-slate-500">Regulators, hoses, stands and other LPG support equipment.</p></div><span className="text-xs font-bold text-slate-500">{accessories.length} item{accessories.length===1?'':'s'}</span></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{accessories.map(product => <ProductCard key={product.id} product={product} accessory/>)}</div></div>}{!loading && filtered.length === 0 && <div className="py-16 text-center"><Package className="mx-auto h-10 w-10 text-slate-300"/><h3 className="mt-3 font-black text-slate-800">No items in this category</h3><p className="mt-1 text-sm text-slate-500">The admin can add new stock from the protected dashboard.</p></div>}</div></section>;
};
