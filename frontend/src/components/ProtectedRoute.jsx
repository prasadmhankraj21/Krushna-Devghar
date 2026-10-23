import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fbfbf9] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl gold-gradient-bg flex items-center justify-center text-stone-950 font-serif font-black text-2xl shadow-xl animate-pulse">
          KD
        </div>
        <p className="text-xs uppercase font-serif font-bold text-amber-900 tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
          <span>KRUSHNA DEVGHAR • Connecting Sacred Sanctum...</span>
        </p>
      </div>
    );
  }

  // Not logged in -> Redirect to /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin route protection
  if (adminOnly && !isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
