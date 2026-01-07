
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { AIChat } from './components/AIChat';
import { Home } from './pages/Home';
import { Eatery } from './pages/Eatery';
import { Supermarket } from './pages/Supermarket';
import { Salon } from './pages/Salon';
import { Cart } from './pages/Cart';
import { Payment } from './pages/Payment';
import { ServiceDetail } from './pages/ServiceDetail';
import { Club } from './pages/Club';
import { Marine } from './pages/Marine';
import { Profile } from './pages/Profile';
import { Bookings } from './pages/Bookings';
import { Wallet } from './pages/Wallet';
import { Settings } from './pages/Settings';
import { Support } from './pages/Support';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { StaffConsole } from './pages/StaffConsole';
import { OrderTracking } from './pages/OrderTracking';
import { MeetingHall } from './pages/MeetingHall';
import { GameLounge } from './pages/GameLounge';

const ScrollManager = () => {
  const { pathname } = useLocation();
  const { weather, sailingTempLimit, vessels, bookings } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handlePriorityFocus = () => {
      if (pathname === '/' && weather.temp >= sailingTempLimit) {
        document.getElementById('safety-node')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (pathname === '/admin' && vessels.some(v => v.status === 'MAINTENANCE')) {
        document.getElementById('fleet-node')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
      if (pathname === '/staff' && bookings.some(b => b.status === 'PENDING')) {
        document.getElementById('task-manifest')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    };
    const timer = setTimeout(handlePriorityFocus, 400);
    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

const AppRoutes = () => {
  const { user } = useApp();
  if (!user) return <Login />;
  return (
    <Layout>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/eatery" element={<Eatery />} />
        <Route path="/supermarket" element={<Supermarket />} />
        <Route path="/salon" element={<Salon />} />
        <Route path="/game-lounge" element={<GameLounge />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/club" element={<Club />} />
        <Route path="/marine" element={<Marine />} />
        <Route path="/meeting-hall" element={<MeetingHall />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/staff" element={<StaffConsole />} />
        <Route path="/order-tracking/:id" element={<OrderTracking />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AIChat />
    </Layout>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}

export default App;
