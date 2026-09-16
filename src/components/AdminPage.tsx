import React, { useEffect, useState } from 'react';
import { Upload, Image, Database, RefreshCw, Shield, Eye, LogOut, Trash2 } from 'lucide-react';

interface ProductRow {
  code: string;
  name: string;
}

interface ImageRow {
  id: number;
  product_code: string;
  category?: string;
  image_url: string;
  image_name: string;
  mime_type: string;
  size_bytes: number;
  price?: number;
  description?: string;
  uploaded_at: string;
}

interface VisitorRow {
  id: number;
  method: string;
  path: string;
  ip: string;
  user_agent: string;
  referrer: string;
  status_code: number;
  visited_at: string;
}

interface AdminPageProps {
  onClose: () => void;
}

const parseJsonResponse = async (response: Response, fallbackMessage: string) => {
  const text = await response.text();
  if (!text || !text.trim()) {
    throw new Error(fallbackMessage);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('The API route returned a non-JSON response. Ensure the Express API server is running on port 3001.');
  }
};

export const AdminPage: React.FC<AdminPageProps> = ({ onClose }) => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [images, setImages] = useState<ImageRow[]>([]);
  const [visitors, setVisitors] = useState<VisitorRow[]>([]);
  const [selectedProductCode, setSelectedProductCode] = useState('3KG');
  const [selectedCategory, setSelectedCategory] = useState('cylinder');
  const [imageLabel, setImageLabel] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingImageId, setEditingImageId] = useState<number | null>(null);
  const [editingProductCode, setEditingProductCode] = useState('3KG');
  const [editingCategory, setEditingCategory] = useState('cylinder');
  const [editingName, setEditingName] = useState('');
  const [editingPrice, setEditingPrice] = useState(0);
  const [editingDescription, setEditingDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(() => sessionStorage.getItem('adalAdminToken') || '');

  const loadAdminData = async () => {
    try {
      const headers = token ? { 'x-admin-token': token } : undefined;

      const productResponse = await fetch('/api/products', { headers });
      if (!productResponse.ok) {
        throw new Error('Could not load products.');
      }
      const productRows = await parseJsonResponse(productResponse, 'Products route returned an empty response.');
      if (Array.isArray(productRows) && productRows.length > 0) {
        const productCodes = productRows.map((row) => ({ code: row.code, name: row.name }));
        setProducts(productCodes);
        if (!productCodes.some((row) => row.code === selectedProductCode)) {
          setSelectedProductCode(productCodes[0].code);
        }
      }

      const imageResponse = await fetch('/api/product-images', { headers });
      if (!imageResponse.ok) {
        throw new Error('Could not load uploaded images.');
      }
      const imageRows = await parseJsonResponse(imageResponse, 'Images route returned an empty response.');
      if (Array.isArray(imageRows)) {
        setImages(imageRows);
      }

      const visitorResponse = await fetch('/api/admin/visitors', { headers });
      if (visitorResponse.ok) {
        const visitorRows = await parseJsonResponse(visitorResponse, 'Visitors route returned an empty response.');
        if (Array.isArray(visitorRows)) {
          setVisitors(visitorRows);
        }
      } else {
        const payload = await parseJsonResponse(visitorResponse, 'Visitors route returned an empty response.');
        if (payload?.message) {
          setMessage(payload.message);
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load admin data.');
    }
  };

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      loadAdminData();
    }
  }, [token]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError('');
    setMessage('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();
      if (!text || !text.trim()) {
        throw new Error('The admin login route returned an empty response. Ensure the Express API server is running on port 3001.');
      }

      let payload: { token?: string; message?: string; success?: boolean };
      try {
        payload = JSON.parse(text);
      } catch {
        throw new Error('The admin login route did not return JSON. Ensure the Express API server is running on port 3001.');
      }

      if (!response.ok || payload.success === false || !payload.token) {
        throw new Error(payload.message || 'Invalid admin credentials.');
      }

      const adminToken = payload.token;
      sessionStorage.setItem('adalAdminToken', adminToken);
      setToken(adminToken);
      setIsLoggedIn(true);
      await loadAdminData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unable to log in.';
      setLoginError(msg);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adalAdminToken');
    setToken('');
    setIsLoggedIn(false);
    setProducts([]);
    setImages([]);
    setVisitors([]);
    setSelectedProductCode('3KG');
    setSelectedCategory('cylinder');
    setSelectedFile(null);
    setMessage('');
  };

  const openEditImage = (image: ImageRow) => {
    setEditingImageId(image.id);
    setEditingProductCode(image.product_code || '3KG');
    setEditingCategory(image.category || 'cylinder');
    setEditingName(image.image_name || '');
    setEditingPrice(Number(image.price || 0));
    setEditingDescription(image.description || '');
  };

  const resetEditImage = () => {
    setEditingImageId(null);
    setEditingProductCode('3KG');
    setEditingCategory('cylinder');
    setEditingName('');
    setEditingPrice(0);
    setEditingDescription('');
  };

  const handleSaveImage = async (imageId: number) => {
    try {
      const response = await fetch(`/api/product-images/${imageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify({
          productCode: editingProductCode,
          category: editingCategory,
          imageName: editingName,
          price: editingPrice,
          description: editingDescription,
        }),
      });

      const payload = await parseJsonResponse(response, 'Update route returned an empty response.');
      if (!response.ok) {
        throw new Error(payload.message || 'Image update failed.');
      }

      setMessage('Stock image details saved.');
      resetEditImage();
      await loadAdminData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image update failed.');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm('Delete this stored image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/product-images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': token,
        },
      });

      const payload = await parseJsonResponse(response, 'Delete route returned an empty response.');
      if (!response.ok) {
        throw new Error(payload.message || 'Image deletion failed.');
      }

      setImages((currentImages) => currentImages.filter((image) => image.id !== imageId));
      setMessage('Image deleted.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Image deletion failed.');
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setMessage('Choose an image file first.');
      return;
    }

    const label = imageLabel.trim();
    const productCode = label || selectedProductCode;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('productCode', productCode);
    formData.append('category', selectedCategory);

    try {
      setUploading(true);
      setMessage('');

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
        headers: {
          'x-admin-token': token,
        },
      });

      const payload = await parseJsonResponse(response, 'Upload route returned an empty response.');
      if (!response.ok) {
        throw new Error(payload.message || 'Upload failed.');
      }

      setMessage(`Uploaded ${payload.fileName} for ${payload.productCode}.`);
      setSelectedFile(null);
      setImageLabel('');
      await loadAdminData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <section className="py-20 bg-slate-50 min-h-[70vh]">
        <div className="max-w-md mx-auto px-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-slate-900" />
              <span className="text-[11px] font-black uppercase tracking-wide text-slate-500">Adal Admin</span>
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-slate-900 font-display">Administrator Login</h1>
            <p className="mt-2 text-sm text-slate-500">Access stock images, uploads and visitor monitoring.</p>

            <form onSubmit={handleLogin} className="mt-8 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wide text-slate-500 mb-2">Username</label>
                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 bg-white"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wide text-slate-500 mb-2">Password</label>
                <input
                  value={password}
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 bg-white"
                  autoComplete="current-password"
                />
              </div>

              {loginError && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-bold text-rose-700">{loginError}</p>}

              <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white hover:bg-slate-800">
                Login to Dashboard
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
              <Database className="w-4 h-4" /> Admin Dashboard
            </span>
            <h1 className="mt-4 text-4xl font-extrabold text-slate-900 font-display">Catalogue Image Manager</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white hover:bg-slate-800"
            >
              Back to Store
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px,1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-black text-slate-900 font-display">Upload New Image</h2>
            </div>

            <form onSubmit={handleUpload} className="mt-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wide text-slate-500 mb-2">
                  Image Category
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 bg-white"
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                >
                  <option value="cylinder">Cylinder</option>
                  <option value="accessory">Accessory</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wide text-slate-500 mb-2">
                  Name image for
                </label>
                <input
                  value={imageLabel}
                  onChange={(event) => setImageLabel(event.target.value)}
                  placeholder="3kg, 6kg, 12.5kg, 38kg, accessories"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wide text-slate-500 mb-2">
                  Product Code
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 bg-white"
                  value={selectedProductCode}
                  onChange={(event) => setSelectedProductCode(event.target.value)}
                >
                  <option value="3KG">3KG - 3kg Cylinder</option>
                  <option value="6KG">6KG - 6kg Cylinder</option>
                  <option value="12.5KG">12.5KG - 12.5kg Cylinder</option>
                  <option value="38KG">38KG - 38kg Cylinder</option>
                  <option value="ACCESSORIES">ACCESSORIES - Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-black uppercase tracking-wide text-slate-500 mb-2">
                  Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white file:text-xs file:font-bold"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                />
              </div>

              {selectedFile && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
                  {selectedFile.name}
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-black text-white hover:bg-slate-800 disabled:opacity-70"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Save Image'}
              </button>

              {message && <p className="text-xs font-bold text-slate-700">{message}</p>}
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Image className="w-5 h-5 text-cyan-600" />
                <h2 className="text-xl font-black text-slate-900 font-display">Stored Images</h2>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.length === 0 && (
                  <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-xs font-bold text-slate-500">
                    No images found in PostgreSQL.
                  </div>
                )}

                {images.map((image) => (
                  <div key={image.id} className="rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
                    <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                      <img
                        src={image.image_url}
                        alt={image.image_name}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(image.id)}
                        className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white px-2 py-1 text-[10px] font-black text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-black text-slate-900">{image.product_code}</span>
                        <span className="text-[10px] font-bold text-slate-500">{image.category || 'cylinder'}</span>
                      </div>
                      <p className="mt-2 text-[10px] text-slate-500 line-clamp-2">{image.image_name}</p>
                      <p className="mt-1 text-[10px] font-bold text-slate-400">{image.mime_type}</p>

                      {editingImageId === image.id ? (
                        <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-3">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wide text-slate-500 mb-1">Product Code</label>
                            <select value={editingProductCode} onChange={(event) => setEditingProductCode(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] font-bold text-slate-700 bg-white">
                              <option value="3KG">3KG</option>
                              <option value="6KG">6KG</option>
                              <option value="12.5KG">12.5KG</option>
                              <option value="38KG">38KG</option>
                              <option value="ACCESSORIES">ACCESSORIES</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wide text-slate-500 mb-1">Name / Rename</label>
                            <input value={editingName} onChange={(event) => setEditingName(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] font-bold text-slate-700 bg-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wide text-slate-500 mb-1">Category</label>
                            <select value={editingCategory} onChange={(event) => setEditingCategory(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] font-bold text-slate-700 bg-white">
                              <option value="cylinder">Cylinder</option>
                              <option value="accessory">Accessory</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wide text-slate-500 mb-1">Price</label>
                            <input type="number" min="0" value={editingPrice} onChange={(event) => setEditingPrice(Number(event.target.value))} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] font-bold text-slate-700 bg-white" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wide text-slate-500 mb-1">Description / Details</label>
                            <textarea value={editingDescription} onChange={(event) => setEditingDescription(event.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-[10px] font-bold text-slate-700 bg-white" rows={3} />
                          </div>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleSaveImage(image.id)} className="rounded-lg bg-slate-900 px-3 py-2 text-[10px] font-black text-white hover:bg-slate-800">Save</button>
                            <button type="button" onClick={resetEditImage} className="rounded-lg border border-slate-300 px-3 py-2 text-[10px] font-black text-slate-700 hover:bg-slate-100">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-slate-500">UGX {Number(image.price || 0).toLocaleString()}</span>
                          <button type="button" onClick={() => openEditImage(image)} className="rounded-lg border border-slate-300 px-3 py-2 text-[10px] font-black text-slate-700 hover:bg-slate-100">Edit</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-600" />
                <h2 className="text-xl font-black text-slate-900 font-display">Visitor Activity</h2>
              </div>
              <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
                {visitors.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs font-bold text-slate-500">
                    No visits recorded yet.
                  </div>
                )}
                {visitors.map((visitor) => (
                  <div key={visitor.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] font-black text-slate-900">{visitor.method} {visitor.path}</span>
                      <span className="text-[10px] font-bold text-slate-500">{visitor.status_code}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                      <span>{visitor.ip}</span>
                      <span>•</span>
                      <span>{new Date(visitor.visited_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
