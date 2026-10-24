import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import InvoiceModal from '../components/InvoiceModal';
import TrackingTimeline from '../components/TrackingTimeline';
import {
  Package,
  Printer,
  Truck,
  ArrowRight,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  MapPin,
  Calendar,
  X,
  Sparkles
} from 'lucide-react';

export default function MyOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.getMyOrders();
        if (res.success) {
          setOrders(res.orders);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Dispatched':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300';
      case 'Crafting & Inspection':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            Krushna Devghar • Customer Orders
          </span>
          <h1 className="text-3xl font-serif font-black text-stone-900 mt-1 flex items-center gap-2">
            <span>Your Orders</span>
            <span className="text-stone-400 font-sans text-xl font-normal">(आपके ऑर्डर्स)</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Yahan aapne Krushna Devghar se jo bhi Marble Mandir ya Shrines kharide hain, unki live status aur tracking updates check kar sakte hain.
          </p>
        </div>

        <Link
          to="/shop"
          className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 px-3 py-2 rounded-xl border border-amber-200 transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="bg-stone-100 h-48 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 shadow-sm p-8 max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-serif font-bold text-stone-800">
            Aapne abhi tak koi order place nahi kiya hai
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
            Krushna Devghar ke pure Makrana white marble mandir aur vrindavan shrines dekhne ke liye catalog par jayein.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 gold-btn px-6 py-3 rounded-xl font-bold text-xs shadow-md"
          >
            <span>Explore Marble Mandir Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const latestHistory = order.tracking_history && order.tracking_history.length > 0
              ? order.tracking_history[order.tracking_history.length - 1]
              : null;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border-2 border-stone-200 shadow-sm overflow-hidden hover:border-amber-400 transition duration-300"
              >
                {/* Order Top Bar */}
                <div className="bg-stone-50/90 px-6 py-4 border-b border-stone-200 flex flex-wrap justify-between items-center gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-sm text-amber-950 bg-amber-100/60 px-2 py-0.5 rounded border border-amber-300">
                      {order.order_number}
                    </span>
                    <span className="text-stone-400">|</span>
                    <span className="text-stone-600">
                      Placed: <strong>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full font-bold border text-xs shadow-sm flex items-center gap-1.5 ${getStatusBadge(order.order_status)}`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                      <span>{order.order_status}</span>
                    </span>
                    <span className="font-mono font-bold text-sm text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200">
                      ₹{Number(order.total_amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Live Tracking Banner directly on Order Card! */}
                <div className="bg-gradient-to-r from-amber-50/80 via-white to-amber-50/60 p-4 sm:px-6 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                        <span>Live Consignment Tracking (Admin Updated)</span>
                      </p>
                      <p className="text-sm font-bold text-stone-900">
                        {order.current_location || 'Makrana Artisan Workshop, Rajasthan'}
                      </p>
                      {latestHistory?.notes && (
                        <p className="text-xs text-stone-600 mt-0.5 line-clamp-1 italic">
                          "{latestHistory.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTrackingOrder(order)}
                      className="px-4 py-2 gold-btn text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer hover:scale-105 transition"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Check Live Tracking Updates</span>
                    </button>
                  </div>
                </div>

                {/* Items & Shipping Details */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Items Column */}
                  <div className="md:col-span-2 space-y-3">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-stone-100 pb-1">
                      Ordered Products ({order.items?.length || 0})
                    </h4>

                    <div className="space-y-2.5">
                      {order.items && order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-stone-50/60 border border-stone-100">
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0 bg-stone-100"
                          />
                          <div className="flex-1 min-w-0 text-xs">
                            <p className="font-serif font-bold text-stone-900 truncate text-sm">{item.title}</p>
                            <p className="text-stone-500 text-[11px]">
                              Stone: {item.marble_type || 'Makrana Marble'} • Quantity: <strong className="text-stone-800">{item.quantity}</strong>
                            </p>
                          </div>
                          <div className="font-mono text-xs font-bold text-stone-900">
                            ₹{(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address & Actions */}
                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-stone-200 pb-1">
                        Delivery Destination
                      </h4>
                      <p className="font-bold text-stone-900 text-sm mt-1">{order.customer_name}</p>
                      <p className="text-stone-600 mt-0.5 leading-relaxed">{order.shipping_address}</p>
                      <p className="text-stone-600">{order.city}, {order.state} - {order.pincode}</p>
                      <p className="text-stone-700 mt-1">📞 {order.customer_phone}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-200">
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="w-full py-2.5 px-3 bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold rounded-lg border border-stone-300 shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-amber-700" />
                        <span>View / Print Tax Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Live Tracking Timeline Modal */}
      {selectedTrackingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base">
                  Live Tracking Updates • Order #{selectedTrackingOrder.order_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTrackingOrder(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <TrackingTimeline order={selectedTrackingOrder} />
            </div>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          isOpen={!!selectedInvoiceOrder}
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
}
