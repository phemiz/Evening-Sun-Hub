
import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Trash2, Edit3, X, Search, Utensils, Scissors, Anchor, 
  LayoutDashboard, Users, Zap, TrendingUp, UserPlus, Package,
  ChevronRight, Camera, DollarSign, Briefcase, Key, Lock, Eye, EyeOff,
  Settings, Clock, ShieldAlert, BadgeCheck, UserCog, Mail, Phone,
  Database, ShieldCheck as ShieldIcon, Landmark, Receipt, Globe,
  AlertTriangle, Filter, Save, RotateCcw, Loader2, ImagePlus, UserMinus,
  User as UserIcon
} from 'lucide-react';
import { Product, Staff, ServiceType, User } from '../types';

export const Admin = () => {
  const { 
    products, transactions, bookings, 
    serviceStatuses, toggleServiceStatus, addProduct, updateProduct, deleteProduct,
    staff, addStaff, updateStaff, deleteStaff, businessSettings, updateBusinessSettings,
    customers, updateUser, addNotification
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'MENU' | 'STAFF' | 'CRM' | 'CONFIG'>('ANALYTICS');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingStaff, setEditingStaff] = useState<Partial<Staff> | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [showModal, setShowModal] = useState<'PRODUCT' | 'STAFF' | 'CRM_DETAIL' | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const togglePassVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const navLinks = [
    { id: 'ANALYTICS', label: 'Reports', icon: TrendingUp },
    { id: 'MENU', label: 'Menu & Stock', icon: Utensils },
    { id: 'STAFF', label: 'Crew Station', icon: Briefcase },
    { id: 'CRM', label: 'Member List', icon: Users },
    { id: 'CONFIG', label: 'Global Config', icon: Settings },
  ];

  const stats = [
    { label: 'Revenue Total', value: `₦${transactions.reduce((a, b) => a + (b.amount < 0 ? 0 : b.amount), 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Active Signals', value: bookings.filter(b => b.status === 'PENDING' || b.status === 'IN_PROGRESS').length, icon: Zap, color: 'text-sun-600' },
    { label: 'Crew Personnel', value: staff.length, icon: Users, color: 'text-blue-500' },
  ];

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (editingProduct.id) {
      updateProduct(editingProduct.id, editingProduct);
      addNotification({ title: 'Registry Update', message: `${editingProduct.name} updated successfully.`, type: 'SUCCESS' });
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      addProduct({ 
        ...editingProduct, 
        id: newId, 
        isAvailable: true, 
        prepTimeMin: editingProduct.prepTimeMin || 20 
      } as Product);
      addNotification({ title: 'Registry Addition', message: `${editingProduct.name} added to catalog.`, type: 'SUCCESS' });
    }
    setShowModal(null);
    setEditingProduct(null);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (editingStaff.id) {
      updateStaff(editingStaff.id, editingStaff);
      addNotification({ title: 'Personnel Update', message: `Credentials for ${editingStaff.name} synchronized.`, type: 'SUCCESS' });
    } else {
      const newId = Math.random().toString(36).substr(2, 9);
      addStaff({ 
        ...editingStaff, 
        id: newId, 
        rating: 5, 
        ratingCount: 0, 
        completedTasks: 0, 
        earnings: 0, 
        status: 'ACTIVE' 
      } as Staff);
      addNotification({ title: 'New Appointment', message: `${editingStaff.name} appointed to station.`, type: 'SUCCESS' });
    }
    setShowModal(null);
    setEditingStaff(null);
  };

  const handlePersistConfig = () => {
    setIsSavingConfig(true);
    setTimeout(() => {
      setIsSavingConfig(false);
      addNotification({ title: 'Hub Configuration', message: 'Global operating parameters persisted.', type: 'SUCCESS' });
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (showModal === 'PRODUCT' && editingProduct) {
          setEditingProduct({ ...editingProduct, image: reader.result as string });
        } else if (showModal === 'STAFF' && editingStaff) {
          setEditingStaff({ ...editingStaff, imageUrl: reader.result as string });
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex pb-32">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-8 space-y-12 shrink-0">
         <div className="space-y-4">
            <div className="w-12 h-12 bg-sun-500 rounded-2xl flex items-center justify-center text-white shadow-xl"><LayoutDashboard size={24}/></div>
            <h1 className="text-2xl font-black dark:text-white uppercase tracking-tighter italic leading-none">Sun Control</h1>
         </div>
         <nav className="flex-1 space-y-2">
            {navLinks.map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-sun-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                <item.icon size={18}/> {item.label}
              </button>
            ))}
         </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto w-full">
         <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 lg:mb-12">
            <div>
               <h2 className="text-3xl lg:text-4xl font-black dark:text-white uppercase tracking-tighter italic leading-none">Greetings, Admin</h2>
               <p className="text-[10px] font-black text-sun-600 uppercase tracking-widest mt-3 flex items-center gap-2">
                 <ShieldIcon size={12}/> Super Admin Authorization: Active
               </p>
            </div>
            <div className="relative group max-w-sm w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input 
                type="text" 
                placeholder="Query Station Logs..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 outline-none font-bold text-xs shadow-sm focus:border-sun-500 transition-all dark:text-white"
              />
            </div>
         </header>

         {/* Mobile Navigation Bar - Fixed visibility for mobile */}
         <div className="lg:hidden sticky top-0 z-40 -mx-4 px-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 mb-8 py-4 flex gap-3 overflow-x-auto scrollbar-hide">
            {navLinks.map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id as any)} 
                className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-sun-500 text-slate-950 shadow-lg scale-105' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'}`}
              >
                <item.icon size={14}/> {item.label}
              </button>
            ))}
         </div>

         {activeTab === 'ANALYTICS' && (
           <div className="space-y-8 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
                 {stats.map((s, i) => (
                   <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4 group hover:scale-[1.02] transition-all">
                      <div className={`w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center ${s.color} shadow-inner group-hover:rotate-12 transition-transform`}><s.icon size={24}/></div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        <p className="text-3xl lg:text-4xl font-black dark:text-white tracking-tighter">{s.value}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                 <h3 className="text-xl font-black dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3 italic">
                   <RotateCcw size={20} className="text-sun-500"/> Activity Record
                 </h3>
                 <div className="space-y-4">
                    {transactions.slice(0, 5).map(tx => (
                      <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-800 gap-3">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-400"><Receipt size={20}/></div>
                            <div>
                               <p className="text-xs font-black dark:text-white uppercase leading-none mb-1">{tx.title}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{tx.date} • {tx.channel}</p>
                            </div>
                         </div>
                         <span className={`text-sm font-black text-right sm:text-left ${tx.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                           {tx.amount < 0 ? '-' : '+'}₦{Math.abs(tx.amount).toLocaleString()}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'MENU' && (
           <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <h3 className="text-xl font-black dark:text-white uppercase tracking-tight italic">Catalog Registry</h3>
                 <button onClick={() => { setEditingProduct({ category: 'Lounge Menu', prepTimeMin: 20 }); setShowModal('PRODUCT'); }} className="w-full sm:w-auto bg-sun-500 text-slate-950 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Plus size={16}/> Register New Item
                 </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
                   <div key={p.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between group shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center gap-5">
                         <img src={p.image} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shadow-md" alt={p.name} />
                         <div className="space-y-1">
                            <h4 className="font-black dark:text-white uppercase text-xs sm:text-sm leading-none">{p.name}</h4>
                            <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">{p.category}</p>
                            <p className="text-sm sm:text-base font-black text-sun-600">₦{p.price.toLocaleString()}</p>
                         </div>
                      </div>
                      <div className="flex flex-col gap-2">
                         <button onClick={() => { setEditingProduct(p); setShowModal('PRODUCT'); }} className="p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-sun-500 rounded-xl transition-all shadow-sm active:scale-90"><Edit3 size={18}/></button>
                         <button onClick={() => { if(window.confirm(`Purge ${p.name} from catalog?`)) deleteProduct(p.id); }} className="p-2.5 sm:p-3 bg-red-50 text-red-500 rounded-xl transition-all shadow-sm active:scale-90"><Trash2 size={18}/></button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         )}

         {activeTab === 'STAFF' && (
           <div className="space-y-8 animate-in fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <h3 className="text-xl font-black dark:text-white uppercase tracking-tight italic">Crew Station Hierarchy</h3>
                 <button onClick={() => { setEditingStaff({ role: 'KITCHEN' }); setShowModal('STAFF'); }} className="w-full sm:w-auto bg-sun-500 text-slate-950 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <UserPlus size={16}/> Appoint Personnel
                 </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                 {staff.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map(s => (
                   <div key={s.id} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 shadow-sm">
                      <div className="flex items-center gap-6">
                         <img src={s.imageUrl} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl border-4 border-slate-50 dark:border-slate-800 object-cover shadow-xl" alt={s.name} />
                         <div className="space-y-2">
                            <h4 className="font-black dark:text-white uppercase text-lg sm:text-xl leading-none italic">{s.name}</h4>
                            <div className="flex flex-wrap items-center gap-3">
                               <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-lg text-[8px] sm:text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.role.replace('_', ' ')}</span>
                               <div className="flex items-center gap-1.5 bg-sun-50 dark:bg-sun-900/20 px-2.5 py-1 rounded-lg">
                                  <Zap size={10} className="text-sun-600" fill="currentColor"/>
                                  <span className="text-[9px] sm:text-[10px] font-black text-sun-600 uppercase">{s.completedTasks} Tasks</span>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex-1 md:mx-4 p-5 sm:p-6 bg-slate-50 dark:bg-slate-950/50 rounded-[2rem] sm:rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                            <div className="space-y-1">
                               <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest block">Login ID (Phone)</span>
                               <div className="flex items-center gap-2 text-xs font-black dark:text-white">
                                  <Phone size={12} className="text-sun-600"/> {s.phone}
                               </div>
                            </div>
                            <div className="space-y-1">
                               <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest block">Personnel Password</span>
                               <div className="flex items-center gap-3">
                                  <span className="text-xs font-black text-sun-600 tracking-[0.3em] font-mono uppercase">
                                     {showPasswords[s.id] ? (s.password || 'NOT SET') : '••••••'}
                                  </span>
                                  <button onClick={() => togglePassVisibility(s.id)} className="p-1.5 bg-white dark:bg-slate-800 rounded-lg text-slate-400 hover:text-sun-500 shadow-sm active:scale-90">
                                     {showPasswords[s.id] ? <EyeOff size={14}/> : <Eye size={14}/>}
                                  </button>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                         <button onClick={() => { setEditingStaff(s); setShowModal('STAFF'); }} className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-sun-500 rounded-2xl transition-all shadow-sm group active:scale-90">
                           <Edit3 size={20} className="group-hover:scale-110 transition-transform"/>
                         </button>
                         <button onClick={() => { if(window.confirm(`Purge ${s.name} from crew?`)) deleteStaff(s.id); }} className="p-4 sm:p-5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-sm active:scale-90">
                           <Trash2 size={20}/>
                         </button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
         )}

         {activeTab === 'CRM' && (
           <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center">
                 <h3 className="text-xl font-black dark:text-white uppercase tracking-tight italic">Member Directory</h3>
                 <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-slate-500">
                   {customers.length} Nodes Synchronized
                 </div>
              </div>
              <div className="grid gap-4">
                 {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone.includes(searchTerm)).map(c => (
                   <div key={c.phone} className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm group hover:border-sun-500/30 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-slate-50 dark:border-slate-800 shadow-lg shrink-0">
                            <img src={c.avatarUrl} className="w-full h-full object-cover" alt={c.name} />
                         </div>
                         <div className="min-w-0">
                            <h4 className="font-black dark:text-white uppercase text-sm truncate leading-none mb-1.5">{c.name}</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest truncate">
                              {c.phone} • {c.loyaltyPoints} XP REWARD
                            </p>
                         </div>
                      </div>
                      <button 
                        onClick={() => { setSelectedCustomer(c); setShowModal('CRM_DETAIL'); }}
                        className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-sun-500 rounded-xl shrink-0 group-hover:translate-x-1 transition-all shadow-inner active:scale-90"
                      >
                        <ChevronRight size={20}/>
                      </button>
                   </div>
                 ))}
              </div>
           </div>
         )}

         {activeTab === 'CONFIG' && (
           <div className="space-y-8 animate-in fade-in max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8 shadow-sm">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-950 dark:bg-sun-500 rounded-2xl flex items-center justify-center text-white shadow-xl"><Settings size={22}/></div>
                       <h3 className="text-lg lg:text-xl font-black dark:text-white uppercase tracking-tight leading-tight italic">Hub Parameters</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily Opening Signal</label>
                          <div className="flex items-center gap-3 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                             <Clock size={20} className="text-sun-600"/>
                             <input type="time" value={businessSettings.openingTime} onChange={e => updateBusinessSettings({openingTime: e.target.value})} className="bg-transparent font-black dark:text-white outline-none text-lg flex-1" />
                          </div>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily Closing Signal</label>
                          <div className="flex items-center gap-3 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
                             <Clock size={20} className="text-red-500"/>
                             <input type="time" value={businessSettings.closingTime} onChange={e => updateBusinessSettings({closingTime: e.target.value})} className="bg-transparent font-black dark:text-white outline-none text-lg flex-1" />
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={handlePersistConfig} 
                      disabled={isSavingConfig}
                      className="w-full bg-slate-950 text-white dark:bg-sun-500 dark:text-slate-950 py-6 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all border-b-4 border-black/20 dark:border-sun-700"
                    >
                       {isSavingConfig ? <Loader2 size={16} className="animate-spin" /> : <Save size={16}/>} 
                       {isSavingConfig ? 'Persisting...' : 'Persist Global Config'}
                    </button>
                 </div>

                 <div className="bg-white dark:bg-slate-900 p-8 lg:p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-8 shadow-sm">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-500 shadow-inner"><ShieldAlert size={22}/></div>
                       <h3 className="text-lg lg:text-xl font-black dark:text-white uppercase tracking-tight leading-tight italic">Security & Privileges</h3>
                    </div>
                    
                    <div className="space-y-4">
                       {serviceStatuses.map(status => (
                         <div key={status.id} className="flex items-center justify-between p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 group hover:border-sun-500/20 transition-all">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest dark:text-white italic">{status.id.replace('_', ' ')} STATION</span>
                            <button onClick={() => toggleServiceStatus(status.id)} className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${status.isActive ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}>
                               {status.isActive ? 'OPERATIONAL' : 'DEACTIVATED'}
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
         )}
      </main>

      {/* Item Modal (Product) */}
      {showModal === 'PRODUCT' && editingProduct && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in duration-500 shadow-4xl border border-white/5 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter italic leading-none">{editingProduct.id ? 'Registry Update' : 'New Catalog Entry'}</h3>
                 <button onClick={() => setShowModal(null)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:rotate-90 transition-all active:scale-90"><X size={20}/></button>
              </div>

              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center">
                    {editingProduct.image ? (
                      <img src={editingProduct.image} className="w-full h-full object-cover" alt="Product" />
                    ) : (
                      <Utensils size={40} className="text-slate-300" />
                    )}
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-3xl"
                    >
                      {isUploading ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black uppercase text-sun-600 tracking-widest">Update Visual</button>
                  {editingProduct.image && (
                    <button type="button" onClick={() => setEditingProduct({...editingProduct, image: ''})} className="text-[10px] font-black uppercase text-red-500 tracking-widest">Purge Visual</button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Entity Name</label>
                       <input value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold outline-none border-2 border-transparent focus:border-sun-500 transition-all shadow-inner" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Fiscal Cost (₦)</label>
                       <input type="number" value={editingProduct.price || ''} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold outline-none border-2 border-transparent focus:border-sun-500 transition-all shadow-inner" required />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Target Station</label>
                    <select value={editingProduct.category || ''} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white font-black uppercase text-[10px] tracking-widest outline-none border-2 border-transparent focus:border-sun-500 transition-all shadow-inner">
                       <option value="Lounge Menu">Lounge Menu</option>
                       <option value="Drinks">Drinks</option>
                       <option value="Provisions">Provisions</option>
                       <option value="Groceries">Groceries</option>
                       <option value="Gaming">Gaming Arena</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Intel (Description)</label>
                    <textarea value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold text-xs outline-none border-2 border-transparent focus:border-sun-500 transition-all shadow-inner h-24" placeholder="Entity specifications..." />
                 </div>
                 <button type="submit" className="w-full bg-sun-500 text-slate-950 py-7 rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-xl border-b-8 border-sun-700 active:scale-95 transition-all">Synchronize Entry</button>
              </form>
           </div>
        </div>
      )}

      {/* Staff Modal */}
      {showModal === 'STAFF' && editingStaff && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] p-10 space-y-8 animate-in zoom-in duration-500 max-h-[90vh] overflow-y-auto scrollbar-hide shadow-4xl border border-white/5">
              <div className="flex justify-between items-center">
                 <div className="space-y-1">
                    <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter italic leading-none">{editingStaff.id ? 'Credentials Protocol' : 'New Appointment'}</h3>
                    <p className="text-[10px] font-black text-sun-600 uppercase tracking-widest">Station Authorization Point</p>
                 </div>
                 <button onClick={() => setShowModal(null)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform"><X size={20}/></button>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-700 shadow-xl">
                    {editingStaff.imageUrl ? (
                      <img src={editingStaff.imageUrl} className="w-full h-full object-cover" alt="Personnel" />
                    ) : (
                      <UserIcon size={48} className="text-slate-300 m-auto mt-8" />
                    )}
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                    >
                      {isUploading ? <Loader2 className="animate-spin text-white" /> : <Camera className="text-white" />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black uppercase text-sun-600 tracking-widest">Update Identity</button>
                  {editingStaff.imageUrl && (
                    <button type="button" onClick={() => setEditingStaff({...editingStaff, imageUrl: ''})} className="text-[10px] font-black uppercase text-red-500 tracking-widest">Remove Identity</button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSaveStaff} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Legal Name</label>
                       <input value={editingStaff.name || ''} onChange={e => setEditingStaff({...editingStaff, name: e.target.value})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white font-bold outline-none border-2 border-transparent focus:border-sun-500 shadow-inner" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Primary Node (Role)</label>
                        <select value={editingStaff.role || ''} onChange={e => setEditingStaff({...editingStaff, role: e.target.value as any})} className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-white font-black uppercase text-[10px] tracking-widest outline-none border-2 border-transparent focus:border-sun-500 transition-all shadow-inner">
                          <option value="KITCHEN">Kitchen Unit</option>
                          <option value="SALON">Salon Specialist</option>
                          <option value="BOAT_OPERATOR">Captain Deck</option>
                          <option value="BAR">Mixology Node</option>
                          <option value="CASHIER">Fiscal Settle Station</option>
                          <option value="ADMIN_MGMT">Station Management</option>
                          <option value="GAME_LOUNGE">Arena Console</option>
                        </select>
                    </div>
                 </div>
                 
                 <div className="p-8 bg-slate-50 dark:bg-slate-950/50 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 space-y-6 shadow-inner">
                    <div className="flex items-center gap-3 text-sun-600">
                       <div className="w-8 h-8 rounded-lg bg-sun-500/10 flex items-center justify-center"><Lock size={16}/></div>
                       <h4 className="text-[11px] font-black uppercase tracking-[0.25em]">System Credentials</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Username (Phone)</label>
                         <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                            <input required type="text" value={editingStaff.phone || ''} onChange={e => setEditingStaff({...editingStaff, phone: e.target.value})} className="w-full pl-11 p-4 rounded-xl bg-white dark:bg-slate-900 dark:text-white font-bold outline-none border-2 border-transparent focus:border-sun-500 shadow-md" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Assigned Password</label>
                         <div className="relative group">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16}/>
                            <input 
                              type="text" 
                              value={editingStaff.password || ''} 
                              onChange={e => setEditingStaff({...editingStaff, password: e.target.value})} 
                              placeholder="Define password..."
                              className="w-full pl-11 p-4 rounded-xl bg-white dark:bg-slate-900 dark:text-white font-black text-xs tracking-[0.4em] outline-none border-2 border-transparent focus:border-sun-500 shadow-md placeholder:font-bold placeholder:tracking-normal" 
                            />
                         </div>
                      </div>
                    </div>
                 </div>

                 <button type="submit" className="w-full bg-slate-950 text-white dark:bg-sun-500 dark:text-slate-950 py-7 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl border-b-8 border-black/20 dark:border-sun-700 active:scale-95 transition-all">Finalize Personnel Update</button>
              </form>
           </div>
        </div>
      )}

      {/* CRM Detail Modal */}
      {showModal === 'CRM_DETAIL' && selectedCustomer && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-10 space-y-8 animate-in zoom-in border border-white/5 relative">
              <button onClick={() => setShowModal(null)} className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform"><X size={24}/></button>
              
              <div className="flex flex-col items-center text-center space-y-4">
                 <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-slate-50 dark:border-slate-800 shadow-2xl">
                    <img src={selectedCustomer.avatarUrl} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div>
                    <h3 className="text-3xl font-black dark:text-white uppercase tracking-tighter italic">{selectedCustomer.name}</h3>
                    <p className="text-xs font-black text-sun-600 uppercase tracking-widest mt-1">Grade {Math.floor((selectedCustomer.loyaltyPoints || 0) / 1000)} Hub Legend</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl text-center space-y-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Accumulated XP</span>
                    <p className="text-xl font-black dark:text-white">{selectedCustomer.loyaltyPoints?.toLocaleString()}</p>
                 </div>
                 <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl text-center space-y-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Wallet Capital</span>
                    <p className="text-xl font-black text-green-600">₦{selectedCustomer.walletBalance?.toLocaleString()}</p>
                 </div>
              </div>

              <div className="space-y-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Node Identifier</span>
                    <span className="dark:text-white">{selectedCustomer.phone}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Hub Segment</span>
                    <span className="text-sun-600 italic">{selectedCustomer.segment?.replace('_', ' ')}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">Station Active</span>
                    <span className="text-green-500">VERIFIED</span>
                 </div>
              </div>

              <button className="w-full bg-slate-950 text-white dark:bg-white dark:text-slate-950 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest shadow-xl">Audit Transaction Manifest</button>
           </div>
        </div>
      )}
    </div>
  );
};
