
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus, Trash2, Edit3, X, Search, Utensils, Scissors, Anchor, Music,
  Star, ArrowLeft, Save, LayoutDashboard, Users, Ship,
  ShieldCheck, BarChart3, Settings2, Package, LogOut, Coins,
  Thermometer, HelpCircle, UserPlus, RefreshCcw, Zap, Globe,
  Smartphone, ShieldAlert, History, BookOpen, Building2, Briefcase, Award,
  Clock, DollarSign, ListChecks, CheckCircle, Wallet, Image as ImageIcon,
  ChevronRight, Ticket, ToggleLeft, ToggleRight, Tag, UserCog, UserMinus,
  MessageSquare, FastForward, Palette, Type, ImageOff, Camera, Filter, ArrowUpDown, UserCheck, UserX,
  SlidersHorizontal, Upload, Sparkles, TrendingUp, Loader2, Calendar as CalendarIcon,
  Megaphone, TextCursorInput, Monitor, Eye, Activity, Info, ArrowUpRight, ArrowDownRight,
  Target, ZapOff, Layers, MousePointer2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product, ServiceItem, ServiceType, Staff, Vessel, User, Voucher, Transaction, ClubEvent } from '../types';
import { MANAGEMENT_KPIS } from '../constants';

export const Admin = () => {
  const navigate = useNavigate();
  const {
    products, addProduct, updateProduct, deleteProduct,
    staff, setStaff, addStaff, updateStaff, deleteStaff,
    vessels, setVessels, updateVesselStatus, updateVesselDetails, deleteVessel,
    user, logout, rewardPercentage, updateRewardPercentage,
    sailingTempLimit, updateSailingTempLimit,
    tickerConfig, updateTickerConfig, transactions, addTransaction,
    customers, bookings, services, businessSettings, updateBusinessSettings,
    balance, vouchers, addVoucher, removeVoucher, getTierProgress, addNotification,
    events, addEvent, updateEvent, deleteEvent, deleteUserRecord, updateUserRecord,
    protocol, updateProtocol, addCustomer, updateVoucher
  } = useApp();

  const [activeTab, setActiveTab] = useState<'SETUP' | 'MARKET' | 'FLEET' | 'EVENTS' | 'MEMBERS' | 'WORKERS' | 'ITEMS' | 'VOUCHERS' | 'PROTOCOL'>('SETUP');

  // Staging States for Settings that require a deliberate "Deploy" (Sync)
  const [pendingBizSettings, setPendingBizSettings] = useState(businessSettings);
  const [pendingTicker, setPendingTicker] = useState(tickerConfig);
  const [isSyncing, setIsSyncing] = useState(false);
  const [tickerInput, setTickerInput] = useState("");

  // Visual feedback for real-time adjustments
  const [isUpdatingLive, setIsUpdatingLive] = useState<'REWARD' | 'THERMAL' | null>(null);

  // Sync staging state with context when values change externally
  useEffect(() => {
    setPendingBizSettings(businessSettings);
    setPendingTicker(tickerConfig);
  }, [businessSettings, tickerConfig]);

  // Modals / Overlays
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ClubEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingVessel, setEditingVessel] = useState<Vessel | null>(null);
  const [isAddingVoucher, setIsAddingVoucher] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [searchMember, setSearchMember] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [searchEvent, setSearchEvent] = useState("");
  const [searchVessel, setSearchVessel] = useState("");
  const [searchVoucher, setSearchVoucher] = useState("");
  const [editingProtocolUnit, setEditingProtocolUnit] = useState<string | null>(null);
  const [localKpis, setLocalKpis] = useState(protocol);
  const [newVoucher, setNewVoucher] = useState<Partial<Voucher>>({
    code: '',
    discount: 0,
    type: 'PERCENT',
    isActive: true,
    minPurchase: 0
  });

  const [newMember, setNewMember] = useState<Partial<User>>({
    name: '',
    phone: '',
    walletBalance: 0,
    loyaltyPoints: 0,
    tier: 'RISING_SUN',
    status: 'ACTIVE'
  });

  const [topUpAmount, setTopUpAmount] = useState('');
  const [isTopUpMode, setIsTopUpMode] = useState(false);

  // File Input Refs
  const productFileRef = useRef<HTMLInputElement>(null);
  const staffFileRef = useRef<HTMLInputElement>(null);
  const eventFileRef = useRef<HTMLInputElement>(null);
  const vesselFileRef = useRef<HTMLInputElement>(null);

  // Staff Filtering/Sorting State
  const [staffSearch, setStaffSearch] = useState("");
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>("ALL");
  const [staffSortKey, setStaffSortKey] = useState<"name" | "role" | "status">("name");
  const [staffSortOrder, setStaffSortOrder] = useState<"asc" | "desc">("asc");

  const hasRulesChanged = JSON.stringify(pendingBizSettings) !== JSON.stringify(businessSettings);
  const hasTickerChanged = JSON.stringify(pendingTicker) !== JSON.stringify(tickerConfig);
  const isDirty = hasRulesChanged || hasTickerChanged;

  // ANALYTICS CALCULATIONS
  const stats = useMemo(() => {
    const totalFlow = transactions.reduce((acc, tx) => acc + (tx.amount > 0 ? tx.amount : 0), 0);
    const totalSpent = Math.abs(transactions.reduce((acc, tx) => acc + (tx.amount < 0 ? tx.amount : 0), 0));
    const hubLiquidity = customers.reduce((acc, c) => acc + (c.walletBalance || 0), 0);
    const completionRate = bookings.length > 0
      ? (bookings.filter(b => b.status === 'COMPLETED').length / bookings.length) * 100
      : 0;

    const categoryPerformance = {
      EATERY: Math.abs(transactions.filter(t => t.type === 'EATERY').reduce((a, b) => a + b.amount, 0)),
      SALON: Math.abs(transactions.filter(t => t.type === 'SALON').reduce((a, b) => a + b.amount, 0)),
      MARINE: Math.abs(transactions.filter(t => t.type === 'MARINE').reduce((a, b) => a + b.amount, 0)),
      CLUB: Math.abs(transactions.filter(t => t.type === 'CLUB').reduce((a, b) => a + b.amount, 0)),
    };

    const maxCategory = Math.max(...Object.values(categoryPerformance));

    return {
      totalFlow,
      totalSpent,
      hubLiquidity,
      completionRate,
      categoryPerformance,
      maxCategory
    };
  }, [transactions, customers, bookings]);

  const filteredStaff = useMemo(() => {
    let result = staff.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(staffSearch.toLowerCase()) || s.phone.includes(staffSearch);
      const matchesRole = staffRoleFilter === "ALL" || s.role === staffRoleFilter;
      return matchesSearch && matchesRole;
    });

    result.sort((a, b) => {
      let comparison = 0;
      if (staffSortKey === "name") comparison = a.name.localeCompare(b.name);
      else if (staffSortKey === "role") comparison = a.role.localeCompare(b.role);
      else if (staffSortKey === "status") comparison = a.status.localeCompare(b.status);

      return staffSortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [staff, staffSearch, staffRoleFilter, staffSortKey, staffSortOrder]);

  const filteredEvents = useMemo(() => {
    return events.filter(event =>
      event.title.toLowerCase().includes(searchEvent.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchEvent.toLowerCase()))
    );
  }, [events, searchEvent]);

  const handleGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      updateBusinessSettings(pendingBizSettings);
      updateTickerConfig(pendingTicker);
      setIsSyncing(false);
      addNotification({
        title: "Hub Synchronized",
        message: "Operational rules and broadcast ticker updated successfully.",
        type: "SUCCESS"
      });
    }, 1200);
  };

  const handleLiveLimitUpdate = (type: 'REWARD' | 'THERMAL', value: number) => {
    setIsUpdatingLive(type);
    if (type === 'REWARD') {
      updateRewardPercentage(value);
    } else {
      updateSailingTempLimit(value);
    }
    setTimeout(() => setIsUpdatingLive(null), 800);
  };

  const handleFileRead = (e: React.ChangeEvent<HTMLInputElement>, type: 'PRODUCT' | 'STAFF' | 'EVENT' | 'VESSEL') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (type === 'PRODUCT') {
          setEditingItem(prev => prev ? { ...prev, image: base64 } : { id: '', name: '', price: 0, category: 'Lounge Menu', description: '', image: base64 } as Product);
        } else if (type === 'STAFF') {
          setEditingStaff(prev => prev ? { ...prev, imageUrl: base64 } : { id: '', name: '', phone: '', role: 'KITCHEN', rating: 5.0, status: 'ACTIVE', completedTasks: 0, earnings: 0, imageUrl: base64 } as Staff);
        } else if (type === 'EVENT') {
          setEditingEvent(prev => prev ? { ...prev, image: base64 } : { id: '', title: '', date: '', price: '', capacity: 50, image: base64 } as ClubEvent);
        } else if (type === 'VESSEL') {
          setEditingVessel(prev => prev ? { ...prev, imageUrl: base64 } : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      image: editingItem?.image || (formData.get('image') as string),
      isAvailable: true
    };

    if (editingItem?.id) {
      updateProduct(editingItem.id, data);
    } else {
      addProduct({ id: Math.random().toString(36).substr(2, 9), ...data });
    }
    setEditingItem(null);
    setIsAddingItem(false);
  };

  const handleSaveVesselDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVessel) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const details: Partial<Vessel> = {
      name: formData.get('vesselName') as string,
      type: formData.get('vesselType') as Vessel['type'],
      capacity: parseInt(formData.get('vesselCapacity') as string),
      hourlyRate: parseFloat(formData.get('vesselRate') as string),
      imageUrl: editingVessel.imageUrl
    };

    updateVesselDetails(editingVessel.id, details);
    setEditingVessel(null);

    addNotification({
      title: "Fleet Synchronized",
      message: `Vessel "${details.name}" registry has been updated.`,
      type: "SUCCESS"
    });
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const staffData = {
      name: formData.get('staffName') as string,
      phone: formData.get('staffPhone') as string,
      role: formData.get('staffRole') as Staff['role'],
      status: formData.get('staffStatus') as Staff['status'],
      imageUrl: editingStaff?.imageUrl
    };

    if (editingStaff && editingStaff.id) {
      updateStaff(editingStaff.id, staffData);
      addNotification({
        title: "Staff Updated",
        message: `${staffData.name}'s profile has been updated.`,
        type: "SUCCESS"
      });
    } else {
      addStaff({
        id: Math.random().toString(36).substr(2, 9),
        rating: 5.0,
        completedTasks: 0,
        earnings: 0,
        ...staffData
      } as Staff);
      addNotification({
        title: "Staff Enrolled",
        message: `${staffData.name} has been added to the manifest.`,
        type: "SUCCESS"
      });
    }
    setEditingStaff(null);
    setIsAddingStaff(false);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const eventData = {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      price: formData.get('price') as string,
      capacity: parseInt(formData.get('capacity') as string),
      description: formData.get('description') as string,
      image: editingEvent?.image || ''
    };

    if (editingEvent && editingEvent.id) {
      updateEvent(editingEvent.id, eventData);
      addNotification({
        title: "Event Updated",
        message: `"${eventData.title}" has been updated.`,
        type: "SUCCESS"
      });
    } else {
      addEvent({
        id: Math.random().toString(36).substr(2, 9),
        ...eventData
      } as ClubEvent);
      addNotification({
        title: "Event Scheduled",
        message: `"${eventData.title}" has been added to the calendar.`,
        type: "SUCCESS"
      });
    }
    setEditingEvent(null);
    setIsAddingEvent(false);
  };

  const handleSaveVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVoucher.code && newVoucher.discount) {
      if (editingVoucher) {
        updateVoucher(editingVoucher.code, newVoucher as Voucher);
        addNotification({
          title: "Voucher Updated",
          message: `Code ${newVoucher.code} has been updated.`,
          type: "SUCCESS"
        });
      } else {
        addVoucher(newVoucher as Voucher);
        addNotification({
          title: "Voucher Authorized",
          message: `Code ${newVoucher.code} is now active in the hub.`,
          type: "SUCCESS"
        });
      }
      setIsAddingVoucher(false);
      setEditingVoucher(null);
      setNewVoucher({ code: '', discount: 0, type: 'PERCENT', isActive: true, minPurchase: 0 });
    }
  };

  const handleEnrollMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMember.name && newMember.phone) {
      addCustomer(newMember as User);
      addNotification({
        title: "Member Enrolled",
        message: `${newMember.name} has been added to the master registry.`,
        type: "SUCCESS"
      });
      setIsAddingMember(false);
      setNewMember({ name: '', phone: '', walletBalance: 0, loyaltyPoints: 0, tier: 'RISING_SUN', status: 'ACTIVE' });
    }
  };

  const handleSaveProtocol = (unit: string) => {
    updateProtocol(localKpis);
    addNotification({
      title: "Protocol Synchronized",
      message: `${unit} unit operational guidelines updated.`,
      type: "SUCCESS"
    });
    setEditingProtocolUnit(null);
  };

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !topUpAmount) return;

    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) return;

    updateUserRecord(selectedCustomer.phone, {
      walletBalance: (selectedCustomer.walletBalance || 0) + amount
    });

    addTransaction({
      title: 'Manual Admin Top-up',
      amount: amount,
      type: 'DEPOSIT',
      status: 'SUCCESS',
      customerPhone: selectedCustomer.phone,
      channel: 'Admin Console'
    });

    addNotification({
      title: "Wallet Funded",
      message: `Successfully added ₦${amount.toLocaleString()} to ${selectedCustomer.name}'s wallet.`,
      type: "SUCCESS"
    });

    // Update local state to reflect change immediately in the modal
    setSelectedCustomer(prev => prev ? ({ ...prev, walletBalance: (prev.walletBalance || 0) + amount }) : null);

    setTopUpAmount('');
    setIsTopUpMode(false);
  };

  const navItems = [
    { id: 'SETUP', label: 'Setup', icon: Settings2 },
    { id: 'MARKET', label: 'Analytics', icon: BarChart3 },
    { id: 'FLEET', label: 'Boats', icon: Ship },
    { id: 'EVENTS', label: 'Events', icon: CalendarIcon },
    { id: 'MEMBERS', label: 'Members', icon: Users },
    { id: 'WORKERS', label: 'Workers', icon: UserCog },
    { id: 'ITEMS', label: 'Menu List', icon: Package },
    { id: 'VOUCHERS', label: 'Vouchers', icon: Ticket },
    { id: 'PROTOCOL', label: 'Guidelines', icon: BookOpen }
  ];

  const SyncButton = () => (
    <button
      onClick={handleGlobalSync}
      disabled={!isDirty || isSyncing}
      className={`w-full py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 border-b-4 ${isDirty ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white border-slate-700 dark:border-slate-300' : 'bg-slate-50 text-slate-300 border-transparent grayscale'}`}
    >
      {isSyncing ? (
        <><Loader2 size={18} className="animate-spin" /> Updating App...</>
      ) : (
        <><Save size={18} /> Update App Changes</>
      )}
    </button>
  );

  const previewSpeedDuration = {
    SLOW: '45s',
    STEADY: '30s',
    QUICK: '20s',
    URGENT: '10s'
  }[pendingTicker.speed];

  const previewSizeClasses = {
    SMALL: 'text-[11px]',
    MEDIUM: 'text-[14px]',
    LARGE: 'text-[18px]',
    XL: 'text-[24px]'
  }[pendingTicker.size];

  return (
    <div className="relative space-y-8 pb-40 animate-in fade-in duration-700 min-h-screen">
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sun-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse decoration-delay-2000" />
        <div className="absolute top-[30%] right-[10%] w-[20%] h-[20%] bg-purple-500/5 blur-[80px] rounded-full" />
      </div>

      <div className="flex items-center justify-between px-1 relative z-10">
        <div className="flex items-center gap-5">
          <button onClick={() => navigate(-1)} className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg border-2 border-slate-50 dark:border-slate-700 active:scale-90 transition-all">
            <ArrowLeft size={28} className="text-slate-900 dark:text-white" />
          </button>
          <div>
            <h2 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-none">Admin</h2>
            <p className="text-[10px] font-black text-sun-600 uppercase tracking-widest mt-2">Operational Command Center</p>
          </div>
        </div>
        <button onClick={logout} className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-red-500 border border-slate-100 dark:border-slate-800 shadow-sm active:scale-90 relative">
          <LogOut size={24} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
        </button>
      </div>

      {/* GLOBAL STATUS BAR */}
      <div className="flex items-center gap-4 px-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 bg-slate-900/5 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200/50 dark:border-white/5 whitespace-nowrap">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Main Server: Active</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/5 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200/50 dark:border-white/5 whitespace-nowrap">
          <Activity size={10} className="text-sun-500" />
          <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">App Load: Optimal</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/5 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200/50 dark:border-white/5 whitespace-nowrap">
          <ShieldCheck size={10} className="text-blue-500" />
          <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Encryption: AES-256</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/5 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200/50 dark:border-white/5 whitespace-nowrap">
          <Globe size={10} className="text-purple-500" />
          <span className="text-[8px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Station: Lagos Hub</span>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-xl p-2 rounded-[2.2rem] scrollbar-hide border border-slate-200/50 dark:border-white/5 sticky top-2 z-40 shadow-xl shadow-black/5">
        {navItems.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2.5 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap relative ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 text-sun-600 shadow-xl scale-105 z-10' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
          >
            <tab.icon size={16} className={activeTab === tab.id ? 'animate-bounce' : ''} />
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-sun-500 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* MARKET / ANALYTICS TAB */}
        {activeTab === 'MARKET' && (
          <div className="space-y-8 animate-in zoom-in duration-500">
            {/* Dynamic KPIs Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-1">
              <div className="bg-slate-950 p-6 rounded-[2.5rem] text-white border border-white/10 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-24 h-24 bg-sun-500 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="flex items-center gap-2 text-slate-500 mb-3">
                  <TrendingUp size={14} className="text-sun-500" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Revenue</span>
                </div>
                <p className="text-2xl font-black tracking-tighter">₦{stats.totalFlow.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-[8px] font-black text-green-400 mt-2">
                  <ArrowUpRight size={10} /> +12.4% THIS PERIOD
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden hover:scale-[1.02] transition-transform">
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-[40px]" />
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <Users size={14} className="text-blue-500" /><span className="text-[9px] font-black uppercase tracking-widest">Hub Liquidity</span>
                </div>
                <p className="text-2xl font-black tracking-tighter dark:text-white">₦{stats.hubLiquidity.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 mt-2">
                  <MousePointer2 size={10} /> WALLET BALANCES
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group overflow-hidden hover:scale-[1.02] transition-transform">
                <div className="absolute top-0 right-0 w-20 h-20 bg-sun-500/5 rounded-full blur-[40px]" />
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <Target size={14} className="text-sun-600" /><span className="text-[9px] font-black uppercase tracking-widest">Efficiency Rate</span>
                </div>
                <p className="text-2xl font-black tracking-tighter dark:text-white">{stats.completionRate.toFixed(1)}%</p>
                <div className="flex items-center gap-1 text-[8px] font-black text-sun-600 mt-2 uppercase">
                  ACTIVE BOOKINGS
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-[2.5rem] text-white border border-white/10 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-600 rounded-full blur-[60px] opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="flex items-center gap-2 text-slate-500 mb-3">
                  <Activity size={14} className="text-blue-400" /><span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Vessel Status</span>
                </div>
                <p className="text-2xl font-black tracking-tighter">{vessels.filter(v => v.status === 'IN_USE').length}/{vessels.length}</p>
                <div className="flex items-center gap-1 text-[8px] font-black text-blue-400 mt-2 uppercase">
                  Deployments Live
                </div>
              </div>
            </div>

            {/* Station Yield Performance & Flow Analysis */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black dark:text-white uppercase tracking-tighter flex items-center gap-3">
                  <Activity size={18} className="text-sun-500" /> Revenue Growth Trends
                </h3>
                <div className="flex gap-2">
                  <span className="w-2 h-2 rounded-full bg-sun-500 animate-pulse" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Live Data</span>
                </div>
              </div>

              {/* Chart section remains same structure but with localized labels */}
              <div className="h-48 w-full relative group">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 100">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 25, 50, 75, 100].map(y => (
                    <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="0.5" strokeDasharray="4 4" />
                  ))}
                  <path
                    d="M 0 80 Q 50 20 100 60 T 200 40 T 300 10 T 400 50 L 400 100 L 0 100 Z"
                    fill="url(#chartGradient)"
                    className="transition-all duration-1000"
                  />
                  <path
                    d="M 0 80 Q 50 20 100 60 T 200 40 T 300 10 T 400 50"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_4px_10px_rgba(245,158,11,0.5)]"
                  />
                  {[
                    { x: 0, y: 80 }, { x: 50, y: 35 }, { x: 100, y: 60 },
                    { x: 150, y: 50 }, { x: 200, y: 40 }, { x: 250, y: 25 },
                    { x: 300, y: 10 }, { x: 350, y: 30 }, { x: 400, y: 55 }
                  ].map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" className="fill-white dark:fill-slate-900 stroke-sun-500 stroke-[2.5] hover:r-6 transition-all cursor-pointer" />
                  ))}
                </svg>

                <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1">
                  {['08:00', '11:00', '14:00', '17:00', '20:00', '23:00'].map(t => (
                    <span key={t} className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t}</span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="text-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Peak Performance</p>
                  <p className="text-sm font-black dark:text-white uppercase leading-none">₦{Math.max(...Object.values(stats.categoryPerformance)).toLocaleString()}</p>
                </div>
                <div className="text-center border-x border-slate-50 dark:border-slate-800">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Hourly Average Flow</p>
                  <p className="text-sm font-black dark:text-white uppercase leading-none">₦{(stats.totalFlow / 12).toFixed(0).toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Economic Condition</p>
                  <p className="text-sm font-black text-green-500 uppercase leading-none">Prosperous</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black dark:text-white uppercase tracking-tighter flex items-center gap-3">
                  <Layers size={18} className="text-sun-500" /> Unit Performance Distribution
                </h3>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">LIVE DATA</span>
              </div>

              <div className="space-y-6">
                {(Object.entries(stats.categoryPerformance) as [string, number][]).map(([cat, val]) => (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between items-end px-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cat} CATEGORY</span>
                      <span className="text-xs font-black dark:text-white">₦{val.toLocaleString()}</span>
                    </div>
                    <div className="h-3 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${cat === 'MARINE' ? 'bg-blue-500' : cat === 'EATERY' ? 'bg-sun-500' : cat === 'SALON' ? 'bg-purple-500' : 'bg-red-500'}`}
                        style={{ width: `${(val / (stats.maxCategory || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent High-Value Transactions */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500/5 rounded-full blur-[60px]" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/5 rounded-full blur-[80px]" />
              <div className="flex justify-between items-center px-1 relative z-10">
                <h3 className="text-sm font-black dark:text-white uppercase tracking-tighter flex items-center gap-3">
                  <History size={18} className="text-sun-500" /> Recent High-Value Transactions
                </h3>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">PAST 7 DAYS</span>
              </div>
              <div className="space-y-4">
                {transactions.filter(t => Math.abs(t.amount) > 10000).slice(0, 5).map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {t.amount > 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black dark:text-white uppercase tracking-tight">{t.description}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{t.date}</p>
                      </div>
                    </div>
                    <p className={`text-xs font-black ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {t.amount > 0 ? '+' : '-'}₦{Math.abs(t.amount).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETUP TAB */}
        {activeTab === 'SETUP' && (
          <div className="space-y-10 animate-in zoom-in duration-500">
            {/* Operational Limits - Instant Tuning Mode */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-10 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-16 h-16 bg-slate-950 dark:bg-sun-500 rounded-[1.8rem] flex items-center justify-center text-white dark:text-slate-950 shadow-2xl rotate-3">
                    <Zap size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-none">Command Overrides</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic">Real-time Operational Tuning</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reward Perk (Cashback %)</span>
                      <h4 className="text-3xl font-black text-sun-600 tracking-tighter">{rewardPercentage}% <span className="text-sm text-slate-400 font-bold ml-1 tracking-normal">Gift back</span></h4>
                    </div>
                  </div>
                  <div className="relative pt-2">
                    <input
                      type="range" min="0" max="20" step="1"
                      value={rewardPercentage}
                      onChange={e => handleLiveLimitUpdate('REWARD', parseInt(e.target.value))}
                      className="w-full accent-sun-500 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Boat Engine Heat Limit</span>
                      <h4 className="text-3xl font-black text-red-600 tracking-tighter">{sailingTempLimit}°C <span className="text-sm text-slate-400 font-bold ml-1 tracking-normal">Danger Level</span></h4>
                    </div>
                  </div>
                  <div className="relative pt-2">
                    <input
                      type="range" min="30" max="45" step="1"
                      value={sailingTempLimit}
                      onChange={e => handleLiveLimitUpdate('THERMAL', parseInt(e.target.value))}
                      className="w-full accent-red-500 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Core Business Rules */}
            <div className="bg-slate-100 dark:bg-slate-800/50 p-8 rounded-[3rem] text-slate-900 dark:text-white shadow-xl border border-slate-200 dark:border-white/5 space-y-8 relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-sun-500/10 dark:bg-white/10 rounded-xl flex items-center justify-center border border-sun-500/20 dark:border-white/20 text-sun-600 dark:text-white"><Building2 size={24} /></div>
                <h3 className="text-lg font-black uppercase tracking-tight">Shop & Opening Rules</h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Opening Time</label>
                  <input type="time" value={pendingBizSettings.openingTime} onChange={e => setPendingBizSettings({ ...pendingBizSettings, openingTime: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-sun-500 transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Closing Time</label>
                  <input type="time" value={pendingBizSettings.closingTime} onChange={e => setPendingBizSettings({ ...pendingBizSettings, closingTime: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-sun-500 transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Delivery Fee (₦)</label>
                  <input type="number" value={pendingBizSettings.deliveryFee} onChange={e => setPendingBizSettings({ ...pendingBizSettings, deliveryFee: parseInt(e.target.value) })} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-sun-500 transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Service Charge (₦)</label>
                  <input type="number" value={pendingBizSettings.serviceCharge} onChange={e => setPendingBizSettings({ ...pendingBizSettings, serviceCharge: parseInt(e.target.value) })} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-sun-500 transition-all shadow-sm" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Value Added Tax (%)</label>
                    <input type="number" defaultValue={7.5} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-sun-500 transition-all shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Maintenance Cycle (Days)</label>
                    <input type="number" defaultValue={30} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 rounded-xl text-slate-900 dark:text-white font-bold outline-none focus:border-sun-500 transition-all shadow-sm" />
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-10 h-10 bg-sun-500/10 dark:bg-white/5 rounded-lg flex items-center justify-center border border-sun-500/20 dark:border-white/10 text-sun-600 dark:text-white"><ShieldCheck size={20} /></div>
                  <h4 className="text-xs font-black uppercase tracking-widest">System Security</h4>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Password</label>
                  <input type="password" placeholder="••••" className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-4 rounded-xl text-slate-900 dark:text-white font-bold tracking-widest outline-none focus:border-sun-500 transition-all shadow-sm" />
                </div>
              </div>

              {isDirty && <SyncButton />}
            </div>

            {/* Hub Broadcast Ticker Control */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sun-500 rounded-xl flex items-center justify-center text-slate-950 shadow-lg border border-sun-600"><Megaphone size={24} /></div>
                  <div>
                    <h3 className="text-lg font-black dark:text-white uppercase tracking-tight">Broadcast Control Center</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Ticker Management</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className={`w-3 h-3 rounded-full ${hasTickerChanged ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{hasTickerChanged ? 'Unsaved' : 'Synced'}</span>
                </div>
              </div>

              <div className="space-y-8">
                {/* Full-width Message Field */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <TextCursorInput size={14} className="text-sun-500" /> Ticker Messages (One per line)
                  </label>
                  <textarea
                    rows={6}
                    value={pendingTicker.messages.join('\n')}
                    onChange={e => {
                      const msgs = e.target.value.split('\n');
                      setPendingTicker({ ...pendingTicker, messages: msgs });
                      updateTickerConfig({ messages: msgs });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-8 rounded-[2.5rem] text-sm font-bold dark:text-white outline-none focus:border-sun-500 transition-all shadow-inner resize-none font-mono selection:bg-sun-500 selection:text-white"
                    placeholder="Enter broadcast message..."
                  />
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-end">
                  {/* Scroll Speed Control */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <FastForward size={14} className="text-sun-500" /> Scroll Speed
                    </label>
                    <div className="relative group">
                      <select
                        value={pendingTicker.speed}
                        onChange={e => {
                          const val = e.target.value as any;
                          setPendingTicker({ ...pendingTicker, speed: val });
                          updateTickerConfig({ speed: val });
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-5 rounded-2xl text-[10px] font-black dark:text-white outline-none appearance-none cursor-pointer focus:border-sun-500 transition-all pr-12 shadow-sm"
                      >
                        <option value="SLOW">Slow Pace</option>
                        <option value="STEADY">Normal Glide</option>
                        <option value="QUICK">Fast Stream</option>
                        <option value="URGENT">Urgent Run</option>
                      </select>
                      <ArrowUpDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-sun-500 transition-colors pointer-events-none" />
                    </div>
                  </div>

                  {/* Font Scale Control */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Type size={14} className="text-sun-500" /> Font Scale
                    </label>
                    <div className="relative group">
                      <select
                        value={pendingTicker.size}
                        onChange={e => {
                          const val = e.target.value as any;
                          setPendingTicker({ ...pendingTicker, size: val });
                          updateTickerConfig({ size: val });
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 p-5 rounded-2xl text-[10px] font-black dark:text-white outline-none appearance-none cursor-pointer focus:border-sun-500 transition-all pr-12 shadow-sm"
                      >
                        <option value="SMALL">Small Text</option>
                        <option value="MEDIUM">Regular Size</option>
                        <option value="LARGE">Large Header</option>
                        <option value="XL">Extra Large</option>
                      </select>
                      <Type size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-sun-500 transition-colors pointer-events-none" />
                    </div>
                  </div>

                  {/* Brand Color Theme Control */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <Palette size={14} className="text-sun-500" /> Color Profile
                    </label>
                    <div className="flex gap-2.5 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700">
                      {['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ffffff'].map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            setPendingTicker({ ...pendingTicker, color });
                            updateTickerConfig({ color });
                          }}
                          style={{ backgroundColor: color }}
                          className={`w-10 h-10 rounded-xl transition-all border-2 ${pendingTicker.color === color ? 'border-slate-900 dark:border-white scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Full-width Live Preview */}
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Monitor size={14} className="text-sun-500" /> Live Terminal Preview
                    </label>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Simulated Client Terminal View</span>
                  </div>

                  <div className="bg-slate-950 rounded-[2rem] h-[100px] border border-white/5 shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-3 left-5 flex gap-1.5 z-20">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500/30" />
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500/30" />
                    </div>

                    {/* Moving Scanline Overlay */}
                    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                      <div className="w-full h-[2px] bg-white/20 blur-[1px] absolute animate-scan opacity-30" style={{ backgroundColor: pendingTicker.color }} />
                    </div>

                    <div className="absolute inset-0 flex items-center pointer-events-none">
                      <div
                        className="flex whitespace-nowrap gap-16 items-center"
                        style={{
                          animation: `marquee ${previewSpeedDuration} linear infinite`,
                        }}
                      >
                        {pendingTicker.messages.map((text, i) => (
                          <div key={i} className="flex items-center gap-6">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pendingTicker.color }} />
                            <span
                              className={`${previewSizeClasses} font-black uppercase tracking-[0.25em] italic`}
                              style={{ color: pendingTicker.color }}
                            >
                              {text}
                            </span>
                          </div>
                        ))}
                        {/* Duplicate for seamless looping */}
                        {pendingTicker.messages.map((text, i) => (
                          <div key={`dup-${i}`} className="flex items-center gap-6">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pendingTicker.color }} />
                            <span
                              className={`${previewSizeClasses} font-black uppercase tracking-[0.25em] italic`}
                              style={{ color: pendingTicker.color }}
                            >
                              {text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CRT Screen Effects */}
                    <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_4px,3px_100%]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 z-[5]" />
                  </div>
                </div>
              </div>

              {hasTickerChanged && (
                <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                  <SyncButton />
                </div>
              )}
            </div>
          </div>
        )}

        {/* FLEET TAB */}
        {activeTab === 'FLEET' && (
          <div className="space-y-6 animate-in slide-in-from-left">
            <div className="flex flex-col gap-4 px-1">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Ship size={18} /> Boat Records</h3>
                <button onClick={() => setEditingVessel({ id: '', name: '', type: 'SPEEDBOAT', capacity: 0, imageUrl: '', baseHourlyRate: 0, hourlyRate: 0, status: 'AVAILABLE', reviews: [] })} className="bg-sun-500 text-slate-950 p-4 rounded-2xl shadow-lg active:scale-90"><Plus size={20} /></button>
              </div>

              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchVessel}
                  onChange={e => setSearchVessel(e.target.value)}
                  placeholder="Search vessel name..."
                  className="w-full bg-white dark:bg-slate-900 border-none p-4 pl-12 rounded-2xl text-xs font-bold shadow-sm dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {vessels.filter(v => v.name.toLowerCase().includes(searchVessel.toLowerCase()) || v.type.toLowerCase().includes(searchVessel.toLowerCase())).map(v => (
                <div key={v.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700">
                      {v.imageUrl ? <img src={v.imageUrl} className="w-full h-full object-cover" /> : <Ship size={28} />}
                    </div>
                    <div>
                      <h4 className="text-lg font-black dark:text-white uppercase tracking-tight leading-none mb-2">{v.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${v.status === 'AVAILABLE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{v.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingVessel(v)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-sun-500 transition-all"><Edit3 size={18} /></button>
                    <button onClick={() => { if (confirm(`Purge vessel ${v.name} from fleet manifest?`)) deleteVessel(v.id); }} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {vessels.filter(v => v.name.toLowerCase().includes(searchVessel.toLowerCase()) || v.type.toLowerCase().includes(searchVessel.toLowerCase())).length === 0 && (
                <div className="py-20 text-center">
                  <Ship size={48} className="mx-auto text-slate-200 mb-4 opacity-20" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching vessel assets</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'EVENTS' && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <div className="flex justify-between items-center px-1">
              <div className="relative flex-1 mr-4">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchEvent} onChange={e => setSearchEvent(e.target.value)}
                  placeholder="Search club events..."
                  className="w-full bg-white dark:bg-slate-900 border-none p-5 pl-14 rounded-3xl text-sm font-bold shadow-sm dark:text-white outline-none"
                />
              </div>
              <button onClick={() => setIsAddingEvent(true)} className="bg-sun-500 text-slate-950 p-5 rounded-2xl shadow-xl active:scale-90"><Plus size={24} /></button>
            </div>
            <div className="grid gap-6">
              {filteredEvents.map(event => (
                <div key={event.id} className="bg-white dark:bg-slate-900 p-6 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-6">
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center relative shrink-0">
                    {event.image ? <img src={event.image} alt="" className="w-full h-full object-cover" /> : <Music size={36} className="text-sun-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-black dark:text-white uppercase tracking-tight truncate leading-none">{event.title}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Event Date</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setEditingEvent(event)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-sun-500 transition-all"><Edit3 size={18} /></button>
                    <button onClick={() => { if (confirm('Cancel and purge event?')) deleteEvent(event.id); }} className="p-3 bg-red-50 dark:bg-red-900/10 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'MEMBERS' && (
          <div className="space-y-6 animate-in slide-in-from-left">
            <div className="flex justify-between items-center px-1 gap-4">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchMember} onChange={e => setSearchMember(e.target.value)}
                  placeholder="Search member name..."
                  className="w-full bg-white dark:bg-slate-900 border-none p-5 pl-14 rounded-3xl text-sm font-bold shadow-sm dark:text-white outline-none"
                />
              </div>
              <button onClick={() => setIsAddingMember(true)} className="bg-sun-500 text-slate-950 p-5 rounded-2xl shadow-xl active:scale-90 flex-shrink-0"><UserPlus size={24} /></button>
            </div>
            <div className="grid gap-4">
              {customers.filter(c => c.name.toLowerCase().includes(searchMember.toLowerCase()) || c.phone.includes(searchMember)).map(c => (
                <div key={c.phone} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between group">
                  <div onClick={() => setSelectedCustomer(c)} className="flex items-center gap-5 cursor-pointer flex-1">
                    <div className="w-14 h-14 bg-sun-50 dark:bg-sun-900/20 text-sun-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner uppercase">{c.name.charAt(0)}</div>
                    <div className="text-left">
                      <h4 className="text-lg font-black dark:text-white uppercase tracking-tight leading-none mb-1">{c.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => { if (confirm(`Purge user node ${c.name} from hub records?`)) deleteUserRecord(c.phone, 'CUSTOMER'); }} className="p-4 bg-red-50 text-red-500 rounded-xl active:scale-90 transition-all ml-4">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORKERS TAB */}
        {activeTab === 'WORKERS' && (
          <div className="space-y-6 animate-in slide-in-from-right">
            <div className="flex flex-col gap-4 px-1">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><UserCog size={18} /> Staff List</h3>
                <button onClick={() => setIsAddingStaff(true)} className="bg-sun-500 text-slate-950 p-4 rounded-2xl shadow-lg active:scale-90"><Plus size={20} /></button>
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={staffSearch}
                    onChange={e => setStaffSearch(e.target.value)}
                    placeholder="Search staff..."
                    className="w-full bg-white dark:bg-slate-900 border-none p-4 pl-12 rounded-2xl text-xs font-bold shadow-sm dark:text-white outline-none"
                  />
                </div>
                <select
                  value={staffRoleFilter}
                  onChange={e => setStaffRoleFilter(e.target.value)}
                  className="bg-white dark:bg-slate-900 border-none p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm dark:text-white outline-none"
                >
                  <option value="ALL">ALL ROLES</option>
                  <option value="KITCHEN">KITCHEN</option>
                  <option value="SALON">SALON</option>
                  <option value="MARINE">MARINE</option>
                  <option value="CLUB">CLUB</option>
                  <option value="SECURITY">SECURITY</option>
                  <option value="EXECUTIVE">EXECUTIVE</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredStaff.map(s => (
                <div key={s.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {s.imageUrl ? <img src={s.imageUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400 font-black">{s.name.charAt(0)}</div>}
                    </div>
                    <div>
                      <h4 className="text-base font-black dark:text-white uppercase leading-none">{s.name}</h4>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-[9px] font-black text-sun-600 uppercase tracking-widest">{s.role}</p>
                        <span className={`w-1.5 h-1.5 rounded-full ${s.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingStaff(s)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-sun-500 transition-all"><Edit3 size={18} /></button>
                    <button onClick={() => { if (confirm(`Offboard and purge staff member ${s.name}?`)) deleteStaff(s.id); }} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
              {filteredStaff.length === 0 && (
                <div className="py-20 text-center">
                  <UserMinus size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No staff matching criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ITEMS TAB */}
        {activeTab === 'ITEMS' && (
          <div className="space-y-6 animate-in slide-in-from-bottom">
            <div className="flex flex-col gap-4 px-1">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Package size={18} /> Food & Service Menu</h3>
                <button onClick={() => setIsAddingItem(true)} className="bg-sun-500 text-slate-950 p-4 rounded-2xl shadow-lg active:scale-90"><Plus size={20} /></button>
              </div>

              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchProduct}
                  onChange={e => setSearchProduct(e.target.value)}
                  placeholder="Filter catalog assets..."
                  className="w-full bg-white dark:bg-slate-900 border-none p-4 pl-12 rounded-2xl text-xs font-bold shadow-sm dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()) || p.category.toLowerCase().includes(searchProduct.toLowerCase())).map(p => (
                <div key={p.id} className="bg-white dark:bg-slate-900 p-5 rounded-[2.2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <Package size={24} className="text-slate-300" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-black dark:text-white uppercase truncate max-w-[120px]">{p.name}</h4>
                      <p className="text-[10px] font-black text-sun-600 mt-1">₦{p.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem(p)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-sun-500 transition-all"><Edit3 size={16} /></button>
                    <button onClick={() => { if (confirm(`Purge item ${p.name} from catalog?`)) deleteProduct(p.id); }} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {products.filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()) || p.category.toLowerCase().includes(searchProduct.toLowerCase())).length === 0 && (
                <div className="py-20 text-center">
                  <ImageOff size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching catalog items</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VOUCHERS TAB */}
        {activeTab === 'VOUCHERS' && (
          <div className="space-y-6 animate-in zoom-in duration-300">
            <div className="flex flex-col gap-4 px-1">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Ticket size={18} /> Active Vouchers</h3>
                <button onClick={() => setIsAddingVoucher(true)} className="bg-sun-500 text-slate-950 p-4 rounded-2xl shadow-lg active:scale-90"><Plus size={20} /></button>
              </div>

              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchVoucher}
                  onChange={e => setSearchVoucher(e.target.value)}
                  placeholder="Search discount manifesto..."
                  className="w-full bg-white dark:bg-slate-900 border-none p-4 pl-12 rounded-2xl text-xs font-bold shadow-sm dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {vouchers.filter(v => v.code.toLowerCase().includes(searchVoucher.toLowerCase())).map(v => (
                <div key={v.code} className="bg-slate-950 text-white p-6 rounded-[2.5rem] border border-white/10 flex items-center justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sun-500/10 rounded-full blur-3xl" />
                  <div>
                    <h4 className="text-lg font-black tracking-tighter uppercase mb-1">{v.code}</h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black text-sun-500 uppercase tracking-widest">{v.discount}{v.type === 'PERCENT' ? '%' : '₦'} OFF</span>
                      <div className={`w-2 h-2 rounded-full ${v.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingVoucher(v); setNewVoucher(v); setIsAddingVoucher(true); }} className="p-4 bg-white/5 text-slate-400 rounded-xl hover:text-sun-500 transition-all">
                      <Edit3 size={20} />
                    </button>
                    <button onClick={() => { if (confirm(`Revoke and purge voucher code ${v.code}?`)) removeVoucher(v.code); }} className="p-4 bg-white/5 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {vouchers.filter(v => v.code.toLowerCase().includes(searchVoucher.toLowerCase())).length === 0 && (
                <div className="py-20 text-center">
                  <Ticket size={48} className="mx-auto text-slate-200 mb-4 opacity-20" />
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching vouchers</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROTOCOL TAB */}
        {activeTab === 'PROTOCOL' && (
          <div className="space-y-8 animate-in slide-in-from-top">
            {Object.entries(localKpis).map(([key, data]) => (
              <div key={key} className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 relative group">
                <div className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center"><Briefcase size={24} /></div>
                    <div>
                      <h4 className="text-lg font-black dark:text-white uppercase tracking-tight">{key} UNIT GUIDELINES</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead: {data.manager}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingProtocolUnit(editingProtocolUnit === key ? null : key)}
                    className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-sun-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    {editingProtocolUnit === key ? <CheckCircle size={18} className="text-green-500" /> : <Edit3 size={18} />}
                  </button>
                </div>
                <div className="space-y-4">
                  {data.points.map((p, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-slate-400">{i + 1}</div>
                      {editingProtocolUnit === key ? (
                        <input
                          value={p}
                          onChange={(e) => {
                            const newKpis = { ...localKpis };
                            newKpis[key as keyof typeof localKpis].points[i] = e.target.value;
                            setLocalKpis(newKpis);
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl text-xs font-black dark:text-white outline-none border-none shadow-inner"
                        />
                      ) : (
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-tight italic group-hover:text-slate-900 dark:group-hover:text-white transition-colors">"{p}"</p>
                      )}
                    </div>
                  ))}
                  {editingProtocolUnit === key && (
                    <button
                      onClick={() => handleSaveProtocol(key)}
                      className="w-full mt-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                    >
                      Synchronize guidelines
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL: Vessel Detail Sync */}
      {
        editingVessel && (
          <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in p-5">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 relative border border-white/5 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <button onClick={() => setEditingVessel(null)} className="absolute top-8 right-8 z-[600] p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 shadow-sm"><X size={24} /></button>
              <div className="space-y-8">
                <div className="flex items-center gap-4 pr-16">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0"><Ship size={28} /></div>
                  <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-tight">Update Boat Details</h3>
                </div>
                <div className="relative group w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-sun-500/50">
                  <input type="file" ref={vesselFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileRead(e, 'VESSEL')} />
                  {editingVessel.imageUrl ? (
                    <>
                      <img src={editingVessel.imageUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity">
                        <button type="button" onClick={() => vesselFileRef.current?.click()} className="bg-sun-500 text-slate-950 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl"><Upload size={14} /> Change Visual</button>
                        <button type="button" onClick={() => setEditingVessel({ ...editingVessel, imageUrl: '' })} className="bg-red-500 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl"><Trash2 size={14} /> Remove visual</button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto text-slate-300"><ImageIcon size={36} /></div>
                      <button type="button" onClick={() => vesselFileRef.current?.click()} className="text-[10px] font-black text-sun-600 uppercase tracking-widest hover:underline">Link visual Asset</button>
                    </div>
                  )}
                </div>
                <form onSubmit={handleSaveVesselDetails} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vessel Name</label>
                    <input name="vesselName" defaultValue={editingVessel.name} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Boat Type</label>
                      <select name="vesselType" defaultValue={editingVessel.type} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-xs border-none outline-none shadow-inner">
                        <option value="SPEEDBOAT">SPEEDBOAT</option>
                        <option value="YACHT">YACHT</option>
                        <option value="JETSKI">JETSKI</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Number of Seats</label>
                      <input name="vesselCapacity" type="number" defaultValue={editingVessel.capacity} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rental Price (₦/hr)</label>
                    <input name="vesselRate" type="number" defaultValue={editingVessel.hourlyRate} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-xl border-b-4 border-blue-800">Update Boat</button>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* MODAL: Customer Detailed Registry */}
      {
        selectedCustomer && (
          <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-xl flex items-end justify-center animate-in fade-in p-5">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[4rem] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 max-h-[90vh] overflow-y-auto scrollbar-hide border border-white/5 relative">
              <button onClick={() => setSelectedCustomer(null)} className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform shadow-sm"><X size={28} /></button>
              <div className="space-y-8 pt-5">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="w-24 h-24 bg-sun-500 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-xl ring-8 ring-sun-500/10 transition-transform hover:scale-105 duration-300">{selectedCustomer.name.charAt(0)}</div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-xl border-4 border-white dark:border-slate-900 shadow-lg"><ShieldCheck size={18} /></div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black dark:text-white uppercase tracking-tighter leading-none">{selectedCustomer.name}</h3>
                    <div className="flex items-center justify-center gap-3 mt-3">
                      <span className="text-[10px] font-black text-sun-600 uppercase tracking-widest bg-sun-50 dark:bg-sun-900/20 px-3 py-1 rounded-full">Active Hub Member</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedCustomer.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-7 rounded-[2.5rem] space-y-2 border border-slate-100 dark:border-slate-700 shadow-inner">
                    <div className="flex items-center gap-2 text-slate-400"><Wallet size={14} /><span className="text-[9px] font-black uppercase tracking-widest">Wallet Balance</span></div>
                    <p className="text-2xl font-black dark:text-white">₦{(selectedCustomer.walletBalance || 0).toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-7 rounded-[2.5rem] space-y-2 border border-slate-100 dark:border-slate-700 shadow-inner">
                    <div className="flex items-center gap-2 text-sun-600"><Sparkles size={14} /><span className="text-[9px] font-black uppercase tracking-widest">SunRewards</span></div>
                    <p className="text-2xl font-black text-sun-600">{(selectedCustomer.loyaltyPoints || 0).toLocaleString()}</p>
                  </div>
                </div>
                {isTopUpMode ? (
                  <form onSubmit={handleTopUp} className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Top-up Amount (₦)</label>
                      <input
                        type="number"
                        autoFocus
                        value={topUpAmount}
                        onChange={e => setTopUpAmount(e.target.value)}
                        className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-black text-xl outline-none border-none shadow-inner"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" className="flex-1 bg-green-500 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Confirm Fund</button>
                      <button type="button" onClick={() => setIsTopUpMode(false)} className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-400 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="pt-4 flex gap-3">
                    <button onClick={() => setIsTopUpMode(true)} className="flex-1 bg-sun-500 text-slate-950 py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"><Plus size={18} /> Manual Top-up</button>
                    <button onClick={() => setSelectedCustomer(null)} className="flex-1 bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Close Profile</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }
      {/* MODAL: Staff Manifest Edit/Add */}
      {
        (editingStaff || isAddingStaff) && (
          <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in p-5">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 relative border border-white/5 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <button
                onClick={() => {
                  setEditingStaff(null);
                  setIsAddingStaff(false);
                }}
                className="absolute top-8 right-8 z-[600] p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 shadow-sm"
              >
                <X size={24} />
              </button>
              <div className="space-y-8">
                <div className="flex items-center gap-4 pr-16">
                  <div className="w-14 h-14 bg-sun-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shrink-0">
                    <UserPlus size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-tight">
                      {editingStaff?.id ? 'Edit Staff Member' : 'Enroll New Staff'}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Staff Member Profile</p>
                  </div>
                </div>

                <div className="relative group w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-sun-500/50">
                  <input type="file" ref={staffFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileRead(e, 'STAFF')} />
                  {editingStaff?.imageUrl ? (
                    <>
                      <img src={editingStaff.imageUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity">
                        <button type="button" onClick={() => staffFileRef.current?.click()} className="bg-sun-500 text-slate-950 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl"><Upload size={14} /> Change Photo</button>
                        <button type="button" onClick={() => setEditingStaff(prev => prev ? { ...prev, imageUrl: '' } : null)} className="bg-red-500 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl"><Trash2 size={14} /> Remove photo</button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto text-slate-300"><ImageIcon size={36} /></div>
                      <button type="button" onClick={() => staffFileRef.current?.click()} className="text-[10px] font-black text-sun-600 uppercase tracking-widest hover:underline">Upload Staff Photo</button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSaveStaff} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input name="staffName" defaultValue={editingStaff?.name} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" placeholder="Enter staff name..." />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                    <input name="staffPhone" defaultValue={editingStaff?.phone} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" placeholder="080..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                      <select name="staffRole" defaultValue={editingStaff?.role || 'KITCHEN'} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-xs border-none outline-none shadow-inner">
                        <option value="KITCHEN">KITCHEN</option>
                        <option value="SALON">SALON</option>
                        <option value="MARINE">MARINE</option>
                        <option value="CLUB">CLUB</option>
                        <option value="SECURITY">SECURITY</option>
                        <option value="FINANCE_MGMT">FINANCE MGMT</option>
                        <option value="ADMIN_MGMT">ADMIN MGMT</option>
                        <option value="OPERATIONS_MGMT">OPERATIONS MGMT</option>
                        <option value="EXECUTIVE">EXECUTIVE</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Status</label>
                      <select name="staffStatus" defaultValue={editingStaff?.status || 'ACTIVE'} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-xs border-none outline-none shadow-inner">
                        <option value="ACTIVE">ACTIVE (AT WORK)</option>
                        <option value="OFFBOARDED">RESIGNED/INACTIVE</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-xl border-b-4 border-slate-700 dark:border-slate-300">
                    {editingStaff?.id ? 'Update Staff Member' : 'Add to Staff List'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* MODAL: Catalog Item Edit/Add */}
      {
        (editingItem || isAddingItem) && (
          <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in p-5">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 relative border border-white/5 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <button
                onClick={() => {
                  setEditingItem(null);
                  setIsAddingItem(false);
                }}
                className="absolute top-8 right-8 z-[600] p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 shadow-sm"
              >
                <X size={24} />
              </button>
              <div className="space-y-8">
                <div className="flex items-center gap-4 pr-16">
                  <div className="w-14 h-14 bg-sun-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shrink-0">
                    <Package size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-tight">
                      {editingItem?.id ? 'Edit Catalog Item' : 'New Catalog Item'}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Store Item Info</p>
                  </div>
                </div>

                <div className="relative group w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-sun-500/50">
                  <input type="file" ref={productFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileRead(e, 'PRODUCT')} />
                  {editingItem?.image ? (
                    <>
                      <img src={editingItem.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity">
                        <button type="button" onClick={() => productFileRef.current?.click()} className="bg-sun-500 text-slate-950 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl"><Upload size={14} /> Change Image</button>
                        <button type="button" onClick={() => setEditingItem(prev => prev ? { ...prev, image: '' } : null)} className="bg-red-500 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl"><Trash2 size={14} /> Remove image</button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto text-slate-300"><ImageIcon size={36} /></div>
                      <button type="button" onClick={() => productFileRef.current?.click()} className="text-[10px] font-black text-sun-600 uppercase tracking-widest hover:underline">Upload Product Asset</button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Label</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" placeholder="Enter product name..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                      <select name="category" defaultValue={editingItem?.category || 'Lounge Menu'} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-xs border-none outline-none shadow-inner">
                        <option value="Lounge Menu">Lounge Menu</option>
                        <option value="Bar & Spirits">Bar & Spirits</option>
                        <option value="Salon Service">Salon Service</option>
                        <option value="Marine Service">Marine Service</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Retail Price (₦)</label>
                      <input name="price" type="number" defaultValue={editingItem?.price} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" placeholder="0.00" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Manifest Description</label>
                    <textarea name="description" defaultValue={editingItem?.description} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner h-24 resize-none" placeholder="Enter item description..." />
                  </div>

                  <button type="submit" className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-xl border-b-4 border-slate-700 dark:border-slate-300">
                    {editingItem?.id ? 'Save Changes' : 'Add to Menu'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* MODAL: Event Edit/Add */}
      {
        (editingEvent || isAddingEvent) && (
          <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in p-5">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 relative border border-white/5 max-h-[90vh] overflow-y-auto scrollbar-hide">
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setIsAddingEvent(false);
                }}
                className="absolute top-8 right-8 z-[600] p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 shadow-sm"
              >
                <X size={24} />
              </button>
              <div className="space-y-8">
                <div className="flex items-center gap-4 pr-16">
                  <div className="w-14 h-14 bg-sun-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shrink-0">
                    <CalendarIcon size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-tight">
                      {editingEvent?.id ? 'Modify Club Event' : 'Schedule New Event'}
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Event Settings</p>
                  </div>
                </div>

                <div className="relative group w-full h-48 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-sun-500/50">
                  <input type="file" ref={eventFileRef} className="hidden" accept="image/*" onChange={(e) => handleFileRead(e, 'EVENT')} />
                  {editingEvent?.image ? (
                    <>
                      <img src={editingEvent.image} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-3 transition-opacity">
                        <button type="button" onClick={() => eventFileRef.current?.click()} className="bg-sun-500 text-slate-950 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl"><Upload size={14} /> Update Promo</button>
                        <button type="button" onClick={() => setEditingEvent(prev => prev ? { ...prev, image: '' } : null)} className="bg-red-500 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 shadow-xl"><Trash2 size={14} /> Remove visual</button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto text-slate-300"><ImageIcon size={36} /></div>
                      <button type="button" onClick={() => eventFileRef.current?.click()} className="text-[10px] font-black text-sun-600 uppercase tracking-widest hover:underline">Link Promotional Art</button>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSaveEvent} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Headline</label>
                    <input name="title" defaultValue={editingEvent?.title} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" placeholder="Enter event title..." />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date of Event</label>
                      <input name="date" type="text" defaultValue={editingEvent?.date} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-xs border-none outline-none shadow-inner" placeholder="e.g. 24 Dec, 2025" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Fee (₦)</label>
                      <input name="price" defaultValue={editingEvent?.price} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" placeholder="FREE or Amount" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Allowed Guests Count</label>
                    <input name="capacity" type="number" defaultValue={editingEvent?.capacity} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" placeholder="Number of guests" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Brief</label>
                    <textarea name="description" defaultValue={editingEvent?.description} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner h-24 resize-none" placeholder="Enter event info..." />
                  </div>

                  <button type="submit" className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-xl border-b-4 border-slate-700 dark:border-slate-300">
                    {editingEvent?.id ? 'Update Event Details' : 'Add to Calendar'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* MODAL: Member Enroll */}
      {isAddingMember && (
        <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in p-5">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 relative border border-white/5 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button onClick={() => setIsAddingMember(false)} className="absolute top-8 right-8 z-[600] p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 shadow-sm"><X size={24} /></button>
            <div className="space-y-8">
              <div className="flex items-center gap-4 pr-16">
                <div className="w-14 h-14 bg-sun-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shrink-0"><UserPlus size={28} /></div>
                <div>
                  <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-tight">Register Member</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Main Member Records</p>
                </div>
              </div>
              <form onSubmit={handleEnrollMember} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Identification</label>
                  <input value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" placeholder="Member's Full Name" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input value={newMember.phone} onChange={e => setNewMember({ ...newMember, phone: e.target.value })} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" placeholder="080..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Capital</label>
                    <input type="number" value={newMember.walletBalance} onChange={e => setNewMember({ ...newMember, walletBalance: parseFloat(e.target.value) })} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Cashback Balance</label>
                    <input type="number" value={newMember.loyaltyPoints} onChange={e => setNewMember({ ...newMember, loyaltyPoints: parseInt(e.target.value) })} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-xl">Complete Registration</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Voucher Add/Edit */}
      {(isAddingVoucher || editingVoucher) && (
        <div className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-xl flex items-center justify-center animate-in fade-in p-5">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 relative border border-white/5 max-h-[90vh] overflow-y-auto scrollbar-hide">
            <button onClick={() => { setIsAddingVoucher(false); setEditingVoucher(null); setNewVoucher({ code: '', discount: 0, type: 'PERCENT', isActive: true, minPurchase: 0 }); }} className="absolute top-8 right-8 z-[600] p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 shadow-sm"><X size={24} /></button>
            <div className="space-y-8">
              <div className="flex items-center gap-4 pr-16">
                <div className="w-14 h-14 bg-sun-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shrink-0"><Ticket size={28} /></div>
                <div>
                  <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter leading-tight">{editingVoucher ? 'Update Code' : 'Create New Code'}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Discount Coupon Settings</p>
                </div>
              </div>
              <form onSubmit={handleSaveVoucher} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Coupon Code</label>
                  <input
                    value={newVoucher.code}
                    onChange={e => setNewVoucher({ ...newVoucher, code: e.target.value.toUpperCase() })}
                    required
                    readOnly={!!editingVoucher}
                    className={`w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm uppercase outline-none border-none shadow-inner ${editingVoucher ? 'opacity-50 cursor-not-allowed' : ''}`}
                    placeholder="E.G. SUNRISE25"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Amount</label>
                    <input type="number" value={newVoucher.discount} onChange={e => setNewVoucher({ ...newVoucher, discount: parseFloat(e.target.value) })} required className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Type</label>
                    <select value={newVoucher.type} onChange={e => setNewVoucher({ ...newVoucher, type: e.target.value as any })} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-xs border-none outline-none shadow-inner">
                      <option value="PERCENT">PERCENTAGE (%)</option>
                      <option value="FIXED">FIXED VALUE (₦)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Minimum Purchase (₦)</label>
                  <input type="number" value={newVoucher.minPurchase} onChange={e => setNewVoucher({ ...newVoucher, minPurchase: parseFloat(e.target.value) })} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-sm outline-none border-none shadow-inner" placeholder="0" />
                </div>
                <button type="submit" className="w-full bg-sun-500 text-slate-950 py-6 rounded-3xl font-black text-sm uppercase tracking-[0.3em] shadow-xl">
                  {editingVoucher ? 'Save Changes' : 'Create Coupon'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes marquee-admin {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div >
  );
};
