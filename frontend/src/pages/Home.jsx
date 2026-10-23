import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Box,
  Compass,
  Award,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.getProducts();
        if (res.success) {
          const prods = res.products || [];
          setAllProducts(prods);
          setFeaturedProducts(prods.slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  // Helper to dynamically pick the latest real photo uploaded by the owner for each category
  const getCategoryPhoto = (categoryName) => {
    const inCategory = allProducts.filter(p => p.category === categoryName && p.image_url);
    if (inCategory.length > 0) {
      // Latest uploaded product photo in this category
      return inCategory[inCategory.length - 1].image_url;
    }
    // Fallback to any real product photo uploaded by owner if category is empty yet
    const anyOwnerPhoto = allProducts.find(p => p.image_url);
    return anyOwnerPhoto ? anyOwnerPhoto.image_url : '';
  };

  const getCategoryCount = (categoryName) => {
    return allProducts.filter(p => p.category === categoryName).length;
  };

  const categories = [
    {
      title: 'Marble Mandir',
      category: 'Marble Mandir',
      desc: 'Bespoke hand-carved pure Makrana white marble home temples with shikhar domes & LED lighting',
      image: getCategoryPhoto('Marble Mandir'),
      count: getCategoryCount('Marble Mandir')
    },
    {
      title: 'Vrindavan Shrines',
      category: 'Vrindavan Shrines',
      desc: 'Sacred Braj style marble shrines with intricate jali carvings, bells & holy sanctums',
      image: getCategoryPhoto('Vrindavan Shrines'),
      count: getCategoryCount('Vrindavan Shrines')
    },
    {
      title: 'Other Marble Products',
      category: 'Other Marble Products',
      desc: 'Handcrafted marble clocks, onyx urlis, granite tables, and luxury decorative artifacts',
      image: getCategoryPhoto('Other Marble Products'),
      count: getCategoryCount('Other Marble Products')
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-950 text-white min-h-[620px] flex items-center">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-35 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent z-1"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Authentic Makrana White Marble Temples & Shrines</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Timeless <span className="gold-gradient-text">Marble Mandir</span> & Vrindavan Shrines
            </h1>

            <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed">
              Explore our master-carved Makrana White Marble Temples, holy Vrindavan Shrines, and exclusive handcrafted marble artifacts. Directly sculpted in Makrana and delivered in reinforced wooden crates with live freight tracking.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="gold-btn px-6 py-3.5 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 hover:scale-105 transition"
              >
                <span>Browse All Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/track"
                className="bg-stone-800/80 hover:bg-stone-700 text-white border border-stone-700 px-6 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 backdrop-blur-md transition"
              >
                <Truck className="w-4 h-4 text-amber-400" />
                <span>Track Your Consignment</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-800 text-stone-300">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">100%</p>
                <p className="text-xs text-stone-400">Pure Makrana Stone</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">Zero</p>
                <p className="text-xs text-stone-400">Transit Damage (Crated)</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-amber-400 font-mono">GST</p>
                <p className="text-xs text-stone-400">Official Tax Invoice</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Handcrafted Stone Collections
          </span>
          <h2 className="text-3xl font-serif font-bold text-stone-900 mt-2">
            Explore By Product Category
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Choose from authentic Marble Mandirs, Vrindavan Shrines, or explore other exclusive marble creations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/shop?category=${encodeURIComponent(cat.category)}`}
              className="group relative rounded-2xl overflow-hidden bg-stone-900 aspect-[4/3] shadow-lg hover:shadow-2xl transition-all duration-300 border border-stone-200 block"
            >
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85 group-hover:opacity-95"
                />
              ) : (
                <div className="w-full h-full bg-stone-850 flex items-center justify-center text-stone-500 font-serif">
                  {cat.title}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider bg-stone-900/60 px-2.5 py-1 rounded-full backdrop-blur-xs border border-amber-500/20">
                  {cat.count > 0 ? `${cat.count} Designs Available` : 'Makrana Heritage'}
                </span>
                <h3 className="font-serif font-bold text-2xl group-hover:text-amber-300 transition mt-2">
                  {cat.title}
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-2 font-light">
                  {cat.desc}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                  <span>View All {cat.title}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-700">
              Artisan Masterpieces
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">
              Featured Marble Mandir & Shrines
            </h2>
          </div>
          <Link
            to="/shop"
            className="flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-stone-100 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Stone Heritage & Safe Transit Assurance Banner */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                Heritage & Assurance
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                From Makrana's White Quarries Direct To Your Holy Sanctum
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed">
                Makrana marble has been prized for over five centuries. Our Mandirs and Vrindavan Shrines are carved with utmost purity and devotion by master artisans.
              </p>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Discoloration:</strong> Pure Makrana marble does not turn yellow with age or water contact.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Heavy Wooden Crate Transit:</strong> Packed with shock-resistant high-density foam, strapped in steel bands to withstand long-distance road transport.</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Live Order Tracking:</strong> Track every stage from artisan hand-carving to dispatch and final delivery.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 gold-btn px-6 py-3 rounded-xl font-bold text-xs"
                >
                  <span>Explore Available Temples & Shrines</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-600/30 bg-stone-900 min-h-[350px] flex items-center justify-center">
                {allProducts.length > 0 && allProducts[0].image_url ? (
                  <img
                    src={allProducts[0].image_url}
                    alt="Authentic Makrana Marble Creation"
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-stone-900 flex items-center justify-center text-stone-500 font-serif">
                    Krushna Devghar Marble
                  </div>
                )}
              </div>
              <div className="absolute -bottom-6 -right-4 bg-stone-800 p-4 rounded-xl border border-amber-500/40 shadow-xl max-w-xs text-xs">
                <p className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> 100% Makrana Certification
                </p>
                <p className="text-stone-300 mt-1">
                  Each order includes a registered GST Tax Invoice and origin authenticity guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
