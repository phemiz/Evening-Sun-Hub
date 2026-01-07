import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, CreditCard, ShieldCheck } from 'lucide-react';

export const Cart = () => {
  const { cart, addToCart, removeFromCart, deleteFromCart } = useApp();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = total > 0 ? 1000 : 0;

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto text-slate-300">
            <ShoppingBag size={48} />
        </div>
        <div className="space-y-2">
            <h3 className="text-xl font-black dark:text-white">Your cart is empty</h3>
            <p className="text-sm text-slate-500 font-medium">Browse our lounge menu or mart for delicious treats.</p>
        </div>
        <button 
            onClick={() => navigate('/eatery')} 
            className="bg-sun-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-sun-500/20 active:scale-95 transition-all"
        >
            Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-40 animate-in slide-in-from-right duration-300">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={20} className="dark:text-white" />
        </button>
        <h2 className="text-xl font-black dark:text-white tracking-tight uppercase text-sm">Review Order</h2>
      </div>

      {/* Item List */}
      <div className="space-y-4">
        {cart.map(item => (
          <div key={item.id} className="flex gap-4 bg-white dark:bg-slate-800 p-4 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 animate-in slide-in-from-bottom-2">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-black text-slate-800 dark:text-white leading-tight">{item.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{item.category}</p>
                  </div>
                  <button onClick={() => deleteFromCart(item.id)} className="text-slate-300 hover:text-red-500 p-1 transition-colors">
                      <Trash2 size={16} />
                  </button>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <span className="font-black text-sun-600">₦{item.price.toLocaleString()}</span>
                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-900 rounded-xl px-3 py-1.5 border border-slate-200 dark:border-slate-700">
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-500 p-1"><Minus size={14} /></button>
                  <span className="text-xs font-black w-4 text-center dark:text-white">{item.quantity}</span>
                  <button onClick={() => addToCart(item)} className="text-slate-500 hover:text-green-500 p-1"><Plus size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 space-y-4 shadow-sm">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-400 uppercase tracking-widest">Basket Subtotal</span>
          <span className="dark:text-white">₦{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-400 uppercase tracking-widest">Service & Delivery</span>
          <span className="dark:text-white">₦{deliveryFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xl font-black pt-4 border-t border-dashed border-slate-100 dark:border-slate-700 mt-2">
          <span className="dark:text-white tracking-tight">Grand Total</span>
          <span className="text-sun-600">₦{(total + deliveryFee).toLocaleString()}</span>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl flex items-center gap-3">
            <ShieldCheck size={18} className="text-green-500" />
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Paystack Secured Checkout Enabled</p>
        </div>
      </div>

      {/* FIXED CHECKOUT ACTION BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800 p-6 z-50">
        <button 
            onClick={() => navigate('/payment')}
            className="w-full max-w-md mx-auto bg-slate-900 dark:bg-sun-500 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-black/20 flex items-center justify-center gap-4 transition-all active:scale-95"
        >
            <CreditCard size={24} />
            <span>PROCEED TO CHECKOUT</span>
        </button>
      </div>
    </div>
  );
};