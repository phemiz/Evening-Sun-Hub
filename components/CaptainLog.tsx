
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MarineTripLog, AuditEntry } from '../types';
import { 
  Anchor, Clock, Fuel, Gauge, PenTool, CheckCircle, Navigation, 
  Satellite, Route, ReceiptText, ShieldCheck, FileText, Loader2, ArrowRight,
  History, Map as MapIcon, BarChart3, TrendingUp, RefreshCw, X, Fingerprint,
  Radio, Signal, LocateFixed
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface CaptainLogProps {
  tripId: string;
  vesselRate: number;
  onComplete: () => void;
}

// Haversine formula to calculate distance between two points in km
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const CaptainLog = ({ tripId, vesselRate, onComplete }: CaptainLogProps) => {
    const { user } = useApp();
    const [step, setStep] = useState<'PRE_CHECK' | 'INITIALIZING' | 'IN_TRIP' | 'POST_CHECK' | 'COMPLETED'>('PRE_CHECK');
    const [log, setLog] = useState<Partial<MarineTripLog>>({
        checklist: { lifeJackets: false, fuelCheck: false, radioCheck: false },
        auditTrail: []
    });
    
    const [signature, setSignature] = useState<string | null>(null);
    const [isSigning, setIsSigning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [distanceCovered, setDistanceCovered] = useState(0);
    const [currentCoords, setCurrentCoords] = useState<string>("Acquiring Link...");
    const [gpsStatus, setGpsStatus] = useState<'IDLE' | 'SEARCHING' | 'LOCKED' | 'FAILED'>('IDLE');
    const [initTasks, setInitTasks] = useState<{label: string, done: boolean}[]>([
        { label: "Safety Checklist Verified", done: false },
        { label: "Engine Hours Recorded", done: false },
        { label: "Acquiring GPS Satellite Lock", done: false },
        { label: "Syncing Manifest with Hub", done: false }
    ]);
    
    const timerRef = useRef<number | null>(null);
    const simulationRef = useRef<number | null>(null);
    const watchIdRef = useRef<number | null>(null);
    const lastCoordRef = useRef<{lat: number, lon: number} | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const recordAudit = (field: string, oldValue: any, newValue: any) => {
      const entry: AuditEntry = {
        timestamp: new Date().toLocaleTimeString(),
        field,
        oldValue,
        newValue,
        staffName: user?.name || 'Captain'
      };
      setLog(prev => ({
        ...prev,
        auditTrail: [entry, ...(prev.auditTrail || [])]
      }));
    };

    const handleLogUpdate = (field: 'startEngineHours' | 'startFuelLevel' | 'endEngineHours' | 'endFuelLevel', value: number) => {
      const oldVal = log[field];
      if (oldVal !== value) {
        recordAudit(field, oldVal || 0, value);
        setLog(prev => ({ ...prev, [field]: value }));
      }
    };

    const startSimulation = () => {
        simulationRef.current = window.setInterval(() => {
            setDistanceCovered(prev => prev + (Math.random() * 0.0005 + 0.0002));
            const jitterLat = (Math.random() - 0.5) * 0.001;
            const jitterLon = (Math.random() - 0.5) * 0.001;
            setCurrentCoords(`Simulated: ${(6.4253 + jitterLat).toFixed(4)}° N, ${(3.4219 + jitterLon).toFixed(4)}° E`);
            setGpsStatus('LOCKED');
        }, 3000);
    };

    useEffect(() => {
        if (step === 'IN_TRIP') {
            // Start Mission Timer
            timerRef.current = window.setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);

            // Start GPS Tracking
            if ("geolocation" in navigator) {
                setGpsStatus('SEARCHING');
                watchIdRef.current = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        setCurrentCoords(`${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`);
                        setGpsStatus('LOCKED');
                        
                        if (lastCoordRef.current) {
                            const distKm = getDistance(
                                lastCoordRef.current.lat, 
                                lastCoordRef.current.lon, 
                                latitude, 
                                longitude
                            );
                            // Convert km to Nautical Miles (1 km = 0.539957 NM)
                            const nm = distKm * 0.539957;
                            // Filter out noise (jumps < 2 meters or > 2km in one ping)
                            if (distKm > 0.002 && distKm < 2) {
                                setDistanceCovered(prev => prev + nm);
                            }
                        }
                        lastCoordRef.current = { lat: latitude, lon: longitude };
                    },
                    (error) => {
                        console.warn("GPS Error, falling back to simulation:", error);
                        setGpsStatus('FAILED');
                        startSimulation();
                    },
                    { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
                );
            } else {
                startSimulation();
            }
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            if (simulationRef.current) clearInterval(simulationRef.current);
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (simulationRef.current) clearInterval(simulationRef.current);
            if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
        };
    }, [step]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handlePreCheck = async () => {
        if (log.startFuelLevel === undefined || log.startEngineHours === undefined) {
            alert("Operational Safety: Please enter fuel and engine hours before launch.");
            return;
        }
        setStep('INITIALIZING');
        for (let i = 0; i < initTasks.length; i++) {
            await new Promise(r => setTimeout(r, 600));
            setInitTasks(prev => prev.map((t, idx) => idx === i ? {...t, done: true} : t));
        }
        setStep('IN_TRIP');
    };

    const fuelConsumed = useMemo(() => {
      if (log.startFuelLevel !== undefined && log.endFuelLevel !== undefined) {
        return Math.max(0, log.startFuelLevel - log.endFuelLevel);
      }
      return 0;
    }, [log.startFuelLevel, log.endFuelLevel]);

    const hoursUsed = useMemo(() => {
      if (log.startEngineHours !== undefined && log.endEngineHours !== undefined) {
        return Math.max(0, log.endEngineHours - log.startEngineHours);
      }
      return 0;
    }, [log.startEngineHours, log.endEngineHours]);

    // Digital Signature Pad Logic
    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
      setIsSigning(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.beginPath();
      const rect = canvas.getBoundingClientRect();
      const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
      const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
      ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
      if (!isSigning) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
      const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      setIsSigning(false);
    };

    const clearSignature = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignature(null);
    };

    const saveSignature = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      setSignature(canvas.toDataURL());
    };

    if (step === 'COMPLETED') {
        return (
            <div className="space-y-6 animate-in zoom-in duration-500 pb-10">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] text-center space-y-8 shadow-2xl border-4 border-green-500">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white shadow-xl">
                        <CheckCircle size={40} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black dark:text-white uppercase tracking-tight">Expedition Archived</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Manifest Node #{tripId}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-[2rem] space-y-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Engine Hub</span>
                            <p className="text-lg font-black dark:text-white">{hoursUsed.toFixed(1)} hrs</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-[2rem] space-y-1">
                            <span className="text-[9px] font-black text-slate-400 uppercase">Fuel Yield</span>
                            <p className="text-lg font-black text-blue-500">{fuelConsumed.toFixed(1)} L</p>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                        <div className="flex items-center gap-3 justify-center">
                            <Fingerprint size={20} className="text-green-500"/>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer Signature Verified</span>
                        </div>
                        {signature && (
                          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl inline-block border border-slate-100 dark:border-slate-700">
                             <img src={signature} alt="Sign" className="h-12 w-auto grayscale contrast-150" />
                          </div>
                        )}
                    </div>

                    <button onClick={onComplete} className="w-full bg-slate-950 dark:bg-white dark:text-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-xl">Handshake Complete</button>
                </div>
            </div>
        );
    }

    if (step === 'INITIALIZING') {
        return (
            <div className="bg-slate-950 text-white p-10 rounded-[3rem] text-center space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500/20">
                    <div className="h-full bg-blue-500 animate-[loading_3s_ease-in-out_infinite]" style={{width: '60%'}} />
                </div>
                <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto ring-8 ring-blue-500/10 animate-pulse">
                    <Satellite size={32} className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Vessel Handshake</h3>
                <div className="space-y-4 text-left bg-black/40 p-8 rounded-3xl border border-white/5 shadow-inner">
                    {initTasks.map((task, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${task.done ? 'text-green-400' : 'text-slate-50'}`}>
                                {task.label}
                            </span>
                            {task.done ? <CheckCircle size={16} className="text-green-400" /> : <Loader2 size={16} className="text-blue-500 animate-spin" />}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-7 bg-white dark:bg-slate-900 rounded-[3rem] p-7 border border-slate-100 dark:border-slate-800 shadow-2xl relative">
            <div className="flex items-center gap-4 border-b border-slate-50 dark:border-slate-800 pb-6">
                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl"><Anchor size={24} /></div>
                <div className="flex-1">
                    <h3 className="font-black text-slate-900 dark:text-white tracking-tight uppercase text-base">Trip Manifest Audit</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase text-blue-500">Node #{tripId}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step.replace('_', ' ')}</span>
                    </div>
                </div>
                {step === 'IN_TRIP' && (
                    <div className="bg-red-50 dark:bg-red-900/10 text-red-600 px-4 py-2 rounded-2xl flex flex-col items-center border border-red-100 dark:border-red-900/20">
                        <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Elapsed</span>
                        <span className="text-sm font-black font-mono">{formatTime(elapsedTime)}</span>
                    </div>
                )}
            </div>

            {step === 'PRE_CHECK' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-6">
                    <div className="grid grid-cols-2 gap-5">
                         <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1"><Gauge size={14} className="text-blue-500" /> Engine Hub (H)</label>
                            <input 
                              type="number" step="0.1"
                              className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-black text-base outline-none border-2 border-transparent focus:border-blue-500 shadow-inner" 
                              placeholder="0.0"
                              onChange={e => handleLogUpdate('startEngineHours', parseFloat(e.target.value))} 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1"><Fuel size={14} className="text-blue-500" /> Fuel Cell (L)</label>
                            <input 
                              type="number"
                              className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-black text-base outline-none border-2 border-transparent focus:border-blue-500 shadow-inner" 
                              placeholder="0"
                              onChange={e => handleLogUpdate('startFuelLevel', parseFloat(e.target.value))} 
                            />
                         </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-sun-500 rounded-full blur-[60px] opacity-10" />
                        <div className="relative z-10 flex items-center gap-5">
                             <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white border border-white/10"><ShieldCheck size={28}/></div>
                             <div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Pre-Launch Sync</h4>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Check lifejackets & radio nodes.</p>
                             </div>
                        </div>
                    </div>

                    <button onClick={handlePreCheck} className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
                        <Navigation size={28} /> Launch Station
                    </button>
                </div>
            )}

            {step === 'IN_TRIP' && (
                <div className="space-y-8 animate-in fade-in zoom-in duration-300">
                    <div className="relative w-40 h-40 mx-auto">
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-10 ${gpsStatus === 'LOCKED' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                        <div className={`relative w-full h-full rounded-full flex flex-col items-center justify-center text-white shadow-2xl border-4 border-white/20 transition-colors ${gpsStatus === 'LOCKED' ? 'bg-blue-600' : 'bg-orange-600'}`}>
                            <Radio size={48} className="animate-pulse mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{gpsStatus === 'LOCKED' ? 'GPS LOCKED' : 'SEARCHING...'}</span>
                        </div>
                    </div>

                    <div className="bg-slate-950 p-6 rounded-[2.5rem] border border-white/10 text-center space-y-4 shadow-inner">
                        <div className="flex items-center justify-center gap-2 mb-1">
                           <LocateFixed size={12} className={gpsStatus === 'LOCKED' ? 'text-green-400' : 'text-orange-400'} />
                           <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Satellite Position</span>
                        </div>
                        <p className="text-sm font-black text-white font-mono">{currentCoords}</p>
                        <div className="h-px bg-white/5 w-1/2 mx-auto" />
                        <div className="flex justify-around items-center pt-2">
                             <div className="text-center">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Odometer</span>
                                <p className="text-lg font-black text-white tracking-tighter">{distanceCovered.toFixed(3)} NM</p>
                             </div>
                             <div className="w-px h-10 bg-white/5" />
                             <div className="text-center">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block mb-1">Live Speed</span>
                                <p className="text-lg font-black text-white tracking-tighter">{(distanceCovered / (elapsedTime / 3600) || 0).toFixed(1)} Knots</p>
                             </div>
                        </div>
                    </div>

                    <button onClick={() => setStep('POST_CHECK')} className="w-full bg-red-500 text-white py-6 rounded-[2rem] font-black text-lg shadow-2xl active:scale-95 transition-all uppercase tracking-widest">Docking & End Trip</button>
                </div>
            )}

            {step === 'POST_CHECK' && (
                <div className="space-y-8 animate-in slide-in-from-right">
                    <div className="grid grid-cols-2 gap-5">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">End Engine (H)</label>
                            <input 
                              type="number" step="0.1"
                              className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-black text-base outline-none border-2 border-transparent focus:border-red-500 shadow-inner" 
                              placeholder="0.0"
                              onChange={e => handleLogUpdate('endEngineHours', parseFloat(e.target.value))} 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">End Fuel (L)</label>
                            <input 
                              type="number"
                              className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 dark:text-white font-black text-base outline-none border-2 border-transparent focus:border-red-500 shadow-inner" 
                              placeholder="0"
                              onChange={e => handleLogUpdate('endFuelLevel', parseFloat(e.target.value))} 
                            />
                         </div>
                    </div>

                    {/* Digital Signature Hub */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                <PenTool size={14} className="text-blue-500" /> Customer Handshake
                            </label>
                            {signature && (
                                <button onClick={clearSignature} className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1"><RefreshCw size={10}/> Clear</button>
                            )}
                        </div>
                        <div className="relative bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 dark:border-slate-700 shadow-inner h-48">
                            {!signature ? (
                                <>
                                  <canvas 
                                      ref={canvasRef}
                                      width={400}
                                      height={200}
                                      className="w-full h-full touch-none"
                                      onMouseDown={startDrawing}
                                      onMouseMove={draw}
                                      onMouseUp={stopDrawing}
                                      onMouseLeave={stopDrawing}
                                      onTouchStart={startDrawing}
                                      onTouchMove={draw}
                                      onTouchEnd={stopDrawing}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                                     <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sign On The Line</span>
                                  </div>
                                </>
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center space-y-4 animate-in zoom-in">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white"><CheckCircle size={24}/></div>
                                    <img src={signature} alt="Sign" className="h-20 w-auto grayscale contrast-150" />
                                </div>
                            )}
                        </div>
                        {!signature && (
                             <button onClick={saveSignature} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Verify Signature</button>
                        )}
                    </div>

                    <button 
                        onClick={() => setStep('COMPLETED')} 
                        disabled={!signature || log.endFuelLevel === undefined || log.endEngineHours === undefined}
                        className="w-full bg-sun-600 text-white py-7 rounded-[2rem] font-black text-xl shadow-2xl active:scale-95 disabled:opacity-30 border-b-4 border-sun-800"
                    >
                        Synchronize Log Node
                    </button>
                </div>
            )}
        </div>
    );
};
