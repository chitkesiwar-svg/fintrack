import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from './components/Navigation';
import { Dashboard } from './views/Dashboard';
import { AddExpense } from './views/AddExpense';
import { Categories } from './views/Categories';
import { Analytics } from './views/Analytics';
import { SavingsGoals } from './views/SavingsGoals';
import { Invoices } from './views/Invoices';
import { Settings } from './views/Settings';
import { Accounts } from './views/Accounts';
import { Transactions } from './views/Transactions';
import { LandingPage } from './views/LandingPage';
import { Onboarding } from './views/Onboarding';
import { SpendWiseAI } from './components/SpendWiseAI';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Sparkles } from 'lucide-react';
import { DUMMY_TRANSACTIONS, CATEGORIES, DUMMY_FAMILY } from './constants';
import { Transaction, IncomeSource, FamilyMember } from './types';

const DEFAULT_USER = {
  id: 'user_default_local',
  name: 'Prashansa (Auto Login)',
  email: 'local@fintrack.app',
  avatar: 'https://ui-avatars.com/api/?name=Prashansa&background=random&color=fff',
  role: 'Admin',
  isLoggedIn: true
};

export default function App() {
  const [user, setUser] = useState<any>(() => {
    let saved = localStorage.getItem('fintrack_user');
    if (saved) return JSON.parse(saved);
    return null; // No user → show Landing
  });
  const [isOnboarding, setIsOnboarding] = useState(false);
  const isLoggedIn = !!user;

  const [activeTab, setActiveTab] = useState('home');
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [family, setFamily] = useState<FamilyMember[]>([]);

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setFamily(data); else setFamily(DUMMY_FAMILY); })
      .catch(() => setFamily(DUMMY_FAMILY));
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/transactions')
        .then(res => res.json())
        .then(data => setTransactions(data))
        .catch(err => console.error('Failed to load transactions:', err));

      fetch('/api/income')
        .then(res => res.json())
        .then(data => setIncomeSources(data))
        .catch(err => console.error('Failed to load income sources:', err));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && !isOnboarding) {
      if (!sessionStorage.getItem('fintrack_welcomed')) {
        const playGreeting = () => {
          const name = user?.name || (user?.email ? user.email.split('@')[0] : 'User');
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(`Hello ${name}. Welcome to FinTrack.`);

            // Calmer, smoother, polite settings
            utterance.rate = 0.85; // Slightly slower for a calmer tone
            utterance.pitch = 1.05; // Slightly higher pitch for a polite feminine baseline
            utterance.volume = 0.8; // Softer volume

            const setBestVoice = () => {
              const voices = window.speechSynthesis.getVoices();
              // Attempt to find a premium female voice specific to Mac/Chrome
              const preferredVoices = ['Google UK English Female', 'Samantha', 'Victoria', 'Karen', 'Moira'];
              let selectedVoice = null;

              for (const pref of preferredVoices) {
                selectedVoice = voices.find(v => v.name.includes(pref));
                if (selectedVoice) break;
              }

              // Fallback to any generic female voice
              if (!selectedVoice) {
                selectedVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman'));
              }

              if (selectedVoice) {
                utterance.voice = selectedVoice;
              }

              window.speechSynthesis.speak(utterance);
            };

            // Browsers load voices asynchronously, wait if necessary
            if (window.speechSynthesis.getVoices().length > 0) {
              setBestVoice();
            } else {
              window.speechSynthesis.addEventListener('voiceschanged', setBestVoice, { once: true });
            }
          }
          sessionStorage.setItem('fintrack_welcomed', 'true');
        };

        playGreeting();
      }
    }
  }, [isLoggedIn, isOnboarding, user]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'status'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Completed'
    };

    try {
      const resp = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTransaction)
      });
      if (resp.ok) {
        setTransactions(prev => [newTransaction, ...prev]);
      }
    } catch (err) {
      console.error('Error saving transaction:', err);
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('fintrack_user', JSON.stringify(userData));

    if (!localStorage.getItem('fintrack_onboarded')) {
      setIsOnboarding(true);
    }
  };

  const handleOnboardingComplete = (updatedUser: any) => {
    setUser(updatedUser);
    localStorage.setItem('fintrack_user', JSON.stringify(updatedUser));
    localStorage.setItem('fintrack_onboarded', 'true');
    setIsOnboarding(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fintrack_user');
    localStorage.removeItem('fintrack_onboarded');
    sessionStorage.removeItem('fintrack_welcomed');
    setActiveTab('home');
  };

  if (!isLoggedIn) {
    return <LandingPage onStart={handleLogin} />;
  }

  if (isOnboarding) {
    return <Onboarding user={user} onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Dashboard
            transactions={transactions}
            setTransactions={setTransactions}
            incomeSources={incomeSources}
            setIncomeSources={setIncomeSources}
            onViewTransactions={() => setActiveTab('transactions')}
            user={user}
            onUpdateUser={(updated) => setUser(updated)}
            family={family}
            setFamily={setFamily}
          />
        );
      case 'transactions':
        return <Transactions transactions={transactions} />;
      case 'accounts':
        return <Accounts />;
      case 'analytics':
        return <Analytics transactions={transactions} family={family} />;
      case 'add-expense':
        return <AddExpense categories={categories} onAddExpense={addTransaction} onDone={() => setActiveTab('home')} />;
      case 'budget-categories':
        return <Categories categories={categories} setCategories={setCategories} transactions={transactions} />;
      case 'savings':
        return <SavingsGoals />;
      case 'invoices':
        return <Invoices />;
      case 'settings':
        return <Settings />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
              <span className="text-4xl">🚧</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">Screen Under Construction</h2>
            <p>We're working hard to bring you the {activeTab.replace('-', ' ')} feature!</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden relative w-full">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        <Header activeTab={activeTab} onMenuClick={() => setIsMobileMenuOpen(true)} user={user} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center gap-2 sm:gap-3 z-40">
        <SpendWiseAI />
        <button
          onClick={() => setActiveTab('add-expense')}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 transition-all group"
          title="Quick Add Expense"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
