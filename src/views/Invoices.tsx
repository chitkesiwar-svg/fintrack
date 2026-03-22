import React from 'react';
import { 
  FileText, Download, Eye, MoreVertical, 
  Search, Filter, Calendar, CheckCircle2, Clock
} from 'lucide-react';
import { cn } from '../types';

export const Invoices: React.FC = () => {
  const invoices = [
    { id: 'INV-001', merchant: 'Amazon India', date: '2025-08-15', amount: 2499, status: 'Verified', type: 'Receipt' },
    { id: 'INV-002', merchant: 'Uber Technologies', date: '2025-08-14', amount: 850, status: 'Verified', type: 'Receipt' },
    { id: 'INV-003', merchant: 'Zomato Ltd', date: '2025-08-13', amount: 1200, status: 'Pending', type: 'Invoice' },
    { id: 'INV-004', merchant: 'Netflix India', date: '2025-08-12', amount: 649, status: 'Verified', type: 'Subscription' },
    { id: 'INV-005', merchant: 'Reliance Retail', date: '2025-08-10', amount: 15000, status: 'Pending', type: 'Invoice' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Invoices & Receipts</h2>
          <p className="text-slate-500 text-sm">Access all your scanned documents in one place</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export All
          </button>
          <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-all">
            Upload New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by merchant or ID..." 
              className="w-full bg-slate-50 border-none rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-600 flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex-1 sm:flex-none px-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-600 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </button>
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
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{inv.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-slate-600">{inv.merchant}</td>
                  <td className="px-8 py-6 text-sm text-slate-400">{inv.date}</td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md uppercase tracking-wider">{inv.type}</span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-800">₹{inv.amount.toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {inv.status === 'Verified' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                      <span className={cn(
                        "text-xs font-bold",
                        inv.status === 'Verified' ? "text-emerald-600" : "text-amber-600"
                      )}>{inv.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100 text-slate-400 hover:text-indigo-600 transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg shadow-sm border border-transparent hover:border-slate-100 text-slate-400 hover:text-indigo-600 transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-sm text-slate-400 font-medium">Showing 5 of 124 documents</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};
