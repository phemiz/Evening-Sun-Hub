
import React, { useState } from 'react';
import { Calendar, Users, Music, Star, ChevronRight, Clock, MapPin, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ServiceType } from '../types';

export const Club = () => {
    const navigate = useNavigate();
    const { events } = useApp();

    const [bookingStep, setBookingStep] = useState<'LIST' | 'RESERVE'>('LIST');
    const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
    const [guests, setGuests] = useState("4");
    const [zone, setZone] = useState("VIP Lounge");

    const handleReserveTable = () => {
        // Commitment fee for VIP Table Reservations
        const reservationFee = 20000;

        const pendingBooking = {
            id: Math.random().toString(36).substr(2, 9),
            serviceId: 'club-table',
            serviceName: `VIP Table (${zone})`,
            category: ServiceType.CLUB,
            date: "Next Friday", // In a real app, this would be picked from the event date
            time: "10:00 PM",
            status: 'PENDING' as const,
            depositPaid: false,
            price: reservationFee,
            location: 'VIP Section',
            staffName: 'Lounge Host'
        };

        // Navigate to payment page with the booking data
        navigate('/payment', {
            state: {
                pendingBooking,
                totalAmount: reservationFee
            }
        });
    };

    if (bookingStep === 'RESERVE') {
        return (
            <div className="space-y-8 animate-in slide-in-from-right duration-300">
                <div className="flex items-center gap-4">
                    <button onClick={() => setBookingStep('LIST')} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                        <ArrowLeft size={20} className="dark:text-white" />
                    </button>
                    <h2 className="text-2xl font-black dark:text-white tracking-tight">VIP Table Booking</h2>
                </div>

                <div className="bg-gradient-to-br from-purple-900 to-slate-950 p-6 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500 rounded-full blur-[60px] opacity-20" />
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <Star className="text-sun-400" fill="currentColor" size={20} />
                            <span className="text-xs font-black uppercase tracking-widest text-sun-400">Premium Booking</span>
                        </div>
                        <h3 className="text-2xl font-bold">VIP Table Booking</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">Secure your spot with premium bottle service and dedicated hosting.</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">How many guests?</label>
                        <div className="grid grid-cols-4 gap-2">
                            {["2", "4", "6", "10+"].map(num => (
                                <button
                                    key={num}
                                    onClick={() => setGuests(num)}
                                    className={`py-3 rounded-xl font-bold border-2 transition-all ${guests === num ? 'border-sun-500 bg-sun-500/10 text-sun-600' : 'border-slate-100 dark:border-slate-800 dark:text-white'}`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Seating Area</label>
                        <div className="space-y-2">
                            {["VIP Lounge", "Dancefloor High-Tables", "Outdoor Patio"].map(z => (
                                <button
                                    key={z}
                                    onClick={() => setZone(z)}
                                    className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${zone === z ? 'border-sun-500 bg-sun-500/10 text-sun-600' : 'border-slate-100 dark:border-slate-800 dark:text-white'}`}
                                >
                                    <span className="font-bold">{z}</span>
                                    {zone === z && <CheckCircle size={18} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 space-y-4">
                        <div className="bg-slate-900 dark:bg-black p-6 rounded-[2rem] space-y-3 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-sun-500 rounded-full blur-[60px] opacity-20" />
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-widest">Table Deposit</span>
                                <span className="text-xl font-black">₦20,000</span>
                            </div>
                            <p className="text-[9px] text-slate-400 font-medium">This amount will be deducted from your final bill tonight.</p>
                        </div>

                        <button
                            onClick={handleReserveTable}
                            className="w-full bg-sun-600 hover:bg-sun-700 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-sun-500/20 transition-all active:scale-95"
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Club & Lounge</h2>
                <p className="text-sm font-medium text-slate-500">Premium nightlife and table reservations.</p>
            </div>

            {/* VIP Header Card */}
            <div className="group relative bg-slate-950 rounded-[2.5rem] p-8 text-white overflow-hidden shadow-2xl border border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253361-bee8a48790c3?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-4 pt-10">
                    <div className="w-16 h-16 rounded-full bg-sun-500/20 backdrop-blur-xl flex items-center justify-center text-sun-400 border border-sun-500/30">
                        <Star size={32} fill="currentColor" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-2xl font-black tracking-tight">Reserve a VIP Table</h3>
                        <p className="text-sm text-slate-300 font-medium max-w-[200px]">Get the best view and premium bottle service.</p>
                    </div>
                    <button
                        onClick={() => setBookingStep('RESERVE')}
                        className="bg-white text-slate-950 px-8 py-3.5 rounded-full font-black text-sm shadow-xl shadow-white/10 hover:bg-sun-400 hover:text-white transition-all transform active:scale-95"
                    >
                        Book Table
                    </button>
                </div>
            </div>

            {/* Events Section */}
            <div className="space-y-5">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Featured Events</h3>
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full bg-sun-500" />
                        <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700" />
                    </div>
                </div>

                <div className="space-y-4">
                    {events.length > 0 ? events.map(event => (
                        <div
                            key={event.id}
                            onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                            className={`group bg-white dark:bg-slate-800 border transition-all duration-300 rounded-[2rem] overflow-hidden ${selectedEvent === event.id
                                    ? 'border-sun-500 shadow-xl shadow-sun-500/5'
                                    : 'border-slate-100 dark:border-slate-700 shadow-sm'
                                }`}
                        >
                            <div className="p-5 flex items-center gap-5">
                                <div className="flex flex-col items-center justify-center w-16 h-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                                    <span className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1 truncate px-1">
                                        {event.date.split(',')[0]}
                                    </span>
                                    <span className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                        {event.date.match(/\d+/) ? event.date.match(/\d+/)[0] : '...'}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Music size={12} className="text-sun-600" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-sun-600">LIVE SET</span>
                                    </div>
                                    <h4 className="font-black text-slate-800 dark:text-white text-lg leading-tight">{event.title}</h4>
                                    <div className="flex items-center gap-3 mt-1.5">
                                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${event.price.toLowerCase().includes('free')
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-sun-100 text-sun-700 dark:bg-sun-900/30 dark:text-sun-400'
                                            }`}>
                                            {event.price}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 truncate max-w-[100px]">• {event.date}</span>
                                    </div>
                                </div>

                                <div className={`p-2 transition-transform duration-300 ${selectedEvent === event.id ? 'rotate-90 text-sun-500' : 'text-slate-300'}`}>
                                    <ChevronRight size={20} />
                                </div>
                            </div>

                            {selectedEvent === event.id && (
                                <div className="px-5 pb-6 space-y-4 animate-in slide-in-from-top-4 duration-300 border-t border-slate-50 dark:border-slate-700/50 pt-5">
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        {event.description || "Join us for an unforgettable night of Afrobeat, Amapiano, and high-energy vibes. Our world-class DJs will keep the floor moving until the early hours."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                                            <Clock size={12} className="text-sun-500" /> Doors at 9PM
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                                            <Users size={12} className="text-sun-500" /> Cap: {event.capacity}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                                            <MapPin size={12} className="text-sun-500" /> Main Lounge
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                                            <Star size={12} className="text-sun-500" /> Smart Casual
                                        </div>
                                    </div>

                                    {event.price.toLowerCase().includes('table') && (
                                        <button
                                            onClick={() => setBookingStep('RESERVE')}
                                            className="w-full bg-slate-900 dark:bg-white dark:text-slate-950 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest mt-2"
                                        >
                                            Book Reservation
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="py-20 text-center opacity-30 space-y-4">
                            <Music size={48} className="mx-auto" />
                            <p className="text-xs font-black uppercase tracking-[0.3em]">No Upcoming Events</p>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={() => navigate(-1)}
                className="w-full py-4 rounded-2xl text-slate-500 dark:text-slate-400 font-bold text-sm border-2 border-slate-100 dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
            >
                Go Back
            </button>
        </div>
    );
};
