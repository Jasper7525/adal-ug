import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart3, Boxes, CheckCircle2, Edit3, Eye, ImagePlus, LogOut, Package,
  RefreshCw, Save, ShieldCheck, ShoppingCart, Trash2, Truck, Users, X,
} from 'lucide-react';

interface Product {
  id: number; code: string; name: string; size: string; category: string;
  price: number; description: string; image_url?: string;
}
interface Visitor { id: number; method: string; path: string; ip: string; user_agent: string; referrer: string; status_code: number; visited_at: string; }
interface Order { id: number; customer_name: string; customer_phone: string; cylinder_code: string; quantity: number; delivery_zone: string; status: string; created_at: string; }
interface Props { onClose: () => void; }

type ProductForm = { code: string; name: string; size: string; category: string; price: string; description: string; image_url: string; };
const emptyForm: ProductForm = { code: '', name: '', size: '', category: '3kg', price: '', description: '', image_url: '' };
const statuses = ['new', 'confirmed', 'processing', 'dispatched', 'completed', 'cancelled'];

async function readJson(response: Response) {
  const text = await response.text();
  if (!text) throw new Error('The server returned an empty response.');
  try { return JSON.parse(text); } catch { throw new Error('The server returned an invalid response.'); }
}

export const AdminPage: React.FC<Props> = ({ onClose }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('adalAdminToken') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<'overview' | 'inventory' | 'orders' | 'visitors'>('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const authHeaders = useMemo(() => ({ 'x-admin-token': token }), [token]);

  const loadData = async (activeToken = token) => {
    if (!activeToken) return;
    setError('');
    try {
      const headers = { 'x-admin-token': activeToken };
      const [productsRes, visitorsRes, ordersRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/admin/visitors', { headers }),
        fetch('/api/admin/orders', { headers }),
      ]);
      if (visitorsRes.status === 401 || ordersRes.status === 401) {
        sessionStorage.removeItem('adalAdminToken'); setToken(''); throw new Error('Your admin session has expired. Please log in again.');
      }
      const productsJson = await readJson(productsRes);
      const visitorsJson = await readJson(visitorsRes);
      const ordersJson = await readJson(ordersRes);
      if (!productsRes.ok) throw new Error(productsJson.message || 'Could not load products.');
      if (!visitorsRes.ok) throw new Error(visitorsJson.message || 'Could not load visitors.');
      if (!ordersRes.ok) throw new Error(ordersJson.message || 'Could not load orders.');
      setProducts(Array.isArray(productsJson) ? productsJson : []);
      setVisitors(Array.isArray(visitorsJson) ? visitorsJson : []);
      setOrders(Array.isArray(ordersJson) ? ordersJson : []);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not load admin data.'); }
  };

  useEffect(() => { if (token) loadData(token); }, [token]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setLoginError(''); setError('');
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const payload = await readJson(response);
      if (!response.ok || !payload.token) throw new Error(payload.message || 'Invalid administrator credentials.');
      sessionStorage.setItem('adalAdminToken', payload.token); setToken(payload.token); setPassword('');
    } catch (e) { setLoginError(e instanceof Error ? e.message : 'Unable to log in.'); }
  };

  const logout = () => { sessionStorage.removeItem('adalAdminToken'); setToken(''); setProducts([]); setVisitors([]); setOrders([]); };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setSelectedFile(null); };

  const uploadFile = async () => {
    if (!selectedFile) return form.image_url;
    const body = new FormData();
    body.append('image', selectedFile);
    body.append('productCode', form.code || 'ACCESSORIES');
    body.append('category', form.category === 'accessories' ? 'accessory' : 'cylinder');
    body.append('imageName', form.name || selectedFile.name);
    body.append('price', form.price || '0');
    body.append('description', form.description);
    const response = await fetch('/api/upload-image', { method: 'POST', headers: authHeaders, body });
    const payload = await readJson(response);
    if (!response.ok) throw new Error(payload.message || 'Image upload failed.');
    return payload.image_url || payload.imageUrl || '';
  };

  const saveProduct = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setMessage(''); setError('');
    try {
      if (!form.code.trim() || !form.name.trim() || !form.price.trim()) throw new Error('Code, product name and price are required.');
      let imageUrl = form.image_url.trim();
      if (selectedFile) imageUrl = await uploadFile();
      const body = { ...form, price: Number(form.price), image_url: imageUrl };
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const response = await fetch(url, { method: editingId ? 'PUT' : 'POST', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload.message || 'Could not save product.');
      setMessage(editingId ? 'Product updated successfully.' : 'New stock item added successfully.');
      resetForm(); await loadData();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save product.'); }
    finally { setSaving(false); }
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setForm({ code: product.code, name: product.name, size: product.size || '', category: product.category || '3kg', price: String(product.price ?? ''), description: product.description || '', image_url: product.image_url || '' });
    setSelectedFile(null); setTab('inventory'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = async (id: number) => {
    if (!window.confirm('Delete this stock item? This cannot be undone.')) return;
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders });
      const payload = await readJson(response); if (!response.ok) throw new Error(payload.message || 'Delete failed.');
      setMessage('Stock item deleted.'); await loadData();
    } catch (e) { setError(e instanceof Error ? e.message : 'Delete failed.'); }
  };

  const changeOrderStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${id}/status`, { method: 'PATCH', headers: { ...authHeaders, 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
      const payload = await readJson(response); if (!response.ok) throw new Error(payload.message || 'Status update failed.');
      setOrders(current => current.map(order => order.id === id ? { ...order, status } : order));
    } catch (e) { setError(e instanceof Error ? e.message : 'Status update failed.'); }
  };

  if (!token) return (
    <section className="min-h-[75vh] bg-slate-950 px-4 py-16 flex items-center">
      <div className="w-full max-w-md mx-auto rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-orange-400"><ShieldCheck className="h-7 w-7" /></div>
        <div className="text-center mt-5"><p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">Adal Uganda</p><h1 className="mt-2 text-3xl font-black text-slate-900">Admin Portal</h1><p className="mt-2 text-sm text-slate-500">Secure catalogue, orders and visitor management.</p></div>
        <form onSubmit={login} className="mt-8 space-y-4">
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" autoComplete="username" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" autoComplete="current-password" className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-orange-500" />
          {loginError && <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700">{loginError}</div>}
          <button className="w-full rounded-xl bg-slate-900 py-3.5 text-sm font-black text-white hover:bg-orange-600 transition-colors">Sign in to Dashboard</button>
        </form>
        <button onClick={onClose} className="mt-4 w-full text-xs font-bold text-slate-500 hover:text-slate-900">Back to website</button>
      </div>
    </section>
  );

  const statCards = [
    { label: 'Catalogue items', value: products.length, icon: Boxes },
    { label: 'Orders received', value: orders.length, icon: ShoppingCart },
    { label: 'Tracked visits', value: visitors.length, icon: Users },
    { label: 'Open orders', value: orders.filter(o => !['completed','cancelled'].includes(o.status)).length, icon: Truck },
  ];

  return (
    <section className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="rounded-3xl bg-slate-950 p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div><div className="flex items-center gap-2 text-orange-400 text-xs font-black uppercase tracking-[0.18em]"><ShieldCheck className="h-4 w-4" /> Operations Console</div><h1 className="mt-2 text-3xl sm:text-4xl font-black">Adal Admin Dashboard</h1><p className="mt-2 text-sm text-slate-400">Manage stock, product content, orders and website activity.</p></div>
            <div className="flex gap-2"><button onClick={() => loadData()} className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-bold hover:bg-slate-800"><RefreshCw className="h-4 w-4" /> Refresh</button><button onClick={logout} className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-black text-slate-900"><LogOut className="h-4 w-4" /> Logout</button></div>
          </div>
        </header>

        {(message || error) && <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold ${error ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>{error || message}</div>}

        <nav className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-2xl bg-white p-2 shadow-sm border border-slate-200">
          {[['overview','Overview',BarChart3],['inventory','Inventory',Package],['orders','Orders',ShoppingCart],['visitors','Visitors',Eye]].map(([id,label,Icon]) => <button key={id as string} onClick={() => setTab(id as typeof tab)} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black ${tab === id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}><Icon className="h-4 w-4" />{label as string}</button>)}
        </nav>

        {tab === 'overview' && <div className="mt-6 space-y-6"><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">{statCards.map(({label,value,icon:Icon}) => <div key={label} className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"><Icon className="h-5 w-5 text-orange-500"/><p className="mt-4 text-3xl font-black text-slate-900">{value}</p><p className="text-xs font-bold text-slate-500">{label}</p></div>)}</div><div className="grid lg:grid-cols-2 gap-6"><div className="rounded-2xl bg-white border border-slate-200 p-6"><h2 className="text-lg font-black text-slate-900">Quick stock actions</h2><p className="mt-1 text-sm text-slate-500">Add cylinders, accessories, prices, descriptions and images.</p><button onClick={() => { resetForm(); setTab('inventory'); }} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-xs font-black text-white"><Package className="h-4 w-4"/> Add new stock</button></div><div className="rounded-2xl bg-white border border-slate-200 p-6"><h2 className="text-lg font-black text-slate-900">Recent activity</h2><div className="mt-4 space-y-3">{visitors.slice(0,5).map(v => <div key={v.id} className="flex items-center justify-between gap-3 text-xs"><span className="font-semibold text-slate-600 truncate">{v.method} {v.path}</span><span className="text-slate-400">{new Date(v.visited_at).toLocaleString()}</span></div>)}{visitors.length === 0 && <p className="text-sm text-slate-400">No visits recorded yet.</p>}</div></div></div></div>}

        {tab === 'inventory' && <div className="mt-6 grid xl:grid-cols-[380px,1fr] gap-6"><div className="rounded-2xl bg-white border border-slate-200 p-6 h-fit"><div className="flex items-center justify-between"><h2 className="text-xl font-black text-slate-900">{editingId ? 'Edit stock item' : 'Add new stock'}</h2>{editingId && <button onClick={resetForm}><X className="h-5 w-5 text-slate-400"/></button>}</div><form onSubmit={saveProduct} className="mt-5 space-y-3"><input value={form.code} onChange={e=>setForm({...form,code:e.target.value})} placeholder="Product code e.g. 6KG" className="field" required/><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Product name" className="field" required/><div className="grid grid-cols-2 gap-3"><input value={form.size} onChange={e=>setForm({...form,size:e.target.value})} placeholder="Size e.g. 6kg" className="field"/><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="field"><option value="3kg">3kg</option><option value="6kg">6kg</option><option value="12.5kg">12.5kg</option><option value="38kg">38kg</option><option value="accessories">Accessories</option></select></div><input value={form.price} onChange={e=>setForm({...form,price:e.target.value})} type="number" min="0" placeholder="Price in UGX" className="field" required/><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Professional product description" rows={4} className="field resize-none"/><input value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} placeholder="Image URL (optional)" className="field"/><label className="block rounded-xl border-2 border-dashed border-slate-300 p-4 text-center cursor-pointer hover:border-orange-400"><ImagePlus className="mx-auto h-6 w-6 text-slate-400"/><span className="mt-1 block text-xs font-bold text-slate-500">{selectedFile ? selectedFile.name : 'Upload product image'}</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setSelectedFile(e.target.files?.[0] || null)} className="hidden"/></label><button disabled={saving} className="w-full rounded-xl bg-slate-900 py-3 text-xs font-black text-white disabled:opacity-50">{saving ? 'Saving...' : editingId ? 'Update stock item' : 'Add stock item'}</button>{editingId && <button type="button" onClick={resetForm} className="w-full rounded-xl border border-slate-300 py-3 text-xs font-bold text-slate-700">Cancel edit</button>}</form></div><div className="rounded-2xl bg-white border border-slate-200 overflow-hidden"><div className="p-5 border-b border-slate-200"><h2 className="text-xl font-black text-slate-900">Current inventory</h2><p className="text-sm text-slate-500 mt-1">Every item shown on the public catalogue is controlled here.</p></div><div className="divide-y divide-slate-100">{products.map(product => <div key={product.id} className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center"><div className="h-20 w-20 rounded-xl bg-slate-100 overflow-hidden shrink-0">{product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover"/>}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap gap-2 items-center"><span className="text-[10px] font-black uppercase rounded-full bg-orange-100 text-orange-700 px-2 py-1">{product.code}</span><span className="text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 px-2 py-1">{product.category}</span></div><h3 className="mt-1 font-black text-slate-900">{product.name}</h3><p className="text-xs text-slate-500 line-clamp-2">{product.description}</p><p className="mt-1 text-sm font-black text-slate-900">UGX {Number(product.price).toLocaleString()}</p></div><div className="flex gap-2"><button onClick={()=>editProduct(product)} className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold"><Edit3 className="h-3.5 w-3.5"/> Edit</button><button onClick={()=>deleteProduct(product.id)} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700"><Trash2 className="h-3.5 w-3.5"/> Delete</button></div></div>)}{products.length===0 && <div className="p-10 text-center text-sm text-slate-400">No products found.</div>}</div></div></div>}

        {tab === 'orders' && <div className="mt-6 rounded-2xl bg-white border border-slate-200 overflow-hidden"><div className="p-5 border-b border-slate-200"><h2 className="text-xl font-black text-slate-900">Customer orders</h2><p className="text-sm text-slate-500 mt-1">Track incoming supply requests and update their fulfilment status.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Customer</th><th className="p-4">Product</th><th className="p-4">Qty</th><th className="p-4">Zone</th><th className="p-4">Status</th><th className="p-4">Date</th></tr></thead><tbody className="divide-y divide-slate-100">{orders.map(order=><tr key={order.id}><td className="p-4"><div className="font-bold">{order.customer_name}</div><div className="text-xs text-slate-500">{order.customer_phone}</div></td><td className="p-4 font-bold">{order.cylinder_code}</td><td className="p-4">{order.quantity}</td><td className="p-4">{order.delivery_zone || '—'}</td><td className="p-4"><select value={order.status} onChange={e=>changeOrderStatus(order.id,e.target.value)} className="rounded-lg border border-slate-300 px-2 py-2 text-xs font-bold">{statuses.map(s=><option key={s}>{s}</option>)}</select></td><td className="p-4 text-xs text-slate-500">{new Date(order.created_at).toLocaleString()}</td></tr>)}{orders.length===0 && <tr><td colSpan={6} className="p-10 text-center text-slate-400">No orders have been recorded.</td></tr>}</tbody></table></div></div>}

        {tab === 'visitors' && <div className="mt-6 rounded-2xl bg-white border border-slate-200 overflow-hidden"><div className="p-5 border-b border-slate-200 flex items-center justify-between"><div><h2 className="text-xl font-black text-slate-900">Website visitors</h2><p className="text-sm text-slate-500 mt-1">Recent requests captured by the website for operational monitoring.</p></div><div className="rounded-xl bg-orange-50 px-3 py-2 text-xs font-black text-orange-700">{visitors.length} records</div></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-4">Time</th><th className="p-4">Route</th><th className="p-4">IP</th><th className="p-4">Device / Browser</th><th className="p-4">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{visitors.map(v=><tr key={v.id}><td className="p-4 text-xs whitespace-nowrap">{new Date(v.visited_at).toLocaleString()}</td><td className="p-4 font-mono text-xs">{v.method} {v.path}</td><td className="p-4 font-mono text-xs">{v.ip}</td><td className="p-4 max-w-xs truncate text-xs text-slate-500">{v.user_agent}</td><td className="p-4"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${v.status_code < 400 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}><CheckCircle2 className="h-3 w-3"/>{v.status_code}</span></td></tr>)}{visitors.length===0 && <tr><td colSpan={5} className="p-10 text-center text-slate-400">No visitor records have been captured yet.</td></tr>}</tbody></table></div></div>}

        <div className="mt-6 flex justify-between"><button onClick={onClose} className="text-xs font-bold text-slate-500 hover:text-slate-900">← Back to public website</button><span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Protected administrator area</span></div>
      </div>
      <style>{`.field{width:100%;border:1px solid rgb(203 213 225);border-radius:.75rem;padding:.75rem .9rem;font-size:.875rem;outline:none;background:white}.field:focus{border-color:rgb(249 115 22);box-shadow:0 0 0 3px rgb(249 115 22 / .1)}`}</style>
    </section>
  );
};
