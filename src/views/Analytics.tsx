import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Calendar, 
  Filter, Download, ArrowUpRight, 
  ArrowDownRight, PieChart, BarChart2,
  Activity, Map, Users, Target, ArrowLeft, ChevronDown, Wallet, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell, Pie
} from 'recharts';
import { cn, Transaction } from '../types';
import { DUMMY_FAMILY } from '../constants';

interface AnalyticsProps {
  transactions: Transaction[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ transactions }) => {
  const [timeframe, setTimeframe] = useState('Monthly');
  
  const totalTransactions = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalTransactionCount = transactions.length;

  const familySpenders = DUMMY_FAMILY.map((member) => {
    const percentage = member.role === 'Admin' ? 65 : 35; 
    const amount = totalTransactions > 0 ? (totalTransactions * percentage) / 100 : 0;
    const count = totalTransactionCount > 0 ? Math.round((totalTransactionCount * percentage) / 100) : 0;
    // Mock user income (Admin vs Member standard)
    const income = member.role === 'Admin' ? 120000 : 45000;
    return {
      ...member,
      amount,
      percentage: totalTransactions > 0 ? percentage : 0,
      count,
      income,
      balance: income - amount
    };
  }).sort((a, b) => b.amount - a.amount);

  type Spender = typeof familySpenders[0];
  const [selectedUser, setSelectedUser] = useState<Spender | null>(null);
  const [compareUser, setCompareUser] = useState<Spender | null>(null);

  const getChartData = () => {
    if (timeframe === 'Weekly' || timeframe === 'Daily') return [
      { name: 'Mon', current: 1200, previous: 900 },
      { name: 'Tue', current: 2100, previous: 1800 },
      { name: 'Wed', current: 800, previous: 1200 },
      { name: 'Thu', current: 1600, previous: 1500 },
      { name: 'Fri', current: 3400, previous: 2800 },
      { name: 'Sat', current: 4200, previous: 3800 },
      { name: 'Sun', current: 2800, previous: 2500 },
    ];
    if (timeframe === 'Monthly') return [
      { name: 'Week 1', current: 8500, previous: 7200 },
      { name: 'Week 2', current: 12400, previous: 14000 },
      { name: 'Week 3', current: 6200, previous: 8100 },
      { name: 'Week 4', current: 9800, previous: 9500 },
    ];
    return [
      { name: 'Q1', current: 28000, previous: 25000 },
      { name: 'Q2', current: 32000, previous: 28000 },
      { name: 'Q3', current: 41000, previous: 35000 },
      { name: 'Q4', current: 39000, previous: 38000 },
    ];
  };
  
  const activeData = getChartData();

  const categoryData = [
    { name: 'Food', value: 35, color: '#6366f1' },
    { name: 'Shopping', value: 25, color: '#10b981' },
    { name: 'Travel', value: 20, color: '#f59e0b' },
    { name: 'Utilities', value: 15, color: '#f43f5e' },
    { name: 'Other', value: 5, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial Analytics</h2>
          <p className="text-slate-500 text-sm">Deep dive into your spending patterns and trends</p>
        </div>
        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          {['Daily', 'Weekly', 'Monthly', 'Yearly'].map((t) => (
            <button 
              key={t}
              onClick={() => setTimeframe(t)}
              className={cn(
                "px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
                timeframe === t ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-bold text-slate-800">Spending Heatmap</h3>
                <p className="text-xs text-slate-400">Daily spending activity for the current week</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <span className="text-xs text-slate-500 font-medium">Current</span>
                </div>
                <div className="flex items-center gap-2 hidden sm:flex">
                  <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                  <span className="text-xs text-slate-500 font-medium">Previous</span>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 ml-2"><Download className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeData}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} width={40} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area name="Current Period" type="monotone" dataKey="current" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSpend)" />
                  <Area name="Previous Period" type="monotone" dataKey="previous" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Top Spending Users</h3>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full">{timeframe}</span>
              </div>
              <div className="space-y-6">
                {(() => {
                  return familySpenders.map((u, i) => {
                    const theme = u.role === 'Admin' 
                      ? { color: 'bg-indigo-500', bg: 'bg-indigo-50', text: 'text-indigo-600' } 
                      : { color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' };
                    
                    return (
                  <div key={i} className="relative cursor-pointer group/user p-3 -mx-3 rounded-2xl hover:bg-slate-50 transition-all" onClick={() => { setSelectedUser(u); setCompareUser(null); }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={u.avatar} className="w-10 h-10 rounded-full shadow-sm" alt={u.name} />
                          {i === 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                              <span className="text-[8px] leading-none">👑</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 text-sm">{u.name}</p>
                            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-md", theme.bg, theme.text)}>{u.role}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">Rank #{i + 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-800">₹{u.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        <p className="text-[10px] text-slate-400 font-bold">{u.percentage}% of total</p>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-2">
                      <div className={cn("h-full rounded-full transition-all duration-1000", theme.color)} style={{ width: `${u.percentage}%` }} />
                    </div>
                  </div>
                )})})()}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Category Comparison</h3>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} width={80} />
                    <Tooltip cursor={{ fill: 'transparent' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] text-white shadow-xl shadow-indigo-100">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">AI Insights</span>
            </div>
            <h3 className="text-xl font-bold mb-4">You're spending 15% more on Food this month.</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-8">
              Based on your history, we suggest reducing your Food spending to save ₹1,500 by month-end.
            </p>
            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:scale-105 transition-all">
              View Food Expenses
            </button>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Monthly Growth</h3>
            <div className="space-y-6">
              {[
                { label: 'Income', value: '+₹12,000', icon: ArrowUpRight, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Savings', value: '+₹5,500', icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                { label: 'Expenses', value: '-₹2,100', icon: ArrowDownRight, color: 'text-rose-500', bg: 'bg-rose-50' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", item.bg)}>
                      <item.icon className={cn("w-5 h-5", item.color)} />
                    </div>
                    <span className="text-sm font-bold text-slate-600">{item.label}</span>
                  </div>
                  <span className={cn("font-bold", item.color)}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-slate-50/95 backdrop-blur-md overflow-y-auto"
          >
            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => { setSelectedUser(null); setCompareUser(null); }} 
                    className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all text-slate-400 hover:text-indigo-600"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h2 className="text-3xl font-bold text-slate-800 tracking-tight">User Profile</h2>
                </div>
                {/* Compare Select */}
                {familySpenders.length > 1 && (
                  <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
                      <Users className="w-5 h-5" />
                    </div>
                    <select 
                      value={compareUser?.id || ''}
                      onChange={(e) => {
                        const target = familySpenders.find(s => s.id === e.target.value);
                        setCompareUser(target || null);
                      }}
                      className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
                    >
                      <option value="">Compare with...</option>
                      {familySpenders.filter(s => s.id !== selectedUser.id).map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                  <div className="relative z-10 flex items-center gap-6">
                    <img src={selectedUser.avatar} className="w-24 h-24 rounded-full border-4 border-white/20 shadow-2xl" alt={selectedUser.name} />
                    <div>
                      <h3 className="text-3xl font-bold mb-1">{selectedUser.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md">{selectedUser.role}</span>
                        <span className="text-indigo-100 text-sm">{selectedUser.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-6 relative z-10 pt-8 border-t border-white/10">
                    <div>
                      <p className="text-indigo-200 text-xs uppercase tracking-widest font-bold mb-1">Total Spending</p>
                      <p className="text-3xl font-black">₹{selectedUser.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                    <div>
                      <p className="text-indigo-200 text-xs uppercase tracking-widest font-bold mb-1">Transactions</p>
                      <p className="text-3xl font-bold">{selectedUser.count}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Wallet className="w-24 h-24 text-emerald-600" />
                  </div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Monthly Income</p>
                  <p className="text-4xl font-black text-slate-800 mb-2">₹{selectedUser.income.toLocaleString()}</p>
                  <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold">
                    <TrendingUp className="w-4 h-4" />
                    <span>Fixed Allowance</span>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-24 h-24 text-indigo-600" />
                  </div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-2">Remaining Balance</p>
                  <p className="text-4xl font-black text-slate-800 mb-2">₹{selectedUser.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                  <div className="flex items-center gap-2 text-indigo-500 text-sm font-bold">
                    <Activity className="w-4 h-4" />
                    <span>Available to spend</span>
                  </div>
                </div>
              </div>

              {/* Comparison Charts */}
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-slate-800">
                    {compareUser ? `Category Comparison: ${selectedUser.name} vs ${compareUser.name}` : `Category Breakdown: ${selectedUser.name}`}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      <span className="text-sm font-bold text-slate-600">{selectedUser.name}</span>
                    </div>
                    {compareUser && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                        <span className="text-sm font-bold text-slate-600">{compareUser.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-[400px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Food', User1: (8500 * selectedUser.percentage) / 100, User2: compareUser ? (8500 * compareUser.percentage) / 100 : 0 },
                      { name: 'Shopping', User1: (15000 * selectedUser.percentage) / 100, User2: compareUser ? (15000 * compareUser.percentage) / 100 : 0 },
                      { name: 'Travel', User1: (4200 * selectedUser.percentage) / 100, User2: compareUser ? (4200 * compareUser.percentage) / 100 : 0 },
                      { name: 'Utilities', User1: (3000 * selectedUser.percentage) / 100, User2: compareUser ? (3000 * compareUser.percentage) / 100 : 0 },
                      { name: 'Entertainment', User1: (1800 * selectedUser.percentage) / 100, User2: compareUser ? (1800 * compareUser.percentage) / 100 : 0 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dx={-10} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 600 }}
                        formatter={(value: number, name: string) => [`₹${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, name === 'User1' ? selectedUser.name : (compareUser ? compareUser.name : '')]}
                      />
                      <Bar dataKey="User1" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={60} />
                      {compareUser && <Bar dataKey="User2" fill="#34d399" radius={[8, 8, 0, 0]} maxBarSize={60} />}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        )}
    </AnimatePresence>

      {/* All Transactions */}
      <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-800">All Transactions</h3>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{transactions.length} total</span>
        </div>
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">No transactions recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <th className="px-6 py-3">Merchant</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3 text-sm font-bold text-slate-800">{t.merchant}</td>
                    <td className="px-6 py-3">
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">{t.category}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-400">{t.date}</td>
                    <td className="px-6 py-3 text-sm font-bold text-slate-800">₹{t.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
