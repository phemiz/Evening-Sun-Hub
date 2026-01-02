
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_STAFF, SERVICE_CATEGORIES } from '../constants';
import { ServiceType, ServiceItem, Staff } from '../types';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Clock, Calendar, CheckCircle, Info, UserCircle, Loader2, Star, ShieldCheck, Sparkles } from 'lucide-react';

export const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addBooking, services } = useApp();

  const category = SERVICE_CATEGORIES.find(c => c.id === id);
  const serviceList = services[id as string] || [];

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(MOCK_STAFF[0]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const now = new Date();
  const nextHour = `${(now.getHours() + 1).toString().padStart(2, '0')}:00`;

  const [date, setDate] = useState(today);
  const [time, setTime] = useState(nextHour);

  useEffect(() => {
    // Handle rebooking state from Bookings page
    if (location.state?.rebookData) {
      const data = location.state.rebookData;
      const service = serviceList.find(s => s.id === data.serviceId);
      if (service) {
        setSelectedService(service);
        const staff = MOCK_STAFF.find(s => s.name === data.staffName) || MOCK_STAFF[0];
        setSelectedStaff(staff);
        setStep(2); // Jump to finalize step
      }
    }
  }, [location.state, serviceList]);

  if (!category) return <div className="p-24 text-center font-black uppercase text-slate-400 text-lg">Service not found</div>;

  const handleBook = () => {
    if (selectedService && selectedStaff && date && time) {
      setIsRedirecting(true);
      const bookingPayload = {
        id: Math.random().toString(36).substr(2, 9),
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        category: id as ServiceType,
        date,
        time,
        status: 'PENDING' as const,
        depositPaid: false,
        price: selectedService.price,
        staffName: selectedStaff.name,
        location: 'Main Hub Salon'
      };
      setTimeout(() => {
        navigate('/payment', { state: { pendingBooking: bookingPayload, totalAmount: selectedService.price } });
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-36">
      <div className="relative h-64">
        <img src={category.image} alt={category.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        <button onClick={() => navigate(-1)} className="absolute top-7 left-7 bg-white/20 backdrop-blur-md p-3 rounded-full text-white transition-transform active:scale-90 border border-white/20">
          <ArrowLeft size={24} />
        </button>
        <div className="absolute bottom-12 left-8 text-white pr-8 animate-in slide-in-from-left duration-500">
          <h1 className="text-4xl font-black tracking-tight">{category.title}</h1>
          <p className="text-sm opacity-90 font-black mt-2 uppercase tracking-[0.25em]">{category.description}</p>
        </div>
      </div>

      <div className="p-7 -mt-8 relative z-10 bg-slate-50 dark:bg-slate-900 rounded-t-[3.5rem] min-h-[50vh] shadow-2xl">
        {step === 1 && (
          <div className="space-y-7 animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-[0.25em]">Select a Service</h3>
              <span className="text-xs font-black text-sun-600 bg-sun-50 dark:bg-sun-900/20 px-4 py-1.5 rounded-full uppercase tracking-widest">Step 1 / 2</span>
            </div>
            <div className="space-y-4">
              {serviceList.map(service => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-6 rounded-[2.5rem] border-2 flex justify-between items-center cursor-pointer transition-all group ${selectedService?.id === service.id
                    ? 'border-sun-500 bg-sun-50 dark:bg-sun-900/10'
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-sun-200 shadow-sm'
                    }`}
                >
                  <div className="flex gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${selectedService?.id === service.id ? 'bg-sun-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-900 text-slate-400'}`}>
                      <Sparkles size={24} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-slate-800 dark:text-white text-lg leading-tight">{service.name}</h4>
                      <p className="text-xs text-slate-500 font-black uppercase tracking-widest">{service.durationMin} mins duration</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sun-600 text-xl">₦{service.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            {selectedService && (
              <button onClick={() => setStep(2)} className="w-full bg-slate-900 dark:bg-sun-500 text-white py-7 rounded-[2rem] font-black text-2xl shadow-2xl shadow-sun-500/20 transition-all active:scale-95 animate-in fade-in zoom-in">
                Next Step
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-9 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-[0.25em]">Book your Appointment</h3>
              <span className="text-xs font-black text-sun-600 bg-sun-50 dark:bg-sun-900/20 px-4 py-1.5 rounded-full uppercase tracking-widest">Step 2 / 2</span>
            </div>

            <div className="space-y-5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date and Time</label>
              <div className="grid grid-cols-2 gap-5">
                <div className="relative group">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-sun-500" size={20} />
                  <input type="date" value={date} className="w-full pl-14 pr-5 py-6 rounded-[1.8rem] bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 font-black text-sm dark:text-white outline-none focus:border-sun-500 shadow-inner" onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="relative group">
                  <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-sun-500" size={20} />
                  <input type="time" value={time} className="w-full pl-14 pr-5 py-6 rounded-[1.8rem] bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 font-black text-sm dark:text-white outline-none focus:border-sun-500 shadow-inner" onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-5 block">Choose a Professional</label>
              <div className="flex gap-5 overflow-x-auto pb-7 scrollbar-hide -mx-2 px-2">
                {MOCK_STAFF.filter(s => s.status === 'ACTIVE').map(staff => (
                  <div key={staff.id} onClick={() => setSelectedStaff(staff)} className={`flex-shrink-0 w-36 flex flex-col items-center gap-4 cursor-pointer p-6 rounded-[2.5rem] border-2 transition-all active:scale-95 ${selectedStaff?.id === staff.id ? 'border-sun-500 bg-sun-50 dark:bg-sun-900/10 shadow-xl shadow-sun-500/10' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}>
                    <div className={`w-20 h-20 rounded-full overflow-hidden border-2 shadow-inner ${selectedStaff?.id === staff.id ? 'border-sun-500' : 'border-slate-100 dark:border-slate-700'}`}>
                      <img src={`https://picsum.photos/seed/${staff.id}/100`} alt={staff.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center space-y-1">
                      <span className={`text-sm font-black block tracking-tight truncate w-full ${selectedStaff?.id === staff.id ? 'text-sun-600' : 'dark:text-white'}`}>{staff.name}</span>
                      <div className="flex items-center justify-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Star size={10} fill="currentColor" className="text-sun-500" /> {staff.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-7">
              <div className="bg-slate-950 dark:bg-black p-9 rounded-[3.5rem] space-y-6 text-white shadow-2xl relative overflow-hidden animate-in zoom-in duration-500 border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sun-500 rounded-full blur-[80px] opacity-10" />
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2.5"><Sparkles size={18} className="text-sun-500" /><span className="text-slate-400 font-black uppercase tracking-widest">Service Name</span></div>
                  <span className="font-black text-white">{selectedService?.name || '---'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2.5"><UserCircle size={20} className="text-sun-500" /><span className="text-slate-400 font-black uppercase tracking-widest">Professional</span></div>
                  <span className="font-black text-white">{selectedStaff?.name || 'Any Available'}</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-3">
                  <div className="flex items-center gap-2.5"><ShieldCheck size={20} className="text-green-500" /><span className="text-sun-500 font-black uppercase tracking-[0.15em] text-base">Price</span></div>
                  <span className="text-4xl font-black text-sun-500">₦{(selectedService?.price || 0).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-5">
                <button onClick={handleBook} disabled={!selectedStaff || isRedirecting} className="w-full bg-sun-600 hover:bg-sun-700 text-white py-7 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-sun-500/40 transition-all active:scale-95 disabled:bg-slate-300 disabled:grayscale">
                  {isRedirecting ? <div className="flex items-center justify-center gap-4"><Loader2 className="animate-spin" /> <span>Processing...</span></div> : 'Confirm Booking'}
                </button>
                <button onClick={() => setStep(1)} className="w-full text-slate-400 dark:text-slate-500 font-black text-xs uppercase tracking-[0.4em] py-5 transition-colors hover:text-sun-600">GO BACK</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
