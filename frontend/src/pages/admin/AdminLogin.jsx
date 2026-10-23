import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Shield, Lock, Mail, User, AlertCircle, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AdminLogin() {
  const { adminLogin, setupAdmin, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [hasAdmin, setHasAdmin] = useState(true);
  const [adminEmail, setAdminEmail] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in as admin, navigate directly to dashboard
    if (user && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }

    async function checkStatus() {
      try {
        const res = await api.getAdminStatus();
        if (res.success) {
          setHasAdmin(res.hasAdmin);
          if (res.hasAdmin && res.adminEmail) {
            setAdminEmail(res.adminEmail);
            setEmail(res.adminEmail);
          }
        }
      } catch (err) {
        console.error('Error checking admin status:', err);
      }
    }
    checkStatus();
  }, [user, isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await adminLogin(email, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(res.message || 'Invalid admin credentials.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await setupAdmin({ name, email, password, phone });
      if (res.success) {
        setSuccessMsg('Owner Admin account created! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Failed to setup admin.');
      }
    } catch (err) {
      setErrorMsg('Error setting up admin account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="bg-stone-900 w-full max-w-md rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-2xl space-y-6 relative z-10 text-white animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl gold-gradient-bg flex items-center justify-center text-stone-950 font-serif font-black text-2xl mx-auto shadow-xl">
            KD
          </div>
          <span className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] uppercase font-bold rounded-full tracking-widest">
            Exclusive Owner Access
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-white tracking-tight">
            Admin Management Portal
          </h1>
          <p className="text-xs text-stone-400">
            Krushna Devghar • Marble Mandir & Shrines Business Panel
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {!isSetupMode ? (
          /* Admin Login Form */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Owner Gmail / Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-700 bg-stone-800/90 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="admin@marbles.com or your registered Gmail"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-700 bg-stone-800/90 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 gold-btn text-stone-950 text-xs font-black rounded-xl shadow-lg cursor-pointer hover:scale-[1.01] transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Shield className="w-4 h-4" />
                <span>{loading ? 'Verifying Admin Access...' : 'Sign In to Owner Admin Panel'}</span>
              </button>
            </div>

            {/* Quick Demo Pre-fill for Owner */}
            <div className="p-3 bg-stone-800/60 rounded-xl border border-stone-700/60 text-center">
              <p className="text-[11px] text-stone-400">
                Default Owner Credentials: <strong className="text-amber-400 font-mono">admin@marbles.com</strong> / <strong className="text-amber-400 font-mono">admin123</strong>
              </p>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@marbles.com');
                  setPassword('admin123');
                }}
                className="mt-1 text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
              >
                Auto-fill Default Owner Credentials
              </button>
            </div>

            {!hasAdmin && (
              <div className="text-center pt-2 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsSetupMode(true)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Create New Owner Account (One-time Setup)
                </button>
              </div>
            )}
          </form>
        ) : (
          /* One-time Owner Setup Form */
          <form onSubmit={handleSetup} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-300 mb-1">Owner Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. Krushna Devghar Owner"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">Your Personal Gmail / Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="youremail@gmail.com"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-300 mb-1">Admin Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-700 bg-stone-800 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="+91 98290 12345"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 gold-btn text-stone-950 text-xs font-black rounded-xl shadow-lg cursor-pointer"
            >
              Register as Single Store Owner
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsSetupMode(false)}
                className="text-xs text-stone-400 hover:text-white underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        <div className="text-center text-[11px] text-stone-500 pt-3 border-t border-stone-800">
          <p>🔒 Strictly reserved for Krushna Devghar Business Owner.</p>
          <p className="mt-1">Customer store access is located separately at <Link to="/login" className="text-amber-400 hover:underline">/login</Link></p>
        </div>
      </div>
    </div>
  );
}
