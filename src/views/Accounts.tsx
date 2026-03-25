import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Shield, Search, ArrowRight, CreditCard, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

const CARDS = [
  {
    id: 1,
    type: 'Visa',
    brand: 'Platinum',
    userName: 'Prashansa C.',
    balance: 12450.50,
    mask: '**** 4242',
    gradient: 'from-slate-900 via-slate-800 to-slate-900',
    shadow: 'shadow-slate-900/30'
  },
  {
    id: 2,
    type: 'Mastercard',
    brand: 'World Elite',
    userName: 'Prashansa C.',
    balance: 3420.00,
    mask: '**** 8821',
    gradient: 'from-indigo-600 via-purple-600 to-indigo-800',
    shadow: 'shadow-indigo-600/30'
  },
  {
    id: 3,
    type: 'Visa',
    brand: 'Signature',
    userName: 'Prashansa C.',
    balance: 850.75,
    mask: '**** 1190',
    gradient: 'from-emerald-500 via-teal-500 to-emerald-700',
    shadow: 'shadow-emerald-600/30'
  }
];

const SmartCardSelector = () => {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <div className="relative w-full max-w-md h-[280px]">
      <AnimatePresence>
        {CARDS.map((card, index) => {
          const offset = (index - activeCard + CARDS.length) % CARDS.length;
          const isActive = offset === 0;
          
          return (
            <motion.div
              key={card.id}
              onClick={() => setActiveCard(index)}
              initial={false}
              animate={{
                top: offset * 24, // Stack spacing
                scale: 1 - offset * 0.05, // Shrink cards behind
                zIndex: CARDS.length - offset,
                opacity: 1 - offset * 0.15, // Fade cards behind
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(
                "absolute left-0 right-0 h-[220px] rounded-3xl p-6 cursor-pointer overflow-hidden border border-white/10",
                "bg-gradient-to-br shadow-2xl transition-shadow backdrop-blur-xl",
                card.gradient,
                isActive ? card.shadow : "shadow-none"
              )}
            >
              {/* Glassmorphism Shine Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50 mix-blend-overlay pointer-events-none"></div>
              
              {/* Glassmorphism Ambient Glows */}
              <div className="absolute -right-20 -top-20 w-56 h-56 bg-white/10 blur-3xl rounded-full pointer-events-none"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 blur-2xl rounded-full pointer-events-none"></div>

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{card.type}</p>
                    <p className="text-white font-bold tracking-wider">{card.brand}</p>
                  </div>
                  {card.type === 'Mastercard' ? (
                    <div className="flex drop-shadow-md">
                      <div className="w-8 h-8 bg-rose-500 rounded-full opacity-90"></div>
                      <div className="w-8 h-8 bg-amber-500 rounded-full opacity-90 -ml-4 mix-blend-screen"></div>
                    </div>
                  ) : (
                    <div className="text-white font-extrabold italic text-3xl tracking-tighter drop-shadow-md">VISA</div>
                  )}
                </div>

                <div>
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Total Balance</p>
                  <p className="text-white text-3xl font-bold tracking-tight">₹{card.balance.toLocaleString()}</p>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-1">Card Holder</p>
                    <p className="text-white/90 font-mono tracking-wider text-sm drop-shadow-sm">{card.userName} • {card.mask}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full shadow-sm">
                    <p className="text-white text-[10px] font-bold uppercase tracking-wider">{isActive ? 'Active' : 'Select'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export const Accounts: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setUsers(data);
      })
      .catch(err => console.error('Failed to load users:', err));
  }, []);

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* Smart Card Selector Section */}
      <div className="flex flex-col lg:flex-row gap-12 items-start justify-between">
        <div className="lg:w-1/2">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">My Wallet</h2>
            <p className="text-slate-500 text-sm mt-2 leading-relaxed">Virtually manage your linked cards to assign automated expense logic and view isolated balances instantly.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <Plus className="w-5 h-5" />
              Add New Card
            </button>
            <button className="flex-1 py-4 px-6 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-200 transition-all">
              <CreditCard className="w-5 h-5" />
              Card Settings
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <SmartCardSelector />
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Household Users Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Household Members</h2>
            <p className="text-slate-500 text-sm mt-1">Manage all registered users synced to this backend.</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..." 
              className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Account ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p>No users found matching your search.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name || 'User'}&background=random&color=fff`} 
                          alt="Avatar" 
                          className="w-10 h-10 rounded-full border-2 border-indigo-50"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{user.name || 'Anonymous User'}</p>
                          <p className="text-xs text-slate-400">Joined tracking</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {user.email && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-4 h-4 text-slate-400" />
                            {user.email}
                          </div>
                        )}
                        {user.phone && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-4 h-4 text-slate-400" />
                            {user.phone}
                          </div>
                        )}
                        {!user.email && !user.phone && (
                          <span className="text-sm text-slate-400 italic">No contact info</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Shield className={`w-4 h-4 ${user.role === 'Admin' ? 'text-indigo-500' : 'text-slate-400'}`} />
                        <span className={`text-sm font-medium ${user.role === 'Admin' ? 'text-indigo-600' : 'text-slate-600'}`}>
                          {user.role || 'Member'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md font-mono">
                        {user.id}
                      </code>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
