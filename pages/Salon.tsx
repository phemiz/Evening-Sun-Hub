
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, Scissors, Footprints, Sparkles, ChevronRight, 
  Search, Star, Clock, Filter, ShoppingBag, Zap, Heart
} from 'lucide-react';
import { ServiceType, ServiceItem } from '../types';

export const Salon = () => {
  const navigate = useNavigate();
  const { services, favorites, toggleFavorite } = useApp();
  
  const [activeCategory, setActiveCategory] = useState<ServiceType>(ServiceType.SALON);
  const [searchQuery, setSearchQuery] = useState("");

  const currentServices = useMemo(() => {
    const list = services[activeCategory] || [];
    return list.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [services, activeCategory, searchQuery]);

  const bundles = useMemo(() => {
    return (services[ServiceType.PEDICURE] || []).filter(s => s.name.toLowerCase().includes('bundle'));
  }, [services]);

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      <header className="flex flex-col gap-6 px-1">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
            <ArrowLeft size={24} className="dark:text-white" />
          </button>
          <div>
            <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase leading-none">The Glow Station</h2>
            <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.3em] mt-2">Premium Grooming & Beauty</p>
          </div>
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search styles, cuts or nails..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 rounded-[1.8rem] border-2 border-slate-50 dark:border-slate-800 focus:border-sun-500 outline-none shadow-sm dark:text-white font-bold text-sm transition-all"
          />
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
           {[
             { id: ServiceType.SALON, label: "Hair & Styling", icon: Scissors },
             { id: ServiceType.PEDICURE, label: "Manicure & Pedicure", icon: Footprints }
           ].map(cat => (
             <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-4 rounded-[1.5rem] flex items-center gap-3 whitespace-nowrap transition-all border-2 ${activeCategory === cat.id ? 'bg-sun-500 border-sun-500 text-white shadow-xl' : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 text-slate-400'}`}
             >
                <cat.icon size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
             </button>
           ))}
        </div>
      </header>

      {/* Featured Bundle Upsell */}
      {bundles.length > 0 && activeCategory === ServiceType.PEDICURE && (
        <section className="px-1 animate-in slide-in-from-right duration-700">
           <div className="bg-slate-950 rounded-[2.5rem] p-7 text-white relative overflow-hidden group shadow-2xl border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500 rounded-full blur-[80px] opacity-10" />
              <div className="relative z-10 flex justify-between items-start">
                 <div className="space-y-3">
                    <div className="flex items-center gap-2">
                       <Zap size={14} className="text-sun-500" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-sun-500">Value Bundle Detected</span>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter">{bundles[0].name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complete treatment protocol • Save ₦1,000</p>
                    <button 
                        onClick={() => navigate(`/service/${activeCategory}`, { state: { rebookData: { serviceId: bundles[0].id } } })}
                        className="bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"
                    >
                        Secure Bundle <ChevronRight size={14}/>
                    </button>
                 </div>
                 <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner group-hover:rotate-12 transition-transform duration-500"><Sparkles size={36} className="text-sun-400"/></div>
              </div>
           </div>
        </section>
      )}

      {/* Service Grid */}
      <section className="space-y-4 px-1">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
           <Zap size={14} className="text-sun-500" />
           Service Manifest
         </h3>
         <div className="grid gap-4">
            {currentServices.map(service => (
              <div 
                key={service.id} 
                onClick={() => navigate(`/service/${activeCategory}`, { state: { rebookData: { serviceId: service.id } } })}
                className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all"
              >
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-sun-500 transition-colors shadow-inner">
                       <Scissors size={26} />
                    </div>
                    <div className="space-y-1">
                       <h4 className="text-lg font-black dark:text-white uppercase leading-none">{service.name}</h4>
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-sun-600 uppercase tracking-widest">₦{service.price.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><Clock size={10}/> {service.durationMin}m</span>
                       </div>
                    </div>
                 </div>
                 <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(service.id); }}
                  className={`p-3 rounded-xl transition-all ${favorites.includes(service.id) ? 'text-red-500' : 'text-slate-200'}`}
                 >
                    <Heart size={20} fill={favorites.includes(service.id) ? 'currentColor' : 'none'} />
                 </button>
              </div>
            ))}
         </div>
      </section>

      {/* Social Proof */}
      <section className="px-1 pt-4">
         <div className="bg-sun-50 dark:bg-sun-900/10 p-8 rounded-[3.5rem] border-2 border-sun-100 dark:border-sun-800/30 flex items-center gap-6">
            <div className="flex -space-x-4">
               {[1,2,3].map(i => (
                 <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 overflow-hidden">
                    <img src={`https://picsum.photos/seed/face${i}/100`} alt="" className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
            <div>
               <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Joined by 1.2k members</p>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">High-end grooming standards enforced</p>
            </div>
         </div>
      </section>
    </div>
  );
};
