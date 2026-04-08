import React, { useState } from 'react';
import { 
  IndianRupee, Tag, Store, Calendar, 
  CreditCard, FileText, X, 
  ChevronDown, Check, Sparkles, Upload,
  Loader2, CheckCircle2, AlertCircle
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
  const [scanComplete, setScanComplete] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const scanReceipt = async (file: File) => {
    setIsScanning(true);
    setScanComplete(false);
    setScanError(null);
    
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
          mimeType: file.type || 'application/pdf',
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
      } else if (result.category) {
        setCategory('Other');
      }
      setScanComplete(true);
    } catch (error: any) {
      console.error("Error scanning receipt:", error);
      setScanError(error?.message || 'Failed to extract details');
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setScanComplete(false);
      setScanError(null);
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

  // Whether fields were auto-filled by scanning
  const isSmartFilled = fileName && !isScanning && scanComplete;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[24px] sm:rounded-[32px] border border-slate-100 shadow-xl overflow-hidden"
      >
        <div className="px-6 sm:px-8 py-5 sm:py-6 bg-indigo-600 text-white">
          <h2 className="text-xl font-bold">Add New Expense</h2>
          <p className="text-indigo-200 text-xs mt-0.5">Keep your spending tracked and organized</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-8 space-y-5">
          {/* Scan confirmation banner */}
          <AnimatePresence>
            {isSmartFilled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <p className="text-xs font-semibold text-emerald-700">Details auto-filled from receipt. Review and edit before saving.</p>
                </div>
              </motion.div>
            )}
            {scanError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-3 bg-rose-50 border border-rose-100 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <p className="text-xs font-semibold text-rose-700">{scanError}. Please fill fields manually.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Amount Input — compact */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Amount</label>
              {isSmartFilled && (
                <motion.span 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Smart Scanned
                </motion.span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-300">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={cn(
                  "w-full bg-slate-50 border rounded-2xl pl-10 pr-5 py-3.5 text-xl font-bold text-slate-800 focus:ring-2 focus:ring-indigo-100 transition-all outline-none placeholder:text-slate-200",
                  isSmartFilled ? "border-indigo-200 bg-indigo-50/30 ring-2 ring-indigo-100" : "border-transparent"
                )}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={cn(
                    "w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all outline-none appearance-none",
                    isSmartFilled ? "border-indigo-200 bg-indigo-50/30" : "border-transparent"
                  )}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              {category === 'Custom' && (
                <motion.input 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  type="text"
                  placeholder="Enter custom category"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full mt-1.5 bg-slate-50 border border-indigo-100 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              )}
            </div>

            {/* Merchant Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Merchant</label>
                {isSmartFilled && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Smart Scanned
                  </motion.span>
                )}
              </div>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  placeholder="e.g. Amazon, Starbucks"
                  className={cn(
                    "w-full bg-slate-50 border rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all outline-none",
                    isSmartFilled ? "border-indigo-200 bg-indigo-50/30" : "border-transparent"
                  )}
                  required
                />
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={cn(
                    "w-full bg-slate-50 border rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all outline-none",
                    isSmartFilled ? "border-indigo-200 bg-indigo-50/30" : "border-transparent"
                  )}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Payment Method</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-50 border-transparent border rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all outline-none appearance-none"
                >
                  <option>Credit Card</option>
                  <option>Debit Card</option>
                  <option>UPI / Paytm</option>
                  <option>Cash</option>
                  <option>Net Banking</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Notes (Optional)</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What was this for?"
                rows={2}
                className="w-full bg-slate-50 border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-100 transition-all outline-none resize-none"
              />
            </div>
          </div>

          {/* Receipt Upload — compact & elegant */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Receipt / Invoice</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*,.pdf"
              disabled={isScanning}
            />

            {isScanning ? (
              /* Scanning state */
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loader2 className="w-4 h-4 text-indigo-600" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-indigo-700 truncate">{fileName}</p>
                  <p className="text-[10px] text-indigo-500 animate-pulse">AI extracting details...</p>
                </div>
              </motion.div>
            ) : fileName ? (
              /* File uploaded state */
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl border",
                  scanComplete 
                    ? "bg-emerald-50/50 border-emerald-200" 
                    : scanError 
                      ? "bg-rose-50/50 border-rose-200"
                      : "bg-slate-50 border-slate-200"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  scanComplete ? "bg-emerald-100" : scanError ? "bg-rose-100" : "bg-slate-100"
                )}>
                  {scanComplete ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : scanError ? (
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  ) : (
                    <FileText className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">{fileName}</p>
                  <p className={cn(
                    "text-[10px] font-medium",
                    scanComplete ? "text-emerald-600" : scanError ? "text-rose-500" : "text-slate-400"
                  )}>
                    {scanComplete ? "Scan Completed ✅" : scanError ? "Scan failed" : "Uploaded"}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFileName(null);
                    setScanComplete(false);
                    setScanError(null);
                    setMerchant('');
                    setAmount('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-rose-500 transition-colors flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ) : (
              /* Upload prompt */
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                  <Upload className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-600 group-hover:text-indigo-700">Upload Receipt or PDF</p>
                  <p className="text-[10px] text-slate-400">AI will auto-detect amount, merchant & date</p>
                </div>
              </button>
            )}
          </div>

          {/* Action buttons */}
          {isSmartFilled ? (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Review & Add Expense</span>
            </motion.button>
          ) : (
            <button 
              type="submit"
              className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>Add Expense</span>
            </button>
          )}
        </form>
      </motion.div>
    </div>
  );
};
