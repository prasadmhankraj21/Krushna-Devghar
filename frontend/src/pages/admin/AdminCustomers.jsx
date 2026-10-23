import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      try {
        const res = await api.getAdminCustomers();
        if (res.success) {
          setCustomers(res.customers);
        }
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
          User Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
          Registered Customers Directory
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          List of customer accounts, total orders placed, and lifetime spend on marble artifacts
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold">
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">City & State</th>
                <th className="py-3 px-4 text-center">Orders Placed</th>
                <th className="py-3 px-4 text-right">Total Spent</th>
                <th className="py-3 px-4">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-stone-400">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-stone-400">
                    No registered customers yet.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-4 font-bold text-stone-900">
                      {c.name}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <p className="flex items-center gap-1.5 text-stone-700 font-mono">
                        <Phone className="w-3 h-3 text-amber-600" />
                        <span>{c.phone || 'N/A'}</span>
                      </p>
                      <p className="flex items-center gap-1.5 text-stone-500">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{c.email}</span>
                      </p>
                    </td>

                    <td className="py-3.5 px-4 text-stone-700">
                      {c.city || 'India'} {c.state ? `, ${c.state}` : ''}
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-stone-900">
                      {c.total_orders}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-900">
                      ₹{Number(c.total_spent).toLocaleString('en-IN')}
                    </td>

                    <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
