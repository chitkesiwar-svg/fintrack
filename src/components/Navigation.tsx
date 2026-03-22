import React, { useState } from 'react';
import { 
  Home, BarChart2, PlusCircle, Grid, CreditCard, 
  PieChart, Target, Repeat, FileText, Download, Settings,
  LogOut, Menu, X, Search, Bell, Calendar as CalendarIcon,
  ChevronDown, UserPlus, Trash2, Edit2, Check, AlertCircle,
  MessageSquare, Send, Sparkles
} from 'lucide-react';
import { cn } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const sidebarItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'add-expense', label: 'Add Expense', icon: PlusCircle },
  { id: 'budget-categories', label: 'Budget & Categories', icon: Grid },
  { id: 'savings', label: 'Savings Goals', icon: Target },
  { id: 'invoices', label: 'Invoices', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="h-full flex flex-col bg-white border-r border-slate-100 w-64">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <Sparkles className="text-white w-6 h-6" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-800">FinTrack</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto py-4">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-indigo-50 text-indigo-600 font-medium" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              activeTab === item.id ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
            )} />
            <span className="text-sm">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export const Header: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-slate-800 capitalize">
          {activeTab === 'budget-categories' ? 'Budget & Categories' : activeTab.replace('-', ' ')}
        </h1>
        {activeTab === 'home' && (
          <p className="text-xs text-slate-400">Hi Prashansa 👋 Here’s your financial summary</p>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-slate-50 border-none rounded-full pl-10 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 leading-none">Prashansa</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-1">Premium Plan</p>
            </div>
            <img 
              src="https://picsum.photos/seed/prashansa/100/100" 
              alt="Profile" 
              className="w-10 h-10 rounded-full border-2 border-indigo-100 p-0.5"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
