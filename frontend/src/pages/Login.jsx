import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // If customer already logged in, redirect to shop
  useEffect(() => {
    if (user && user.role === 'user') {
      navigate('/shop', { replace: true });
    }
  }, [user, navigate]);

  const from = location.state?.from?.pathname || '/shop';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from === '/login' ? '/shop' : from);
      } else {
        setErrorMsg(res.message || 'Incorrect email or password.');
      }
    } catch (err) {
      setErrorMsg('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = () => {
    setEmail('customer@gmail.com');
    setPassword('customer123');
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Decorative Marble Background Effect */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="bg-white w-full max-w-md rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-2xl space-y-6 relative z-10 animate-in fade-in zoom-in-95">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl gold-gradient-bg flex items-center justify-center text-stone-950 font-serif font-black text-2xl mx-auto shadow-lg">
            KD
          </div>
          <h1 className="font-serif text-3xl font-black text-stone-900 tracking-tight">
            KRUSHNA DEVGHAR
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-amber-800 font-bold">
            Makrana Pure White Marble Mandir & Vrindavan Shrines
          </p>
          <div className="inline-block bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold mt-1">
            👤 Customer Sign In (ग्राहक लॉगिन)
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Customer Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="rajesh@gmail.com"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 gold-btn text-xs font-black rounded-xl shadow-md cursor-pointer hover:scale-[1.01] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Store'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Customer Button */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="text-xs text-amber-800 hover:text-amber-900 underline font-semibold cursor-pointer"
            >
              Fill Sample Customer Credentials (customer@gmail.com)
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-stone-500 pt-3 border-t border-stone-100">
          <span>New Customer? </span>
          <Link to="/register" className="font-bold text-amber-800 hover:underline">
            Create an Account (खाता बनाएं)
          </Link>
        </div>
      </div>
    </div>
  );
}
