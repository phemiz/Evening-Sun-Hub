
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Clock, Star, ExternalLink, Filter,
  Navigation, RefreshCcw, MoreHorizontal, X, ChevronDown,
  Info, CheckCircle, AlertCircle, Trash2, Search, DollarSign,
  UserCheck, HelpCircle, Archive, ClipboardList, ArrowUpDown,
  Zap, Package, Scissors, Anchor, Timer, History, MessageSquare,
  Loader2, ClipboardCheck, Quote, BadgeCheck
} from 'lucide-react';
import { Booking, ServiceType, Review } from '../types';
import { HUB_ADDRESS } from '../constants';

export const Bookings = () => {
  const { bookings, addToCart, addVesselReview, user } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'PAST'>('UPCOMING');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [helpNode, setHelpNode] = useState<{ title: string, desc: string } | null>(null);

  // Review Staging
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const HELP_DATABASE = {
    MANIFEST: { title: "Booking History", desc: "Your official record of all activities. It tracks every boat trip, salon session, and reservation made." },
    REBOOK: { title: "Quick Re-order", desc: "Enjoyed a previous service? Use the re-order button to instantly book the same service again." }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [sortKey, setSortKey] = useState<'date' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredBookings = useMemo(() => {
    let result = bookings.filter(b => {
      const isPast = b.status === 'COMPLETED' || b.status === 'CANCELLED';
      const matchesTab = activeTab === 'UPCOMING' ? !isPast : isPast;
      const matchesSearch = b.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
      const matchesType = typeFilter === 'ALL' || b.category === typeFilter;
      const matchesDate = !dateFilter || b.date === dateFilter;

      return matchesTab && matchesSearch && matchesStatus && matchesType && matchesDate;
    });

    return result.sort((a, b) => {
      if (sortKey === 'date') {
        const dateA = new Date(`${a.date} ${a.time || '00:00'}`).getTime();
        const dateB = new Date(`${b.date} ${b.time || '00:00'}`).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc'
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
    });
  }, [bookings, activeTab, searchTerm, statusFilter, typeFilter, dateFilter, sortKey, sortOrder]);

  const handleGetDirections = (location: string) => {
    const query = encodeURIComponent(`${location} ${HUB_ADDRESS}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const handleRebook = (booking: Booking) => {
    if (booking.category === ServiceType.EATERY) {
      navigate('/eatery');
      return;
    }

    if (booking.category === ServiceType.MARINE) {
      navigate('/marine', { state: { rebookVesselId: booking.serviceId } });
    } else if (booking.category === ServiceType.CLUB) {
      navigate('/club');
    } else {
      navigate(`/service/${booking.category}`, {
        state: {
          rebookData: {
            serviceId: booking.serviceId,
            staffName: booking.staffName
          }
        }
      });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking || !reviewComment.trim()) return;
    setIsSubmittingReview(true);
    const newReview: Review = {
      id: Math.random().toString(36).substr(2, 9),
      userName: user?.name || "Member",
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' }),
      entityId: reviewBooking.serviceId
    };

    setTimeout(() => {
      if (reviewBooking.category === ServiceType.MARINE) {
        addVesselReview(reviewBooking.serviceId, newReview);
      }
      setIsSubmittingReview(false);
      setReviewBooking(null);
      setReviewComment("");
      setReviewRating(5);
      alert("Your review has been submitted successfully!");
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      {/* Tactical Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90 transition-all">
              <ArrowLeft size={24} className="dark:text-white" />
            </button>
            <div onClick={() => setHelpNode(HELP_DATABASE.MANIFEST)} className="cursor-help">
              <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase leading-none flex items-center gap-2">My Bookings <HelpCircle size={16} className="text-sun-500 opacity-40" /></h2>
              <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.3em] mt-2">Your booking history</p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`w-12 h-12 rounded-2xl transition-all flex items-center justify-center active:scale-90 ${showFilters ? 'bg-sun-500 text-white shadow-xl rotate-90' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'}`}
          >
            <Filter size={24} />
          </button>
        </div>

        {/* Search & Filter Unit */}
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sun-500 transition-colors" size={22} />
            <input
              type="text"
              placeholder="Search your bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-5 py-5 bg-white dark:bg-slate-900 border-2 border-transparent focus:border-sun-500/30 rounded-[2rem] text-base outline-none shadow-sm dark:text-white font-bold transition-all"
            />
          </div>

          {showFilters && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border-2 border-sun-500/20 space-y-6 animate-in slide-in-from-top-4 shadow-2xl relative z-20">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Booking Date</label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-bold dark:text-white border-none outline-none shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sort Logic</label>
                  <div className="flex gap-1">
                    <select
                      value={sortKey}
                      onChange={(e) => setSortKey(e.target.value as any)}
                      className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase border-none outline-none shadow-inner dark:text-white"
                    >
                      <option value="date">Date</option>
                      <option value="status">Status</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-sun-500 shadow-inner"
                    >
                      <ArrowUpDown size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Status</label>
                <div className="flex flex-wrap gap-2">
                  {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-sun-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setStatusFilter('ALL');
                  setTypeFilter('ALL');
                  setDateFilter('');
                  setSearchTerm('');
                }}
                className="w-full py-4 text-[9px] font-black text-red-500 uppercase tracking-[0.3em] hover:underline"
              >
                Reset Filters
              </button>
            </div>
          )}

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-[2rem] shadow-inner">
            <button onClick={() => setActiveTab('UPCOMING')} className={`flex-1 py-4 rounded-[1.6rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'UPCOMING' ? 'bg-white dark:bg-slate-700 shadow-xl text-slate-900 dark:text-white' : 'text-slate-400'}`}>Active</button>
            <button onClick={() => setActiveTab('PAST')} className={`flex-1 py-4 rounded-[1.6rem] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'PAST' ? 'bg-white dark:bg-slate-700 shadow-xl text-slate-900 dark:text-white' : 'text-slate-400'}`}>Past</button>
          </div>
        </div>
      </div>

      {/* Manifest Feed */}
      <section className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 opacity-40">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[3rem] flex items-center justify-center text-slate-300 shadow-inner"><ClipboardList size={48} /></div>
            <p className="text-sm font-black uppercase tracking-[0.3em]">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredBookings.map((booking) => (
              <div key={booking.id} onClick={() => setSelectedBooking(booking)} className="bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm overflow-hidden group cursor-pointer active:scale-[0.98] transition-all hover:border-sun-500/20">
                <div className="p-7 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${booking.status === 'CANCELLED' ? 'bg-red-500' :
                          booking.status === 'COMPLETED' ? 'bg-blue-500' :
                            'bg-green-500 animate-pulse'
                          }`} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {booking.id}</span>
                      </div>
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight">{booking.serviceName}</h4>
                    </div>
                    <div className="bg-sun-50 dark:bg-sun-900/10 p-3 rounded-2xl text-sun-600 shadow-inner">
                      {booking.category === ServiceType.EATERY ? <Package size={20} /> :
                        booking.category.includes('SALON') ? <Scissors size={20} /> :
                          booking.category === ServiceType.MARINE ? <Anchor size={20} /> :
                            <MoreHorizontal size={20} />}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-50 dark:border-slate-800/50">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Schedule</span>
                      <div className="flex items-center gap-2 text-sm font-black dark:text-white"><Calendar size={14} className="text-sun-500" /> {booking.date}</div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Station</span>
                      <div className="flex items-center gap-2 text-sm font-black dark:text-white"><MapPin size={14} className="text-sun-500" /> {booking.location?.split(' ')[0] || 'Hub'}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xl font-black text-sun-600 tracking-tighter">₦{booking.price?.toLocaleString()}</span>
                    <div className="flex gap-2">
                      {activeTab === 'PAST' && booking.status === 'COMPLETED' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setReviewBooking(booking); }}
                          className="bg-sun-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                        >
                          <Star size={12} fill="currentColor" /> Write Review
                        </button>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRebook(booking); }}
                        className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                      >
                        <RefreshCcw size={12} /> Re-order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* REVIEW OVERLAY */}
      {reviewBooking && (
        <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex items-end justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 border border-white/5 relative">
            <button onClick={() => setReviewBooking(null)} className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform shadow-sm z-20"><X size={28} /></button>

            <div className="p-10 space-y-8">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-sun-50 dark:bg-sun-900/20 text-sun-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner"><Quote size={40} /></div>
                <div>
                  <h4 className="text-3xl font-black dark:text-white uppercase tracking-tighter leading-none">Review Service</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Reviewing: {reviewBooking.serviceName}</p>
                </div>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`p-1 transition-all ${reviewRating >= star ? 'text-sun-500 scale-125' : 'text-slate-200 dark:text-slate-700'}`}
                    >
                      <Star size={40} fill={reviewRating >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Write about your experience..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] p-6 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-inner outline-none focus:ring-2 focus:ring-sun-500 h-32 resize-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmittingReview || !reviewComment.trim()}
                  className="w-full bg-sun-500 text-slate-950 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl disabled:opacity-30 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {isSubmittingReview ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : <><ClipboardCheck size={20} /> Submit Review</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL OVERLAY */}
      {selectedBooking && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/90 backdrop-blur-2xl p-5 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[4rem] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500 border border-white/5 relative max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button onClick={() => setSelectedBooking(null)} className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform shadow-sm z-20"><X size={28} /></button>

            <div className="space-y-8 pt-5">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-sun-50 dark:bg-sun-900/20 text-sun-600 rounded-[2rem] flex items-center justify-center shadow-inner"><Star size={40} fill="currentColor" /></div>
                <div>
                  <h4 className="text-3xl font-black dark:text-white uppercase tracking-tighter leading-none">{selectedBooking.serviceName}</h4>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest ${selectedBooking.status === 'CONFIRMED' ? 'bg-green-500 text-white' :
                      selectedBooking.status === 'COMPLETED' ? 'bg-blue-500 text-white' :
                        selectedBooking.status === 'CANCELLED' ? 'bg-red-500 text-white' :
                          'bg-slate-400 text-white'
                      }`}>
                      {selectedBooking.status}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BOOKING ID #{selectedBooking.id}</span>
                  </div>
                </div>
              </div>

              {/* Primary Data Card */}
              <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[3rem] space-y-6 shadow-inner border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price Paid</span>
                  <span className="text-2xl font-black text-sun-600">₦{selectedBooking.price?.toLocaleString()}</span>
                </div>
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-5">
                  <div className="flex items-center gap-4 text-sm font-bold dark:text-white">
                    <Calendar size={20} className="text-sun-500" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Booking Date</span>
                      {selectedBooking.date} @ {selectedBooking.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold dark:text-white">
                    <MapPin size={20} className="text-sun-500" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Hub Location</span>
                      {selectedBooking.location || 'Main Hub Station'}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold dark:text-white">
                    <UserCheck size={20} className="text-sun-500" />
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Staff Name</span>
                      {selectedBooking.staffName || 'Hub Service Unit'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Manifest History */}
              <div className="space-y-4">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2"><History size={14} className="text-sun-500" /> Booking Status History</h5>
                <div className="space-y-4 pl-4 border-l-2 border-slate-100 dark:border-slate-800 relative">
                  {(selectedBooking.statusHistory || [
                    { status: 'INITIALIZED', timestamp: selectedBooking.date }
                  ]).map((h, i) => (
                    <div key={i} className="relative pl-6">
                      <div className="absolute left-[-11px] top-1 w-4 h-4 rounded-full bg-white dark:bg-slate-900 border-2 border-sun-500 z-10" />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black dark:text-white uppercase tracking-widest">{h.status}</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">{h.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {selectedBooking.status === 'COMPLETED' && (
                  <button
                    onClick={() => { setReviewBooking(selectedBooking); setSelectedBooking(null); }}
                    className="flex-1 bg-sun-500 text-white py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Star size={18} fill="currentColor" /> Rate Service
                  </button>
                )}
                <button onClick={() => setSelectedBooking(null)} className="flex-1 bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HELP OVERLAY */}
      {helpNode && (
        <div className="fixed inset-0 z-[600] flex items-end justify-center bg-black/90 backdrop-blur-2xl p-5 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 border border-white/5 relative">
            <button onClick={() => setHelpNode(null)} className="absolute top-7 right-7 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform shadow-sm"><X size={28} /></button>
            <div className="space-y-8 pt-5 text-center">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner"><HelpCircle size={48} /></div>
              <div className="space-y-4">
                <h4 className="text-4xl font-black dark:text-white uppercase tracking-tighter leading-none">{helpNode.title}</h4>
                <p className="text-xl font-bold text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-tight italic">"{helpNode.desc}"</p>
              </div>
              <button onClick={() => setHelpNode(null)} className="w-full bg-sun-500 text-white py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">Acknowledged</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
