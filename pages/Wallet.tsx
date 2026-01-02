
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Landmark, X, Loader2, CheckCircle,
  ShieldCheck, Receipt, ArrowRight, Hash, Smartphone as MobileIcon,
  History, HelpCircle, Wallet as WalletIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Wallet = () => {
  const navigate = useNavigate();
  const { balance, updateBalance, transactions, addTransaction } = useApp();

  const [activeOverlay, setActiveOverlay] = useState<'TOPUP' | 'WITHDRAW' | 'TX_DETAIL' | null>(null);
  const [fundingStep, setFundingStep] = useState<'AMOUNT' | 'CHANNEL' | 'GATEWAY'>('AMOUNT');
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [amount, setAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [selectedBank, setSelectedBank] = useState<any>(null);
  const [helpNode, setHelpNode] = useState<{ title: string, desc: string } | null>(null);

  const HELP_DATABASE = {
    WALLET: { title: "Account Wallet", desc: "This is your digital wallet for making payments within the hub. You can top up your balance to easily pay for meals and vessel bookings without re-entering your payment details." },
    LEDGER: { title: "Transaction History", desc: "This is a record of all financial activity in your wallet. Green indicates funds added, and grey indicates payments made at our service hubs." }
  };

  const PAYMENT_HUBS = [
    { id: 'card', name: 'Bank Card', desc: 'Secure Payment', icon: Receipt, color: 'text-blue-500', bgColor: 'bg-blue-600', brand: 'C' },
    { id: 'monnify', name: 'Bank Transfer', desc: 'Bank Account Details', icon: Landmark, color: 'text-sun-600', bgColor: 'bg-sun-600', brand: 'B' },
    { id: 'ussd', name: 'USSD Dial', desc: 'Dialing Code', icon: Hash, color: 'text-purple-500', bgColor: 'bg-purple-600', brand: 'U' }
  ];

  const USSD_CODES = [
    { name: 'GTBank', code: '*737*' },
    { name: 'Zenith', code: '*966*' },
    { name: 'UBA', code: '*919*' },
    { name: 'FirstBank', code: '*894*' },
    { name: 'AccessBank', code: '*901*' }
  ];

  const CARD_PROVIDERS = [
    { name: 'Paystack', url: 'https://paystack.com' },
    { name: 'Flutterwave', url: 'https://flutterwave.com' },
    { name: 'Interswitch', url: 'https://interswitchgroup.com' },
    { name: 'Monnify', url: 'https://monnify.com' }
  ];

  const handleInitFunding = () => {
    const val = parseFloat(amount);
    if (!val || val < 100) return;
    setFundingStep('CHANNEL');
  };

  const handleLaunchPortal = () => {
    if (selectedMethod === 'card') {
      setFundingStep('GATEWAY');
    } else if (selectedMethod === 'monnify') {
      setFundingStep('GATEWAY');
    } else if (selectedMethod === 'ussd') {
      setFundingStep('GATEWAY');
    }
  };

  const handleGatewayAuthorize = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const val = parseFloat(amount);
      updateBalance(val);
      addTransaction({
        title: 'Wallet Top-up',
        amount: val,
        type: 'DEPOSIT',
        channel: PAYMENT_HUBS.find(h => h.id === selectedMethod)?.name || 'Hub Portal'
      });
      setIsProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
    setFundingStep('AMOUNT');
    setSuccess(false);
    setAmount("");
    setSelectedBank(null);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-300 pb-32">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90 transition-all"
          >
            <ArrowLeft size={24} className="dark:text-white" />
          </button>
          <div onClick={() => setHelpNode(HELP_DATABASE.WALLET)} className="cursor-help">
            <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase leading-none flex items-center gap-2">Hub Wallet <HelpCircle size={16} className="text-sun-500 opacity-40" /></h2>
            <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.3em] mt-2">Financial Center</p>
          </div>
        </div>
      </div>

      {/* Capital Display Node */}
      <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden group border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sun-500 rounded-full blur-[100px] opacity-20 -mr-24 -mt-24" />
        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Available Balance</p>
              <h3 className="text-5xl font-black tracking-tighter text-white">₦{balance.toLocaleString()}</h3>
            </div>
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 backdrop-blur-md shadow-xl group-hover:rotate-12 transition-transform duration-500">
              <ShieldCheck size={32} className="text-sun-500" />
            </div>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setActiveOverlay('TOPUP')} className="flex-1 bg-sun-500 text-slate-950 font-black py-5 rounded-3xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest">
              <Plus size={24} strokeWidth={3} /> Top Up Wallet
            </button>
            <button onClick={() => setActiveOverlay('WITHDRAW')} className="flex-1 bg-white/5 text-white font-black py-5 rounded-3xl backdrop-blur-xl flex items-center justify-center gap-3 border border-white/10 active:scale-95 transition-all text-sm uppercase tracking-widest">Payout</button>
          </div>
        </div>
      </div>

      {/* Ledger Manifest - Real-Time */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
            <History size={14} className="text-sun-500" /> Transaction Records
          </h3>
          <button onClick={() => setHelpNode(HELP_DATABASE.LEDGER)} className="p-1 text-slate-300 hover:text-sun-500"><HelpCircle size={18} /></button>
        </div>
        <div className="space-y-4">
          {transactions.map(tx => (
            <button key={tx.id} onClick={() => { setSelectedTx(tx); setActiveOverlay('TX_DETAIL'); }} className="w-full bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-50 dark:border-slate-800 flex justify-between items-center shadow-sm active:scale-[0.98] transition-all text-left group hover:border-sun-500/20">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${tx.amount > 0 && tx.type === 'DEPOSIT' ? 'bg-green-500/10 text-green-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-sun-500'}`}>
                  {tx.amount > 0 && tx.type === 'DEPOSIT' ? <Plus size={24} strokeWidth={3.5} /> : <Receipt size={26} />}
                </div>
                <div>
                  <h4 className="font-black text-lg dark:text-white uppercase tracking-tight leading-none mb-2">{tx.title}</h4>
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">{tx.date}</span>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-black text-xl tracking-tighter ${tx.type === 'DEPOSIT' ? 'text-green-600' : 'dark:text-white'}`}>
                  {tx.type === 'DEPOSIT' ? '+' : '-'}₦{Math.abs(tx.amount).toLocaleString()}
                </span>
                <div className="flex items-center justify-end gap-1.5 mt-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'SUCCESS' ? 'bg-green-500' : 'bg-orange-500'}`} />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{tx.status}</span>
                </div>
              </div>
            </button>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-10 opacity-30 font-black uppercase tracking-widest text-xs">No records found</div>
          )}
        </div>
      </div>

      {/* OVERLAY: FUNDING TERMINAL */}
      {activeOverlay === 'TOPUP' && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-end justify-center animate-in fade-in p-5">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[4rem] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 border border-white/5 relative">
            <button onClick={closeOverlay} className="absolute top-8 right-8 p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 shadow-sm"><X size={24} /></button>

            {success ? (
              <div className="space-y-8 pt-5 text-center animate-in zoom-in">
                <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center mx-auto text-white shadow-xl shadow-green-500/20 ring-8 ring-green-500/10"><CheckCircle size={48} /></div>
                <div className="space-y-2">
                  <h4 className="text-3xl font-black dark:text-white uppercase tracking-tighter">Wallet Updated</h4>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest italic">Funds added to your wallet.</p>
                </div>
                <button onClick={closeOverlay} className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-7 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl">Go Back</button>
              </div>
            ) : fundingStep === 'AMOUNT' ? (
              <div className="space-y-8 pt-5">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black dark:text-white uppercase tracking-tighter">Wallet Top-up</h3>
                  <p className="text-[10px] font-black text-sun-600 uppercase tracking-[0.3em]">Payment System</p>
                </div>
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute left-7 top-1/2 -translate-y-1/2 text-4xl font-black text-sun-500">₦</div>
                    <input
                      autoFocus type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"
                      className="w-full pl-16 p-10 rounded-[3rem] bg-slate-50 dark:bg-slate-800 border-none outline-none text-5xl font-black dark:text-white shadow-inner placeholder-slate-200 dark:placeholder-slate-700"
                    />
                  </div>
                </div>
                <button onClick={handleInitFunding} disabled={!amount || parseFloat(amount) < 100} className="w-full bg-sun-500 text-slate-950 py-7 rounded-[2.2rem] font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-30 border-b-4 border-sun-700">Payment Methods <ArrowRight size={24} /></button>
              </div>
            ) : fundingStep === 'CHANNEL' ? (
              <div className="space-y-6 pt-5">
                <div className="grid grid-cols-1 gap-3">
                  {PAYMENT_HUBS.map(hub => (
                    <button key={hub.id} onClick={() => setSelectedMethod(hub.id)} className={`p-6 rounded-[2.5rem] border-2 flex items-center gap-5 transition-all relative ${selectedMethod === hub.id ? 'border-sun-500 bg-sun-50/20 dark:bg-sun-900/10 shadow-lg' : 'border-slate-100 dark:border-slate-800'}`}>
                      <div className={`w-14 h-14 rounded-2xl ${hub.bgColor} text-white flex items-center justify-center shadow-md`}>{React.createElement(hub.icon as any, { size: 28 })}</div>
                      <div className="text-left flex-1">
                        <span className="text-lg font-black dark:text-white block tracking-tight uppercase leading-none mb-1">{hub.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{hub.desc}</span>
                      </div>
                      {selectedMethod === hub.id && <div className="p-2 bg-sun-500 rounded-full text-white shadow-md animate-in zoom-in"><CheckCircle size={16} strokeWidth={4} /></div>}
                    </button>
                  ))}
                </div>
                <button onClick={handleLaunchPortal} className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-7 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">Proceed to Payment</button>
              </div>
            ) : fundingStep === 'GATEWAY' ? (
              <div className="space-y-8 pt-5 animate-in slide-in-from-right">
                <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                  <button onClick={() => setFundingStep('CHANNEL')} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400"><ArrowLeft size={18} /></button>
                  <div>
                    <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Secure Payment</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedMethod === 'card' ? 'Payment Portal' : selectedMethod === 'monnify' ? 'Account Details' : 'Bank Transfer'}</p>
                  </div>
                </div>

                {selectedMethod === 'card' && (
                  <div className="space-y-6">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Select your preferred secure payment gateway:</p>
                    <div className="grid grid-cols-2 gap-4">
                      {CARD_PROVIDERS.map(p => (
                        <a
                          key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                          onClick={handleGatewayAuthorize}
                          className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl text-center border border-slate-100 dark:border-slate-700 hover:border-sun-500 transition-all font-black text-[10px] uppercase tracking-widest dark:text-white"
                        >
                          {p.name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMethod === 'monnify' && (
                  <div className="space-y-6">
                    <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/10 space-y-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-sun-500/10 rounded-full blur-3xl" />
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wema Bank / Monnify</span>
                        <p className="text-2xl font-black text-white tracking-widest">8234567890</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Name</span>
                        <p className="text-sm font-black text-sun-500 uppercase">EVENING SUN HUB - {amount}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center leading-relaxed">Please transfer the exact amount. <br />Your wallet will be credited automatically.</p>
                    <button onClick={handleGatewayAuthorize} className="w-full bg-sun-500 text-slate-950 py-7 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl">Complete Payment</button>
                  </div>
                )}

                {selectedMethod === 'ussd' && (
                  <div className="space-y-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Select your bank to dial the code:</p>
                    <div className="space-y-3">
                      {USSD_CODES.map(bank => (
                        <button
                          key={bank.name}
                          onClick={() => {
                            setSelectedBank(bank);
                            window.location.href = `tel:${bank.code}${amount}#`;
                            handleGatewayAuthorize();
                          }}
                          className="w-full p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl flex justify-between items-center border border-slate-100 dark:border-slate-700 hover:border-sun-500 transition-all"
                        >
                          <span className="font-black text-sm uppercase tracking-tight dark:text-white">{bank.name}</span>
                          <span className="text-sun-600 font-black text-xs">{bank.code}...</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {isProcessing && (
                  <div className="flex flex-col items-center gap-4 py-5 animate-in fade-in">
                    <Loader2 size={32} className="text-sun-500 animate-spin" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorizing Payment...</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* HELP OVERLAY */}
      {helpNode && (
        <div className="fixed inset-0 z-[600] flex items-end justify-center bg-black/90 backdrop-blur-2xl p-5 animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[3.5rem] p-10 shadow-2xl animate-in slide-in-from-bottom-full duration-500 border border-white/5 relative">
            <button onClick={() => setHelpNode(null)} className="absolute top-7 right-7 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 active:scale-90 transition-transform shadow-sm"><X size={28} /></button>
            <div className="space-y-8 pt-5 text-center">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner"><HelpCircle size={48} /></div>
              <div className="space-y-4">
                <h4 className="text-4xl font-black dark:text-white uppercase tracking-tighter leading-none">{helpNode.title}</h4>
                <p className="text-xl font-bold text-slate-600 dark:text-slate-300 leading-relaxed uppercase tracking-tight italic">"{helpNode.desc}"</p>
              </div>
              <button onClick={() => setHelpNode(null)} className="w-full bg-sun-500 text-white py-6 rounded-[2.2rem] font-black text-sm uppercase tracking-[0.4em] shadow-xl active:scale-95 transition-all">Understood</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
