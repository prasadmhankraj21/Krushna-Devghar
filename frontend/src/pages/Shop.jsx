import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedMarbleType, setSelectedMarbleType] = useState('All');

  // Exactly the 3 categories requested by user
  const categories = [
    'All',
    'Marble Mandir',
    'Vrindavan Shrines',
    'Other Marble Products'
  ];

  const marbleTypes = [
    'All',
    'Makrana',
    'Carrara',
    'Granite',
    'Onyx'
  ];

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (selectedMarbleType && selectedMarbleType !== 'All') {
          params.marbleType = selectedMarbleType;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        if (sortBy) {
          params.sort = sortBy;
        }

        const res = await api.getProducts(params);
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [selectedCategory, selectedMarbleType, searchQuery, sortBy]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            Handcrafted In Makrana & Rajasthan
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-2">
            Marble Mandir & Vrindavan Shrines Catalog
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Browse authentic Makrana pure white marble temples, Vrindavan shrines, and luxury marble products.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Mandir, Vrindavan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & Marble Material Filter */}
        <div className="flex items-center gap-3 ml-auto text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Stone:</span>
            <select
              value={selectedMarbleType}
              onChange={(e) => setSelectedMarbleType(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {marbleTypes.map((m) => (
                <option key={m} value={m}>{m === 'All' ? 'All Stone Types' : m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="newest">Latest Collection</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-stone-100 rounded-xl h-80 animate-pulse"></div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
          <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-stone-800">No matching marble products found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category from above.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedMarbleType('All');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="text-xs text-stone-500 mb-4 font-medium">
            Showing <strong className="text-stone-800">{products.length}</strong> master-crafted marble creations
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
