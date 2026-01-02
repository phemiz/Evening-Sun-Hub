
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Search, Utensils, GlassWater, Heart, ArrowRight, ShoppingCart, SlidersHorizontal, ArrowUpDown, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Eatery = () => {
  const { addToCart, cart, removeFromCart, products, favorites, toggleFavorite } = useApp();
  const [activeCategory, setActiveCategory] = useState('Lounge Menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'name'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const categories = ['Lounge Menu', 'Drinks', 'Provisions', 'Favorites'];

  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchesCategory = activeCategory === 'Favorites'
        ? favorites.includes(p.id)
        : p.category === activeCategory;

      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAvailability = !onlyAvailable || p.isAvailable;

      return matchesCategory && matchesSearch && matchesAvailability;
    });

    result.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      }
      return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    });

    return result;
  }, [products, activeCategory, searchQuery, favorites, onlyAvailable, sortBy, sortOrder]);

  const getItemQuantity = (id: string) => cart.find(i => i.id === id)?.quantity || 0;

  return (
    <div className={`space-y-7 transition-all duration-300 animate-in fade-in ${cart.length > 0 ? 'pb-48' : 'pb-24'}`}>
      <div className="flex justify-between items-start px-1">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter leading-none uppercase">Food & Drinks</h2>
          <p className="text-xs font-black text-sun-600 uppercase tracking-[0.2em]">BADAGRY HUB</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${showFilters ? 'bg-sun-500 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'}`}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-[70px] z-30 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl pb-4 space-y-4">
        {showFilters && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl space-y-6 animate-in slide-in-from-top-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sort By</label>
                <div className="flex gap-1">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs font-black dark:text-white outline-none appearance-none border border-slate-100 dark:border-slate-700"
                  >
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sun-500 shadow-inner"
                  >
                    <ArrowUpDown size={16} />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Inventory</label>
                <button
                  onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-black transition-all border ${onlyAvailable ? 'bg-green-50 text-green-600 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700'}`}
                >
                  <span>Only Available</span>
                  {onlyAvailable && <CheckCircle size={14} />}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border-none rounded-[1.8rem] pl-14 pr-6 py-6 text-lg font-bold outline-none shadow-sm transition-all dark:text-white"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-7 py-3.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-[0.15em] border-2 shadow-sm ${activeCategory === cat ? 'bg-sun-500 border-sun-500 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-400'}`}>
              {cat === 'Favorites' ? <span className="flex items-center gap-2"><Heart size={16} fill="currentColor" /> Favorites</span> : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="grid gap-5">
        {filteredProducts.map(product => {
          const qty = getItemQuantity(product.id);
          const isFav = favorites.includes(product.id);
          const available = product.isAvailable !== false;
          return (
            <div key={product.id} className={`bg-white dark:bg-slate-900 rounded-[2.2rem] p-5 shadow-sm flex gap-5 border border-slate-100 dark:border-slate-800 hover:border-sun-500/20 transition-all relative ${!available ? 'opacity-60' : ''}`}>
              <button onClick={() => toggleFavorite(product.id)} className={`absolute top-4 right-4 p-2 rounded-full z-10 ${isFav ? 'text-red-500' : 'text-slate-200 dark:text-slate-800'}`}>
                <Heart size={24} fill={isFav ? 'currentColor' : 'none'} />
              </button>
              <div className="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-50 dark:bg-slate-950 flex items-center justify-center shadow-inner">
                <img src={product.image} alt="" className="w-full h-full object-contain p-2" />
                {!available && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Out of Stock</span>
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white text-lg uppercase leading-tight tracking-tight">{product.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{product.category} Category</p>
                </div>
                <div className="flex justify-between items-end mt-3">
                  <span className="font-black text-sun-600 text-2xl tracking-tighter">₦{product.price.toLocaleString()}</span>
                  {available && (
                    qty === 0 ? (
                      <button onClick={() => addToCart(product)} className="bg-slate-950 dark:bg-sun-500 text-white px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest active:scale-90 transition-all">
                        Add to Cart
                      </button>
                    ) : (
                      <div className="flex items-center gap-5 bg-slate-100 dark:bg-slate-950 rounded-xl px-3 py-2.5 border border-slate-200 dark:border-slate-800">
                        <button onClick={() => removeFromCart(product.id)} className="text-slate-500 hover:text-red-500"><Minus size={16} /></button>
                        <span className="text-base font-black w-6 text-center dark:text-white">{qty}</span>
                        <button onClick={() => addToCart(product)} className="text-slate-500 hover:text-green-500"><Plus size={16} /></button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
