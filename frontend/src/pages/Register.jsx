import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/shop');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div className="bg-white w-full max-w-lg rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-2xl space-y-6 relative z-10 animate-in fade-in zoom-in-95">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl gold-gradient-bg flex items-center justify-center text-stone-950 font-serif font-black text-2xl mx-auto shadow-lg">
            KD
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            KRUSHNA DEVGHAR
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            Create Customer Account (नया ग्राहक खाता बनाएं)
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="e.g. Rajesh Sharma"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="rajesh@gmail.com"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Password *</label>
              <input
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="Min 6 characters"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Phone / WhatsApp</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="Mumbai"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Delivery Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="Apartment, Street Address"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="Maharashtra"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="400001"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 gold-btn text-xs font-black rounded-xl shadow-md cursor-pointer hover:scale-[1.01] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration & Enter Store'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-amber-800 hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
