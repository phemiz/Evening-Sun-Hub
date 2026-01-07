
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Gamepad2, Trophy, Users, Monitor, Cpu, Sparkles, ChevronRight, 
  ArrowLeft, Search, Clock, Zap, Star, LayoutGrid, List,
  Smartphone, MousePointer2, CheckCircle2, Flame, Info, Plus,
  ShieldAlert, Activity, Award, User, Target, X, HardDrive
} from 'lucide-react';
import { ServiceType, ServiceItem, ClubEvent } from '../types';
import { GAMING_LEADERBOARD } from '../constants';

type GameTab = 'OVERVIEW' | 'STATIONS' | 'TOURNAMENTS' | 'LEADERBOARD';

export const GameLounge = () => {
  const navigate = useNavigate();
  const { services, events, products, addToCart, cart, user, loyaltyPoints, addNotification } = useApp();
  
  const [activeTab, setActiveTab] = useState<GameTab>('OVERVIEW');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStation, setSelectedStation] = useState<ServiceItem | null>(null);
  const [duration, setDuration] = useState(1); // Hours

  const gamingServices = services[ServiceType.GAME_LOUNGE] || [];
  const gamingTournaments = events.filter(e => e.isTournament);
  const gamingProducts = products.filter(p => p.category === 'Gaming');

  const filteredStations = useMemo(() => {
    return gamingServices.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [gamingServices, searchQuery]);

  const handleBooking = () => {
    if (!selectedStation) return;
    const total = selectedStation.price * duration;
    const booking = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        serviceId: selectedStation.id,
        serviceName: selectedStation.name,
        category: ServiceType.GAME_LOUNGE,
        date: "Today",
        time: "Now",
        status: 'PENDING' as const,
        depositPaid: false,
        price: total,
        stationId: selectedStation.id,
        durationCount: duration,
    };
    setSelectedStation(null);
    navigate('/payment', { state: { pendingBooking: booking, totalAmount: total } });
  };

  const handleRegisterTournament = (tourney: ClubEvent) => {
     addNotification({
        title: 'Manifest Connection',
        message: `Registered for ${tourney.title}. Node synchronized.`,
        type: 'SUCCESS'
     });
     // In a real app, we'd navigate to payment if there's a fee
  };

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Player Status Card */}
      <div className="bg-slate-950 p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sun-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20" />
          <div className="relative z-10 flex justify-between items-center">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <User size={24} className="text-sun-500" />
                   </div>
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Player</span>
                      <h3 className="text-xl font-black uppercase leading-none">{user?.name}</h3>
                   </div>
                </div>
                <div className="flex gap-8">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Total XP</span>
                      <div className="flex items-center gap-1.5 text-sun-500">
                         <Zap size={14} fill="currentColor" />
                         <span className="text-2xl font-black">{loyaltyPoints?.toLocaleString()}</span>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Global Rank</span>
                      <div className="flex items-center gap-1.5 text-blue-500">
                         <Trophy size={14} />
                         <span className="text-2xl font-black">#42</span>
                      </div>
                   </div>
                </div>
             </div>
             <div className="text-center p-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md">
                <span className="text-[10px] font-black text-sun-500 uppercase tracking-widest block mb-1">Grade</span>
                <span className="text-4xl font-black italic">S</span>
             </div>
          </div>
      </div>

      {/* Real-time Hub Availability */}
      <div className="grid grid-cols-2 gap-4">
          <button onClick={() => setActiveTab('STATIONS')} className="bg-white dark:bg-slate-900 p-7 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm flex flex-col items-center text-center gap-3 transition-all hover:border-sun-500/20 active:scale-95">
             <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-2xl flex items-center justify-center shadow-inner"><Activity size={28}/></div>
             <div>
                <span className="text-2xl font-black dark:text-white">12 / 24</span>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Nodes Ready</p>
             </div>
          </button>
          <button onClick={() => setActiveTab('TOURNAMENTS')} className="bg-white dark:bg-slate-900 p-7 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm flex flex-col items-center text-center gap-3 transition-all hover:border-sun-500/20 active:scale-95">
             <div className="w-14 h-14 bg-sun-50 dark:bg-sun-900/20 text-sun-600 rounded-2xl flex items-center justify-center shadow-inner"><Target size={28}/></div>
             <div>
                <span className="text-2xl font-black dark:text-white">{gamingTournaments.length} Active</span>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Tournaments</p>
             </div>
          </button>
      </div>

      {/* Featured Tournament Card */}
      <div className="space-y-4">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Sparkles size={14} className="text-sun-500"/> Featured Ops</h4>
        {gamingTournaments[0] && (
          <div className="bg-slate-900 rounded-[3rem] overflow-hidden relative h-56 border border-white/5 shadow-2xl group cursor-pointer" onClick={() => setActiveTab('TOURNAMENTS')}>
             <img src={gamingTournaments[0].image} className="w-full h-full object-cover opacity-60 transition-transform duration-[10s] group-hover:scale-110" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
             <div className="absolute bottom-8 left-8 right-8">
                <div className="flex justify-between items-end">
                   <div className="space-y-2">
                      <span className="bg-sun-500 text-slate-950 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">Grand Slam</span>
                      <h4 className="text-3xl font-black text-white uppercase tracking-tighter italic">{gamingTournaments[0].title}</h4>
                      <p className="text-[10px] font-bold text-sun-400 uppercase tracking-[0.2em]">{gamingTournaments[0].prizePool} Prize</p>
                   </div>
                   <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase">Entries</p>
                      <p className="text-lg font-black text-white">{gamingTournaments[0].attendeeCount}/{gamingTournaments[0].capacity}</p>
                   </div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Gamer Fuel Quickpick */}
      <div className="space-y-4">
         <div className="flex justify-between items-center px-1">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Flame size={14} className="text-sun-500"/> Station Provisions</h4>
            <button onClick={() => navigate('/eatery')} className="text-[9px] font-black text-sun-600 uppercase tracking-widest">Kitchen Manifest</button>
         </div>
         <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
            {gamingProducts.map(p => (
              <div key={p.id} className="min-w-[220px] bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 shadow-sm space-y-4">
                 <div className="h-32 rounded-[1.8rem] overflow-hidden bg-slate-50 dark:bg-slate-800 shadow-inner">
                    <img src={p.image} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <h5 className="text-[11px] font-black uppercase dark:text-white truncate">{p.name}</h5>
                    <p className="text-sun-600 font-black text-base mt-1">₦{p.price.toLocaleString()}</p>
                 </div>
                 <button 
                  onClick={() => addToCart(p)}
                  className="w-full bg-slate-950 dark:bg-sun-500 text-white dark:text-slate-950 py-3 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] active:scale-95 transition-all shadow-lg border-b-4 border-black/20 dark:border-sun-700"
                 >
                    Inject to Tray
                 </button>
              </div>
            ))}
         </div>
      </div>
    </div>
  );

  const renderStations = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
      <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
              type="text" 
              placeholder="Search platforms, specs, nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-6 bg-white dark:bg-slate-900 rounded-[2rem] border-none outline-none shadow-sm dark:text-white font-bold text-base focus:ring-4 focus:ring-sun-500/10 transition-all"
          />
      </div>

      <div className="grid grid-cols-1 gap-5">
         {filteredStations.map(station => (
           <div 
            key={station.id} 
            onClick={() => setSelectedStation(station)}
            className={`bg-white dark:bg-slate-900 p-7 rounded-[3rem] border-2 transition-all group active:scale-[0.98] relative overflow-hidden flex items-center justify-between ${
                station.status === 'AVAILABLE' ? 'border-slate-50 dark:border-slate-800' : 
                station.status === 'OCCUPIED' ? 'border-red-500/20 opacity-80' : 
                'border-orange-500/20 grayscale'
            }`}
           >
              <div className="flex items-center gap-6">
                 <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center shadow-inner transition-transform group-hover:scale-110 ${
                   station.platform === 'PS5' ? 'bg-blue-50 text-blue-600' :
                   station.platform === 'VR/SIM' ? 'bg-purple-50 text-purple-600' :
                   station.platform === 'PC' ? 'bg-sun-50 text-sun-600' : 'bg-red-50 text-red-600'
                 }`}>
                    {station.platform === 'PC' ? <Cpu size={32}/> : <Gamepad2 size={32}/>}
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <h4 className="text-xl font-black dark:text-white uppercase leading-none">{station.name}</h4>
                       <div className={`w-2 h-2 rounded-full ${
                          station.status === 'AVAILABLE' ? 'bg-green-500' : 
                          station.status === 'OCCUPIED' ? 'bg-red-500' : 'bg-orange-500'
                       }`} />
                    </div>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-sun-600 uppercase tracking-widest">₦{station.price.toLocaleString()}/hr</span>
                       <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{station.status}</span>
                    </div>
                 </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                 <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl text-slate-300 group-hover:text-sun-500 transition-colors shadow-inner">
                    <ChevronRight size={24} />
                 </div>
              </div>
              
              {station.status === 'OCCUPIED' && (
                  <div className="absolute top-0 right-0 p-4">
                     <span className="text-[8px] font-black text-red-500 uppercase tracking-[0.2em] bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">Engaged</span>
                  </div>
              )}
           </div>
         ))}
      </div>
    </div>
  );

  const renderTournaments = () => (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
       <div className="bg-slate-950 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sun-500 rounded-full blur-[120px] opacity-10" />
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
             <div className="w-20 h-20 bg-sun-500/20 rounded-3xl flex items-center justify-center text-sun-400 border border-sun-500/30">
                <Target size={48} />
             </div>
             <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase tracking-tighter italic leading-none">Tournaments Manifest</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Scheduled competitive operations.</p>
             </div>
          </div>
       </div>

       <div className="grid gap-6">
          {gamingTournaments.map(t => (
            <div key={t.id} className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all">
               <div className="h-48 relative overflow-hidden">
                  <img src={t.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end">
                     <div>
                        <span className="text-[9px] font-black text-sun-400 uppercase tracking-widest">{t.game} protocol</span>
                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{t.title}</h4>
                     </div>
                     <div className="text-right">
                        <p className="text-[8px] font-black text-slate-300 uppercase">Prize Pool</p>
                        <p className="text-sm font-black text-green-500 uppercase">{t.prizePool}</p>
                     </div>
                  </div>
               </div>
               <div className="p-8 space-y-6">
                  <div className="flex justify-around items-center border-b border-slate-50 dark:border-slate-800 pb-6">
                     <div className="text-center space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Entry Fee</span>
                        <p className="text-base font-black dark:text-white uppercase">{t.price}</p>
                     </div>
                     <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
                     <div className="text-center space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Deployment</span>
                        <p className="text-base font-black dark:text-white uppercase">{t.date}</p>
                     </div>
                     <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />
                     <div className="text-center space-y-1">
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Slots</span>
                        <p className="text-base font-black dark:text-white uppercase">{t.attendeeCount}/{t.capacity}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => handleRegisterTournament(t)}
                    className="w-full bg-sun-600 hover:bg-sun-500 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-sun-800"
                  >
                     Authorize Registration
                  </button>
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-8 animate-in zoom-in duration-500">
       <div className="bg-slate-950 p-10 rounded-[4rem] text-white shadow-2xl relative overflow-hidden border border-white/5">
          <div className="absolute top-0 right-0 w-48 h-48 bg-sun-500 rounded-full blur-[100px] opacity-10" />
          <div className="relative z-10 flex flex-col items-center text-center gap-6">
             <Trophy size={64} className="text-sun-500 animate-bounce" />
             <div className="space-y-2">
                <h3 className="text-4xl font-black uppercase tracking-tighter italic leading-none">Apex Legends</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">Badagry Hub Elite Manifest</p>
             </div>
          </div>
       </div>

       <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl relative">
          {GAMING_LEADERBOARD.map((entry, i) => (
            <div key={entry.id} className={`flex items-center gap-6 p-8 border-b last:border-0 border-slate-50 dark:border-slate-800 transition-all ${i === 0 ? 'bg-sun-50/20 dark:bg-sun-900/5' : ''}`}>
               <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-black text-xl shadow-lg ${
                 i === 0 ? 'bg-sun-500 text-slate-950 scale-110' :
                 i === 1 ? 'bg-slate-200 text-slate-600' :
                 i === 2 ? 'bg-orange-200 text-orange-600' : 'bg-slate-100 text-slate-400'
               }`}>
                  {entry.rank}
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-black dark:text-white uppercase leading-none mb-1.5 truncate italic">{entry.name}</h4>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{entry.game} Station</span>
                     <span className="w-1 h-1 rounded-full bg-slate-300" />
                     <span className="text-[9px] font-bold text-sun-600 uppercase tracking-widest">{entry.winRate} WR</span>
                  </div>
               </div>
               <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-sun-500">
                     <Zap size={14} fill="currentColor"/>
                     <span className="text-xl font-black italic">{entry.xp.toLocaleString()}</span>
                  </div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Manifest XP</span>
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className={`space-y-8 transition-all duration-300 animate-in fade-in ${cart.length > 0 ? 'pb-48' : 'pb-24'}`}>
      <div className="flex items-center gap-4 px-1">
        <button onClick={() => navigate('/')} className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
          <ArrowLeft size={24} className="dark:text-white" />
        </button>
        <div>
          <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase leading-none italic">Gaming Hub</h2>
          <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.3em] mt-2">Elite Digital Sandbox</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[2.2rem] shadow-inner sticky top-[70px] z-40 backdrop-blur-xl border border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-hide">
          {(['OVERVIEW', 'STATIONS', 'TOURNAMENTS', 'LEADERBOARD'] as GameTab[]).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[100px] py-4 rounded-[1.8rem] text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-sun-600 shadow-xl scale-[1.02]' : 'text-slate-400'}`}
            >
              {tab === 'STATIONS' ? 'Nodes' : tab}
            </button>
          ))}
      </div>

      <div className="min-h-[50vh]">
         {activeTab === 'OVERVIEW' && renderOverview()}
         {activeTab === 'STATIONS' && renderStations()}
         {activeTab === 'TOURNAMENTS' && renderTournaments()}
         {activeTab === 'LEADERBOARD' && renderLeaderboard()}
      </div>

      {/* MODAL: Station Detailed View */}
      {selectedStation && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-3xl flex items-end justify-center p-4 animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[4rem] overflow-hidden shadow-4xl animate-in slide-in-from-bottom-10 border border-white/5 relative max-h-[90dvh] flex flex-col">
              <button 
                onClick={() => setSelectedStation(null)} 
                className="absolute top-8 right-8 p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 z-10 shadow-sm active:scale-90 transition-transform"
              >
                <X size={24} />
              </button>

              <div className="p-10 flex-1 overflow-y-auto scrollbar-hide space-y-8">
                 <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-2xl transition-all ${
                       selectedStation.platform === 'PS5' ? 'bg-blue-600 text-white' :
                       selectedStation.platform === 'VR/SIM' ? 'bg-purple-600 text-white' :
                       selectedStation.platform === 'PC' ? 'bg-sun-500 text-slate-950' : 'bg-red-600 text-white'
                    }`}>
                       {selectedStation.platform === 'PC' ? <Cpu size={48}/> : <Gamepad2 size={48}/>}
                    </div>
                    <div className="space-y-1">
                       <div className="flex items-center justify-center gap-2">
                          <h3 className="text-4xl font-black dark:text-white uppercase tracking-tighter italic">{selectedStation.name}</h3>
                          <div className={`w-3 h-3 rounded-full ${selectedStation.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-red-500'}`} />
                       </div>
                       <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.5em]">{selectedStation.platform} Elite Hardware</p>
                    </div>
                 </div>

                 {/* Technical Specs Node */}
                 <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 flex items-center gap-2"><HardDrive size={14}/> Node Specifications</h4>
                    <div className="grid grid-cols-2 gap-3">
                       {selectedStation.specs && Object.entries(selectedStation.specs).map(([label, value]) => (
                         <div key={label} className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">{label}</span>
                            <span className="text-xs font-black dark:text-white uppercase">{value}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Available Games Node */}
                 <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1 flex items-center gap-2"><LayoutGrid size={14}/> Pre-Loaded Software</h4>
                    <div className="flex flex-wrap gap-2">
                       {selectedStation.gamesList?.map(game => (
                         <span key={game} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg">
                            {game}
                         </span>
                       ))}
                    </div>
                 </div>

                 <div className="bg-slate-950 p-8 rounded-[3rem] space-y-6 text-white relative overflow-hidden border border-white/5">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500 rounded-full blur-[80px] opacity-10" />
                    <div className="flex justify-between items-center relative z-10">
                       <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Session Magnitude</label>
                          <div className="flex items-center gap-4">
                             {[1, 2, 3].map(h => (
                               <button 
                                key={h} 
                                onClick={() => setDuration(h)}
                                className={`w-12 h-12 rounded-xl font-black text-xs transition-all ${duration === h ? 'bg-sun-500 text-slate-950 shadow-xl scale-110' : 'bg-white/5 text-slate-400 border border-white/10'}`}
                               >
                                  {h}h
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Fiscal manifest</span>
                          <h4 className="text-3xl font-black text-sun-500 italic leading-none">₦{(selectedStation.price * duration).toLocaleString()}</h4>
                          <span className="text-[10px] font-bold text-sun-400 uppercase tracking-widest mt-2 block">+{duration * 250} SunXP</span>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 pb-4">
                    <button 
                        onClick={handleBooking}
                        disabled={selectedStation.status !== 'AVAILABLE'}
                        className="w-full bg-sun-600 hover:bg-sun-500 text-white py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.5em] shadow-3xl active:scale-95 transition-all disabled:opacity-30 disabled:grayscale border-b-8 border-sun-800"
                    >
                        {selectedStation.status === 'AVAILABLE' ? 'Initialize Connection' : 'Node Engagement Locked'}
                    </button>
                    {selectedStation.status !== 'AVAILABLE' && (
                        <div className="flex items-center justify-center gap-2 text-red-500 mt-6 text-[9px] font-black uppercase tracking-widest animate-pulse">
                           <ShieldAlert size={14}/> Safety Protocol: Node is currently engaged or in maintenance.
                        </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
