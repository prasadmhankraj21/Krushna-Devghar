import React from 'react';
import { Outlet, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Store,
  Shield,
  LogOut,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // If not logged in as Admin, redirect immediately to /admin/login
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Product Catalog & Photos', path: '/admin/products', icon: Package },
    { name: 'Customer Orders & Live Tracking', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-stone-950 text-stone-300 p-5 shrink-0 flex flex-col justify-between border-r border-stone-800 shadow-xl">
        <div>
          {/* Brand */}
          <div className="flex items-center gap-2.5 pb-6 border-b border-stone-800">
            <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center text-stone-950 font-serif font-black text-xl shadow-md">
              KD
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm text-white tracking-wide">
                KRUSHNA DEVGHAR
              </h2>
              <p className="text-[10px] text-amber-400 font-mono">Owner Management Panel</p>
            </div>
          </div>

          {/* Current Owner Badge */}
          <div className="mt-4 p-3 bg-stone-900 rounded-2xl border border-stone-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm shadow">
              👑
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <span className="text-[10px] text-amber-400 font-mono font-semibold">Store Owner</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    active
                      ? 'bg-amber-600 text-white shadow-md'
                      : 'text-stone-400 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-stone-900 transition"
            title="Open customer storefront in new tab"
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>View Storefront (New Tab)</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition text-left cursor-pointer font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
