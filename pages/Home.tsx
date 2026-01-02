
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SERVICE_CATEGORIES, APP_NAME, HUB_ADDRESS } from '../constants';
import { Link, useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import {
  ArrowRight, Star, Calendar, MapPin, Clock, GlassWater, CloudSun,
  Zap, ShieldCheck, Waves, TrendingUp, Heart, Info, AlertCircle,
  HelpCircle, X, Activity, Ship, ShoppingBag, Plus, Wallet,
  History, Headphones, Search, Bell, Sparkles, Navigation, ChevronLeft, ChevronRight
} from 'lucide-react';

export const Home = () => {
  const { user, weather, getTierProgress, sailingTempLimit, vessels, bookings, balance, tickerConfig, events } = useApp();
  const navigate = useNavigate();
  const tier = getTierProgress();

  const [helpNode, setHelpNode] = useState<{ title: string, desc: string } | null>(null);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const HELP_DATABASE = {
    WEATHER: {
      title: "Safety & Operations Monitor",
      desc: "This is a security and safety check. It monitors the external temperature to ensure optimal service. If the temperature exceeds " + sailingTempLimit + "°C, vessel operations are suspended to prevent engine overheating and ensure passenger safety."
    },
    REWARDS: {
      title: "Loyalty Appreciation Points",
      desc: "This is our way of rewarding your patronage. For every ₦1,000 spent, you earn loyalty points that can be redeemed for meals or vessel services at any of our hubs."
    },
    HUBS: {
      title: "Service Hubs",
      desc: "The Evening Sun Hub provides access to premium business services including the Restaurant, Beauty Salon, Private Club, Event Center, and Boat Jetty."
    },
    PULSE: {
      title: "Operational Status",
      desc: "This dashboard displays real-time activity across the hub, tracking vessel availability and service capacity."
    }
  };

  const isSailable = weather.temp < sailingTempLimit;
  const activeBoats = vessels.filter(v => v.status === 'IN_USE').length;
  const nextBooking = bookings.find(b => b.status === 'PENDING' || b.status === 'CONFIRMED');

  const getIcon = (name: string, size = 32) => {
    const Icon = (Icons as any)[name];
    return Icon ? <Icon size={size} className="text-sun-600" /> : null;
  };

  useEffect(() => {
    if (events.length > 0) {
      const timer = setInterval(() => {
        setActiveEventIndex(prev => (prev + 1) % events.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [events]);

  // Speed mapping
  const speedDuration = {
    SLOW: '45s',
    STEADY: '30s',
    QUICK: '20s',
    URGENT: '10s'
  }[tickerConfig.speed];

  // Size mapping
  const sizeClasses = {
    SMALL: 'text-[11px]',
    MEDIUM: 'text-[14px]',
    LARGE: 'text-[18px]',
    XL: 'text-[24px]'
  }[tickerConfig.size];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-32">
      {/* Header & Weather Section */}
      <section id="safety-node" className="flex justify-between items-start px-1 pt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">
              HI, {user?.name.split(' ')[0].toUpperCase()}
            </h2>
            <Sparkles size={20} className="text-sun-500 animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black bg-slate-900 dark:bg-sun-500 text-white dark:text-slate-950 px-4 py-1.5 rounded-full uppercase tracking-[0.25em] w-fit shadow-lg border border-white/10">
              {tier.current} Level
            </span>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={13} className="text-sun-500" /> {HUB_ADDRESS.split(',')[0]} STATION
            </p>
          </div>
        </div>
        <div
          onClick={() => setHelpNode(HELP_DATABASE.WEATHER)}
          className={`p-5 rounded-[2.2rem] shadow-2xl border-2 flex items-center gap-4 cursor-help transition-all active:scale-95 ${isSailable ? 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/30'}`}
        >
          <div className="flex flex-col items-end">
            <span className={`text-2xl font-black leading-none ${!isSailable ? 'text-red-600' : 'dark:text-white'}`}>{weather.temp}°C</span>
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1.5 ${isSailable ? 'Operational' : 'Secured'}`}>
              {isSailable ? 'Operational' : 'Secured'}
            </span>
          </div>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${isSailable ? 'bg-sun-50 dark:bg-sun-900/30 text-sun-600' : 'bg-red-600 text-white shadow-lg animate-bounce'}`}>
            {isSailable ? <CloudSun size={28} /> : <AlertCircle size={28} />}
          </div>
        </div>
      </section>

      {/* Featured Event Hero - Sleek Auto-Sliding Carousel */}
      <section className="relative h-64 rounded-[3.5rem] overflow-hidden shadow-2xl group mx-1">
        {events.length > 0 ? (
          <>
            {events.map((event, idx) => (
              <div
                key={event.id}
                className={`absolute inset-0 transition-all duration-1000 ease-out transform ${idx === activeEventIndex
                  ? 'opacity-100 scale-100 translate-x-0'
                  : 'opacity-0 scale-110 translate-x-full'
                  }`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />
                <img
                  src={event.image || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80"}
                  alt=""
                  className={`w-full h-full object-cover transition-transform duration-[6000ms] ${idx === activeEventIndex ? 'scale-110' : 'scale-100'}`}
                />
                <div className="absolute bottom-10 left-10 right-10 z-20 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sun-500 animate-ping" />
                    <span className="text-[10px] font-black text-sun-500 uppercase tracking-[0.4em]">Featured Highlights</span>
                  </div>
                  <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-lg">{event.title}</h3>
                  <div className="flex justify-between items-center pt-2">
                    <p className="text-xs font-black text-slate-200 uppercase tracking-widest drop-shadow-md">{event.date} • {event.price}</p>
                    <button
                      onClick={() => navigate(event.title.toLowerCase().includes('salon') ? '/service/SALON_FEMALE' : event.title.toLowerCase().includes('menu') ? '/eatery' : '/club')}
                      className="bg-white/10 backdrop-blur-md text-white p-4 rounded-2xl border border-white/20 hover:bg-sun-500 hover:text-white transition-all active:scale-90"
                    >
                      <ArrowRight size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {events.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveEventIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === activeEventIndex ? 'w-8 bg-sun-500' : 'w-2 bg-white/40'}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-slate-800 flex items-center justify-center">
            <span className="text-slate-500 font-black uppercase tracking-widest">No Events Scheduled</span>
          </div>
        )}
      </section>

      {/* Quick Access Tactical Buttons */}
      <section className="grid grid-cols-4 gap-4 px-1">
        {[
          { label: 'Add Funds', icon: Wallet, path: '/wallet', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/10' },
          { label: 'Recent Orders', icon: History, path: '/bookings', color: 'text-sun-600', bg: 'bg-sun-50 dark:bg-sun-900/10' },
          { label: 'Support', icon: Headphones, path: '/support', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/10' },
          { label: 'Search Hub', icon: Search, path: '/', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/10', action: () => document.dispatchEvent(new CustomEvent('open-search')) }
        ].map(item => (
          <button key={item.label} onClick={() => item.action ? item.action() : navigate(item.path)} className="flex flex-col items-center gap-3 group">
            <div className={`w-16 h-16 rounded-[1.8rem] ${item.bg} ${item.color} flex items-center justify-center shadow-sm group-hover:shadow-lg group-hover:scale-110 transition-all border border-transparent group-hover:border-current/20`}>
              <item.icon size={26} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white text-center">{item.label}</span>
          </button>
        ))}
      </section>

      {/* Intelligence Ticker */}
      <section className="bg-slate-950 py-5 -mx-4 overflow-hidden border-y-2 border-white/10 shadow-lg">
        <div
          className="flex whitespace-nowrap gap-16 items-center"
          style={{
            animation: `marquee ${speedDuration} linear infinite`,
          }}
        >
          {tickerConfig.messages.map((text, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="w-2.5 h-2.5 rounded-full bg-sun-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <span
                className={`${sizeClasses} font-black uppercase tracking-[0.25em] italic drop-shadow-md`}
                style={{ color: tickerConfig.color }}
              >
                {text}
              </span>
            </div>
          ))}
          {/* Duplicate for seamless looping */}
          {tickerConfig.messages.map((text, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-6">
              <div className="w-2.5 h-2.5 rounded-full bg-sun-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
              <span
                className={`${sizeClasses} font-black uppercase tracking-[0.25em] italic drop-shadow-md`}
                style={{ color: tickerConfig.color }}
              >
                {text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Core Service Hub Grid */}
      <section className="space-y-6 px-1">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
            <Activity size={16} className="text-sun-500" />
            Service Stations
          </h3>
          <button onClick={() => setHelpNode(HELP_DATABASE.HUBS)} className="p-2 bg-white dark:bg-slate-900 rounded-xl text-slate-300 hover:text-sun-500 transition-all"><HelpCircle size={18} /></button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {SERVICE_CATEGORIES.map((service) => (
            <Link key={service.id} to={service.id === 'EATERY' ? '/eatery' : service.id === 'CLUB' ? '/club' : service.id === 'MARINE' ? '/marine' : `/service/${service.id}`} className="group relative h-48 overflow-hidden rounded-[3rem] shadow-xl border-2 border-transparent hover:border-sun-500/20 transition-all duration-500">
              <div className="absolute inset-0">
                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />
              </div>
              <div className="absolute inset-y-0 left-0 p-8 flex flex-col justify-center max-w-[80%] space-y-4">
                <div className="bg-sun-500 w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-white/20 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                  {getIcon(service.icon, 36)}
                </div>
                <div>
                  <h3 className="text-white font-black text-3xl tracking-tighter leading-none uppercase">{service.title}</h3>
                  <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mt-2 line-clamp-1">{service.description}</p>
                </div>
              </div>
              <div className="absolute right-8 bottom-8 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl">
                <ArrowRight size={28} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* EDUCATION OVERLAY */}
      {helpNode && (
        <div className="fixed inset-0 z-[600] flex items-end justify-center bg-black/90 backdrop-blur-2xl p-5 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[4rem] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 border border-white/5 relative">
            <button onClick={() => setHelpNode(null)} className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform shadow-sm"><X size={28} /></button>
            <div className="space-y-8 pt-5 text-center">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                <HelpCircle size={48} />
              </div>
              <div className="space-y-4">
                <h4 className="text-4xl font-black dark:text-white uppercase tracking-tighter leading-none">{helpNode.title}</h4>
                <p className="text-xl font-bold text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-tight italic">
                  "{helpNode.desc}"
                </p>
              </div>
              <button onClick={() => setHelpNode(null)} className="w-full bg-sun-500 text-white py-7 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">Understood</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
};
