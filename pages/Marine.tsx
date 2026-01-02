
import React, { useState, useMemo, useRef } from 'react';
import { MARINE_DESTINATIONS } from '../constants';
import { useApp } from '../context/AppContext';
import {
    Anchor, Calendar, Users, Shield, ArrowRight, Clock, Star,
    MapPin, Filter, Search, X, CheckCircle2, AlertTriangle,
    Waves, Ship, Zap, Info, Map as MapIcon, Radio, HelpCircle,
    MessageSquareMore, AlertCircle, Ship as ShipIcon, ArrowUpDown,
    ChevronDown, SlidersHorizontal, Tag, MessageCircle, Send,
    ThumbsUp, UserCircle, Loader2, Award, ClipboardCheck,
    Quote, BadgeCheck, Compass
} from 'lucide-react';
import { Vessel, ServiceType, Booking, Review } from '../types';
import { useNavigate } from 'react-router-dom';

export const Marine = () => {
    const navigate = useNavigate();
    const { user, vessels, addOfflineBooking, addVesselReview, weather, isOnline, sailingTempLimit, bookings } = useApp();
    const [view, setView] = useState<'BOOKING' | 'MAP'>('BOOKING');

    const [helpNode, setHelpNode] = useState<{ title: string, desc: string } | null>(null);
    const [detailedVessel, setDetailedVessel] = useState<Vessel | null>(null);
    const [isReviewMode, setIsReviewMode] = useState(false);

    const HELP_DATABASE = {
        FILTERS: { title: "Vessel Filters", desc: "Filter vessels by category or availability status. See which boats are ready for immediate booking." },
        REGISTRY: { title: "Vessel Records", desc: "Our official list of boats. View passenger capacity, hourly rates, and current status." },
        SAFETY: { title: "Safety System", desc: "Automated safety protocol. Trips are restricted when external temperature exceeds " + sailingTempLimit + "°C to protect engine performance and passenger safety." },
    };

    const [typeFilter, setTypeFilter] = useState<'ALL' | 'SPEEDBOAT' | 'YACHT' | 'JETSKI'>('ALL');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'MAINTENANCE' | 'IN_USE'>('ALL');
    const [sortBy, setSortBy] = useState<'name' | 'price' | 'capacity'>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
    const [destination, setDestination] = useState(MARINE_DESTINATIONS[0]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("10:00");

    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const isSailable = weather.temp < sailingTempLimit;

    const filteredVessels = useMemo(() => {
        let result = vessels.filter(v => {
            const matchesType = typeFilter === 'ALL' || v.type === typeFilter;
            const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
            const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesType && matchesStatus && matchesSearch;
        });

        result.sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
            else if (sortBy === 'price') comparison = a.hourlyRate - b.hourlyRate;
            else if (sortBy === 'capacity') comparison = a.capacity - b.capacity;

            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [vessels, typeFilter, statusFilter, searchQuery, sortBy, sortOrder]);

    const handleConfirmBooking = () => {
        if (!selectedVessel || !date || !time) {
            alert("Please fill in all booking details.");
            return;
        }
        if (!isSailable) {
            alert("Safety Lock: Environmental conditions restricted.");
            return;
        }

        const bookingPayload: Booking = {
            id: Math.random().toString(36).substr(2, 9),
            serviceId: selectedVessel.id,
            serviceName: `${selectedVessel.name} Trip`,
            category: ServiceType.MARINE,
            date: date,
            time: time,
            status: 'PENDING' as const,
            depositPaid: false,
            price: selectedVessel.hourlyRate,
            location: `Jetty Point -> ${destination}`,
            staffName: 'Captain Musa'
        };

        if (!isOnline) {
            addOfflineBooking(bookingPayload);
            setSelectedVessel(null);
            alert("Station Offline: Booking saved to local cache.");
            return;
        }

        navigate('/payment', { state: { pendingBooking: bookingPayload, totalAmount: selectedVessel.hourlyRate } });
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!detailedVessel || !reviewComment.trim()) return;
        setIsSubmittingReview(true);
        const newReview: Review = {
            id: Math.random().toString(36).substr(2, 9),
            userName: user?.name || "Anonymous Member",
            rating: reviewRating,
            comment: reviewComment,
            date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
            entityId: detailedVessel.id
        };
        setTimeout(() => {
            addVesselReview(detailedVessel.id, newReview);
            setIsSubmittingReview(false);
            setReviewComment("");
            setReviewRating(5);
            setIsReviewMode(false);
            setDetailedVessel(prev => prev ? { ...prev, reviews: [newReview, ...(prev.reviews || [])] } : null);
        }, 1000);
    };

    const getAvgRating = (v: Vessel) => {
        if (!v.reviews || v.reviews.length === 0) return "5.0";
        const sum = v.reviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / v.reviews.length).toFixed(1);
    };

    return (
        <div className="space-y-7 pb-32 animate-in fade-in duration-500">
            {/* Safety Indicator */}
            <div
                onClick={() => setHelpNode(HELP_DATABASE.SAFETY)}
                className={`p-7 rounded-[2.5rem] shadow-2xl relative overflow-hidden transition-all duration-700 cursor-help ${!isSailable ? 'bg-red-600' : 'bg-blue-600'} text-white border-b-4 ${!isSailable ? 'border-red-800' : 'border-blue-800'}`}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-[60px] opacity-20 -mr-8 -mt-8" />
                <div className="relative z-10 flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Shield size={16} fill="currentColor" className="text-white" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Safety Status</span>
                        </div>
                        <h3 className="text-2xl font-black tracking-tight uppercase leading-none">{isSailable ? 'Fleet Ready' : 'OPERATIONS SUSPENDED'}</h3>
                        <div className="flex items-center gap-2 mt-2">
                            <div className={`w-2 h-2 rounded-full ${isSailable ? 'bg-green-400 animate-pulse' : 'bg-white'}`} />
                            <p className="text-xs font-bold uppercase tracking-widest">{weather.temp}°C Thermal Status</p>
                        </div>
                    </div>
                    <div className={`w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-lg ${!isSailable ? 'animate-bounce' : ''}`}>
                        {isSailable ? <Waves size={28} /> : <AlertCircle size={28} />}
                    </div>
                </div>
            </div>

            {/* Tactical Navigation & Filter Hub */}
            <div className="sticky top-[70px] z-40 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-2xl p-4 -mx-4 border-b border-slate-100 dark:border-slate-800 flex flex-col gap-4 shadow-sm">
                <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg"><Anchor size={20} /></div>
                        <h2 className="text-lg font-black dark:text-white uppercase leading-none tracking-tight">Boat Records</h2>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showFilters ? 'bg-sun-500 text-white shadow-xl scale-110' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-800'}`}
                        >
                            <SlidersHorizontal size={18} />
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-sun-500/20 shadow-2xl space-y-8 animate-in slide-in-from-top-4 relative z-50 overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500/5 rounded-full -mr-16 -mt-16" />

                        <div className="grid grid-cols-2 gap-6 relative">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sort Records</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-[10px] font-black uppercase dark:text-white outline-none border border-slate-100 dark:border-slate-700 shadow-inner appearance-none"
                                >
                                    <option value="name">Vessel Name</option>
                                    <option value="price">Base Rate (₦/hr)</option>
                                    <option value="capacity">Passenger Capacity</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sort Direction</label>
                                <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-[10px] font-black uppercase dark:text-white flex items-center justify-between border border-slate-100 dark:border-slate-700 shadow-inner">
                                    <span>{sortOrder === 'asc' ? 'Low-High' : 'High-Low'}</span>
                                    <ArrowUpDown size={14} className="text-sun-500" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vessel Class</label>
                                <span className="text-[8px] font-black text-sun-600 uppercase tracking-widest bg-sun-50 dark:bg-sun-900/20 px-2 py-0.5 rounded">Filter</span>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {['ALL', 'SPEEDBOAT', 'YACHT', 'JETSKI'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTypeFilter(t as any)}
                                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${typeFilter === t ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deploy Status</label>
                                <span className="text-[8px] font-black text-green-600 uppercase tracking-widest bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">Real-time</span>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                                {['ALL', 'AVAILABLE', 'IN_USE', 'MAINTENANCE'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setStatusFilter(s as any)}
                                        className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0 ${statusFilter === s ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-100 dark:border-slate-700'}`}
                                    >
                                        {s.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowFilters(false)}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all"
                        >
                            Synchronize Filters
                        </button>
                    </div>
                )}
            </div>

            {view === 'BOOKING' && (
                <div className="space-y-6 px-1">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sun-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search boats..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 p-5 pl-14 rounded-3xl text-sm font-bold border-2 border-transparent focus:border-sun-500/30 outline-none shadow-sm dark:text-white transition-all"
                        />
                    </div>

                    {filteredVessels.length === 0 ? (
                        <div className="py-20 text-center space-y-4 opacity-30">
                            <ShipIcon size={48} className="mx-auto" />
                            <p className="text-xs font-black uppercase tracking-[0.3em]">No boats found</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {filteredVessels.map(vessel => (
                                <div
                                    key={vessel.id}
                                    className={`bg-white dark:bg-slate-900 rounded-[3rem] border-2 transition-all p-5 shadow-sm active:scale-[0.98] ${selectedVessel?.id === vessel.id ? 'border-blue-600 bg-blue-50/10' : 'border-slate-50 dark:border-slate-800 hover:border-blue-200'} ${(!isSailable || vessel.status !== 'AVAILABLE') && vessel.status !== 'IN_USE' ? 'opacity-50 grayscale' : ''}`}
                                >
                                    <div onClick={() => isSailable && vessel.status === 'AVAILABLE' && setSelectedVessel(vessel)} className="h-56 rounded-[2.5rem] overflow-hidden relative mb-5 shadow-inner cursor-pointer">
                                        {vessel.imageUrl ? <img src={vessel.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300"><Ship size={64} /></div>}
                                        <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10"><Users size={14} className="text-white" /><span className="text-[10px] font-black text-white uppercase">{vessel.capacity} MAX CAPACITY</span></div>
                                        <div className={`absolute bottom-4 right-4 px-4 py-2 rounded-2xl text-[9px] font-black uppercase shadow-lg ${vessel.status === 'AVAILABLE' ? 'bg-green-500 text-white' : vessel.status === 'IN_USE' ? 'bg-blue-600 text-white animate-pulse' : 'bg-red-600 text-white'}`}>{vessel.status.replace('_', ' ')}</div>
                                    </div>
                                    <div className="px-1 flex justify-between items-end">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-none">{vessel.name}</h4>
                                                <button onClick={(e) => { e.stopPropagation(); setDetailedVessel(vessel); }} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-sun-600 hover:bg-sun-500 hover:text-white transition-all shadow-sm flex items-center gap-2">
                                                    <Star size={16} fill="currentColor" />
                                                    <span className="text-xs font-black">{getAvgRating(vessel)}</span>
                                                </button>
                                            </div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{vessel.type} CLASS • {vessel.reviews?.length || 0} REVIEWS</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-blue-600 tracking-tighter">₦{vessel.hourlyRate.toLocaleString()}</span>
                                            <span className="text-[9px] font-black text-slate-400 block uppercase">/ HOUR</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {selectedVessel && isSailable && (
                        <div className="animate-in slide-in-from-bottom-full duration-500 space-y-6 pb-20 mt-4">
                            <div className="bg-slate-950 p-8 rounded-[3.5rem] shadow-2xl space-y-8 relative overflow-hidden border border-white/10">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[90px] opacity-10" />
                                <div className="flex justify-between items-center">
                                    <div className="space-y-1">
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter">Booking Details</h4>
                                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em]">Vessel: {selectedVessel.name}</p>
                                    </div>
                                    <button onClick={() => setSelectedVessel(null)} className="p-2 bg-white/5 rounded-full text-slate-500"><X size={24} /></button>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Destination</label>
                                        <select value={destination} onChange={e => setDestination(e.target.value)} className="w-full p-5 rounded-2xl bg-black/60 font-black text-sm text-white border border-white/10 outline-none focus:border-blue-500 transition-all uppercase shadow-inner">
                                            {MARINE_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Departure Date</label>
                                            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-5 rounded-2xl bg-black/60 font-black text-xs text-white border border-white/10 outline-none focus:border-blue-500 shadow-inner" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Departure Time</label>
                                            <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full p-5 rounded-2xl bg-black/60 font-black text-xs text-white border border-white/10 outline-none focus:border-blue-500 shadow-inner" />
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleConfirmBooking} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all relative z-10 uppercase tracking-widest border-b-4 border-blue-800">Confirm Trip</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* VESSEL DETAIL & REVIEW MODAL */}
            {detailedVessel && (
                <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex items-end justify-center p-4 animate-in fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 border border-white/5 flex flex-col max-h-[90vh]">
                        <div className="relative h-48 flex-shrink-0">
                            {detailedVessel.imageUrl ? <img src={detailedVessel.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600"><Ship size={64} /></div>}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                            <button onClick={() => { setDetailedVessel(null); setIsReviewMode(false); }} className="absolute top-6 right-6 p-2 bg-black/40 text-white rounded-full backdrop-blur-md border border-white/10 active:scale-90 transition-transform"><X size={20} /></button>
                            <div className="absolute bottom-6 left-8 right-8">
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{detailedVessel.name}</h3>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{detailedVessel.type} CLASS</span>
                                    <div className="flex items-center gap-1 bg-sun-500 text-slate-950 px-2 py-0.5 rounded-md text-[9px] font-black">
                                        <Star size={10} fill="currentColor" /> {getAvgRating(detailedVessel)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-hide p-8 space-y-8">
                            {/* TABS (STATS vs REVIEWS) */}
                            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                                <button onClick={() => setIsReviewMode(false)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isReviewMode ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-md' : 'text-slate-400'}`}>Boat Details</button>
                                <button onClick={() => setIsReviewMode(true)} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isReviewMode ? 'bg-white dark:bg-slate-700 text-sun-600 shadow-md' : 'text-slate-400'}`}>Reviews</button>
                            </div>

                            {!isReviewMode ? (
                                <div className="space-y-6 animate-in fade-in duration-300">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2 shadow-inner">
                                            <Users size={20} className="text-blue-500" />
                                            <span className="text-2xl font-black dark:text-white">{detailedVessel.capacity}</span>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Capacity</span>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-2 shadow-inner">
                                            <Award size={20} className="text-sun-500" />
                                            <span className="text-2xl font-black dark:text-white">{getAvgRating(detailedVessel)}</span>
                                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rating</span>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2"><Info size={14} /> About Vessel</h4>
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed dark:text-slate-400 italic">
                                            "The {detailedVessel.name} is a top-tier {detailedVessel.type.toLowerCase()} boat. Equipped with deep-hull stabilization and high-flow engines, it's optimized for {detailedVessel.capacity}-passenger trips across the Lagos shoreline."
                                        </p>
                                    </div>
                                    <button onClick={() => { setSelectedVessel(detailedVessel); setDetailedVessel(null); }} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-blue-500/10 active:scale-95 transition-all">Book this Vessel</button>
                                </div>
                            ) : (
                                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                                    {/* SUBMIT REVIEW FORM */}
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2.5rem] border-2 border-dashed border-sun-500/20 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Quote className="text-sun-500 opacity-40" size={24} />
                                            <h4 className="text-xs font-black dark:text-white uppercase tracking-widest">Submit a Review</h4>
                                        </div>
                                        <form onSubmit={handleSubmitReview} className="space-y-4">
                                            <div className="flex justify-center gap-2 py-2">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setReviewRating(star)}
                                                        className={`p-1 transition-all ${reviewRating >= star ? 'text-sun-500 scale-110' : 'text-slate-300'}`}
                                                    >
                                                        <Star size={28} fill={reviewRating >= star ? "currentColor" : "none"} />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={reviewComment}
                                                onChange={e => setReviewComment(e.target.value)}
                                                placeholder="Write about your trip experience..."
                                                className="w-full bg-white dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-inner outline-none focus:ring-2 focus:ring-sun-500 h-24 resize-none"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={isSubmittingReview || !reviewComment.trim()}
                                                className="w-full bg-sun-500 text-slate-950 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-lg disabled:opacity-30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                            >
                                                {isSubmittingReview ? <><Loader2 size={14} className="animate-spin" /> Syncing Review...</> : <><ClipboardCheck size={16} /> Submit Review</>}
                                            </button>
                                        </form>
                                    </div>

                                    {/* REVIEW LIST */}
                                    <div className="space-y-4">
                                        {(detailedVessel.reviews && detailedVessel.reviews.length > 0) ? detailedVessel.reviews.map(review => (
                                            <div key={review.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-50 dark:border-slate-800 shadow-sm space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center font-black shadow-inner">
                                                            {review.userName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h5 className="text-xs font-black dark:text-white uppercase tracking-widest">{review.userName}</h5>
                                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{review.date}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sun-500">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={8} fill={i < review.rating ? "currentColor" : "none"} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic">
                                                    "{review.comment}"
                                                </p>
                                                <div className="flex items-center gap-2 pt-1">
                                                    <BadgeCheck size={12} className="text-green-500" />
                                                    <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">Verified Customer</span>
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="py-12 text-center opacity-30 space-y-3">
                                                <MessageSquareMore size={40} className="mx-auto" />
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Reviews Yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
