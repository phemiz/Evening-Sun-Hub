
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Search, Heart, SlidersHorizontal, Clock, X, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, ProductOption } from '../types';

export const Eatery = () => {
  const { addToCart, cart, products, favorites, toggleFavorite } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Lounge Menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [customizations, setCustomizations] = useState<{ [key: string]: ProductOption }>({});
  const [qty, setQty] = useState(1);

  const categories = ['Lounge Menu', 'Drinks', 'Provisions', 'Saved Items'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === 'Saved Items' 
        ? favorites.includes(p.id) 
        : p.category === activeCategory;
        
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery, favorites]);

  const handleOpenDetail = (p: Product) => {
    setSelectedProduct(p);
    setQty(1);
    setCustomizations({});
  };

  const handleAddToCartWithCustom = () => {
    if (selectedProduct) {
      for (let i = 0; i < qty; i++) {
        addToCart({
          ...selectedProduct,
          selectedOptions: customizations
        } as any);
      }
      setSelectedProduct(null);
    }
  };

  return (
    <div className={`space-y-7 transition-all duration-300 animate-in fade-in ${cart.length > 0 ? 'pb-48' : 'pb-24'}`}>
      <div className="flex justify-between items-start px-1">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90 transition-all">
            <ArrowLeft size={24} className="dark:text-white" />
          </button>
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter leading-none uppercase italic">Kitchen & Canteen</h2>
            <p className="text-xs font-black text-sun-600 uppercase tracking-[0.2em]">Order Point Station</p>
          </div>
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${showFilters ? 'bg-sun-500 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'}`}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="sticky top-[70px] z-30 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl pb-4 space-y-4">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            type="text" 
            placeholder="Search our menu..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border-none rounded-[1.8rem] pl-14 pr-6 py-6 text-lg font-bold outline-none shadow-sm transition-all dark:text-white" 
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-7 py-3.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all uppercase tracking-[0.15em] border-2 shadow-sm ${activeCategory === cat ? 'bg-sun-500 border-sun-500 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-400'}`}>
              {cat === 'Saved Items' ? <span className="flex items-center gap-2"><Heart size={16} fill="currentColor"/> Saved</span> : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 px-1">
        {filteredProducts.map(product => (
          <div key={product.id} onClick={() => handleOpenDetail(product)} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 shadow-sm border border-slate-50 dark:border-slate-800 flex flex-col group cursor-pointer active:scale-95 transition-all">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-950 mb-4">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                 <Clock size={10} className="text-sun-600" />
                 <span className="text-[8px] font-black uppercase dark:text-white">{product.prepTimeMin}m</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                className={`absolute top-3 right-3 p-2 rounded-full ${favorites.includes(product.id) ? 'text-red-500 bg-white shadow-lg' : 'text-slate-300 bg-white/20'}`}
              >
                <Heart size={14} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-black dark:text-white uppercase truncate">{product.name}</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{product.category}</p>
            </div>
            <div className="flex justify-between items-center mt-3">
               <span className="text-base font-black text-sun-600">₦{product.price.toLocaleString()}</span>
               <div className="w-8 h-8 bg-slate-950 dark:bg-sun-500 rounded-xl flex items-center justify-center text-white"><Plus size={16}/></div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Overlay */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-end justify-center p-4 animate-in fade-in">
           <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 border border-white/5 relative">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 z-10"><X size={20}/></button>
              
              <div className="h-64 relative">
                 <img src={selectedProduct.image} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
              </div>

              <div className="px-8 pb-10 -mt-12 relative space-y-6">
                 <div className="space-y-2">
                    <div className="flex items-center gap-2">
                       <span className="bg-sun-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Top Station Item</span>
                       <div className="flex items-center gap-1 text-slate-400"><Clock size={12}/> <span className="text-[10px] font-bold">{selectedProduct.prepTimeMin} mins prep</span></div>
                    </div>
                    <h3 className="text-3xl font-black dark:text-white uppercase tracking-tighter">{selectedProduct.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">"{selectedProduct.description}"</p>
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-6 bg-slate-100 dark:bg-slate-800 p-2 rounded-2xl">
                       <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-slate-500"><Minus size={20}/></button>
                       <span className="text-xl font-black dark:text-white">{qty}</span>
                       <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-slate-500"><Plus size={20}/></button>
                    </div>
                    <button 
                      onClick={handleAddToCartWithCustom}
                      className="flex-1 ml-4 bg-sun-500 text-white py-5 rounded-[1.8rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                      Add to Cart • ₦{( (selectedProduct.price) * qty).toLocaleString()}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
