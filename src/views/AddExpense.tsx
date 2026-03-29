import React, { useState } from 'react';
import { 
  IndianRupee, Tag, Store, Calendar, 
  CreditCard, FileText, X, 
  ChevronDown, Check, Sparkles, Upload,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, Transaction } from '../types';

interface AddExpenseProps {
  categories: string[];
  onAddExpense: (transaction: Omit<Transaction, 'id' | 'status'>) => void;
  onDone: () => void;
}

export const AddExpense: React.FC<AddExpenseProps> = ({ categories, onAddExpense, onDone }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [customCategory, setCustomCategory] = useState('');
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const scanReceipt = async (file: File) => {
    setIsScanning(true);
    
    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(file);
      });

      // Call server-side scanning endpoint
      const response = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: base64Data,
          mimeType: file.type,
          categories,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Scan failed');
      }

      const result = await response.json();
      
      if (result.merchant) setMerchant(result.merchant);
      if (result.amount) setAmount(result.amount.toString());
      if (result.date) setDate(result.date);
      if (result.category && categories.includes(result.category)) {
        setCategory(result.category);
      } else {
        setCategory('Other');
      }
    } catch (error) {
      console.error("Error scanning receipt:", error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      scanReceipt(file);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!amount || !merchant) return;

    onAddExpense({
      merchant,
      amount: Number(amount),
      category: category === 'Custom' ? customCategory : category,
      date,
      paymentMethod
    });

    onDone();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[24px] sm:rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden"
      >
        <div className="p-6 sm:p-8 bg-indigo-600 text-white">
          <h2 className="text-2xl font-bold">Add New Expense</h2>
          <p className="text-indigo-100 text-sm">Keep your spending tracked and organized</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-6 sm:space-y-8">
          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Amount</label>
              {fileName && !isScanning && (
                <motion.span 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Smart Scanned
                </motion.span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-bold text-slate-300">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-50 border-none rounded-3xl pl-12 pr-6 py-4 sm:py-6 text-2xl sm:text-4xl font-bold text-slate-800 focus:ring-4 focus:ring-indigo-50 transition-all outline-none placeholder:text-slate-200"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all outline-none appearance-none"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              {category === 'Custom' && (
                <motion.input 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  type="text"
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full mt-2 bg-slate-50 border border-indigo-100 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              )}
            </div>

            {/* Merchant Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Merchant</label>
                {fileName && !isScanning && (
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Smart Scanned
                  </motion.span>
                )}
              </div>
              <div className="relative">
                <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Amazon, Starbucks"
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Date</label>
              <div className="relative">
                <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Payment Method</label>
              <div className="relative">
                <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all outline-none appearance-none"
                >
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>UPI / Paytm</option>
                  <option>Cash</option>
                  <option>Net Banking</option>
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Notes (Optional)</label>
            <div className="relative">
              <FileText className="absolute left-5 top-5 w-4 h-4 text-slate-400" />
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What was this for?"
                rows={3}
                className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-5 py-4 text-sm font-medium text-slate-700 focus:ring-4 focus:ring-indigo-50 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Receipt Upload */}
          <div 
            onClick={() => !isScanning && fileInputRef.current?.click()}
            className={cn(
              "p-6 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group",
              isScanning ? "border-indigo-200 bg-indigo-50/50 cursor-wait" : 
              fileName ? "border-emerald-200 bg-emerald-50" : "border-slate-100 hover:bg-slate-50"
            )}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,.pdf"
              disabled={isScanning}
            />
            {isScanning ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loader2 className="w-6 h-6 text-indigo-600" />
                </motion.div>
                <span className="text-xs font-bold text-indigo-600 animate-pulse">AI Extracting Details...</span>
              </>
            ) : fileName ? (
              <>
                <Check className="w-6 h-6 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600">{fileName}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileName(null);
                  }}
                  className="text-[10px] text-rose-500 font-bold hover:underline"
                >
                  Remove
                </button>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600">Upload Receipt</span>
              </>
            )}
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <span>Done</span>
          </button>

          {fileName && !isScanning && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              type="button"
              onClick={handleSubmit}
              className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-bold border border-emerald-100 hover:bg-emerald-100 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Quick Add Scanned Details</span>
            </motion.button>
          )}
        </form>
      </motion.div>

      <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-indigo-50 rounded-2xl sm:rounded-3xl flex items-start sm:items-center gap-3 sm:gap-4">
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0 mt-0.5 sm:mt-0" />
        <p className="text-xs sm:text-sm text-indigo-700 font-medium">
          Want to save time? Use the <span className="font-bold underline cursor-pointer">Smart Upload</span> feature to scan receipts automatically.
        </p>
      </div>
    </div>
  );
};
