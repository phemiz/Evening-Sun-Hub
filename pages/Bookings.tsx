
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, Clock, Star, ExternalLink, Filter, 
  Navigation, RefreshCcw, MoreHorizontal, X, ChevronDown, 
  Info, CheckCircle, AlertCircle, Trash2, Search, DollarSign, 
  UserCheck, HelpCircle, Archive, ClipboardList, ArrowUpDown,
  Zap, Package, Scissors, Anchor, Timer, History, MessageSquare,
  Loader2, ClipboardCheck, Quote, BadgeCheck, RotateCcw, AlertTriangle, ShieldCheck
} from 'lucide-react';
import { Booking, ServiceType, Review } from '../types';
import { HUB_ADDRESS } from '../constants';

export const Bookings = () => {
  const { bookings, cancelBooking, addVesselReview, user, refundRequests, requestRefund } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [helpNode, setHelpNode] = useState<{ title: string, desc: string } | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  
  const HELP_DATABASE = {
    MANIFEST: { title: "Activity Manifest", desc: "Your official history book. It records every boat trip, salon session, and lounge reservation." },
    REFUND: { title: "Protocol Refund", desc: "If a station failed to deliver or you cancelled within the safety window (24h before), you get a Naira liquidation back to your wallet." }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const isPast = b.status === 'COMPLETED' || b.status === 'CANCELLED';
      const matchesTab = activeTab === 'UPCOMING' ? !isPast : isPast;
      const matchesSearch = b.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      return matchesTab && matchesSearch && matchesStatus;
    });
  }, [bookings, activeTab, searchTerm, statusFilter]);

  const handleCancelProtocol = () => {
    if (cancelTarget) {
      cancelBooking(cancelTarget.id);
      setCancelTarget(null);
    }
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90 transition-all">
              <ArrowLeft size={24} className="dark:text-white" />
            </button>
            <div onClick={() => setHelpNode(HELP_DATABASE.MANIFEST)} className="cursor-help">
              <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase leading-none flex items-center gap-2">Activity Manifest <HelpCircle size={16} className="text-sun-500 opacity-40"/></h2>
              <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.3em] mt-2">Personal Service Timeline</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sun-500 transition-colors" size={22} />
            <input 
              type="text"
              placeholder="Search manifest records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-5 py-5 bg-white dark:bg-slate-900 border-2 border-transparent focus:border-sun-500/30 rounded-[2rem] text-base outline-none shadow-sm dark:text-white font-bold transition-all"
            />
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] shadow-inner">
            <button onClick={() => setActiveTab('UPCOMING')} className={`flex-1 py-4 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'UPCOMING' ? 'bg-white dark:bg-slate-700 shadow-xl text-slate-900 dark:text-white' : 'text-slate-400'}`}>Active Ops</button>
            <button onClick={() => setActiveTab('PAST')} className={`flex-1 py-4 rounded-[1.6rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PAST' ? 'bg-white dark:bg-slate-700 shadow-xl text-slate-900 dark:text-white' : 'text-slate-400'}`}>History</button>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden group hover:border-sun-500/20 transition-all">
              <div className="p-7 space-y-6">
                  <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${booking.status === 'CANCELLED' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`} />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ES-{booking.id}</span>
                        </div>
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter pt-1">{booking.serviceName}</h4>
                     </div>
                     {booking.status === 'CONFIRMED' && (
                        <button 
                          onClick={() => setCancelTarget(booking)}
                          className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-inner"
                        >
                           <Trash2 size={18}/>
                        </button>
                     )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-50 dark:border-slate-800/50">
                     <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Schedule Manifest</span>
                        <div className="flex items-center gap-2 text-[11px] font-black dark:text-white uppercase"><Calendar size={12} className="text-sun-500"/> {booking.date}</div>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Investment</span>
                        <div className="flex items-center gap-2 text-[11px] font-black text-sun-600 uppercase">₦{booking.price?.toLocaleString()}</div>
                     </div>
                  </div>
              </div>
          </div>
        ))}
      </div>

      {/* CANCEL CONFIRMATION OVERLAY */}
      {cancelTarget && (
        <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in">
           <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 text-center space-y-8 shadow-2xl border border-white/5">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-[2rem] flex items-center justify-center mx-auto ring-8 ring-red-500/5"><AlertTriangle size={40}/></div>
              <div className="space-y-2">
                 <h4 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Manifest Termination</h4>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed px-2">Terminate {cancelTarget.serviceName}?</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-3">
                 <Info size={16} className="text-sun-600" />
                 <p className="text-[9px] font-black text-slate-400 uppercase text-left">Safety window cancellation (>24h) awards full capital refund to wallet.</p>
              </div>
              <div className="space-y-4">
                 <button onClick={handleCancelProtocol} className="w-full bg-red-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all">AUTHORIZE TERMINATION</button>
                 <button onClick={() => setCancelTarget(null)} className="w-full text-slate-400 font-black text-[10px] uppercase tracking-widest">ABORT</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
