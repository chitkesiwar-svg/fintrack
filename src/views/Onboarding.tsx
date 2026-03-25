import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Wallet } from 'lucide-react';

interface OnboardingProps {
  user: any;
  onComplete: (data: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user?.name || '');
  const [income, setIncome] = useState('');

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else finish();
  };

  const finish = async () => {
    const finalName = name || user?.phone || 'User';

    if (income) {
      await fetch('/api/settings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'monthlyIncome', value: income })
      }).catch(console.error);
    }

    await fetch('/api/users/profile', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: user.id, 
        name: finalName, 
        avatar: user?.avatar || `https://ui-avatars.com/api/?name=${finalName}&background=random&color=fff`,
        role: user?.role || 'Member'
      })
    }).catch(console.error);

    onComplete({ ...user, name: finalName });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 overflow-hidden relative"
      >
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex gap-2">
            <div className={`w-12 h-2 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-100'}`} />
            <div className={`w-12 h-2 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-100'}`} />
          </div>
          <button onClick={finish} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Skip for now</button>
        </div>

        <div className="relative z-10 min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                  <User className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome to FinTrack!</h2>
                <p className="text-slate-500 mb-8">Let's personalize your experience. What should we call you?</p>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-200 text-lg font-bold text-slate-700 mb-8 transition-shadow"
                />
                <div className="mt-auto">
                  <button 
                    onClick={handleNext} 
                    disabled={!name} 
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg disabled:opacity-50 hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
                  <Wallet className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Monthly Income</h2>
                <p className="text-slate-500 mb-8">This helps us calculate your safe-to-spend limit immediately.</p>
                <div className="relative mb-8">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">₹</span>
                  <input 
                    type="number" 
                    value={income} 
                    onChange={e => setIncome(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-emerald-200 text-xl font-bold text-slate-700 transition-shadow"
                  />
                </div>
                <div className="mt-auto">
                  <button 
                    onClick={handleNext} 
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200"
                  >
                    Finish Setup
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
