import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import ImageAdjusterModal from '../../components/ImageAdjusterModal';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Sparkles,
  Package,
  X,
  CheckCircle,
  AlertCircle,
  Image,
  Upload,
  UploadCloud,
  Loader2,
  Sliders,
  Crop
} from 'lucide-react';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [statusNotice, setStatusNotice] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isAdjusterOpen, setIsAdjusterOpen] = useState(false);
  const [adjusterImageSrc, setAdjusterImageSrc] = useState(null);

  const handleGalleryUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Open image adjuster modal immediately so user can adjust size, aspect ratio, zoom, and framing
    setAdjusterImageSrc(file);
    setIsAdjusterOpen(true);
    e.target.value = '';
  };

  const handleAdjustExistingPhoto = () => {
    if (!formData.image_url) return;
    setAdjusterImageSrc(formData.image_url);
    setIsAdjusterOpen(true);
  };

  const handleAdjustedPhotoSaved = (uploadedUrl) => {
    setFormData(prev => ({
      ...prev,
      image_url: uploadedUrl
    }));
    setStatusNotice('फोटो सफलतापूर्वक एडजस्ट और सेव हो गई!');
    setTimeout(() => setStatusNotice(''), 3500);
  };

  const initialForm = {
    title: '',
    category: 'Marble Mandir',
    price: '',
    original_price: '',
    marble_type: 'Pure Makrana White Marble',
    dimensions: '60" Height x 36" Width x 24" Depth',
    weight: '210 kg',
    finish: 'Hand Carved & High Gloss Mirror Polish',
    stock: 5,
    description: '',
    image_url: '',
    featured: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const categories = [
    'Marble Mandir',
    'Vrindavan Shrines',
    'Other Marble Products'
  ];

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({ search });
      if (res.success) {
        setProducts(res.products);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData(initialForm);
    setUploadError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setUploadError('');
    setFormData({
      title: p.title,
      category: p.category,
      price: p.price,
      original_price: p.original_price || '',
      marble_type: p.marble_type || '',
      dimensions: p.dimensions || '',
      weight: p.weight || '',
      finish: p.finish || '',
      stock: p.stock !== undefined ? p.stock : 10,
      description: p.description || '',
      image_url: p.image_url || '',
      featured: p.featured || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this marble product from catalog?')) {
      return;
    }
    try {
      const res = await api.deleteProduct(id);
      if (res.success) {
        setStatusNotice('Product deleted successfully.');
        setTimeout(() => setStatusNotice(''), 3000);
        loadProducts();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url) {
      setUploadError('कृपया अपने फ़ोन या कंप्यूटर की गैलरी से फोटो चुनें (Please choose a product photo from gallery)');
      return;
    }
    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct.id, formData);
        if (res.success) {
          setStatusNotice('Product updated successfully!');
          setIsModalOpen(false);
          loadProducts();
        }
      } else {
        const res = await api.createProduct(formData);
        if (res.success) {
          setStatusNotice('New stone product added to catalog successfully!');
          setIsModalOpen(false);
          loadProducts();
        }
      }
      setTimeout(() => setStatusNotice(''), 3000);
    } catch (err) {
      console.error('Form submit error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
            Catalog Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Marble & Granite Products
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Add new shrines, peacock statues, pillars, clocks, or update prices & descriptions
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="gold-btn px-4 py-2.5 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Marble Product</span>
        </button>
      </div>

      {statusNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, stone type, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="text-xs text-stone-500 font-medium">
          Total Products: <strong>{products.length}</strong>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold">
                <th className="py-3 px-4">Item & Photo</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Stone Material</th>
                <th className="py-3 px-4">Dimensions</th>
                <th className="py-3 px-4 text-right">Selling Price</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-stone-400">
                    Loading products catalog...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-stone-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image_url}
                          alt={p.title}
                          className="w-12 h-12 rounded-lg object-contain bg-stone-100 border border-stone-200 shrink-0 p-0.5"
                        />
                        <div className="min-w-0 max-w-xs">
                          <p className="font-bold text-stone-900 truncate">{p.title}</p>
                          <p className="text-[10px] text-stone-400">ID: #{p.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium text-[11px]">
                        {p.category}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-stone-700 font-medium truncate max-w-[150px]">
                      {p.marble_type}
                    </td>

                    <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                      {p.dimensions}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                          title="Edit Product Info / Price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base">
                {editingProduct ? 'Edit Stone Product Details' : 'Add New Marble Product To Catalog'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Product Title * (e.g. Vrindavan Shrines Mandir, Peacock Sculpture)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. Classical Hand-Carved Makrana Marble Mandir"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Marble / Stone Type *</label>
                  <input
                    type="text"
                    required
                    value={formData.marble_type}
                    onChange={(e) => setFormData({ ...formData, marble_type: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. Pure Makrana White Marble / Carrara / Black Galaxy"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="85000"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Market / MRP Price (₹) (For Discount Display)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="105000"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Dimensions (H x W x D)</label>
                  <input
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder='60" Height x 36" Width x 24" Depth'
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="180 kg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Surface Finish</label>
                  <input
                    type="text"
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Hand Carved & Mirror Polished"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Available Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="10"
                  />
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-semibold text-stone-800">
                      Product Photo (गैलरी से फोटो चुनें) *
                    </label>
                    {formData.image_url && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        फोटो सिलेक्ट हो चुकी है
                      </span>
                    )}
                  </div>

                  {/* Photo Preview Card if selected */}
                  {formData.image_url ? (
                    <div className="p-3.5 bg-stone-50 rounded-2xl border-2 border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-20 h-20 rounded-xl bg-white border border-stone-200 shadow-sm shrink-0 flex items-center justify-center p-1 overflow-hidden">
                          <img
                            src={formData.image_url}
                            alt="Product preview"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>गैलरी फोटो सफलतापूर्वक चुनी गई</span>
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5">
                            यह फोटो वेबसाइट पर बिना कटे पूरी दिखाई देगी
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleAdjustExistingPhoto}
                          className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                          title="फ़ोटो को ज़ूम, रोटेट या री-फ्रेम करें"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>एडजस्ट / क्रॉप</span>
                        </button>

                        <label
                          htmlFor="admin-gallery-file"
                          className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-xs flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>दूसरी फोटो चुनें</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                          className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>हटाएं</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Device / Gallery File Picker when no photo is selected */
                    <label
                      htmlFor="admin-gallery-file"
                      className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/80 rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-2 block"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shadow-sm">
                        <UploadCloud className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900">
                          यहाँ क्लिक करके अपनी Gallery / Computer से Photo चुनें
                        </p>
                        <p className="text-xs text-stone-500 mt-1">
                          फोटो चुनते ही आपको ज़ूम, रोटेट और साइज़ एडजस्ट (Crop / Fit) करने का टूल मिलेगा
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Hidden File Input used by gallery pickers */}
                  <input
                    type="file"
                    accept="image/*"
                    id="admin-gallery-file"
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />

                  {uploadError && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-stone-700 mb-1">
                    Artisanship Description & Religious / Architectural Significance
                  </label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Describe stone quarry origin, carving details, and wooden crate packaging..."
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Add Stone Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Image Adjuster / Cropper Modal */}
      <ImageAdjusterModal
        isOpen={isAdjusterOpen}
        onClose={() => setIsAdjusterOpen(false)}
        imageSrc={adjusterImageSrc}
        onSaveAdjusted={handleAdjustedPhotoSaved}
      />
    </div>
  );
}
