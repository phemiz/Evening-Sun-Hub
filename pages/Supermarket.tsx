
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, ShoppingBag, Heart, Plus, Minus, X, Info, 
  ArrowRight, SlidersHorizontal, Package, Tag, Clock, 
  ChevronRight, Sparkles, Filter, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

export const Supermarket = () => {
  const { products, addToCart, cart, favorites, toggleFavorite } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  const supermarketProducts = useMemo(() => {
    return products.filter(p => 
      ['Groceries', 'Provisions', 'Personal Care', 'Drinks'].includes(p.category)
    );
  }, [products]);

  const categories = ['All', ...new Set(supermarketProducts.map(p => p.category))];

  const filteredProducts = useMemo(() => {
    return supermarketProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [supermarketProducts, searchQuery, activeCategory]);

  const handleOpenDetail = (p: Product) => {
    setSelectedProduct(p);
    setQty(1);
  };

  const handleAdd = () => {
    if (selectedProduct) {
      for (let i = 0; i < qty; i++) {
        addToCart(selectedProduct);
      }
      setSelectedProduct(null);
    }
  };

  const calculateTotalPrice = (p: Product, q: number) => {
    if (p.bulkPrice && q >= p.bulkPrice.minQty) {
      return p.bulkPrice.price * q;
    }
    return p.price * q;
  };

  return (
    <div className={`space-y-7 pb-32 animate-in fade-in duration-500`}>
      <header className="flex flex-col gap-4 px-1">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Sun Mart</h2>
            <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.3em]">Fresh provisions station</p>
          </div>
          <button 
            onClick={() => navigate('/cart')} 
            className="relative w-14 h-14 bg-slate-950 dark:bg-sun-500 rounded-2xl flex items-center justify-center text-white shadow-xl active:scale-90 transition-all"
          >
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ring-4 ring-slate-50 dark:ring-slate-950 animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search groceries, soaps, milk..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-12 py-5 bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-100 dark:border-slate-800 outline-none font-bold text-sm shadow-sm focus:border-sun-500 transition-all"
          />
          <SlidersHorizontal className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        </div>
      </header>

      {/* Categories Bar */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
              activeCategory === cat 
              ? 'bg-sun-500 border-sun-500 text-white shadow-lg' 
              : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Feed */}
      <div className="grid grid-cols-2 gap-4 px-1">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            onClick={() => handleOpenDetail(product)}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 shadow-sm border border-slate-50 dark:border-slate-800 group active:scale-95 transition-all relative overflow-hidden"
          >
            {product.originalPrice && (
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase shadow-lg animate-pulse">
                Save {Math.round((1 - product.price/product.originalPrice) * 100)}%
              </div>
            )}
            
            <div className="relative aspect-square rounded-[1.8rem] overflow-hidden bg-slate-50 dark:bg-slate-950 mb-4">
              <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                className={`absolute bottom-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition-all ${
                  favorites.includes(product.id) ? 'bg-red-500 text-white shadow-lg' : 'bg-white/20 text-white'
                }`}
              >
                <Heart size={14} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-black dark:text-white uppercase truncate">{product.name}</h4>
              <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{product.category}</p>
              
              <div className="flex items-center gap-2 mt-3">
                <span className="text-base font-black text-sun-600">₦{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                  <span className="text-[10px] text-slate-300 line-through font-bold italic">₦{product.originalPrice.toLocaleString()}</span>
                )}
              </div>
              
              {product.bulkPrice && (
                <div className="mt-1 flex items-center gap-1 text-green-500">
                  <Tag size={10} />
                  <span className="text-[8px] font-black uppercase tracking-tighter">Bulk: ₦{product.bulkPrice.price.toLocaleString()} for {product.bulkPrice.minQty}+</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 w-full bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl flex items-center justify-center gap-2 group-hover:bg-sun-500 transition-colors">
               <Plus size={14} className="text-slate-400 group-hover:text-white" />
               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Add to Tray</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-end justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 border border-white/5 relative max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button 
              onClick={() => setSelectedProduct(null)} 
              className="absolute top-6 right-6 p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 z-10 shadow-sm"
            >
              <X size={20} />
            </button>
            
            <div className="h-72 relative bg-slate-50 dark:bg-slate-950">
              <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
              <div className="absolute bottom-6 left-8 flex items-center gap-3">
                 <div className="bg-sun-500 text-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                    <CheckCircle2 size={12}/> In Stock
                 </div>
                 <div className="bg-slate-900/40 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {selectedProduct.stockLevel} Remaining
                 </div>
              </div>
            </div>

            <div className="px-8 pb-10 space-y-7 relative -mt-4">
              <div className="space-y-2">
                <h3 className="text-3xl font-black dark:text-white uppercase tracking-tighter leading-none">{selectedProduct.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">"{selectedProduct.description}"</p>
              </div>

              {selectedProduct.bulkPrice && (
                <div className="bg-green-50 dark:bg-green-900/10 p-5 rounded-2xl border-2 border-green-500/20 flex items-center gap-5 shadow-inner">
                   <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white"><Tag size={24}/></div>
                   <div>
                      <h5 className="text-xs font-black uppercase text-green-600 dark:text-green-400 tracking-widest">Sun Bulk Reward Node</h5>
                      <p className="text-[10px] font-bold text-green-500 mt-1 uppercase">Buy {selectedProduct.bulkPrice.minQty} or more to unlock ₦{selectedProduct.bulkPrice.price.toLocaleString()} pricing.</p>
                   </div>
                </div>
              )}

              <div className="space-y-4">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Magnitude Selection</span>
                    <span className="text-2xl font-black text-sun-600">₦{calculateTotalPrice(selectedProduct, qty).toLocaleString()}</span>
                 </div>
                 <div className="flex items-center gap-6 bg-slate-100 dark:bg-slate-800 p-3 rounded-[2rem] shadow-inner">
                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl shadow-sm flex items-center justify-center text-slate-500 active:scale-90 transition-all"><Minus size={24}/></button>
                    <span className="flex-1 text-center text-2xl font-black dark:text-white">{qty}</span>
                    <button onClick={() => setQty(qty + 1)} className="w-14 h-14 bg-white dark:bg-slate-700 rounded-2xl shadow-sm flex items-center justify-center text-slate-500 active:scale-90 transition-all"><Plus size={24}/></button>
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                 <button 
                  onClick={() => toggleFavorite(selectedProduct.id)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    favorites.includes(selectedProduct.id) ? 'bg-red-500 text-white shadow-xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                 >
                    <Heart size={24} fill={favorites.includes(selectedProduct.id) ? 'currentColor' : 'none'} />
                 </button>
                 <button 
                  onClick={handleAdd}
                  className="flex-1 bg-sun-500 text-slate-950 py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all border-b-4 border-sun-700"
                 >
                    Sync to Tray
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
