import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Calendar, 
  Filter, Download, ArrowUpRight, 
  ArrowDownRight, PieChart, BarChart2,
  Activity, Map, Users, Target
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell, Pie
} from 'recharts';
import { cn } from '../types';

export const Analytics: React.FC = () => {
  const [timeframe, setTimeframe] = useState('Monthly');

  const spendingData = [
    { name: 'Mon', value: 1200 },
    { name: 'Tue', value: 2100 },
    { name: 'Wed', value: 800 },
    { name: 'Thu', value: 1600 },
    { name: 'Fri', value: 3400 },
    { name: 'Sat', value: 4200 },
    { name: 'Sun', value: 2800 },
  ];

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
                  <span className="text-xs text-slate-500 font-medium">Spending</span>
                </div>
                <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><Download className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendingData}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorSpend)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Top Merchants</h3>
              <div className="space-y-6">
                {[
                  { name: 'Amazon', amount: '₹24,500', count: 12, color: 'bg-indigo-50' },
                  { name: 'Zomato', amount: '₹8,200', count: 24, color: 'bg-rose-50' },
                  { name: 'Uber', amount: '₹4,100', count: 18, color: 'bg-slate-50' },
                ].map((m, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-slate-600", m.color)}>
                        {m.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{m.name}</p>
                        <p className="text-xs text-slate-400">{m.count} transactions</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-800">{m.amount}</span>
                  </div>
                ))}
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
    </div>
  );
};
