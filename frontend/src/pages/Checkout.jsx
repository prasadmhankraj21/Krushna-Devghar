import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import PaymentModal from '../components/PaymentModal';
import InvoiceModal from '../components/InvoiceModal';
import {
  Lock,
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { cartItems, subtotal, gst, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_name: user?.name || 'Rajesh Sharma',
    customer_email: user?.email || 'customer@gmail.com',
    customer_phone: user?.phone || '+91 98765 43210',
    shipping_address: user?.address || 'Flat 402, Royal Palms Residency, MG Road',
    city: user?.city || 'Mumbai',
    state: user?.state || 'Maharashtra',
    pincode: user?.pincode || '400001',
    notes: 'Please ensure heavy wooden crating with fragile stone transit warning.'
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customer_name: prev.customer_name || user.name,
        customer_email: prev.customer_email || user.email,
        customer_phone: prev.customer_phone || user.phone || '',
        shipping_address: prev.shipping_address || user.address || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        pincode: prev.pincode || user.pincode || ''
      }));
    }
  }, [user]);

  if (cartItems.length === 0 && !createdOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-800">Your Cart is Empty</h2>
        <p className="text-xs text-stone-500 mt-2">Add marble artifacts or shrines to checkout.</p>
        <Link to="/shop" className="mt-4 inline-block gold-btn px-4 py-2 rounded-lg text-xs font-bold">
          Go To Catalog
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStartPayment = (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.shipping_address || !formData.city || !formData.pincode) {
      setErrorMsg('Please fill in all mandatory delivery address fields.');
      return;
    }
    setErrorMsg('');
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async ({ payment_method, transaction_id }) => {
    try {
      setIsPaymentModalOpen(false);

      const itemsPayload = cartItems.map(item => ({
        id: item.id,
        product_id: item.id,
        title: item.title,
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        image_url: item.image_url,
        marble_type: item.marble_type || 'Makrana Natural White Marble',
        category: item.category || 'Marble Mandir'
      }));

      const calculatedSubtotal = itemsPayload.reduce((sum, it) => sum + (it.price * it.quantity), 0);
      const calculatedGst = Math.round(calculatedSubtotal * 0.12);
      const calculatedTotal = calculatedSubtotal + calculatedGst;

      const orderPayload = {
        ...formData,
        payment_method: payment_method || 'UPI / Online Payment',
        transaction_id: transaction_id || `TXN_${Date.now().toString(36).toUpperCase()}`,
        items: itemsPayload,
        subtotal: calculatedSubtotal,
        gst_amount: calculatedGst,
        shipping_charges: 0,
        total_amount: calculatedTotal
      };

      const res = await api.createOrder(orderPayload);
      if (res.success) {
        setCreatedOrder(res.order);
        clearCart();
        // Immediately show the official tax invoice!
        setIsInvoiceModalOpen(true);
      } else {
        setErrorMsg(res.message || 'Error saving order. Please try again.');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMsg('Failed to process order. Please try again.');
    }
  };

  const handleCloseInvoice = () => {
    setIsInvoiceModalOpen(false);
    if (createdOrder) {
      navigate(`/order-success/${createdOrder.order_number}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs uppercase font-bold tracking-widest text-amber-700">Safe Delivery Checkout</span>
        <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
          Delivery Address & Payment
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleStartPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Shipping Address Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <h2 className="font-serif font-bold text-stone-900 text-lg border-b border-stone-100 pb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <span>Consignment Shipping Address</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Full Name / Recipient *
              </label>
              <input
                type="text"
                name="customer_name"
                required
                value={formData.customer_name}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. Rajesh Sharma"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Contact Phone / WhatsApp *
              </label>
              <input
                type="text"
                name="customer_phone"
                required
                value={formData.customer_phone}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Email Address (For Invoice & Tracking PDF) *
              </label>
              <input
                type="email"
                name="customer_email"
                required
                value={formData.customer_email}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="customer@gmail.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Detailed Street Address (Include Flat / House No / Landmark) *
              </label>
              <textarea
                name="shipping_address"
                required
                rows="2"
                value={formData.shipping_address}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="Flat 402, Royal Palms Residency, MG Road"
              ></textarea>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">City *</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. Mumbai"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">State *</label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. Maharashtra"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Pincode *</label>
              <input
                type="text"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. 400001"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Special Delivery Instructions (e.g. Lift access, Ground Floor, Temple Placement)
              </label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. Handle with care, fragile stone"
              />
            </div>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-amber-700" /> Insured Heavy Freight Guarantee:
            </p>
            <p className="text-[11px] leading-relaxed">
              We dispatch through specialized surface logistics (SafeXpress / VRL). Your consignment will be packaged in a bespoke wooden case. You will receive an SMS and live tracking link as soon as your order is dispatched.
            </p>
          </div>
        </div>

        {/* Order Review & Pay CTA */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <h3 className="font-serif font-bold text-stone-900 text-lg border-b border-stone-100 pb-3">
            Review Items ({cartItems.length})
          </h3>

          <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-stone-100 last:border-0">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-12 h-12 rounded object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-900 truncate">{item.title}</p>
                  <p className="text-stone-500 text-[11px]">Qty: {item.quantity}</p>
                </div>
                <div className="font-mono font-bold text-stone-900 text-right">
                  ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs border-t border-stone-100 pt-3">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>GST (12%):</span>
              <span className="font-mono font-semibold">₹{gst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Wooden Crate & Freight:</span>
              <span className="text-emerald-700 font-bold uppercase text-[10px]">FREE</span>
            </div>
            <div className="pt-3 border-t-2 border-stone-900 flex justify-between text-sm font-bold text-stone-900">
              <span>Total Amount:</span>
              <span className="text-lg font-mono text-amber-900">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-4 gold-btn text-sm font-black rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Proceed to Payment (₹{total.toLocaleString('en-IN')})</span>
          </button>

          <div className="text-[11px] text-stone-500 text-center space-y-1">
            <p className="flex items-center justify-center gap-1 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Secure Checkout
            </p>
            <p>Official GST Invoice & Live Tracking will be generated immediately.</p>
          </div>
        </div>
      </form>

      {/* Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={total}
        onSuccess={handlePaymentSuccess}
      />

      {/* Instant Tax Invoice Modal */}
      {createdOrder && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          order={createdOrder}
          onClose={handleCloseInvoice}
        />
      )}
    </div>
  );
}
