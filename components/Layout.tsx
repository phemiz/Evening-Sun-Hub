
import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, Calendar, User, ShoppingBag, Sun, Moon, Anchor, Search, X, 
  Zap, ChevronRight, Utensils, Scissors, Ship, ClipboardList, 
  LayoutDashboard, WifiOff, RefreshCw, Bell, Filter, CheckCircle, 
  Clock, MapPin, LogOut, Info, HelpCircle, Terminal, Radio, Navigation, ArrowLeft,
  AlertTriangle, ShieldAlert, History, Map
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ServiceItem, Booking } from '../types';

export const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { user, cart, isDarkMode, toggleTheme, products, services, isOnline, notifications, markNotificationAsRead, logout, activeToast, clearToast, bookings } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<'ALL' | 'EATERY' | 'SALON' | 'MARINE' | 'BOOKINGS'>('ALL');
  const [showNotifications, setShowNotifications] = useState(false);

  const isStaff = user?.role === 'STAFF';
  const isAdmin = user?.role === 'ADMIN';

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: isStaff ? ClipboardList : Anchor, label: isStaff ? "Console" : "Marine", path: isStaff ? "/staff" : "/marine" },
    { icon: isAdmin ? LayoutDashboard : Calendar, label: isAdmin ? "Admin" : "Activity", path: isAdmin ? "/admin" : "/bookings" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    
    const results = [
      ...products.filter(p => p.name.toLowerCase().includes(q)).map(p => ({ ...p, type: 'EATERY', meta: 'Main Hub' })),
      ...Object.entries(services).flatMap(([key, items]: [string, ServiceItem[]]) => 
        items.filter(s => s.name.toLowerCase().includes(q))
             .map(s => ({ ...s, type: key.includes('SALON') ? 'SALON' : 'MARINE', meta: 'Hub Jetty' }))
      ),
      ...bookings.filter(b => b.serviceName.toLowerCase().includes(q) || b.status.toLowerCase().includes(q) || b.location?.toLowerCase().includes(q))
             .map(b => ({ ...b, type: 'BOOKINGS', meta: b.status }))
    ];

    if (searchFilter === 'ALL') return results.slice(0, 10);
    return results.filter(r => (r as any).type === searchFilter).slice(0, 10);
  }, [searchQuery, searchFilter, products, services, bookings]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <>{children}</>;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 flex flex-col transition-colors duration-300">
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <button onClick={() => setShowSearch(true)} className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 hover:text-sun-600 transition-all active:scale-90">
              <Search size={22} />
            </button>
            <div className="hidden sm:flex flex-col ml-2">
              <h1 className="font-black text-lg text-slate-800 dark:text-white uppercase tracking-tighter">Evening Sun</h1>
            </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowNotifications(true)} className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 relative transition-all active:scale-90">
            <Bell size={22} />
            {unreadCount > 0 && <span className="absolute top-2 right-2 bg-sun-500 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-950 animate-bounce" />}
          </button>
          <button onClick={toggleTheme} className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 active:scale-90 transition-all">
            {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button onClick={handleLogout} className="w-11 h-11 rounded-2xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center text-red-500 active:scale-90 transition-all border border-red-100 dark:border-red-900/20">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 pb-28 px-4 py-6 max-w-md mx-auto w-full">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 pb-safe pt-3 px-8 flex justify-between items-center z-50 shadow-2xl">
          {navItems.map((item) => (
            <Link key={item.label} to={item.path} className={`flex flex-col items-center gap-1.5 p-2 transition-all ${location.pathname === item.path ? 'text-sun-600 scale-110' : 'text-slate-400 dark:text-slate-600'}`}>
              <item.icon size={28} strokeWidth={location.pathname === item.path ? 3.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-[0.15em]">{item.label}</span>
            </Link>
          ))}
      </nav>
    </div>
  );
};
