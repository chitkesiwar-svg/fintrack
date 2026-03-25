import React, { useState, useRef } from 'react';
import { 
  FileText, Download, Eye, MoreVertical, 
  Search, Filter, Calendar, Trash2, Edit2, X, Save, Upload, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

const INITIAL_INVOICES = [
  { id: 'INV-001', merchant: 'Amazon India', date: '2025-08-15', amount: 2499, type: 'Receipt', file: null as string | null },
  { id: 'INV-002', merchant: 'Uber Technologies', date: '2025-08-14', amount: 850, type: 'Receipt', file: null as string | null },
  { id: 'INV-003', merchant: 'Zomato Ltd', date: '2025-08-13', amount: 1200, type: 'Invoice', file: null as string | null },
  { id: 'INV-004', merchant: 'Netflix India', date: '2025-08-12', amount: 649, type: 'Subscription', file: null as string | null },
  { id: 'INV-005', merchant: 'Reliance Retail', date: '2025-08-10', amount: 15000, type: 'Invoice', file: null as string | null },
];

export const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editIdValue, setEditIdValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const filtered = invoices.filter(inv =>
    inv.merchant.toLowerCase().includes(search.toLowerCase()) ||
    inv.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
    setOpenMenu(null);
  };

  const handleEditId = (oldId: string) => {
    setEditingId(oldId);
    setEditIdValue(oldId);
    setOpenMenu(null);
  };

  const saveEditId = (oldId: string) => {
    setInvoices(invoices.map(inv => inv.id === oldId ? { ...inv, id: editIdValue } : inv));
    setEditingId(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadTarget) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setInvoices(invoices.map(inv => inv.id === uploadTarget ? { ...inv, file: base64 } : inv));
      setUploadTarget(null);
    };
    reader.readAsDataURL(file);
  };

  const downloadFile = (inv: typeof INITIAL_INVOICES[0]) => {
    if (!inv.file) return;
    const link = document.createElement('a');
    link.href = inv.file;
    link.download = `${inv.id}-${inv.merchant}.pdf`;
    link.click();
  };

  const exportAll = () => {
    const withFiles = invoices.filter(inv => inv.file);
    withFiles.forEach(inv => downloadFile(inv));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Invoices & Receipts</h2>
          <p className="text-slate-500 text-sm">Access all your scanned documents in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportAll} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export All
          </button>
          <button 
            onClick={() => {
              const newInv = { id: `INV-${String(invoices.length + 1).padStart(3, '0')}`, merchant: 'New Entry', date: new Date().toISOString().split('T')[0], amount: 0, type: 'Receipt', file: null };
              setInvoices([newInv, ...invoices]);
            }}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Upload New
          </button>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by merchant or ID..." 
              className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                <th className="px-8 py-5">Document ID</th>
                <th className="px-8 py-5">Merchant</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((inv) => (
                <tr key={inv.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      {editingId === inv.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            value={editIdValue} onChange={e => setEditIdValue(e.target.value)}
                            className="w-24 px-2 py-1 text-sm border border-indigo-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 font-mono"
                            autoFocus
                          />
                          <button onClick={() => saveEditId(inv.id)} className="p-1 text-emerald-500 hover:text-emerald-700">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-1 text-slate-400 hover:text-slate-600">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-slate-800">{inv.id}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-600">{inv.merchant}</td>
                  <td className="px-8 py-6 text-sm text-slate-400">{inv.date}</td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">{inv.type}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-800">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 relative">
                      <button 
                        onClick={() => { setUploadTarget(inv.id); fileInputRef.current?.click(); }}
                        className="p-2 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100 text-slate-400 hover:text-indigo-600 transition-all"
                        title="Upload file"
                      >
                        <Upload className="w-4 h-4" />
                      </button>
                      {inv.file && (
                        <button 
                          onClick={() => downloadFile(inv)}
                          className="p-2 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100 text-slate-400 hover:text-emerald-600 transition-all"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <div className="relative">
                        <button 
                          onClick={() => setOpenMenu(openMenu === inv.id ? null : inv.id)}
                          className="p-2 text-slate-300 hover:text-slate-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {openMenu === inv.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                              className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-20 w-44"
                            >
                              <button 
                                onClick={() => handleEditId(inv.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                              >
                                <Edit2 className="w-4 h-4" /> Edit ID
                              </button>
                              <button 
                                onClick={() => handleDelete(inv.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-400 font-medium">Showing {filtered.length} of {invoices.length} documents</p>
        </div>
      </div>
    </div>
  );
};
