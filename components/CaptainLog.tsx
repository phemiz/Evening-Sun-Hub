
import React, { useState, useEffect, useRef } from 'react';
import { MarineTripLog } from '../types';
import { 
  Anchor, Clock, Fuel, Gauge, PenTool, CheckCircle, Navigation, Satellite, X, Loader2, Fingerprint
} from 'lucide-react';

export const CaptainLog = ({ tripId, vesselRate, onComplete }: { tripId: string, vesselRate: number, onComplete: () => void }) => {
    const [step, setStep] = useState<'PRE_CHECK' | 'IN_TRIP' | 'POST_CHECK' | 'COMPLETED'>('PRE_CHECK');
    const [fuel, setFuel] = useState(0);
    const [hours, setHours] = useState(0);
    const [signature, setSignature] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startTrip = () => setStep('IN_TRIP');
    const dockTrip = () => setStep('POST_CHECK');

    const saveSignature = () => {
      const canvas = canvasRef.current;
      if (canvas) setSignature(canvas.toDataURL());
    };

    if (step === 'COMPLETED') {
      return (
        <div className="text-center space-y-6">
           <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white"><CheckCircle size={40} /></div>
           <h3 className="text-2xl font-black uppercase">Log Archived</h3>
           <button onClick={onComplete} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase">Close Handshake</button>
        </div>
      );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
                <Anchor className="text-blue-600" />
                <h3 className="font-black uppercase text-lg">Marine Node #{tripId}</h3>
            </div>

            {step === 'PRE_CHECK' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Engine Hrs</label>
                            <input type="number" step="0.1" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" placeholder="0.0" onChange={e => setHours(parseFloat(e.target.value))} />
                         </div>
                         <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase text-slate-400">Fuel Level</label>
                            <input type="number" className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold" placeholder="0" onChange={e => setFuel(parseFloat(e.target.value))} />
                         </div>
                    </div>
                    <button onClick={startTrip} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase shadow-lg">Launch Expedition</button>
                </div>
            )}

            {step === 'IN_TRIP' && (
                <div className="text-center space-y-6 animate-pulse">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600"><Satellite size={48}/></div>
                    <p className="font-black uppercase tracking-widest text-blue-600">GPS Locked - Expedition Active</p>
                    <button onClick={dockTrip} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase">Dock Vessel</button>
                </div>
            )}

            {step === 'POST_CHECK' && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400">Customer Handshake (Digital Sign)</label>
                        <div className="border-2 border-slate-100 dark:border-slate-800 h-40 rounded-2xl relative bg-slate-50">
                           <canvas ref={canvasRef} width={300} height={150} className="w-full h-full" />
                        </div>
                    </div>
                    <button onClick={() => setStep('COMPLETED')} className="w-full bg-sun-600 text-white py-5 rounded-2xl font-black uppercase">Finalize Log</button>
                </div>
            )}
        </div>
    );
};
