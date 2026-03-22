import React, { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, Wallet, 
  Plus, UserPlus, Trash2, MoreVertical,
  Edit2, Check, X, Sliders,
  Utensils, ShoppingBag, Film, Car, 
  Activity, Zap, CreditCard, TrendingUp, 
  BookOpen, MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DUMMY_TRANSACTIONS, DUMMY_SUBSCRIPTIONS, DUMMY_FAMILY, DUMMY_EMIS } from '../constants';
import { Subscription, Transaction, FamilyMember, IncomeSource, EMI } from '../types';
import { CategoryPieChart, IncomeVsExpenseChart } from '../components/Charts';
import { cn } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  incomeSources: IncomeSource[];
  setIncomeSources: React.Dispatch<React.SetStateAction<IncomeSource[]>>;
}

// Sub-components for Modals to prevent full Dashboard re-renders
const IncomeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  incomeSources: IncomeSource[];
  setIncomeSources: React.Dispatch<React.SetStateAction<IncomeSource[]>>;
  monthlyIncome: number;
}> = ({ isOpen, onClose, incomeSources, setIncomeSources, monthlyIncome }) => {
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceAmount, setNewSourceAmount] = useState('');
  const [editingSourceId, setEditingSourceId] = useState<string | null>(null);

  const handleAddIncomeSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSourceName && newSourceAmount && !isNaN(Number(newSourceAmount))) {
      const newSource: IncomeSource = {
        id: Math.random().toString(36).substr(2, 9),
        name: newSourceName,
        amount: Number(newSourceAmount)
      };
      setIncomeSources([...incomeSources, newSource]);
      setNewSourceName('');
      setNewSourceAmount('');
    }
  };

  const updateIncomeSource = (id: string, name: string, amount: number) => {
    setIncomeSources(prev => prev.map(s => 
      s.id === id ? { ...s, name, amount } : s
    ));
  };

  const deleteIncomeSource = (id: string) => {
    if (incomeSources.length <= 1) {
      alert("You must have at least one income source.");
      return;
    }
    setIncomeSources(prev => prev.filter(s => s.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">Monthly Income Sources</h3>
                <p className="text-xs text-slate-400 mt-1">Total: ₹{monthlyIncome.toLocaleString()}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {incomeSources.map(source => (
                <div key={source.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group">
                  {editingSourceId === source.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input 
                        type="text"
                        value={source.name}
                        autoFocus
                        onChange={(e) => updateIncomeSource(source.id, e.target.value, source.amount)}
                        className="flex-1 bg-white border-none rounded-lg px-2 py-1 text-sm font-bold text-slate-800 outline-none"
                      />
                      <input 
                        type="number"
                        value={source.amount}
                        onChange={(e) => updateIncomeSource(source.id, source.name, Number(e.target.value))}
                        className="w-20 bg-white border-none rounded-lg px-2 py-1 text-sm font-bold text-emerald-600 outline-none"
                      />
                      <button 
                        onClick={() => setEditingSourceId(null)}
                        className="p-1.5 bg-emerald-500 text-white rounded-lg"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center font-bold text-emerald-600 shadow-sm">
                          {source.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{source.name}</p>
                          <p className="text-xs text-slate-400">₹{source.amount.toLocaleString()}/mo</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button 
                          onClick={() => setEditingSourceId(source.id)}
                          className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteIncomeSource(source.id)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              
              <form onSubmit={handleAddIncomeSource} className="p-4 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="text" 
                    placeholder="Name (e.g. John)"
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    className="bg-slate-50 border-none rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <input 
                    type="number" 
                    placeholder="Amount"
                    value={newSourceAmount}
                    onChange={(e) => setNewSourceAmount(e.target.value)}
                    className="bg-slate-50 border-none rounded-xl px-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={!newSourceName || !newSourceAmount}
                  className="w-full py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Person & Income</span>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const Dashboard: React.FC<DashboardProps> = ({ 
  transactions, 
  setTransactions,
  incomeSources,
  setIncomeSources
}) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(DUMMY_SUBSCRIPTIONS);
  const [emis, setEmis] = useState<EMI[]>(DUMMY_EMIS);
  const [family, setFamily] = useState<FamilyMember[]>(DUMMY_FAMILY);
  
  // Modal States
  const [isManagingIncome, setIsManagingIncome] = useState(false);
  const [isManagingSubs, setIsManagingSubs] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isManagingSafeToSpend, setIsManagingSafeToSpend] = useState(false);
  const [isAddingFamilyMember, setIsAddingFamilyMember] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  
  // Family Member Form State
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  
  // Savings/Fixed Expenses State
  const [savingsTarget, setSavingsTarget] = useState(45000);
  
  // New Sub/EMI Form State
  const [newSubName, setNewSubName] = useState('');
  const [newSubAmount, setNewSubAmount] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('Subscriptions');
  const [isEmi, setIsEmi] = useState(false);
  const [emiTenure, setEmiTenure] = useState('12');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const activeSubs = subscriptions.filter(s => s.status === 'Active');
  const activeEmis = emis.filter(e => e.status === 'Active');
  const totalMonthlySubCost = activeSubs.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMonthlyEmiCost = activeEmis.reduce((acc, curr) => acc + curr.amount, 0);
  const totalTransactionExpenses = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const totalMonthlyExpenses = totalTransactionExpenses + totalMonthlySubCost + totalMonthlyEmiCost;
  
  const monthlyIncome = incomeSources.reduce((acc, curr) => acc + curr.amount, 0);
  const safeToSpendLimit = monthlyIncome - totalMonthlySubCost - totalMonthlyEmiCost - savingsTarget;
  const remainingToSpend = safeToSpendLimit - totalTransactionExpenses;

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    setTransactionToDelete(null);
  };

  const deleteFamilyMember = (id: string) => {
    if (family.length <= 1) {
      alert("You must have at least one family member.");
      return;
    }
    setFamily(prev => prev.filter(m => m.id !== id));
  };

  // Dynamic Category Data
  const categoryData = transactions.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, [] as { name: string, value: number }[]).sort((a, b) => b.value - a.value);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food': 'bg-orange-500',
      'Shopping': 'bg-rose-500',
      'Travel': 'bg-emerald-500',
      'Utilities': 'bg-amber-500',
      'Entertainment': 'bg-purple-500',
      'Subscriptions': 'bg-indigo-500',
      'Health': 'bg-red-500',
      'Education': 'bg-blue-500',
      'Investments': 'bg-cyan-500',
      'Salary': 'bg-green-500',
    };
    return colors[category] || 'bg-slate-500';
  };

  const handleFamilySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName && newMemberEmail) {
      if (editingMemberId) {
        setFamily(prev => prev.map(m => 
          m.id === editingMemberId 
            ? { ...m, name: newMemberName, email: newMemberEmail, phone: newMemberPhone } 
            : m
        ));
      } else {
        const newMember: FamilyMember = {
          id: Math.random().toString(36).substr(2, 9),
          name: newMemberName,
          email: newMemberEmail,
          phone: newMemberPhone,
          role: 'Member',
          avatar: `https://picsum.photos/seed/${newMemberName}/100/100`
        };
        setFamily([...family, newMember]);
      }
      resetFamilyForm();
    }
  };

  const resetFamilyForm = () => {
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberPhone('');
    setEditingMemberId(null);
    setIsAddingFamilyMember(false);
  };

  const openEditFamilyMember = (member: FamilyMember) => {
    setNewMemberName(member.name);
    setNewMemberEmail(member.email);
    setNewMemberPhone(member.phone || '');
    setEditingMemberId(member.id);
    setIsAddingFamilyMember(true);
  };

  const categoryColors: Record<string, string> = {
    'Food': '#6366f1',     // Indigo
    'Shopping': '#f43f5e', // Rose
    'Travel': '#10b981',   // Emerald
    'Utilities': '#f59e0b', // Amber
    'Entertainment': '#8b5cf6', // Violet
    'Subscriptions': '#ec4899', // Pink
    'Health': '#ef4444',    // Red
    'Education': '#3b82f6', // Blue
    'Investments': '#06b6d4', // Cyan
    'Salary': '#22c55e',   // Green
  };

  const getCategoryIcon = (category: string) => {
    const iconProps = { className: "w-4 h-4 text-white" };
    switch (category) {
      case 'Food': return <Utensils {...iconProps} />;
      case 'Shopping': return <ShoppingBag {...iconProps} />;
      case 'Entertainment': return <Film {...iconProps} />;
      case 'Travel': return <Car {...iconProps} />;
      case 'Health': return <Activity {...iconProps} />;
      case 'Utilities': return <Zap {...iconProps} />;
      case 'Subscriptions': return <CreditCard {...iconProps} />;
      case 'Salary': return <ArrowUpRight {...iconProps} />;
      case 'Investments': return <TrendingUp {...iconProps} />;
      case 'Education': return <BookOpen {...iconProps} />;
      default: return <MoreHorizontal {...iconProps} />;
    }
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s
    ));
  };

  const handleAddSubOrEmi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubAmount) return;

    if (editingItemId) {
      if (isEmi) {
        setEmis(prev => prev.map(e => 
          e.id === editingItemId 
            ? { ...e, name: newSubName, amount: Number(newSubAmount), totalTenure: Number(emiTenure) } 
            : e
        ));
      } else {
        setSubscriptions(prev => prev.map(s => 
          s.id === editingItemId 
            ? { ...s, name: newSubName, amount: Number(newSubAmount) } 
            : s
        ));
      }
    } else {
      if (isEmi) {
        const newEmi: EMI = {
          id: Math.random().toString(36).substr(2, 9),
          name: newSubName,
          amount: Number(newSubAmount),
          nextPaymentDate: new Date().toISOString().split('T')[0],
          status: 'Active',
          totalTenure: Number(emiTenure),
          remainingTenure: Number(emiTenure)
        };
        setEmis([...emis, newEmi]);
      } else {
        const newSub: Subscription = {
          id: Math.random().toString(36).substr(2, 9),
          name: newSubName,
          category: newSubCategory,
          bankDetails: 'HDFC Bank **** 1234',
          amount: Number(newSubAmount),
          lastPayment: new Date().toISOString().split('T')[0],
          billingCycle: 'Monthly',
          nextBillDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'Active',
          paymentMethod: 'Credit Card'
        };
        setSubscriptions([...subscriptions, newSub]);
      }
    }

    setNewSubName('');
    setNewSubAmount('');
    setEditingItemId(null);
    setShowAddForm(false);
  };

  const handleEditEmi = (emi: EMI) => {
    setNewSubName(emi.name);
    setNewSubAmount(emi.amount.toString());
    setEmiTenure(emi.totalTenure.toString());
    setIsEmi(true);
    setEditingItemId(emi.id);
    setShowAddForm(true);
  };

  const handleEditSub = (sub: Subscription) => {
    setNewSubName(sub.name);
    setNewSubAmount(sub.amount.toString());
    setIsEmi(false);
    setEditingItemId(sub.id);
    setShowAddForm(true);
  };

  const deleteEmi = (id: string) => {
    setEmis(prev => prev.filter(e => e.id !== id));
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => setIsManagingIncome(true)}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group relative cursor-pointer hover:border-emerald-200 transition-all"
        >
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Monthly Income</p>
            <h3 className="text-2xl font-bold text-emerald-600">₹{monthlyIncome.toLocaleString()}</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
              <ArrowUpRight className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Monthly Expenses</p>
            <h3 className="text-2xl font-bold text-rose-600">₹{totalMonthlyExpenses.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-rose-50">
            <ArrowDownRight className="w-6 h-6 text-rose-600" />
          </div>
        </div>

        <div 
          onClick={() => setIsManagingSafeToSpend(true)}
          className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-all"
        >
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Remaining to Spend</p>
            <h3 className="text-2xl font-bold text-indigo-600">₹{remainingToSpend.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
            <Wallet className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm font-medium">Family Members</p>
            <button onClick={() => setIsAddingFamilyMember(true)} className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors">
              <UserPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex -space-x-3 mt-4">
            {family.map((member) => (
              <div key={member.id} className="relative group/member">
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  title={`${member.name} (${member.email})`}
                  onClick={() => openEditFamilyMember(member)}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFamilyMember(member.id);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/member:opacity-100 transition-all scale-75 hover:scale-100"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button onClick={() => setIsAddingFamilyMember(true)} className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm font-medium">EMI and Active Subscriptions</p>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <h4 className="text-3xl font-bold text-slate-800">{activeSubs.length + activeEmis.length}</h4>
              <p className="text-xs text-slate-400 mt-1">Total monthly: ₹{(totalMonthlySubCost + totalMonthlyEmiCost).toLocaleString()}</p>
            </div>
            <button 
              onClick={() => setIsManagingSubs(true)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      {/* Family Member Modal */}
      <AnimatePresence>
        {isAddingFamilyMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetFamilyForm}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">{editingMemberId ? 'Edit' : 'Add'} Family Member</h3>
                  <p className="text-xs text-slate-400 mt-1">Manage your family group access</p>
                </div>
                <button onClick={resetFamilyForm} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleFamilySubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Sarah Parker"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gmail / Email</label>
                  <input 
                    type="email" 
                    required
                    placeholder="e.g. sarah@gmail.com"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. +91 98765 43210"
                    value={newMemberPhone}
                    onChange={(e) => setNewMemberPhone(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    {editingMemberId ? 'Update Member' : 'Add to Family'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {transactionToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTransactionToDelete(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden p-8 text-center"
            >
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Delete Transaction?</h3>
              <p className="text-slate-500 text-sm mb-8">
                Are you sure you want to delete this transaction? This action cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setTransactionToDelete(null)}
                  className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  No, Keep it
                </button>
                <button 
                  onClick={() => deleteTransaction(transactionToDelete)}
                  className="py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Income Modal */}
      <IncomeModal 
        isOpen={isManagingIncome}
        onClose={() => setIsManagingIncome(false)}
        incomeSources={incomeSources}
        setIncomeSources={setIncomeSources}
        monthlyIncome={monthlyIncome}
      />

      {/* Manage Safe to Spend Modal */}
      <AnimatePresence>
        {isManagingSafeToSpend && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManagingSafeToSpend(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800">Adjust Safe to Spend</h3>
                  <p className="text-xs text-slate-400 mt-1">Set your monthly savings target</p>
                </div>
                <button onClick={() => setIsManagingSafeToSpend(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8 space-y-8">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-400 mb-2">Remaining to Spend</p>
                  <h4 className="text-4xl font-bold text-indigo-600">₹{remainingToSpend.toLocaleString()}</h4>
                  <p className="text-xs text-slate-400 mt-2">Limit: ₹{safeToSpendLimit.toLocaleString()}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-slate-500">Savings Target</span>
                    <span className="text-emerald-600">₹{savingsTarget.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max={Math.max(100000, monthlyIncome)} 
                    step="500"
                    value={savingsTarget}
                    onChange={(e) => setSavingsTarget(Number(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>More Spending</span>
                    <span>More Savings</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Total Monthly Income</span>
                    <span className="font-bold text-slate-800">₹{monthlyIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-rose-500">
                    <span>Fixed Subscriptions & EMIs</span>
                    <span className="font-bold">- ₹{(totalMonthlySubCost + totalMonthlyEmiCost).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-rose-500">
                    <span>Current Transactions</span>
                    <span className="font-bold">- ₹{totalTransactionExpenses.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
                    <span className="font-bold text-slate-800">Remaining Balance</span>
                    <span className="font-bold text-indigo-600">₹{remainingToSpend.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsManagingSafeToSpend(false)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                  Save Adjustment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Subscriptions Modal */}
      <AnimatePresence>
        {isManagingSubs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManagingSubs(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">
                  {showAddForm ? (editingItemId ? 'Edit Details' : 'Add New') : 'Manage EMI & Subscriptions'}
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      if (showAddForm) {
                        setShowAddForm(false);
                        setEditingItemId(null);
                      }
                      else setIsManagingSubs(false);
                    }} 
                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {showAddForm ? (
                  <form onSubmit={handleAddSubOrEmi} className="space-y-4">
                    <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
                      <button 
                        type="button"
                        disabled={!!editingItemId}
                        onClick={() => setIsEmi(false)}
                        className={cn(
                          "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                          !isEmi ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500",
                          editingItemId && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        Subscription
                      </button>
                      <button 
                        type="button"
                        disabled={!!editingItemId}
                        onClick={() => setIsEmi(true)}
                        className={cn(
                          "flex-1 py-2 text-xs font-bold rounded-xl transition-all",
                          isEmi ? "bg-white text-rose-600 shadow-sm" : "text-slate-500",
                          editingItemId && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        EMI
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Name</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Netflix or Car Loan"
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Amount</label>
                      <input 
                        type="number" 
                        required
                        placeholder="e.g. 649"
                        value={newSubAmount}
                        onChange={(e) => setNewSubAmount(e.target.value)}
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>

                    {isEmi && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Tenure (Months)</label>
                        <input 
                          type="number" 
                          required
                          placeholder="e.g. 12"
                          value={emiTenure}
                          onChange={(e) => setEmiTenure(e.target.value)}
                          className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                    )}

                    <div className="pt-4">
                      <button 
                        type="submit"
                        className={cn(
                          "w-full py-4 text-white rounded-2xl font-bold transition-all shadow-lg",
                          isEmi ? "bg-rose-500 hover:bg-rose-600 shadow-rose-100" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                        )}
                      >
                        {editingItemId ? 'Update Details' : `Add ${isEmi ? 'EMI' : 'Subscription'}`}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    {emis.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active EMIs</p>
                        {emis.map(emi => (
                          <div key={emi.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group/emi">
                            <div className="flex items-center gap-3">
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleEditEmi(emi)}
                                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-rose-600 shadow-sm hover:bg-rose-50 transition-colors group"
                                >
                                  <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                                <button 
                                  onClick={() => deleteEmi(emi.id)}
                                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-rose-500 shadow-sm hover:bg-rose-50 transition-colors group opacity-0 group-hover/emi:opacity-100"
                                  title="Delete EMI"
                                >
                                  <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </button>
                              </div>
                              <div>
                                <p className="font-bold text-slate-800 text-sm">{emi.name}</p>
                                <p className="text-[10px] text-slate-400">{emi.remainingTenure}/{emi.totalTenure} months left</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-slate-800">₹{emi.amount.toLocaleString()}</p>
                              <p className="text-[10px] text-slate-400">Next: {emi.nextPaymentDate}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="space-y-3 pt-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Subscriptions</p>
                      {subscriptions.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group/sub">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleEditSub(sub)}
                                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors group"
                              >
                                <span className="group-hover:scale-110 transition-transform">{sub.name[0]}</span>
                              </button>
                              <button 
                                onClick={() => deleteSubscription(sub.id)}
                                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-rose-500 shadow-sm hover:bg-rose-50 transition-colors group opacity-0 group-hover/sub:opacity-100"
                                title="Delete Subscription"
                              >
                                <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </button>
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{sub.name}</p>
                              <p className="text-xs text-slate-400">₹{sub.amount}/mo</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => toggleSubscription(sub.id)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                              sub.status === 'Active' 
                                ? "bg-emerald-100 text-emerald-600" 
                                : "bg-slate-200 text-slate-500"
                            )}
                          >
                            {sub.status}
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Floating Add Button */}
              {!showAddForm && (
                <div className="absolute bottom-8 right-8">
                  <button 
                    onClick={() => {
                      setEditingItemId(null);
                      setNewSubName('');
                      setNewSubAmount('');
                      setShowAddForm(true);
                    }}
                    className="w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all group"
                  >
                    <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Grid - Full Width */}
      <div className="space-y-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  <th className="px-6 py-4">Merchant</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map((t) => (
                  <tr 
                    key={t.id} 
                    onClick={() => console.log('Transaction clicked:', t)}
                    className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110"
                          style={{ backgroundColor: categoryColors[t.category] || '#64748b' }}
                        >
                          {getCategoryIcon(t.category)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{t.merchant}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{t.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-500">{t.category}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{t.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{t.amount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setTransactionToDelete(t.id);
                        }}
                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section below Transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative">
            <h3 className="font-bold text-slate-800 mb-6">Category Breakdown</h3>
            <CategoryPieChart data={categoryData.length > 0 ? categoryData : [
              { name: 'No Transactions', value: 1 }
            ]} />
            <div className="mt-6 space-y-3">
              {categoryData.length > 0 ? (
                categoryData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group/cat relative">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", getCategoryColor(item.name))}></div>
                      <span className="text-xs text-slate-500 font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-800">₹{item.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 font-medium">No transaction data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">Income vs Expense</h3>
            <IncomeVsExpenseChart />
          </div>
        </div>
      </div>
    </div>
  );
};
