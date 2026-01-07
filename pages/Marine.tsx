
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Anchor, Ship, Shield, Waves, Star, Search, X, Users, CheckCircle, 
  MapPin, Clock, Calendar, ChevronRight, Info, AlertTriangle, 
  QrCode, ArrowLeft, Wind, Thermometer, UserCheck, Armchair, 
  CreditCard, Loader2, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ServiceType, MarineRoute, SeatInfo, Booking } from '../types';
import { MOCK_MARINE_ROUTES } from '../constants';

type MarineStep = 'ROUTES' | 'DETAILS' | 'SEATS' | 'CONFIRM';

export const Marine = () => {
    const navigate = useNavigate();
    const { vessels, weather, sailingTempLimit, addNotification } = useApp();
    
    const [step, setStep] = useState<MarineStep>('ROUTES');
    const [selectedRoute, setSelectedRoute] = useState<MarineRoute | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState("");
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);

    const isSailable = weather.temp < sailingTempLimit;

    // Simulate Seat Map
    const seats = useMemo(() => {
        const rows = ['A', 'B', 'C', 'D', 'E'];
        const list: SeatInfo[] = [];
        rows.forEach(r => {
            for(let i=1; i<=4; i++) {
                list.push({
                    id: `${r}${i}`,
                    row: r,
                    number: i,
                    isBooked: Math.random() < 0.2,
                    type: (i === 1 || i === 4) ? 'WINDOW' : 'AISLE'
                });
            }
        });
        return list;
    }, [selectedRoute, selectedTime]);

    const handleRouteSelect = (route: MarineRoute) => {
        setSelectedRoute(route);
        setStep('DETAILS');
    };

    const toggleSeat = (seatId: string) => {
        setSelectedSeats(prev => 
            prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
        );
    };

    const handleInitiatePayment = () => {
        if (!selectedRoute || selectedSeats.length === 0) return;
        
        setIsSyncing(true);
        const total = selectedRoute.price * selectedSeats.length;
        
        const bookingPayload: Partial<Booking> = {
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            serviceId: selectedRoute.id,
            serviceName: `Marine: ${selectedRoute.origin} → ${selectedRoute.destination}`,
            category: ServiceType.MARINE,
            date: selectedDate,
            time: selectedTime,
            status: 'PENDING',
            depositPaid: false,
            price: total,
            location: selectedRoute.origin,
            seatNumber: selectedSeats.join(', '),
            gateNumber: 'Gate 3, Sun Jetty'
        };

        setTimeout(() => {
            setIsSyncing(false);
            navigate('/payment', { state: { pendingBooking: bookingPayload, totalAmount: total } });
        }, 1500);
    };

    const renderRoutes = () => (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className={`p-8 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group ${isSailable ? 'bg-blue-600' : 'bg-red-600'}`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 flex justify-between items-center">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Safety Protocol V4.2</span>
                        <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{isSailable ? 'Waters Clear' : 'Thermal Lockout'}</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Temp: {weather.temp}°C | Wind: 12kn NE</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                        {isSailable ? <Waves size={36} className="animate-pulse" /> : <AlertTriangle size={36} />}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Anchor size={14} className="text-blue-500" /> Marine Expeditions
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-black text-sun-600 uppercase">
                    Live Schedules <ChevronRight size={14} />
                </div>
            </div>

            <div className="grid gap-6">
                {MOCK_MARINE_ROUTES.map(route => (
                    <div 
                        key={route.id} 
                        onClick={() => handleRouteSelect(route)}
                        className="bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm active:scale-[0.98] transition-all group"
                    >
                        <div className="h-48 relative overflow-hidden">
                            <img src={route.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s]" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                            <div className="absolute bottom-6 left-8 flex items-center gap-3">
                                <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                                    <Clock size={10} /> {route.durationMin}m
                                </div>
                                <div className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                    ₦{route.price.toLocaleString()}
                                </div>
                            </div>
                        </div>
                        <div className="p-7 flex justify-between items-center">
                            <div className="space-y-1">
                                <h4 className="text-xl font-black uppercase dark:text-white leading-none tracking-tight">{route.destination}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departure: {route.origin}</p>
                            </div>
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-inner">
                                <ChevronRight size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderDetails = () => (
        <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <header className="flex items-center gap-4">
                <button onClick={() => setStep('ROUTES')} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                    <ArrowLeft size={24} className="dark:text-white" />
                </button>
                <div>
                    <h2 className="text-2xl font-black dark:text-white tracking-tighter uppercase leading-none">Manifest Details</h2>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2">Route Sync Active</p>
                </div>
            </header>

            <div className="bg-slate-950 rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full blur-[100px] opacity-10 -mr-20 -mt-20" />
                <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em]">Target Node</span>
                            <h3 className="text-3xl font-black uppercase tracking-tighter">{selectedRoute?.destination}</h3>
                        </div>
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner"><Ship size={28} className="text-blue-400"/></div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-white/5">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Base Investment</span>
                            <p className="text-xl font-black text-white">₦{selectedRoute?.price.toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Travel Window</span>
                            <p className="text-xl font-black text-white">{selectedRoute?.durationMin} Mins</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Schedule Manifest</h5>
                        <div className="flex flex-wrap gap-2">
                            {selectedRoute?.departureTimes.map(time => (
                                <button 
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${selectedTime === time ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-400'}`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4 px-2">
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-50 dark:border-slate-800">
                    <ShieldCheck size={20} className="text-green-500" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Life Jacket Protocol Enforced</p>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-50 dark:border-slate-800">
                    <UserCheck size={20} className="text-blue-500" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Captain Musa Assigned to Deck</p>
                </div>
            </div>

            <button 
                onClick={() => selectedTime && setStep('SEATS')} 
                disabled={!selectedTime}
                className="w-full bg-slate-950 dark:bg-white dark:text-slate-950 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all disabled:opacity-30"
            >
                Authorize Seating
            </button>
        </div>
    );

    const renderSeats = () => (
        <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <header className="flex items-center gap-4">
                <button onClick={() => setStep('DETAILS')} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                    <ArrowLeft size={24} className="dark:text-white" />
                </button>
                <div>
                    <h2 className="text-2xl font-black dark:text-white tracking-tighter uppercase leading-none">Seat Selector</h2>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-2">Vessel Layout: {selectedRoute?.vesselId}</p>
                </div>
            </header>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] shadow-inner border-2 border-slate-50 dark:border-slate-800">
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-16 rounded-t-full mb-12 flex items-center justify-center border-b-4 border-blue-500/20">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Deck Bow</span>
                </div>

                <div className="grid grid-cols-4 gap-4 px-4">
                    {seats.map(seat => (
                        <button 
                            key={seat.id} 
                            disabled={seat.isBooked}
                            onClick={() => toggleSeat(seat.id)}
                            className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                                seat.isBooked ? 'bg-slate-100 dark:bg-slate-800 text-slate-300 cursor-not-allowed opacity-30' :
                                selectedSeats.includes(seat.id) ? 'bg-blue-600 text-white shadow-lg scale-110' :
                                'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400'
                            }`}
                        >
                            <Armchair size={16} className={selectedSeats.includes(seat.id) ? 'animate-bounce' : ''} />
                            <span className="text-[8px] font-black mt-1">{seat.id}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-12 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                        <span className="text-[8px] font-black uppercase text-slate-400">Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <span className="text-[8px] font-black uppercase text-slate-400">Reserved</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full border border-slate-200" />
                        <span className="text-[8px] font-black uppercase text-slate-400">Ready</span>
                    </div>
                </div>
            </div>

            <div className="bg-slate-950 p-8 rounded-[2.5rem] flex items-center justify-between text-white shadow-xl">
                <div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total manifest</span>
                    <h4 className="text-xl font-black">₦{( (selectedRoute?.price || 0) * selectedSeats.length ).toLocaleString()}</h4>
                </div>
                <div className="text-right">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Seats</span>
                    <h4 className="text-xl font-black text-blue-400 uppercase tracking-tighter">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</h4>
                </div>
            </div>

            <button 
                onClick={() => selectedSeats.length > 0 && setStep('CONFIRM')} 
                disabled={selectedSeats.length === 0}
                className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all disabled:opacity-30 border-b-4 border-blue-800"
            >
                Confirm Reservation
            </button>
        </div>
    );

    const renderConfirm = () => (
        <div className="space-y-8 animate-in zoom-in duration-300">
            <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner"><QrCode size={48}/></div>
                <div>
                    <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase leading-none">Pre-Check Complete</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Expedition Manifest Ready</p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departure Node</span>
                            <span className="text-sm font-black dark:text-white uppercase">{selectedRoute?.origin}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Node</span>
                            <span className="text-sm font-black dark:text-white uppercase">{selectedRoute?.destination}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</span>
                            <span className="text-sm font-black dark:text-white uppercase">{selectedDate} @ {selectedTime}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seats Allocated</span>
                            <span className="text-sm font-black text-blue-600 uppercase tracking-tighter">{selectedSeats.join(', ')}</span>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-end">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fiscal Total</span>
                            <p className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">₦{( (selectedRoute?.price || 0) * selectedSeats.length ).toLocaleString()}</p>
                        </div>
                        <div className="bg-sun-50 dark:bg-sun-900/20 px-4 py-2 rounded-xl border border-sun-100 dark:border-sun-900/50">
                            <span className="text-[9px] font-black text-sun-600 uppercase tracking-widest">+{((selectedRoute?.price || 0) * selectedSeats.length * 0.05).toFixed(0)} Points</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <button 
                    onClick={handleInitiatePayment} 
                    disabled={isSyncing}
                    className="w-full bg-sun-500 text-white py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-sun-700"
                >
                    {isSyncing ? <><Loader2 className="animate-spin" size={24} /> Processing...</> : <><CreditCard size={24}/> Pay & Board</>}
                </button>
                <button onClick={() => setStep('SEATS')} className="w-full text-slate-400 font-black text-[9px] uppercase tracking-[0.4em] py-3">Modify Seating</button>
            </div>
        </div>
    );

    return (
        <div className="space-y-7 pb-32">
            {step === 'ROUTES' && renderRoutes()}
            {step === 'DETAILS' && renderDetails()}
            {step === 'SEATS' && renderSeats()}
            {step === 'CONFIRM' && renderConfirm()}
        </div>
    );
};
