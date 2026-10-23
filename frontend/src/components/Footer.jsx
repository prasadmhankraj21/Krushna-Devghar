import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Box, Award, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-8 border-t border-amber-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-stone-800">
          <div className="flex items-center gap-3 bg-stone-800/40 p-4 rounded-xl border border-stone-800">
            <Award className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">100% Pure Makrana</h4>
              <p className="text-xs text-stone-400">Direct from Rajasthan quarries</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-stone-800/40 p-4 rounded-xl border border-stone-800">
            <Box className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">Wooden Crate Packing</h4>
              <p className="text-xs text-stone-400">Zero-damage transit guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-stone-800/40 p-4 rounded-xl border border-stone-800">
            <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">Insured All-India Freight</h4>
              <p className="text-xs text-stone-400">Live GPS tracking updates</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-stone-800/40 p-4 rounded-xl border border-stone-800">
            <Sparkles className="w-8 h-8 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-semibold text-white text-sm">Master Carvers</h4>
              <p className="text-xs text-stone-400">Generations of stone sculpting</p>
            </div>
          </div>
        </div>

        {/* Links & Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 py-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg gold-gradient-bg flex items-center justify-center text-stone-950 font-serif font-black text-xl">
                KD
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-wide">
                KRUSHNA DEVGHAR
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">
              Specialists in bespoke handcrafted pure Makrana white marble mandirs, sacred Vrindavan shrines, and exclusive temple artifacts.
            </p>
            <div className="text-xs text-amber-400/90 font-mono">
              GSTIN: 08AAACR8923K1ZP
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Featured Collections
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop?category=Marble%20Mandir" className="hover:text-amber-400 transition">
                  Makrana Pure White Marble Mandir
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Vrindavan%20Shrines" className="hover:text-amber-400 transition">
                  Vrindavan Shrines & Sanctum Temples
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Other%20Marble%20Products" className="hover:text-amber-400 transition">
                  Other Marble Artifacts & Clocks
                </Link>
              </li>
              <li>
                <Link to="/your-orders" className="hover:text-amber-400 transition font-bold text-amber-300">
                  📦 Your Orders & Live Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Customer Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/your-orders" className="hover:text-amber-400 transition">
                  Check Your Placed Orders
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-amber-400 transition">
                  Track Your Heavy Consignment
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-amber-400 transition">
                  Custom Stone Carving Inquiries
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-amber-400 transition">
                  Customer / Owner Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Workshop & Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Artisan Quarries & Hub
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Workshop: Makrana Artisan Industrial Area, Nagaur District, Rajasthan - 341505
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <span>+91 98290 12345 / 0141-289410</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>orders@krushnadevghar.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-stone-800 text-xs text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Krushna Devghar Pvt. Ltd. All Rights Reserved.</p>
          <p className="text-stone-400">
            Handcrafted with devotion in Makrana, Rajasthan
          </p>
        </div>
      </div>
    </footer>
  );
}
