import React from 'react';
import { 
  Target, Plus, TrendingUp, 
  Calendar, ArrowRight, Trophy,
  Zap, Heart, Home, Plane
} from 'lucide-react';
import { DUMMY_SAVINGS } from '../constants';
import { motion } from 'motion/react';

const goalIcons: Record<string, any> = {
  Laptop: Zap,
  Plane: Plane,
  Home: Home,
  Heart: Heart,
};

export const SavingsGoals: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Savings Goals</h2>
          <p className="text-slate-500 text-sm">Track your progress towards your big dreams</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Create New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {DUMMY_SAVINGS.map((goal) => {
          const percentage = (goal.current / goal.target) * 100;
          const Icon = goalIcons[goal.icon] || Target;

          return (
            <div key={goal.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Target Date</p>
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>{goal.deadline}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{goal.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-indigo-600">₹{goal.current.toLocaleString()}</span>
                    <span className="text-slate-400 font-medium">of ₹{goal.target.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className="h-full bg-indigo-600 rounded-full shadow-sm"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-800">{percentage.toFixed(1)}% Completed</span>
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>On Track</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex items-center gap-4">
                  <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:scale-105 transition-all">
                    Add Savings
                  </button>
                  <button className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all">
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          );
        })}

        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center p-12 text-center group cursor-pointer hover:border-indigo-300 transition-all">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-300 mb-6 group-hover:scale-110 group-hover:text-indigo-400 transition-all shadow-sm">
            <Trophy className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-400 group-hover:text-slate-600 transition-colors">What are you saving for?</h3>
          <p className="text-slate-400 mt-2 max-w-[200px]">Start a new goal and reach your milestones faster with AI.</p>
        </div>
      </div>
    </div>
  );
};
