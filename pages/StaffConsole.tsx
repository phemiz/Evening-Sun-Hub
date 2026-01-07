
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Utensils, Scissors, Anchor, Music, Shield, Power, Clock, User, 
  MapPin, Navigation, CheckCircle2, X, Activity, Loader2,
  TrendingUp, Wallet, ListChecks, Calendar, Package, GlassWater,
  Search, SlidersHorizontal, ChevronRight, Briefcase, Award,
  Smartphone, BarChart3, Database, ShieldCheck, Landmark, Receipt,
  Users, Star
} from 'lucide-react';
import { CaptainLog } from '../components/CaptainLog';
import { StaffRole, Booking, ServiceType } from '../types';

export const StaffConsole = () => {
  const { bookings, updateBookingStatus, user, addNotification, staff, updateStaff, clockIn, clockOut, shifts, transactions } = useApp();
  
  const [activeFilter, setActiveFilter] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('PENDING');
  const [showMarineLog, setShowMarineLog] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const staffRole = user?.staffRole || 'KITCHEN';
  const staffProfile = staff.find(s => s.phone === user?.phone);
  const activeShift = shifts.find(s => s.staffId === staffProfile?.id && s.status === 'ACTIVE');

  // Role Configurations
  const roleConfigs: Record<StaffRole, any> = {
    KITCHEN: { icon: Utensils, label: 'Kitchen Unit', color: 'bg-orange-500', workflow: 'FOOD' },
    BAR: { icon: GlassWater, label: 'Mixology Station', color: 'bg-indigo-500', workflow: 'DRINK' },
    CASHIER: { icon: Receipt, label: 'Settle Station', color: 'bg-sun-500', workflow: 'FINANCE' },
    INVENTORY: { icon: Package, label: 'Storage Node', color: 'bg-emerald-500', workflow: 'STOCK' },
    EVENT_SUPERVISOR: { icon: Music, label: 'Event Control', color: 'bg-sun-600', workflow: 'EVENT' },
    SALON: { icon: Scissors, label: 'Salon Area', color: 'bg-purple-500', workflow: 'SERVICE' },
    PEDICURE: { icon: Scissors, label: 'Spa Station', color: 'bg-pink-500', workflow: 'SERVICE' },
    GAME_LOUNGE: { icon: Smartphone, label: 'Arena Console', color: 'bg-red-500', workflow: 'GAME' },
    BOAT_OPERATOR: { icon: Anchor, label: 'Captain Deck', color: 'bg-blue-600', workflow: 'MARINE' },
    FLOOR_MANAGER: { icon: Activity, label: 'Floor Control', color: 'bg-slate-900', workflow: 'MGMT' },
    ADMIN_MGMT: { icon: Database, label: 'Command Hub', color: 'bg-slate-950', workflow: 'MGMT' },
    OPERATIONS_MGMT: { icon: SlidersHorizontal, label: 'Ops Desk', color: 'bg-slate-900', workflow: 'MGMT' },
    FINANCE_MGMT: { icon: Landmark, label: 'Fiscal Control', color: 'bg-amber-600', workflow: 'MGMT' },
    EXECUTIVE: { icon: Award, label: 'Executive Suite', color: 'bg-sun-600', workflow: 'MGMT' }
  };

  const currentConfig = roleConfigs[staffRole];

  // RBAC Task Filtering Logic
  const myTasks = useMemo(() => {
    return bookings.filter(b => {
      const matchesStatus = b.status === activeFilter;
      const matchesSearch = b.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           b.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      // Role-based filtering
      if (currentConfig.workflow === 'MGMT') return matchesStatus;
      if (staffRole === 'KITCHEN') return matchesStatus && (b.category === ServiceType.EATERY || b.category === ServiceType.CLUB);
      if (staffRole === 'SALON' || staffRole === 'PEDICURE') return matchesStatus && (b.category === ServiceType.SALON || b.category === ServiceType.PEDICURE);
      if (staffRole === 'BOAT_OPERATOR') return matchesStatus && b.category === ServiceType.MARINE;
      if (staffRole === 'GAME_LOUNGE') return matchesStatus && b.category === ServiceType.GAME_LOUNGE;
      if (staffRole === 'BAR') return matchesStatus && (b.category === ServiceType.CLUB || b.category === ServiceType.LOUNGE);
      if (staffRole === 'CASHIER') return matchesStatus; // View all for payment tracking
      if (staffRole === 'INVENTORY') return matchesStatus && b.category === ServiceType.SUPERMARKET;
      
      return matchesStatus;
    });
  }, [bookings, activeFilter, staffRole, searchQuery, currentConfig.workflow]);

  const handleFinishJob = (taskId: string, price: number = 0) => {
    updateBookingStatus(taskId, 'COMPLETED');
    if (staffProfile) {
        updateStaff(staffProfile.id, {
            completedTasks: (staffProfile.completedTasks || 0) + 1,
            earnings: (staffProfile.earnings || 0) + price
        });
    }
    addNotification({ title: 'Protocol Success', message: `Manifest #${taskId} finalized.`, type: 'SUCCESS' });
  };

  const toggleDuty = () => {
    if (!staffProfile) return;
    if (activeShift) {
        clockOut(staffProfile.id);
        addNotification({ title: 'Duty Terminated', message: 'Shift manifest closed for today.', type: 'WARNING' });
    } else {
        clockIn(staffProfile.id);
        addNotification({ title: 'Duty Active', message: 'Hub Node synchronization started.', type: 'SUCCESS' });
    }
  };

  const renderManagerStats = () => (
    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
      <div className="bg-slate-950 p-6 rounded-[2rem] text-white border border-white/5 shadow-2xl">
         <div className="flex items-center gap-2 text-slate-500 mb-2"><TrendingUp size={14}/><span className="text-[8px] font-black uppercase tracking-widest">Yield Today</span></div>
         <p className="text-xl font-black">₦{Math.abs(transactions.reduce((a,b)=>a+(b.amount<0?0:b.amount),0)).toLocaleString()}</p>
      </div>
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm">
         {/* Fix: Added missing Users icon import to render team stats correctly */}
         <div className="flex items-center gap-2 text-slate-400 mb-2"><Users size={14}/><span className="text-[8px] font-black uppercase tracking-widest">Team Active</span></div>
         <p className="text-xl font-black dark:text-white">{staff.filter(s => s.status === 'ACTIVE').length}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-500">
      {/* 1. Header & ID Card */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase leading-none">{currentConfig.label}</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{user?.name} Station Hub</p>
        </div>
        <button 
          onClick={toggleDuty}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${activeShift ? currentConfig.color : 'bg-slate-200 dark:bg-slate-800 text-slate-400'} shadow-lg ring-4 ${activeShift ? 'ring-green-500/20' : 'ring-transparent'}`}
        >
            {activeShift ? <currentConfig.icon size={28} className="text-white" /> : <Power size={28} />}
        </button>
      </div>

      {/* 2. Management Layer (Conditional) */}
      {currentConfig.workflow === 'MGMT' && renderManagerStats()}

      {/* 3. Performance Metrics Mini-Node */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm flex items-center justify-around">
          <div className="text-center">
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Efficiency</span>
             <p className="text-lg font-black dark:text-white">98.2%</p>
          </div>
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
          <div className="text-center">
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Manifests</span>
             <p className="text-lg font-black dark:text-white">{staffProfile?.completedTasks || 0}</p>
          </div>
          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
          <div className="text-center">
             <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">XP Rating</span>
             <div className="flex items-center gap-1">
                {/* Fix: Added missing Star icon import to render rating correctly */}
                <Star size={12} fill="currentColor" className="text-sun-500"/>
                <p className="text-lg font-black dark:text-white">{staffProfile?.rating || '5.0'}</p>
             </div>
          </div>
      </div>

      {/* 4. Controls & Filters */}
      <div className="space-y-4">
          <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search station manifest..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 p-5 rounded-3xl bg-white dark:bg-slate-900 border-none shadow-sm dark:text-white text-xs font-bold focus:ring-2 focus:ring-blue-500 transition-all"
              />
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[2rem] shadow-inner">
            {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f as any)}
                className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xl' : 'text-slate-400'}`}
              >
                {f === 'PENDING' ? 'Unassigned' : f === 'IN_PROGRESS' ? 'Active' : 'Archived'}
              </button>
            ))}
          </div>
      </div>

      {/* 5. Main Task Feed */}
      <div id="task-manifest" className="space-y-5">
        {!activeShift ? (
           <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 opacity-50">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-400"><Power size={40}/></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Node Offline: Clock-in to Sync</p>
           </div>
        ) : myTasks.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 opacity-30">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center text-slate-400"><ListChecks size={40}/></div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Manifest Registry Clear</p>
           </div>
        ) : (
          myTasks.map(task => (
            <div key={task.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-7 border-2 border-slate-50 dark:border-slate-800 shadow-sm space-y-6 group active:scale-[0.98] transition-all">
               <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-1"><Smartphone size={10}/> ES-MANIFEST-{task.id}</span>
                    <h4 className="text-xl font-black dark:text-white uppercase leading-none tracking-tight">{task.serviceName}</h4>
                  </div>
                  <div className={`p-3 rounded-xl ${currentConfig.color} text-white shadow-lg`}><Clock size={18}/></div>
               </div>

               <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-500">M</div>
                  <div className="flex-1">
                     <p className="text-[10px] font-black dark:text-white uppercase">Hub Member</p>
                     <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Loyalty: Grade 4</p>
                  </div>
                  <div className="text-right">
                     <span className="text-xs font-black dark:text-white">₦{task.price?.toLocaleString()}</span>
                  </div>
               </div>

               <div className="flex gap-3">
                  {task.status === 'PENDING' && (
                    <button 
                      onClick={() => updateBookingStatus(task.id, 'IN_PROGRESS')} 
                      className="flex-1 bg-slate-950 dark:bg-blue-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                    >
                      Establish Link
                    </button>
                  )}
                  {task.status === 'IN_PROGRESS' && (
                    <button 
                      onClick={() => { if(staffRole === 'BOAT_OPERATOR') { setActiveJobId(task.id); setShowMarineLog(true); } else { handleFinishJob(task.id, task.price); } }} 
                      className="flex-1 bg-green-600 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={16}/> Settle Manifest
                    </button>
                  )}
                  <button className="p-5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl active:scale-90 transition-all"><SlidersHorizontal size={20}/></button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* 6. Shift History Mini-Tray */}
      {shifts.length > 0 && (
        <div className="space-y-4 pt-4">
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] px-1 flex items-center gap-2"><Briefcase size={14} className="text-blue-500"/> Activity Logs</h3>
           <div className="space-y-3">
              {shifts.slice(0, 3).map(s => (
                <div key={s.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-50 dark:border-slate-800 flex justify-between items-center opacity-70">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400"><Calendar size={20}/></div>
                      <div>
                         <p className="text-[10px] font-black dark:text-white uppercase">{s.date}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{s.clockIn} - {s.clockOut || 'Current'}</p>
                      </div>
                   </div>
                   <span className={`text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${s.status === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>{s.status}</span>
                </div>
              ))}
           </div>
        </div>
      )}

      {showMarineLog && (
        <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-2xl flex items-end justify-center p-5 animate-in slide-in-from-bottom-full duration-500">
           <div className="w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide bg-white dark:bg-slate-900 rounded-[3rem] p-10 relative border border-white/5">
              <button onClick={() => setShowMarineLog(false)} className="absolute top-10 right-10 p-2 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform"><X size={24}/></button>
              <CaptainLog 
                tripId={activeJobId || '0000'} 
                vesselRate={50000} 
                onComplete={() => { handleFinishJob(activeJobId!, 50000); setShowMarineLog(false); }} 
              />
           </div>
        </div>
      )}
    </div>
  );
};
