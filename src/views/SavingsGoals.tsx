import React, { useState } from 'react';
import { 
  Target, Plus, TrendingUp, 
  Calendar, ArrowRight, Trophy,
  Zap, Heart, Home, Plane, X, Save
} from 'lucide-react';
import { DUMMY_SAVINGS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

const goalIcons: Record<string, any> = {
  Laptop: Zap,
  Plane: Plane,
  Home: Home,
  Heart: Heart,
};

export const SavingsGoals: React.FC = () => {
  const [goals, setGoals] = useState(DUMMY_SAVINGS.map(g => ({ ...g })));
  const [showModal, setShowModal] = useState(false);
  const [addSavingsId, setAddSavingsId] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState('');
  const [editDateId, setEditDateId] = useState<string | null>(null);
  const [editDateValue, setEditDateValue] = useState('');

  // New Goal Form
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '', icon: 'Laptop' });

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.target) return;
    setGoals([...goals, {
      id: String(goals.length + 1),
      name: newGoal.name,
      target: Number(newGoal.target),
      current: 0,
      deadline: newGoal.deadline || '2026-12-31',
      icon: newGoal.icon,
    }]);
    setNewGoal({ name: '', target: '', deadline: '', icon: 'Laptop' });
    setShowModal(false);
  };

  const handleAddSavings = (goalId: string) => {
    const amount = Number(addAmount);
    if (!amount || amount <= 0) return;
    setGoals(goals.map(g => g.id === goalId ? { ...g, current: Math.min(g.current + amount, g.target) } : g));
    setAddSavingsId(null);
    setAddAmount('');
  };

  const handleSaveDate = (goalId: string) => {
    setGoals(goals.map(g => g.id === goalId ? { ...g, deadline: editDateValue } : g));
    setEditDateId(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Savings Goals</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Track your progress towards your big dreams</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          const Icon = goalIcons[goal.icon] || Target;

          return (
            <div key={goal.id} className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Target Date</p>
                    {editDateId === goal.id ? (
                      <div className="flex items-center gap-1">
                        <input type="date" value={editDateValue} onChange={e => setEditDateValue(e.target.value)}
                          className="text-xs px-2 py-1 border border-indigo-200 rounded-lg outline-none"
                        />
                        <button onClick={() => handleSaveDate(goal.id)} className="text-emerald-500"><Save className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setEditDateId(goal.id); setEditDateValue(goal.deadline); }}
                        className="flex items-center gap-1 text-slate-800 font-bold text-xs hover:text-indigo-600 transition-colors"
                      >
                        <Calendar className="w-3 h-3 text-indigo-600" />
                        <span>{goal.deadline}</span>
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">{goal.name}</h3>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-indigo-600">₹{goal.current.toLocaleString()}</span>
                    <span className="text-slate-400 font-medium text-xs">/ ₹{goal.target.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-indigo-600 rounded-full shadow-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{percentage.toFixed(1)}%</span>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-[10px]">
                      <TrendingUp className="w-3 h-3" />
                      <span>On Track</span>
                    </div>
                  </div>
                </div>

                {addSavingsId === goal.id ? (
                  <div className="flex gap-2">
                    <input 
                      type="number" value={addAmount} onChange={e => setAddAmount(e.target.value)}
                      placeholder="₹ Amount" autoFocus
                      className="flex-1 px-3 py-2.5 text-sm border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                    <button onClick={() => handleAddSavings(goal.id)} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                      Add
                    </button>
                    <button onClick={() => setAddSavingsId(null)} className="p-2.5 text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => { setAddSavingsId(goal.id); setAddAmount(''); }}
                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-all"
                  >
                    Add Savings
                  </button>
                )}
              </div>
              
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          );
        })}

        <div 
          onClick={() => setShowModal(true)}
          className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-indigo-300 transition-all"
        >
          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 group-hover:text-indigo-400 transition-all shadow-sm">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-400 group-hover:text-slate-600 transition-colors">What are you saving for?</h3>
        </div>
      </div>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 z-10"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Create New Goal</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Goal Name</label>
                  <input type="text" value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g. New MacBook Pro"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Target Amount (₹)</label>
                  <input type="number" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Target Date</label>
                  <input type="date" value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Icon</label>
                  <div className="flex gap-3">
                    {Object.entries(goalIcons).map(([key, IconComp]) => (
                      <button key={key} onClick={() => setNewGoal({...newGoal, icon: key})}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newGoal.icon === key ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-200' : 'bg-slate-50 text-slate-400'}`}
                      >
                        <IconComp className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleAddGoal} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mt-4">
                  <Save className="w-5 h-5" />
                  Create Goal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
