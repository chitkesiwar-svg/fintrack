import React from 'react';
import { 
  User, Shield, Bell, Globe, 
  Sparkles, CreditCard, LogOut, 
  ChevronRight, Camera, Mail, Phone,
  Lock, Eye, Smartphone, HelpCircle
} from 'lucide-react';

export const Settings: React.FC = () => {
  const sections = [
    { id: 'profile', label: 'Profile Settings', icon: User, desc: 'Manage your personal information and avatar' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Update password and enable 2FA' },
    { id: 'notifications', label: 'Notifications', icon: Bell, desc: 'Control which alerts you receive' },
    { id: 'preferences', label: 'AI Preferences', icon: Sparkles, desc: 'Customize SpendWise AI behavior' },
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
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all text-left group"
            >
              <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-600 group-hover:text-slate-800">{s.label}</span>
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
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-10">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img 
                  src="https://picsum.photos/seed/prashansa/200/200" 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-indigo-50 p-1"
                />
                <button className="absolute bottom-0 right-0 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:scale-110 transition-all">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mt-6">Prashansa</h3>
              <p className="text-slate-400 font-medium">Premium Member since Jan 2025</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="text" defaultValue="Prashansa" className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="email" defaultValue="prashansa@example.com" className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all outline-none" />
                </div>
              </div>

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
