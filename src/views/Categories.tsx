import React, { useState } from 'react';
import { 
  ShoppingBag, Utensils, Plane, Zap, 
  Film, Repeat, Briefcase, GraduationCap, 
  HeartPulse, Plus, MoreVertical, X, Sliders, MoreHorizontal, TrendingUp, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Transaction } from '../types';
import { cn } from '../types';

const categoryIcons: Record<string, any> = {
  Shopping: ShoppingBag,
  Food: Utensils,
  Travel: Plane,
  Utilities: Zap,
  Entertainment: Film,
  Subscriptions: Repeat,
  Salary: Briefcase,
  Education: GraduationCap,
  Health: HeartPulse,
  Investments: TrendingUp,
  Custom: Plus,
};

const categoryColors: Record<string, string> = {
  Shopping: '#f43f5e', // Rose
  Food: '#6366f1',     // Indigo
  Travel: '#10b981',   // Emerald
  Utilities: '#f59e0b', // Amber
  Entertainment: '#8b5cf6', // Violet
  Subscriptions: '#ec4899', // Pink
  Salary: '#22c55e',   // Green
  Investments: '#06b6d4', // Cyan
  Education: '#3b82f6', // Blue
  Health: '#ef4444',    // Red
  Custom: '#64748b',    // Slate
};

interface CategoriesProps {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  transactions: Transaction[];
}

