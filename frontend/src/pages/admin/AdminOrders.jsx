import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import InvoiceModal from '../../components/InvoiceModal';
import {
  ShoppingBag,
  Truck,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  X,
  Phone,
  Mail,
  Home,
  AlertCircle
} from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [trackingModalOrder, setTrackingModalOrder] = useState(null);
  const [trackingFormData, setTrackingFormData] = useState({
    order_status: 'In Transit',
    courier_name: 'SafeXpress Heavy Freight Logistics',
    tracking_number: '',
    current_location: 'Jaipur Logistics Hub',
    estimated_delivery: '',
    notes: 'Consignment inspected and moving smoothly via air-suspension truck.'
  });
  const [statusNotice, setStatusNotice] = useState('');

  const statuses = [
    'All',
    'Order Placed',
    'Crafting & Inspection',
    'Dispatched',
    'In Transit',
    'Out for Delivery',
    'Delivered'
  ];

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOrders({ status: statusFilter, search });
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleOpenTrackingModal = (order) => {
    setTrackingModalOrder(order);
    setTrackingFormData({
      order_status: order.order_status || 'In Transit',
      courier_name: order.courier_name || 'SafeXpress Heavy Freight Logistics',
      tracking_number: order.tracking_number || `SX-TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      current_location: order.current_location || 'Makrana Workshop',
      estimated_delivery: order.estimated_delivery || '5-7 Days',
      notes: `Status updated to ${order.order_status || 'In Transit'}`
    });
  };

  const handleUpdateTracking = async (e) => {
    e.preventDefault();
    if (!trackingModalOrder) return;

    try {
      const res = await api.updateOrderStatus(trackingModalOrder.id, trackingFormData);
      if (res.success) {
        setStatusNotice(`Order #${trackingModalOrder.order_number} live status updated!`);
        setTrackingModalOrder(null);
        loadOrders();
        setTimeout(() => setStatusNotice(''), 3000);
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
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
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
            Dispatch & Fulfillment
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Customer Orders & Live Tracking
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            View customer details, shipping addresses, items ordered, and push live tracking milestone updates
          </p>
        </div>

        <div className="text-xs text-stone-600 font-medium bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-sm">
          Total Orders: <strong className="text-stone-900">{orders.length}</strong>
        </div>
      </div>

      {statusNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order # or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Orders Cards List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white h-48 rounded-2xl border border-stone-200 animate-pulse"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-stone-200">
            <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No Orders Found</h3>
            <p className="text-xs text-stone-500 mt-1">There are no orders matching this filter.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:border-amber-300 transition"
            >
              {/* Header */}
              <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex flex-wrap justify-between items-center gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-amber-900">{order.order_number}</span>
                  <span className="text-stone-400">|</span>
                  <span className="text-stone-600 font-medium">
                    Order Date: {new Date(order.created_at).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full font-bold border text-[11px] ${getStatusBadge(order.order_status)}`}>
                    ● {order.order_status}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    PAID via {order.payment_method}
                  </span>
                </div>
              </div>

              {/* Order Body: Customer details + Ordered items */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer & Shipping info */}
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-stone-200 pb-1 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-amber-700" />
                    <span>Customer & Delivery Address</span>
                  </h4>
                  <p className="font-bold text-stone-900 text-sm">{order.customer_name}</p>
                  <p className="text-stone-600 leading-relaxed">{order.shipping_address}</p>
                  <p className="text-stone-600">{order.city}, {order.state} - {order.pincode}</p>
                  <div className="pt-1 text-stone-700 space-y-1">
                    <p className="flex items-center gap-1.5 font-medium">
                      <Phone className="w-3.5 h-3.5 text-amber-700" />
                      <span>{order.customer_phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-stone-600">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>{order.customer_email}</span>
                    </p>
                  </div>
                </div>

                {/* Ordered Items Preview */}
                <div className="lg:col-span-2 space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-stone-100 pb-1 flex items-center justify-between">
                    <span>Products Purchased ({order.items?.length || 0})</span>
                    <span className="font-mono text-stone-900 font-bold text-sm">
                      Total: ₹{Number(order.total_amount).toLocaleString('en-IN')}
                    </span>
                  </h4>

                  <div className="space-y-2">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-stone-50/60 border border-stone-100">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-12 h-12 rounded object-cover border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <p className="font-bold text-stone-900 truncate">{item.title}</p>
                          <p className="text-stone-500 text-[11px]">
                            Stone: {item.marble_type} • Qty: <strong>{item.quantity}</strong>
                          </p>
                        </div>
                        <div className="text-right font-mono text-xs font-bold text-stone-900">
                          ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Consignment Status Box */}
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 text-xs flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-amber-900 font-semibold flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-amber-700" />
                        <span>Carrier: {order.courier_name || 'SafeXpress'}</span>
                        <span className="font-mono font-bold ml-1">({order.tracking_number || 'SX-PENDING'})</span>
                      </p>
                      <p className="text-stone-600 text-[11px]">
                        Last Scan: <strong>{order.current_location || 'Makrana'}</strong> • Est Delivery: <strong>{order.estimated_delivery || 'In 5-7 days'}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-3 py-1.5 bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold rounded-lg border border-stone-200 flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>Invoice</span>
                      </button>

                      <button
                        onClick={() => handleOpenTrackingModal(order)}
                        className="gold-btn px-3.5 py-1.5 text-xs font-bold rounded-lg shadow flex items-center gap-1.5 cursor-pointer hover:scale-105 transition"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Update Live Tracking</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Update Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-base">
                  Update Consignment Live Tracking
                </h3>
                <p className="text-xs text-amber-400 font-mono">
                  Order #{trackingModalOrder.order_number} ({trackingModalOrder.customer_name})
                </p>
              </div>
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTracking} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Change Order Status Stage *
                </label>
                <select
                  value={trackingFormData.order_status}
                  onChange={(e) => setTrackingFormData({ ...trackingFormData, order_status: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Order Placed">1. Order Placed</option>
                  <option value="Crafting & Inspection">2. Crafting & Inspection</option>
                  <option value="Dispatched">3. Dispatched (Wooden Crate)</option>
                  <option value="In Transit">4. In Transit (Heavy Truck)</option>
                  <option value="Out for Delivery">5. Out for Delivery</option>
                  <option value="Delivered">6. Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Courier / Logistics Partner Name
                </label>
                <input
                  type="text"
                  value={trackingFormData.courier_name}
                  onChange={(e) => setTrackingFormData({ ...trackingFormData, courier_name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. SafeXpress Heavy Freight Logistics / VRL Logistics"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  AWB / Tracking Consignment Number
                </label>
                <input
                  type="text"
                  value={trackingFormData.tracking_number}
                  onChange={(e) => setTrackingFormData({ ...trackingFormData, tracking_number: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 font-mono font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="SX-MAK-9021841"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Current Scanned City / Location *
                </label>
                <input
                  type="text"
                  required
                  value={trackingFormData.current_location}
                  onChange={(e) => setTrackingFormData({ ...trackingFormData, current_location: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. Jaipur Logistics Sorting Hub, Rajasthan"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Estimated Delivery Date
                </label>
                <input
                  type="text"
                  value={trackingFormData.estimated_delivery}
                  onChange={(e) => setTrackingFormData({ ...trackingFormData, estimated_delivery: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. 28 Oct 2026"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Milestone Progress Note (Visible to Customer on Live Tracking Page)
                </label>
                <textarea
                  rows="3"
                  value={trackingFormData.notes}
                  onChange={(e) => setTrackingFormData({ ...trackingFormData, notes: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="e.g. Consignment loaded into shock-absorbing wooden crate and handed to driver."
                ></textarea>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gold-btn px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer hover:scale-105 transition"
                >
                  Publish Tracking Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal Preview for Admin */}
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
