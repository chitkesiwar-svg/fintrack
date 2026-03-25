import React, { useState, useEffect } from 'react';
import { 
  User, Shield, Bell, Globe, 
  Sparkles, CreditCard, LogOut, 
  ChevronRight, Camera, Mail, Phone,
  Lock, Eye, Smartphone, HelpCircle, Users, Search
} from 'lucide-react';
import { motion } from 'motion/react';

export const Settings: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSection, setActiveSection] = useState('security');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setUsers(data); })
      .catch(err => console.error('Failed to load users:', err));
  }, []);

  const filteredUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sections = [
    { id: 'security', label: 'Security', icon: Shield, desc: 'Update password and enable 2FA' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Control which alerts you receive' },
    { id: 'household', label: 'Household Members', icon: Users, desc: 'Manage family members' },
    { id: 'billing', label: 'Subscription & Billing', icon: CreditCard, desc: 'Manage your plan and payment methods' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, desc: 'Get assistance and read FAQs' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Settings</h2>
        <p className="text-slate-500">Manage your account preferences and security settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 space-y-4">
          {sections.map((s) => (
            <button 
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                activeSection === s.id 
                  ? 'bg-white shadow-sm border-slate-100' 
                  : 'border-transparent hover:bg-white hover:shadow-sm hover:border-slate-100'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                activeSection === s.id 
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'
              }`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`text-sm font-bold ${
                activeSection === s.id ? 'text-slate-800' : 'text-slate-600 group-hover:text-slate-800'
              }`}>{s.label}</span>
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button className="w-full flex items-center gap-4 p-4 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all text-left font-bold text-sm">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="md:col-span-2 space-y-8">
          {activeSection === 'household' ? (
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Household Members</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="w-48 pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>
              <div className="space-y-3">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">No members found.</p>
                  </div>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=random&color=fff`}
                          alt="" className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{user.name || 'Anonymous'}</p>
                          <p className="text-xs text-slate-400">{user.email || user.phone || 'No contact'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                          user.role === 'Admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'
                        }`}>{user.role || 'Member'}</span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-4">
                  {(() => { const S = sections.find(s => s.id === activeSection); return S ? <S.icon className="w-10 h-10" /> : null; })()}
                </div>
                <h3 className="text-2xl font-bold text-slate-800">{sections.find(s => s.id === activeSection)?.label}</h3>
                <p className="text-slate-400 font-medium mt-2">{sections.find(s => s.id === activeSection)?.desc}</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Currency</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <select className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all outline-none appearance-none">
                      <option>INR (₹) - Indian Rupee</option>
                      <option>USD ($) - US Dollar</option>
                      <option>EUR (€) - Euro</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end gap-4">
                <button className="px-8 py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors">Cancel</button>
                <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          <div className="bg-rose-50 border border-rose-100 p-8 rounded-[40px] flex items-center justify-between">
            <div>
              <h4 className="font-bold text-rose-900">Danger Zone</h4>
              <p className="text-sm text-rose-700">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <button className="px-6 py-3 bg-white border border-rose-200 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-all">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
