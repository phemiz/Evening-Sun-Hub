
import React, { useState, useMemo } from 'react';
import { 
  Calendar, Users, Music, Star, ChevronRight, Clock, MapPin, 
  CheckCircle, ArrowLeft, GlassWater, Flame, Package, 
  Plus, Search, ShoppingCart, Info, LayoutGrid, List
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ServiceType, Product } from '../types';

type ClubTab = 'OVERVIEW' | 'DRINKS' | 'CALENDAR' | 'RESERVE';

export const Club = () => {
    const navigate = useNavigate();
    const { events, products, addToCart, cart } = useApp();
    
    const [activeTab, setActiveTab] = useState<ClubTab>('OVERVIEW');
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const [guests, setGuests] = useState("4");
    const [zone, setZone] = useState("VIP Lounge");
    const [searchQuery, setSearchQuery] = useState("");

    const drinks = useMemo(() => {
        return products.filter(p => p.category === 'Drinks' && 
            p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [products, searchQuery]);

    const handleReserveTable = () => {
        const reservationFee = 20000;
        const pendingBooking = {
            id: Math.random().toString(36).substr(2, 9),
            serviceId: 'club-table',
            serviceName: `VIP Table (${zone})`,
            category: ServiceType.CLUB,
            date: "Friday Night",
            time: "10:00 PM",
            status: 'PENDING' as const,
            depositPaid: false,
            price: reservationFee,
            location: 'VIP Section',
            staffName: 'Lounge Host'
        };
        navigate('/payment', { state: { pendingBooking, totalAmount: reservationFee } });
    };

    const renderOverview = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* VIP Header Card */}
            <div className="group relative bg-slate-950 rounded-[3rem] p-10 text-white overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253361-bee8a48790c3?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-[10s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 rounded-[1.5rem] bg-sun-500/20 backdrop-blur-xl flex items-center justify-center text-sun-400 border border-sun-500/30 shadow-2xl animate-pulse">
                        <Star size={40} fill="currentColor" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-4xl font-black tracking-tighter uppercase leading-none">Elite Nightlife</h3>
                        <p className="text-sm text-slate-300 font-bold uppercase tracking-widest max-w-[250px]">Badagry's Most Exclusive Lounge Experience</p>
                    </div>
                    <button 
                        onClick={() => setActiveTab('RESERVE')}
                        className="bg-sun-500 text-slate-950 px-10 py-5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all transform active:scale-95"
                    >
                        Secure VIP Table
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setActiveTab('DRINKS')} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center"><GlassWater size={24}/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Order Drinks</span>
                </button>
                <button onClick={() => setActiveTab('CALENDAR')} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center gap-3 active:scale-95 transition-all">
                    <div className="w-12 h-12 bg-sun-50 dark:bg-sun-900/20 text-sun-600 rounded-2xl flex items-center justify-center"><Calendar size={24}/></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Event Guide</span>
                </button>
            </div>

            {/* Featured Event Preview */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Up Next</h4>
                    <button onClick={() => setActiveTab('CALENDAR')} className="text-[10px] font-black text-sun-600 uppercase tracking-widest">View All</button>
                </div>
                {events[0] && (
                    <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden relative h-48 border border-white/5">
                        <img src={events[0].image} className="w-full h-full object-cover opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 to-transparent" />
                        <div className="absolute inset-y-0 left-8 flex flex-col justify-center space-y-2">
                            <span className="bg-sun-500 text-slate-950 px-2 py-0.5 rounded text-[8px] font-black uppercase w-fit tracking-widest">Hottest</span>
                            <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{events[0].title}</h4>
                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{events[0].date}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderDrinksMenu = () => (
        <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search premium drinks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 rounded-[2rem] border-none outline-none shadow-sm dark:text-white font-bold text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {drinks.map(drink => (
                    <div key={drink.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col group active:scale-95 transition-all">
                        <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-slate-950 mb-4">
                            <img src={drink.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                                <Package size={10} className="text-blue-600" />
                                <span className="text-[8px] font-black uppercase dark:text-white">{drink.stockLevel} units</span>
                            </div>
                        </div>
                        <div className="flex-1 space-y-1">
                            <h4 className="text-xs font-black dark:text-white uppercase truncate">{drink.name}</h4>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">₦{drink.price.toLocaleString()}</p>
                        </div>
                        <button 
                            onClick={() => addToCart(drink)}
                            disabled={!drink.stockLevel || drink.stockLevel <= 0}
                            className="w-full mt-3 bg-slate-950 dark:bg-sun-500 text-white dark:text-slate-950 py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest disabled:opacity-30"
                        >
                            {drink.stockLevel && drink.stockLevel > 0 ? <><Plus size={14}/> Add to Cart</> : 'Out of Stock'}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCalendar = () => (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            {events.map(event => (
                <div 
                    key={event.id} 
                    onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                    className={`group bg-white dark:bg-slate-800 border transition-all duration-300 rounded-[2.5rem] overflow-hidden ${
                        selectedEvent === event.id 
                        ? 'border-sun-500 shadow-xl' 
                        : 'border-slate-100 dark:border-slate-700 shadow-sm'
                    }`}
                >
                    <div className="p-6 flex items-center gap-5">
                        <div className="flex flex-col items-center justify-center w-16 h-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 text-center shadow-inner">
                            <span className="text-[8px] font-black text-slate-400 uppercase mb-1">{event.date.split(',')[0]}</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white leading-none">
                                {event.date.match(/\d+/) ? event.date.match(/\d+/)[0] : '...'}
                            </span>
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Music size={12} className="text-sun-600" />
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-sun-600">Event Night</span>
                            </div>
                            <h4 className="font-black text-slate-800 dark:text-white text-lg leading-tight uppercase truncate">{event.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-md bg-sun-100 text-sun-700 dark:bg-sun-900/30 dark:text-sun-400 uppercase">
                                    {event.price}
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedEvent === event.id && (
                        <div className="px-6 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-300 border-t border-slate-50 dark:border-slate-700/50 pt-6">
                            <div className="h-40 rounded-3xl overflow-hidden shadow-inner mb-4">
                                <img src={event.image} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                {event.description || "Experience the best afrobeat sets and premium bottle service at Badagry's favorite lounge."}
                            </p>
                            
                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <Users size={14} className="text-sun-500" /> {event.attendeeCount} Going
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                    <Clock size={14} className="text-sun-500" /> Starts 9PM
                                </div>
                            </div>

                            <button 
                                onClick={() => setActiveTab('RESERVE')}
                                className="w-full bg-slate-950 dark:bg-white dark:text-slate-950 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                            >
                                Book Reservation
                            </button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    const renderReserve = () => (
        <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-gradient-to-br from-indigo-900 to-slate-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-sun-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20" />
                <div className="relative z-10 space-y-4">
                    <div className="flex items-center gap-3">
                        <Flame className="text-sun-400" size={24} />
                        <span className="text-xs font-black uppercase tracking-widest text-sun-400">VIP Selection</span>
                    </div>
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Elite Table Booking</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-bold uppercase tracking-tight">Dedicated hosting & premium section access.</p>
                </div>
            </div>

            <div className="space-y-8">
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Party Magnitude</label>
                    <div className="grid grid-cols-4 gap-3">
                        {["2", "4", "6", "10+"].map(num => (
                            <button 
                                key={num}
                                onClick={() => setGuests(num)}
                                className={`py-5 rounded-2xl font-black border-2 transition-all ${guests === num ? 'border-sun-500 bg-sun-500/10 text-sun-600 shadow-lg' : 'border-slate-100 dark:border-slate-800 dark:text-slate-500'}`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Deployment Zone</label>
                    <div className="space-y-3">
                        {["Elite VIP (Best View)", "Main Floor High-Tables", "Terrace Chill Zone"].map(z => (
                            <button 
                                key={z}
                                onClick={() => setZone(z)}
                                className={`w-full p-6 rounded-[2rem] flex items-center justify-between border-2 transition-all group ${zone === z ? 'border-sun-500 bg-sun-500/10 text-sun-600' : 'border-slate-100 dark:border-slate-800 dark:text-slate-500'}`}
                            >
                                <span className="font-black uppercase tracking-tight text-sm">{z}</span>
                                {zone === z && <div className="bg-sun-500 text-white p-1 rounded-full"><CheckCircle size={16} /></div>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-4 space-y-6">
                    <div className="bg-slate-950 p-8 rounded-[3rem] space-y-4 text-white shadow-2xl relative overflow-hidden border border-white/5">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500 rounded-full blur-[80px] opacity-10" />
                        <div className="flex justify-between items-center">
                            <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Reservation Deposit</span>
                            <span className="text-3xl font-black text-sun-500 tracking-tighter">₦20,000</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            <Info size={12} className="text-sun-500" /> Credited to your bill on arrival
                        </div>
                    </div>

                    <button 
                        onClick={handleReserveTable}
                        className="w-full bg-sun-600 hover:bg-sun-500 text-white py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all"
                    >
                        Authorize & Sync
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`space-y-8 transition-all duration-300 animate-in fade-in ${cart.length > 0 ? 'pb-48' : 'pb-24'}`}>
            <div className="flex flex-col gap-2">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">Club Hub</h2>
                <p className="text-xs font-black text-sun-600 uppercase tracking-[0.2em]">Premium Nightlife & Lounge</p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[2.2rem] shadow-inner sticky top-[70px] z-40 backdrop-blur-xl border border-slate-200 dark:border-slate-800">
                {(['OVERVIEW', 'DRINKS', 'CALENDAR', 'RESERVE'] as ClubTab[]).map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-4 rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-sun-600 shadow-xl scale-[1.02]' : 'text-slate-400'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content Rendering */}
            <div className="min-h-[50vh]">
                {activeTab === 'OVERVIEW' && renderOverview()}
                {activeTab === 'DRINKS' && renderDrinksMenu()}
                {activeTab === 'CALENDAR' && renderCalendar()}
                {activeTab === 'RESERVE' && renderReserve()}
            </div>

            {/* Persistent Cart Link */}
            {cart.length > 0 && (
                <div className="fixed bottom-24 left-6 right-6 z-[60] animate-in slide-in-from-bottom-10">
                    <button 
                        onClick={() => navigate('/cart')}
                        className="w-full bg-slate-950 dark:bg-sun-500 text-white dark:text-slate-950 p-6 rounded-[2rem] flex items-center justify-between shadow-2xl group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <ShoppingCart size={20}/>
                            </div>
                            <div className="text-left">
                                <span className="block text-[10px] font-black uppercase opacity-60">Tray Subtotal</span>
                                <span className="font-black text-lg">₦{cart.reduce((s,i)=>s+(i.price*i.quantity),0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-black text-xs uppercase tracking-widest">Review Tray</span>
                            <ChevronRight size={18} />
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
};
