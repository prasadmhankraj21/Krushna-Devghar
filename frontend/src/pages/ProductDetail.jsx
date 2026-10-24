import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import {
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Box,
  Sparkles,
  Award,
  CheckCircle,
  FileText
} from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await api.getProductById(id);
        if (res.success && res.product) {
          setProduct(res.product);
          let initial = res.product.image_url || '';
          if (!initial && res.product.images) {
            if (Array.isArray(res.product.images) && res.product.images.length > 0) {
              initial = res.product.images[0];
            } else if (typeof res.product.images === 'string') {
              try {
                const parsed = JSON.parse(res.product.images);
                if (Array.isArray(parsed) && parsed.length > 0) initial = parsed[0];
              } catch (e) {
                initial = res.product.images;
              }
            }
          }
          setSelectedImage(initial);
          setRelated(res.related || []);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  // Extract images array safely (handles stringified JSON, array, or single string)
  const imagesList = React.useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images)) {
      return product.images.filter(Boolean);
    }
    if (typeof product.images === 'string') {
      try {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch (e) {
        if (product.images.trim()) return [product.images.trim()];
      }
    }
    if (product.image_url) {
      return [product.image_url];
    }
    return [];
  }, [product]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-stone-200 aspect-square rounded-2xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-stone-200 rounded w-3/4"></div>
            <div className="h-4 bg-stone-200 rounded w-1/2"></div>
            <div className="h-24 bg-stone-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Stone Product Not Found</h2>
        <Link to="/shop" className="mt-4 inline-block gold-btn px-4 py-2 rounded-lg text-xs font-bold">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const discountPercent = product.original_price && Number(product.original_price) > Number(product.price)
    ? Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="text-xs text-stone-500 flex items-center gap-2">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-stone-900">Products</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(product.category || '')}`} className="hover:text-stone-900">
          {product.category || 'Stone Collection'}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-semibold truncate max-w-xs">{product.title || 'Product Details'}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Images Column */}
        <div className="space-y-4">
          <div className="aspect-[4/3] sm:aspect-square max-h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100/90 border border-stone-200 shadow-md flex items-center justify-center p-3">
            <img
              src={selectedImage || product.image_url}
              alt={product.title}
              className="w-full h-full object-contain object-center transition-all duration-300 drop-shadow-sm"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
              }}
            />
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                    selectedImage === img ? 'border-amber-600 scale-105 shadow' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Controls */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                {product.category || 'Stone Collection'}
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> In Stock ({product.stock ?? 1} units ready)
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Authentic Stone: <strong>{product.marble_type || 'Makrana White Marble'}</strong></span>
            </p>
          </div>

          {/* Price Box */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold font-mono text-stone-900">
                ₹{Number(product.price || 0).toLocaleString('en-IN')}
              </span>
              {product.original_price && Number(product.original_price) > Number(product.price) && (
                <span className="text-sm text-stone-400 line-through font-mono">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
              )}
              {discountPercent && (
                <span className="text-xs font-bold bg-rose-600 text-white px-2 py-0.5 rounded">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
              <span>Includes 12% GST</span>
              <span>•</span>
              <span className="text-emerald-700 font-medium">Free Nationwide Insured Wooden Crate Delivery</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-stone-700 leading-relaxed">
            {product.description}
          </p>

          {/* Specifications Table */}
          <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-stone-100 font-bold px-4 py-2 border-b border-stone-200 text-stone-800 uppercase tracking-wider">
              Stone Specifications & Crafting Details
            </div>
            <div className="divide-y divide-stone-100">
              <div className="grid grid-cols-2 p-3">
                <span className="text-stone-500 font-medium">Marble / Granite Type:</span>
                <span className="text-stone-900 font-semibold">{product.marble_type}</span>
              </div>
              <div className="grid grid-cols-2 p-3 bg-stone-50/50">
                <span className="text-stone-500 font-medium">Dimensions (H x W x D):</span>
                <span className="text-stone-900 font-semibold">{product.dimensions}</span>
              </div>
              <div className="grid grid-cols-2 p-3">
                <span className="text-stone-500 font-medium">Approximate Net Weight:</span>
                <span className="text-stone-900 font-semibold">{product.weight}</span>
              </div>
              <div className="grid grid-cols-2 p-3 bg-stone-50/50">
                <span className="text-stone-500 font-medium">Surface Finish:</span>
                <span className="text-stone-900 font-semibold">{product.finish}</span>
              </div>
              <div className="grid grid-cols-2 p-3">
                <span className="text-stone-500 font-medium">Packaging:</span>
                <span className="text-stone-900 font-semibold">Fumigated Heavy Wooden Crate with 5-Layer Thermocol</span>
              </div>
            </div>
          </div>

          {/* Quantity & Buy Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-2 font-mono text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-100 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs rounded-xl transition"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Cart</span>
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-4 gold-btn text-sm font-black rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition"
            >
              <span>Instant Buy Now & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {addedNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Added to cart successfully! <Link to="/cart" className="underline font-bold ml-1">View Cart</Link></span>
              </div>
            )}
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-200 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Certified Rajasthan Makrana Quarries</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Instant GST Tax Invoice with Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Reinforced Wooden Crate Packaging</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Live Tracking & Carrier Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="pt-12 border-t border-stone-200">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">
            Similar Handcrafted Stone Creations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
