import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import TrackingTimeline from '../components/TrackingTimeline';
import InvoiceModal from '../components/InvoiceModal';
import {
  Truck,
  Search,
  FileText,
  AlertCircle,
  ShieldCheck,
  Package,
  Sparkles
} from 'lucide-react';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('order') || '';

  const [orderQuery, setOrderQuery] = useState(initialQuery);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const handleSearch = async (queryToSearch) => {
    const q = (queryToSearch || orderQuery).trim();
    if (!q) {
      setErrorMsg('Please enter an Order Number or Tracking Number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.trackOrder(q);
      if (res.success) {
        setOrder(res.order);
      } else {
        setErrorMsg(res.message || 'No shipment record found. Please verify your order number.');
        setOrder(null);
      }
    } catch (err) {
      console.error('Track error:', err);
      setErrorMsg('Shipment not found. Please verify the order number.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setOrderQuery(initialQuery);
      handleSearch(initialQuery);
    } else {
      // Default to the sample order so the user sees live tracking right away!
      setOrderQuery('MRB-2026-8942');
      handleSearch('MRB-2026-8942');
    }
  }, [initialQuery]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Heavy Freight Consignment Tracker
        </span>
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Track Your Marble & Granite Order
        </h1>
        <p className="text-xs sm:text-sm text-stone-600">
          Enter your Order Number (e.g. <span className="font-mono font-semibold text-amber-900">MRB-2026-8942</span>) or Courier AWB number to check real-time artisan crafting and logistics milestones updated by our workshop.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto pt-4"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="e.g. MRB-2026-8942 or Tracking Number"
              className="w-full text-xs font-mono pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="gold-btn px-6 py-3 rounded-xl text-xs font-bold shadow-md hover:scale-105 transition shrink-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Track Shipment'}
          </button>
        </form>

        {/* Quick Demo Fill Pill */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              setOrderQuery('MRB-2026-8942');
              handleSearch('MRB-2026-8942');
            }}
            className="text-[11px] text-amber-800 hover:text-amber-900 underline font-medium"
          >
            Load Sample Shipped Mandir Consignment (MRB-2026-8942)
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="max-w-xl mx-auto p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Order Details & Timeline Display */}
      {order && (
        <div className="space-y-6">
          {/* Top Quick Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-stone-900 text-white p-4 rounded-2xl shadow-md">
            <div>
              <p className="text-xs text-stone-400">Order Consignment:</p>
              <h3 className="text-base font-bold font-mono text-amber-400">
                {order.order_number}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsInvoiceOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold rounded-lg shadow transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Tax Invoice</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline Component */}
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
