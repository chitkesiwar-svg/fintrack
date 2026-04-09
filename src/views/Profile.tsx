import React from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Shield, Briefcase, Users, IndianRupee, ArrowLeft } from 'lucide-react';
import { cn, FamilyMember, IncomeSource } from '../types';

interface ProfileProps {
  user: any;
  incomeSources: IncomeSource[];
  family: FamilyMember[];
  onBack: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, incomeSources, family, onBack }) => {
  const name = user?.name || 'User';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const email = user?.email || 'user@fintrack.app';
  const role = user?.role || 'Member';
  const phone = user?.phone || '+91 98765 43210';

  const totalIncome = incomeSources.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-8 flex flex-col sm:flex-row items-center gap-5">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={name}
              className="w-20 h-20 rounded-full border-4 border-white/30 shadow-xl object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
            />
          ) : null}
          <div
            className={cn(
              "w-20 h-20 rounded-full border-4 border-white/30 shadow-xl bg-white/20 flex items-center justify-center text-2xl font-bold text-white",
              user?.avatar ? "hidden" : ""
            )}
          >
            {initials}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white">{name}</h2>
            <span className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white/90 uppercase tracking-wider">
              <Shield className="w-3 h-3" /> {role}
            </span>
            <p className="text-indigo-100 text-sm mt-2">{email}</p>
          </div>
        </div>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
      >
        <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Mail className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email</p>
              <p className="text-sm font-medium text-slate-700">{email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Phone className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Phone</p>
              <p className="text-sm font-medium text-slate-700">{phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-violet-600" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Role</p>
              <p className="text-sm font-medium text-slate-700">{role}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Income Details */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400">Income Details</h3>
          <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            ₹{totalIncome.toLocaleString('en-IN')}/mo
          </span>
        </div>
        {incomeSources.length > 0 ? (
          <div className="space-y-2.5">
            {incomeSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between py-2.5 px-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{source.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-800">₹{source.amount.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-4">No income sources added yet.</p>
        )}
      </motion.div>

      {/* Family Members */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs uppercase font-bold tracking-widest text-slate-400">Family Members</h3>
        </div>
        {family.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {family.map((member) => {
              const memberInitials = member.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
              return (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }}
                    />
                  ) : null}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-200",
                      member.avatar ? "hidden" : ""
                    )}
                  >
                    {memberInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{member.name}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{member.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400 text-center py-4">No family members added.</p>
        )}
      </motion.div>
    </div>
  );
};
