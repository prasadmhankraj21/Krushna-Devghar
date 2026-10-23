import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  User,
  Truck,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  PackageCheck
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'All Collection', path: '/shop' },
    { name: 'Marble Mandir', path: '/shop?category=Marble%20Mandir' },
    { name: 'Vrindavan Shrines', path: '/shop?category=Vrindavan%20Shrines' },
    { name: 'Other Marble Products', path: '/shop?category=Other%20Marble%20Products' },
    { name: 'Track Order', path: '/track' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm">
      {/* Top Customer Announcement Bar */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs">
              <Sparkles className="w-3.5 h-3.5" /> KRUSHNA DEVGHAR • Pure Makrana White Marble Mandir & Vrindavan Shrines
            </span>
            <span className="hidden md:inline text-stone-500">|</span>
            <span className="hidden md:inline text-stone-300">
              Safe Wooden Crate All-India Insured Transport
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-stone-300">
            <span>Call/WhatsApp: <strong>+91 98290 12345</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - KRUSHNA DEVGHAR */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl gold-gradient-bg flex items-center justify-center text-stone-950 shadow-md transform group-hover:scale-105 transition">
              <span className="font-serif font-black text-2xl tracking-tighter">KD</span>
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-stone-900 flex items-center gap-1.5">
                KRUSHNA DEVGHAR
                <span className="text-amber-800 font-sans text-[10px] uppercase font-bold px-1.5 py-0.5 border border-amber-300 rounded bg-amber-50">
                  MARBLE MANDIR
                </span>
              </span>
              <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                Makrana Artisanship • Vrindavan Sanctums
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = location.pathname + location.search === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-xs font-bold transition ${
                    active
                      ? 'text-amber-700 bg-amber-50 font-bold'
                      : 'text-stone-700 hover:text-amber-700 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons for Customer */}
          <div className="flex items-center gap-2.5">
            {/* Prominent "Your Orders" button */}
            <Link
              to="/your-orders"
              className="flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl border border-amber-300 transition shadow-sm"
              title="View placed orders & tracking updates"
            >
              <PackageCheck className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Your Orders</span>
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl hover:bg-stone-100 text-stone-700 transition"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-amber-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Customer User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-xs font-bold text-stone-800 hover:text-amber-700 p-1.5 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-200 border border-stone-300 flex items-center justify-center text-stone-800 font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Signed in as</p>
                      <p className="text-sm font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                    </div>

                    <Link
                      to="/your-orders"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-900 bg-amber-50/60 hover:bg-amber-50"
                    >
                      <PackageCheck className="w-4 h-4 text-amber-700" /> Your Orders (आपके ऑर्डर्स)
                    </Link>

                    <Link
                      to="/track"
                      className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-stone-50"
                    >
                      <Truck className="w-4 h-4 text-stone-500" /> Live Consignment Tracking
                    </Link>

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out (लॉग आउट)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold gold-btn px-4 py-2 rounded-xl shadow-sm"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-md"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-stone-800 hover:bg-stone-50 hover:text-amber-700"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/your-orders"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-bold text-amber-900 bg-amber-50"
          >
            📦 Your Orders (आपके ऑर्डर्स)
          </Link>
          {user && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-semibold text-rose-600 hover:bg-rose-50"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  );
}