export const Categories: React.FC<CategoriesProps> = ({ categories, setCategories, transactions }) => {
  // Category Actions State
  const [activeCategoryMenu, setActiveCategoryMenu] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSettingBudget, setIsSettingBudget] = useState(false);
  const [isViewingCategoryTransactions, setIsViewingCategoryTransactions] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({
    'Food': 12000,
    'Shopping': 10000,
    'Travel': 5000,
    'Utilities': 4000,
  });
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  // Calculate stats for each category
  const categoryStats = categories.map(cat => {
    const catTransactions = transactions.filter(t => t.category === cat);
    const totalSpent = catTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const budget = categoryBudgets[cat] || 0;
    const isOnBudget = budget === 0 || totalSpent <= budget;
    
    return {
      name: cat,
      count: catTransactions.length,
      spent: totalSpent,
      budget,
      isOnBudget
    };
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories(prev => [...prev, newCategoryName.trim()]);
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const Icon = categoryIcons[category] || Plus;
    return <Icon className="w-6 h-6 text-white" />;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Budget & Categories</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Manage your spending categories and limits</p>
        </div>
        <button 
          onClick={() => setIsAddingCategory(true)}
          className="w-full sm:w-auto px-5 sm:px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {categoryStats.map((stat) => {
          const percentage = stat.budget > 0 ? Math.min((stat.spent / stat.budget) * 100, 100) : 0;
          
          return (
            <div key={stat.name} className="bg-white p-4 sm:p-6 lg:p-8 rounded-[24px] sm:rounded-[32px] lg:rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative flex flex-col">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg transition-all group-hover:scale-110"
                  style={{ backgroundColor: categoryColors[stat.name] || '#64748b' }}
                >
                  {getCategoryIcon(stat.name)}
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setActiveCategoryMenu(activeCategoryMenu === stat.name ? null : stat.name)}
                    className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {activeCategoryMenu === stat.name && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setActiveCategoryMenu(null)}
                        />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-20 py-1 overflow-hidden"
                        >
                          <button 
                            onClick={() => {
                              setSelectedCategory(stat.name);
                              setNewBudgetAmount(categoryBudgets[stat.name]?.toString() || '');
                              setIsSettingBudget(true);
                              setActiveCategoryMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            Set Budget
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedCategory(stat.name);
                              setIsViewingCategoryTransactions(true);
                              setActiveCategoryMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                            View Transactions
                          </button>
                          <button 
                            onClick={() => {
                              setCategoryToDelete(stat.name);
                              setActiveCategoryMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete Category
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <h3 className="font-bold text-slate-800 mb-0.5 text-sm sm:text-base truncate">{stat.name}</h3>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-wider truncate">{stat.count} Transactions</p>
              <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4 flex-1 flex flex-col justify-end">
                {stat.budget > 0 ? (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-[11px] gap-1 sm:gap-0">
                      <span className="text-slate-500 font-medium truncate">Spent: <span className="text-slate-800 font-bold">₹{stat.spent.toLocaleString()}</span></span>
                      <span className="text-slate-500 font-medium truncate">Limit: <span className="text-slate-800 font-bold">₹{stat.budget.toLocaleString()}</span></span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={cn(
                          "h-full rounded-full",
                          stat.isOnBudget ? "bg-indigo-600" : "bg-rose-500"
                        )}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[10px] font-bold",
                        stat.isOnBudget ? "text-indigo-600" : "text-rose-600"
                      )}>
                        {percentage.toFixed(0)}% used
                      </span>
                      <span className={cn(
                        "text-[10px] font-bold",
                        stat.isOnBudget ? "text-slate-400" : "text-rose-600"
                      )}>
                        {stat.isOnBudget 
                          ? `₹${(stat.budget - stat.spent).toLocaleString()} left` 
                          : `₹${(stat.spent - stat.budget).toLocaleString()} over`
                        }
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] text-slate-400 font-medium italic">No budget set for this category</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isAddingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Add New Category</h3>
                <button onClick={() => setIsAddingCategory(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <form onSubmit={handleAddCategory} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Category Name</label>
                  <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g. Gifts, Pets, etc."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                    autoFocus
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  Create Category
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Set Budget Modal */}
      <AnimatePresence>
        {isSettingBudget && selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Set Budget for {selectedCategory}</h3>
                <button onClick={() => setIsSettingBudget(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                if (newBudgetAmount && !isNaN(Number(newBudgetAmount))) {
                  setCategoryBudgets(prev => ({ ...prev, [selectedCategory]: Number(newBudgetAmount) }));
                  setIsSettingBudget(false);
                }
              }} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Monthly Limit (₹)</label>
                  <input 
                    type="number" 
                    value={newBudgetAmount}
                    onChange={(e) => setNewBudgetAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                    autoFocus
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
                >
                  Save Budget
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Category Transactions Modal */}
      <AnimatePresence>
        {isViewingCategoryTransactions && selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl border border-slate-100 max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedCategory} Transactions</h3>
                  <p className="text-sm text-slate-400 font-medium">
                    Total: ₹{transactions.filter(t => t.category === selectedCategory).reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                  </p>
                </div>
                <button onClick={() => setIsViewingCategoryTransactions(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {transactions.filter(t => t.category === selectedCategory).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm text-white"
                        style={{ backgroundColor: categoryColors[t.category] || '#64748b' }}
                      >
                        {/* Inline icon helper for transactions */}
                        {statIcons[t.category] ? React.createElement(statIcons[t.category], { className: "w-5 h-5" }) : <Plus className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{t.merchant}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{t.date}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-800">₹{t.amount.toLocaleString()}</p>
                  </div>
                ))}
                {transactions.filter(t => t.category === selectedCategory).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-slate-400 font-medium">No transactions found in this category.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Category Confirmation Modal */}
      <AnimatePresence>
        {categoryToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden p-6 sm:p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Category?</h3>
              <p className="text-slate-500 text-sm mb-8">
                Are you sure you want to delete <span className="font-bold text-slate-800">"{categoryToDelete}"</span>? This will remove the category and its budget limit.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setCategoryToDelete(null)}
                  className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  No, Keep it
                </button>
                <button 
                  onClick={() => {
                    setCategories(prev => prev.filter(c => c !== categoryToDelete));
                    setCategoryToDelete(null);
                  }}
                  className="py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const statIcons: Record<string, any> = {
  Shopping: ShoppingBag,
  Food: Utensils,
  Travel: Plane,
  Utilities: Zap,
  Entertainment: Film,
  Subscriptions: Repeat,
  Salary: Briefcase,
  Education: GraduationCap,
  Health: HeartPulse,
  Investments: TrendingUp,
};
