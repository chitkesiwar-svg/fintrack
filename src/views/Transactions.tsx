import React, { useState } from 'react';
import { Transaction } from '../types';
import { motion } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Search, Filter, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export const Transactions: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = transactions.filter(t => 
    t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">All Transactions</h2>
          <p className="text-slate-500 text-sm mt-1">A detailed log of all your expenses and incomes.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..." 
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-lg">No transactions found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((t, idx) => {
              const date = parseISO(t.date);
              const isIncome = t.category === 'Income' || t.amount > 0 && t.category.includes('Credit'); // Adapt logic as needed
              const displayAmount = Math.abs(t.amount);
              
              return (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="p-3 sm:p-4 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm ${
                      isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {isIncome ? <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" /> : <ArrowDownRight className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm sm:text-base truncate">{t.merchant}</p>
                      <div className="flex items-center gap-2 mt-0.5 sm:mt-1 flex-wrap">
                        <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md font-medium">
                          {t.category}
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-400 hidden sm:inline">
                          • {format(date, 'MMM d, yyyy \u2022 h:mm a')}
                        </span>
                        <span className="text-[10px] text-slate-400 sm:hidden">
                          {format(date, 'MMM d')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-bold text-sm sm:text-lg ${isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
                      {isIncome ? '+' : '-'}₹{displayAmount.toLocaleString()}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1 capitalize hidden sm:block">{t.paymentMethod} • {t.status}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
