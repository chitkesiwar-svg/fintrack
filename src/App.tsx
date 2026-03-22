import React, { useState, useEffect } from 'react';
import { Sidebar, Header } from './components/Navigation';
import { Dashboard } from './views/Dashboard';
import { AddExpense } from './views/AddExpense';
import { Categories } from './views/Categories';
import { Analytics } from './views/Analytics';
import { SavingsGoals } from './views/SavingsGoals';
import { Invoices } from './views/Invoices';
import { Settings } from './views/Settings';
import { LandingPage } from './views/LandingPage';
import { SpendWiseAI } from './components/SpendWiseAI';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_TRANSACTIONS, CATEGORIES } from './constants';
import { Transaction, IncomeSource } from './types';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  if (!isLoggedIn) {
    return <LandingPage onStart={() => setIsLoggedIn(true)} />;
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
          />
        );
      case 'analytics':
        return <Analytics transactions={transactions} />;
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      <main className="flex-1 flex flex-col overflow-hidden w-full relative">
        <Header activeTab={activeTab} onMenuClick={() => setIsMobileMenuOpen(true)} />
        
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

      <SpendWiseAI />

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
