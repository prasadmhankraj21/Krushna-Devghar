import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles
} from 'lucide-react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, gst, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-800">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-stone-500 mt-2 max-w-sm mx-auto">
          Explore our magnificent Makrana white marble temples, peacock statues, and architectural pillars.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 gold-btn px-6 py-3 rounded-xl font-bold text-xs shadow-md"
        >
          <span>Explore Marble Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-stone-200 pb-4 flex justify-between items-end">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Review Items</span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-stone-500 hover:text-rose-600 transition flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-20 h-20 rounded-lg object-cover shrink-0 bg-stone-100 border border-stone-200"
                />
                <div>
                  <Link
                    to={`/product/${item.id}`}
                    className="font-serif font-bold text-stone-900 text-sm sm:text-base hover:text-amber-800 transition line-clamp-1"
                  >
                    {item.title}
                  </Link>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Stone: <strong className="text-stone-700">{item.marble_type || 'Natural Marble'}</strong>
                  </p>
                  <p className="text-xs text-amber-800 font-mono font-bold mt-1">
                    ₹{Number(item.price).toLocaleString('en-IN')} each
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Line Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-mono text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-stone-600 hover:bg-stone-100 font-bold text-xs"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="font-mono font-bold text-sm text-stone-900">
                    ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Safe Wooden Crate Notice */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-3 text-xs text-amber-900">
            <Truck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              All heavy stone items are crated in bespoke wooden cases with multi-layer thermocol cushioning for 100% damage-free transit.
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-stone-900 text-lg border-b border-stone-100 pb-3">
            Order Summary
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>GST (12% stone rate):</span>
              <span className="font-mono font-semibold">₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Insured Freight & Packaging:</span>
              <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
            </div>
            <div className="pt-3 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
              <span>Total Payable:</span>
              <span className="text-lg font-mono text-amber-900">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-4 gold-btn text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-3 border-t border-stone-100 text-[11px] text-stone-500 space-y-1">
            <p className="flex items-center gap-1.5 text-stone-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Includes GST Tax Invoice immediately upon purchase</span>
            </p>
            <p className="flex items-center gap-1.5 text-stone-700">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Full live consignment tracking by Admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
