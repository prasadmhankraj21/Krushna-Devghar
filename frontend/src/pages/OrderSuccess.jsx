import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import InvoiceModal from '../components/InvoiceModal';
import TrackingTimeline from '../components/TrackingTimeline';
import {
  CheckCircle2,
  FileText,
  Truck,
  ArrowRight,
  Printer,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    async function loadOrder() {
      try {
        const res = await api.trackOrder(orderNumber);
        if (res.success) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Error loading order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-stone-500 animate-pulse text-sm">Generating your order receipt and tracking link...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Celebration Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block text-xs uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Payment Verified & Order Confirmed
        </span>

        <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight">
          Thank You For Your Order!
        </h1>

        <p className="text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
          Your order has been forwarded to our master carving workshop in Makrana, Rajasthan. A tax invoice has been generated below for your records.
        </p>

        {order && (
          <div className="inline-block bg-stone-50 border border-stone-200 rounded-2xl p-4 my-2 text-xs text-left max-w-md w-full">
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Order Number:</span>
              <span className="font-mono font-bold text-amber-900 text-sm">{order.order_number}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Amount Paid:</span>
              <span className="font-mono font-bold text-stone-900">₹{Number(order.total_amount).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Payment Mode:</span>
              <span className="font-medium text-stone-800">{order.payment_method}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">Delivery To:</span>
              <span className="font-medium text-stone-800 truncate max-w-[200px]">{order.customer_name}, {order.city}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/your-orders"
            className="flex items-center gap-2 gold-btn px-6 py-3.5 rounded-xl font-black text-xs shadow-md cursor-pointer hover:scale-105 transition"
          >
            <PackageCheck className="w-4 h-4" />
            <span>Go to Your Orders (ऑर्डर्स देखें)</span>
          </Link>

          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 px-6 py-3.5 rounded-xl font-bold text-xs shadow transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-700" />
            <span>Print Tax Invoice</span>
          </button>

          <Link
            to={`/track?order=${orderNumber}`}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-6 py-3.5 rounded-xl font-semibold text-xs shadow-md transition"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Live Consignment Tracking</span>
          </Link>
        </div>
      </div>

      {/* Live Tracking Timeline Embed */}
      {order && (
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <span>Live Shipment Status (Track In Real-Time)</span>
          </h2>
          <TrackingTimeline order={order} />
        </div>
      )}

      {/* Invoice Modal */}
      {order && (
        <InvoiceModal
          isOpen={isInvoiceOpen}
          order={order}
          onClose={() => setIsInvoiceOpen(false)}
        />
      )}
    </div>
  );
}
