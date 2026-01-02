
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ClipboardList, CheckCircle, Clock, MapPin, User,
  Smartphone, Zap, ChevronRight, ChevronDown, Play, CheckCircle2,
  AlertCircle, Star, BadgeCheck, Utensils, Anchor,
  Scissors, Music, Shield, RefreshCw, BarChart3,
  Activity, TrendingUp, DollarSign, MessageSquare,
  Phone, UserCheck, Timer, ListChecks, Info, Coffee,
  Power, Package, Settings, BellRing, LogOut, X, Navigation,
  ShieldAlert
} from 'lucide-react';
import { CaptainLog } from '../components/CaptainLog';
import { ServiceType } from '../types';
import { useNavigate } from 'react-router-dom';

export const StaffConsole = () => {
  const { bookings, updateBookingStatus, user, addNotification, logout, updateStaff, staff, vessels } = useApp();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('PENDING');
  const [showMarineLog, setShowMarineLog] = useState(false);
  const [activeMarineBookingId, setActiveMarineBookingId] = useState<string | null>(null);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [isDutyActive, setIsDutyActive] = useState(true);

  const staffRole = user?.staffRole || 'KITCHEN';
  const staffProfile = staff.find(s => s.phone === user?.phone);

  const roleConfigs = {
    KITCHEN: { icon: Utensils, label: 'Kitchen', color: 'bg-orange-500', accent: 'text-orange-600', category: 'EATERY', dutyLabel: 'Cooking' },
    SALON: { icon: Scissors, label: 'Salon', color: 'bg-purple-500', accent: 'text-purple-600', category: 'SALON', dutyLabel: 'Styling' },
    MARINE: { icon: Anchor, label: 'Boat Captain', color: 'bg-blue-600', accent: 'text-blue-600', category: 'MARINE', dutyLabel: 'Trip' },
    CLUB: { icon: Music, label: 'Club & Lounge', color: 'bg-sun-500', accent: 'text-sun-600', category: 'CLUB', dutyLabel: 'Hosting' },
    SECURITY: { icon: Shield, label: 'Security', color: 'bg-red-600', accent: 'text-red-600', category: 'SYSTEM', dutyLabel: 'Safety' }
  };

  const currentRole = roleConfigs[staffRole];

  // Critical alerts for Marine vessels needing maintenance
  const maintenanceAlerts = useMemo(() => {
    return vessels.filter(v => v.status === 'MAINTENANCE');
  }, [vessels]);

  const myTasks = useMemo(() => {
    return bookings.filter(b => {
      const matchesStatus = b.status === activeFilter;
      if (staffRole === 'SALON') return matchesStatus && (b.category.includes('SALON'));
      if (staffRole === 'MARINE') return matchesStatus && b.category === 'MARINE';
      if (staffRole === 'KITCHEN') return matchesStatus && b.category === 'EATERY';
      if (staffRole === 'CLUB') return matchesStatus && b.category === 'CLUB';
      return matchesStatus;
    });
  }, [bookings, activeFilter, staffRole]);

  const handleFinishJob = (taskId: string, price: number = 0) => {
    updateBookingStatus(taskId, 'COMPLETED');
    if (staffProfile) {
      updateStaff(staffProfile.id, {
        completedTasks: staffProfile.completedTasks + 1,
        earnings: staffProfile.earnings + price
      });
    }
    addNotification({ title: 'Task Completed', message: `Task #${taskId} has been completed and saved.`, type: 'SUCCESS' });
  };

  const startMarineExpedition = (bookingId: string) => {
    setActiveMarineBookingId(bookingId);
    setShowMarineLog(true);
  };

  return (
    <div className="space-y-8 pb-32 animate-in fade-in duration-700">
      {/* STAFF IDENTITY HEADER */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">{currentRole.label}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isDutyActive ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`} />
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Operator: {user?.name}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsDutyActive(!isDutyActive)}
          className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all active:scale-90 ${isDutyActive ? currentRole.color : 'bg-slate-200 dark:bg-slate-800 text-slate-400'} ring-8 ring-white dark:ring-slate-900`}
        >
          {isDutyActive ? <currentRole.icon size={32} className="text-white" /> : <Power size={32} />}
        </button>
      </div>

      {/* MAINTENANCE ALERTS WIDGET (Surfaced for Marine Staff) */}
      {staffRole === 'MARINE' && maintenanceAlerts.length > 0 && (
        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 px-1">
            <ShieldAlert size={18} className="text-red-500 animate-pulse" />
            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Vessel Maintenance Alerts</h3>
          </div>
          <div className="space-y-3">
            {maintenanceAlerts.map(vessel => (
              <div key={vessel.id} className="bg-red-50 dark:bg-red-950/20 border-2 border-red-100 dark:border-red-900/30 p-5 rounded-[2.5rem] flex items-center gap-4 shadow-sm animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white shadow-lg">
                  <Anchor size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-black dark:text-white uppercase leading-none">{vessel.name}</h4>
                  <p className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mt-1.5">Urgent Maintenance Required</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-red-500 border border-red-100 dark:border-red-900/30">
                  <RefreshCw size={14} className="animate-spin-slow" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PERFORMANCE METRICS PREVIEW */}
      {staffProfile && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-1.5">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">My Completed Tasks</span>
            <p className="text-2xl font-black dark:text-white">{staffProfile.completedTasks}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-1.5">
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Revenue Generated</span>
            <p className="text-2xl font-black text-green-600">₦{staffProfile.earnings.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* FILTER TABS */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-2 rounded-[2rem] shadow-inner">
        {['PENDING', 'IN_PROGRESS', 'COMPLETED'].map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f as any)}
            className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xl' : 'text-slate-400'}`}
          >
            {f === 'PENDING' ? 'Pending' : f === 'IN_PROGRESS' ? 'In Progress' : 'Completed'}
          </button>
        ))}
      </div>

      {/* MANIFEST LIST */}
      <div id="task-manifest" className="space-y-5">
        {myTasks.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <Activity size={48} className="mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">No tasks assigned</p>
          </div>
        )}
        {myTasks.map(task => (
          <div key={task.id} className={`bg-white dark:bg-slate-900 rounded-[3rem] border-2 shadow-sm overflow-hidden ${expandedJobId === task.id ? 'border-blue-500' : 'border-slate-50 dark:border-slate-800'}`}>
            <div className="p-7 space-y-5">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">BOOKING #{task.id}</span>
                  <h4 className="text-xl font-black dark:text-white tracking-tighter uppercase leading-none">{task.serviceName}</h4>
                </div>
                <div className={`p-3 rounded-2xl ${currentRole.color} text-white shadow-lg`}><Clock size={20} /></div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-50 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner"><User size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Customer</span>
                    <span className="text-xs font-black dark:text-white truncate">Node_{task.id.slice(-4)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-inner"><MapPin size={20} /></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Location</span>
                    <span className="text-xs font-black dark:text-white truncate">{task.location || 'Hub Main'}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {task.status === 'PENDING' && (
                  <button
                    onClick={() => {
                      updateBookingStatus(task.id, 'IN_PROGRESS');
                      if (staffRole === 'MARINE') startMarineExpedition(task.id);
                    }}
                    className="flex-1 bg-blue-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl active:scale-95"
                  >
                    {staffRole === 'MARINE' ? <><Navigation size={20} /> Start Trip</> : <><Play size={20} /> Start Task</>}
                  </button>
                )}
                {task.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => {
                      if (staffRole === 'MARINE') startMarineExpedition(task.id);
                      else handleFinishJob(task.id, task.price);
                    }}
                    className="flex-1 bg-green-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl active:scale-95"
                  >
                    {staffRole === 'MARINE' ? <><Anchor size={20} /> Update Trip Details</> : <><CheckCircle2 size={20} /> Mark Completed</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MARINE EXPEDITION LOG OVERLAY */}
      {showMarineLog && (
        <div className="fixed inset-0 z-[600] bg-black/90 backdrop-blur-2xl flex items-end justify-center p-5 animate-in fade-in">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] relative">
              <button onClick={() => setShowMarineLog(false)} className="absolute top-8 right-8 z-10 p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 shadow-sm"><X size={24} /></button>
              <div className="p-8 pt-12">
                <CaptainLog
                  tripId={activeMarineBookingId || '0000'}
                  vesselRate={50000}
                  onComplete={() => {
                    handleFinishJob(activeMarineBookingId!, 50000);
                    setShowMarineLog(false);
                    setActiveMarineBookingId(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}} />
    </div>
  );
};
