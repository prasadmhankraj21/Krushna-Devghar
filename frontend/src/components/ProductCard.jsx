import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const discountPercent = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 flex flex-col">
      {/* Product Image & Badges */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-b from-stone-50 to-stone-100/90 flex items-center justify-center p-2.5">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 drop-shadow-2xs"
          loading="lazy"
        />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-amber-300 text-[11px] font-medium px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>

        {/* Discount Badge */}
        {discountPercent && (
          <span className="absolute top-3 right-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow">
            {discountPercent}% OFF
          </span>
        )}

        {/* Marble Type Tag */}
        <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-medium text-stone-700 flex items-center justify-between border border-stone-200">
          <span className="truncate flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
            {product.marble_type || 'Makrana Natural Stone'}
          </span>
          {product.weight && (
            <span className="text-stone-500 shrink-0 text-[10px] bg-stone-100 px-1.5 py-0.5 rounded">
              {product.weight}
            </span>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-serif font-semibold text-stone-900 text-base line-clamp-2 group-hover:text-amber-800 transition">
              {product.title}
            </h3>
          </Link>

          {product.dimensions && (
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
              <span>Dimensions:</span>
              <span className="font-mono text-stone-700">{product.dimensions}</span>
            </p>
          )}
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-bold text-stone-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs text-stone-400 line-through">
                ₹{Number(product.original_price).toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium ml-auto">
              GST Inclusive
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 gold-btn text-xs font-bold rounded-lg shadow-sm"
            >
              <span>Buy Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
