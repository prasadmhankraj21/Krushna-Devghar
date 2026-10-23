import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import InvoiceModal from '../../components/InvoiceModal';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Truck,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await api.getAdminDashboard();
        if (res.success) {
          setStats(res.stats);
          setRecentOrders(res.recentOrders);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-stone-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => <div key={n} className="h-32 bg-stone-200 rounded-2xl"></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
            Real-Time Store Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Admin Management Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 gold-btn px-4 py-2.5 rounded-xl font-bold text-xs shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2.5 rounded-xl font-semibold text-xs shadow-md"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 font-medium">Total Gross Revenue</p>
            <h3 className="text-2xl font-black font-mono text-stone-900 mt-1">
              ₹{Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> All-Time Paid Sales
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg border border-amber-200">
            ₹
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 font-medium">Total Orders Placed</p>
            <h3 className="text-2xl font-black font-mono text-stone-900 mt-1">
              {stats?.totalOrders || 0}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              {stats?.deliveredOrders || 0} Delivered Successfully
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 font-medium">In-Transit / Processing</p>
            <h3 className="text-2xl font-black font-mono text-amber-900 mt-1">
              {stats?.pendingOrders || 0}
            </h3>
            <p className="text-[11px] text-amber-700 font-semibold mt-1">
              Live Shipments to Update
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-stone-500 font-medium">Active Products in Catalog</p>
            <h3 className="text-2xl font-black font-mono text-stone-900 mt-1">
              {stats?.totalProducts || 0}
            </h3>
            <p className="text-[11px] text-stone-500 mt-1">
              Vrindavan Shrines, Peacocks, Pillars
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-200">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Orders Management Section */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex justify-between items-center">
          <div>
            <h2 className="font-serif font-bold text-stone-900 text-lg">
              Recent Customer Consignments
            </h2>
            <p className="text-xs text-stone-500">
              Orders requiring crafting, packing, or tracking milestone updates
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold">
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & City</th>
                <th className="py-3 px-4">Product Bought</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-mono font-bold text-amber-900">{order.order_number}</p>
                    <p className="text-[10px] text-stone-400">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </p>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-stone-900">{order.customer_name}</p>
                    <p className="text-[11px] text-stone-500">{order.city}, {order.customer_phone}</p>
                  </td>

                  <td className="py-3.5 px-4">
                    {order.items && order.items[0] ? (
                      <div>
                        <p className="font-medium text-stone-800 truncate max-w-xs">{order.items[0].title}</p>
                        {order.items.length > 1 && (
                          <span className="text-[10px] text-stone-400">+{order.items.length - 1} more items</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-stone-400">Details attached</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-stone-900">
                    ₹{Number(order.total_amount).toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      ● {order.order_status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to="/admin/orders"
                        className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-semibold rounded shadow-sm"
                      >
                        Update Tracking
                      </Link>
                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold rounded border border-stone-200"
                        title="View Official Invoice"
                      >
                        Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal Preview */}
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
