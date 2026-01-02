
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { AIChat } from './components/AIChat';
import { Home } from './pages/Home';
import { Eatery } from './pages/Eatery';
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

// Refined ScrollManager to handle route transitions without interrupting state updates
const ScrollManager = () => {
  const { pathname } = useLocation();
  const { weather, sailingTempLimit, vessels, bookings } = useApp();

  // Effect 1: Only scroll to top on actual route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Effect 2: Handle priority node focusing on page mount or critical status shifts
  useEffect(() => {
    const handlePriorityFocus = () => {
      // 1. Home Page: Weather Lock Priority
      if (pathname === '/' && weather.temp >= sailingTempLimit) {
        const safetyNode = document.getElementById('safety-node');
        safetyNode?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // 2. Admin Page: Fleet Maintenance Priority
      if (pathname === '/admin' && vessels.some(v => v.status === 'MAINTENANCE')) {
        const fleetNode = document.getElementById('fleet-node');
        fleetNode?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      // 3. Staff Console: Pending Task Priority
      if (pathname === '/staff' && bookings.some(b => b.status === 'PENDING')) {
        const manifestNode = document.getElementById('task-manifest');
        manifestNode?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    };

    const timer = setTimeout(handlePriorityFocus, 300);
    return () => clearTimeout(timer);
  }, [pathname]); // Removed data dependencies to prevent scroll-on-slider-change

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
        <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/club" element={<Club />} />
        <Route path="/marine" element={<Marine />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/support" element={<Support />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/staff" element={<StaffConsole />} />
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
