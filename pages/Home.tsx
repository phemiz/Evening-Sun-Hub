
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES, HUB_ADDRESS } from '../constants';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, MapPin, Zap, Camera, Loader2, Lock, 
  Utensils, GlassWater, ShoppingBag, Presentation, 
  Scissors, Footprints, Gamepad2, Anchor 
} from 'lucide-react';

export const Home = () => {
  const { user, getTierProgress, events, serviceStatuses, updateUser } = useApp();
  const navigate = useNavigate();
  const tier = getTierProgress();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [activeBanner, setActiveBanner] = useState(0);

  // Robust icon lookup map to prevent namespace resolution failures
  const iconMap: Record<string, React.ElementType> = {
    Utensils,
    GlassWater,
    ShoppingBag,
    Presentation,
    Scissors,
    Footprints,
    Gamepad2,
    Anchor,
    Zap
  };

  const getIcon = (name: string, size = 28) => {
    const IconComponent = iconMap[name] || Zap;
    return <IconComponent size={size} />;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (events.length > 0) {
        setActiveBanner(prev => (prev + 1) % events.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [events.length]);

  const handleServiceNav = (id: string) => {
    const status = serviceStatuses.find(s => s.id === id);
    if (status && !status.isActive) return;

    switch(id) {
        case 'EATERY': navigate('/eatery'); break;
        case 'SUPERMARKET': navigate('/supermarket'); break;
        case 'MARINE': navigate('/marine'); break;
        case 'CLUB': navigate('/club'); break;
        case 'MEETING_HALL': navigate('/meeting-hall'); break;
        case 'SALON': navigate('/salon'); break;
        case 'PEDICURE': navigate('/salon'); break;
        case 'GAME_LOUNGE': navigate('/game-lounge'); break;
        default: navigate(`/service/${id}`);
    }
  };

  const handleProfileClick = () => {
    if (user?.role !== 'ADMIN') {
      fileInputRef.current?.click();
    } else {
      navigate('/profile');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatarUrl: reader.result as string });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32">
      
      {/* Header with Personalized Greeting */}
      <section className="flex justify-between items-center px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none italic">
              {user?.role === 'ADMIN' ? 'Greetings, Admin' : `Greetings, ${user?.name}`}
            </h2>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-slate-400">
             <MapPin size={12} className="text-sun-500" />
             <span className="text-[10px] font-black uppercase tracking-widest">{HUB_ADDRESS.split(',')[0]} HUB STATION</span>
          </div>
        </div>
        
        <div className="relative group">
           <input 
             type="file" 
             ref={fileInputRef} 
             className="hidden" 
             accept="image/*" 
             onChange={handleFileChange} 
           />
           <button onClick={handleProfileClick} className="relative group overflow-hidden rounded-2xl w-14 h-14 border-2 border-white dark:border-slate-800 shadow-lg">
              <div className="absolute inset-0 bg-sun-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
              <img src={user?.avatarUrl} className="w-full h-full object-cover" alt="" />
              {user?.role !== 'ADMIN' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? <Loader2 className="text-white animate-spin" size={20} /> : <Camera className="text-white" size={20} />}
                </div>
              )}
           </button>
        </div>
      </section>

      {/* Quick Service Grid */}
      <section className="space-y-5 px-1">
        <div className="flex justify-between items-center">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <Zap size={14} className="text-sun-500" />
             Service Units
           </h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {SERVICE_CATEGORIES.map((service) => {
            const status = serviceStatuses.find(s => s.id === service.id);
            const isActive = status?.isActive ?? true;
            return (
              <button 
                key={service.id} 
                onClick={() => handleServiceNav(service.id)}
                className={`flex flex-col items-center gap-3 group transition-all ${!isActive ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
              >
                <div className="relative">
                  <div className={`relative w-16 h-16 rounded-[1.8rem] bg-white dark:bg-slate-900 border-2 shadow-sm flex items-center justify-center text-slate-400 ${isActive ? 'group-hover:text-sun-600 group-hover:border-sun-500 border-slate-50 dark:border-slate-800' : 'border-slate-200 dark:border-slate-700'}`}>
                     {getIcon(service.icon)}
                  </div>
                  {!isActive && <div className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-900"><Lock size={10}/></div>}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 text-center leading-tight">{service.title}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Dynamic Banners */}
      <section className="relative h-56 rounded-[3rem] overflow-hidden shadow-2xl group mx-1">
        {events.length > 0 ? events.map((event, idx) => (
          <div 
            key={event.id} 
            className={`absolute inset-0 transition-all duration-1000 transform ${idx === activeBanner ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
            <img src={event.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute bottom-8 left-8 right-8 z-20">
               <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{event.title}</h3>
               <button onClick={() => navigate('/club')} className="mt-2 text-[10px] font-black text-sun-500 uppercase tracking-widest flex items-center gap-1">Attend Event <ArrowRight size={12}/></button>
            </div>
          </div>
        )) : (
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-white font-black uppercase">No Events Scheduled</div>
        )}
      </section>

      {/* Loyalty Progress Station */}
      <section className="px-1">
         <div className="bg-gradient-to-r from-sun-600 to-amber-500 p-7 rounded-[3rem] shadow-xl relative overflow-hidden group">
            <div className="relative z-10 text-white space-y-4">
               <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Membership Grade</span>
                    <h4 className="text-2xl font-black uppercase tracking-tighter">{tier.current}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase opacity-80">REWARDS XP</span>
                    <p className="text-2xl font-black">{(user?.loyaltyPoints || 0).toLocaleString()}</p>
                  </div>
               </div>
               <div className="space-y-2">
                 <div className="h-2 w-full bg-black/10 rounded-full">
                    <div className="h-full bg-white rounded-full transition-all duration-1000 shadow-lg" style={{ width: `${tier.progress}%` }} />
                 </div>
                 <p className="text-[8px] font-black uppercase tracking-widest text-center">Service History Progress: {tier.progress}% completed</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
