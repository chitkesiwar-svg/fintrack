import React from 'react';
import { 
  Sparkles, Shield, Zap, PieChart, 
  Globe, ArrowRight, Check, Star
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingPage: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-800">FinTrack</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onStart} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Login</button>
          <button 
            onClick={onStart}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
          >
            Get Started Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-32 text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
        >
          <Sparkles className="w-3 h-3" />
          <span>AI-Powered Personal Finance</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8"
        >
          Track your money <br />
          <span className="text-indigo-600">automatically</span> with AI.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-xl text-slate-500 mb-12"
        >
          FinTrack uses advanced AI to scan receipts, categorize expenses, and provide deep insights into your spending habits.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Start Tracking Now
            <ArrowRight className="w-6 h-6" />
          </button>
          <button className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all">
            Watch Demo
          </button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-24 relative"
        >
          <div className="absolute -inset-4 bg-indigo-600/5 rounded-[40px] blur-3xl"></div>
          <img 
            src="https://picsum.photos/seed/fintrack-dashboard/1600/900" 
            alt="Dashboard Preview" 
            className="relative rounded-[40px] border border-slate-100 shadow-2xl w-full"
          />
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything you need to master your money</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Powerful features designed to give you total control over your financial life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'AI Invoice Scanner', desc: 'Just snap a photo and our AI extracts all details automatically.' },
              { icon: PieChart, title: 'Smart Reports', desc: 'Deep visual insights into where your money is going every month.' },
              { icon: Shield, title: 'Budget Planner', desc: 'Set smart limits and get notified before you overspend.' },
              { icon: Globe, title: 'Bank Sync', desc: 'Securely connect your bank accounts for real-time tracking.' },
              { icon: Star, title: 'Multi-currency', desc: 'Manage expenses in any currency with live exchange rates.' },
              { icon: Sparkles, title: 'AI Predictions', desc: 'Our AI predicts future expenses based on your history.' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
                  <f.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-bold text-slate-900 mb-12">How FinTrack Works</h2>
              <div className="space-y-12">
                {[
                  { step: '01', title: 'Connect your accounts', desc: 'Securely link your bank accounts and credit cards in seconds.' },
                  { step: '02', title: 'Upload your receipts', desc: 'Snap photos of your paper receipts or upload digital invoices.' },
                  { step: '03', title: 'AI does the magic', desc: 'Our AI categorizes every transaction and extracts key data.' },
                  { step: '04', title: 'Get smart insights', desc: 'Receive personalized advice on how to save more money.' },
                ].map((s, i) => (
                  <div key={i} className="flex gap-6">
                    <span className="text-4xl font-black text-indigo-100">{s.step}</span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{s.title}</h3>
                      <p className="text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-indigo-600/5 rounded-full blur-3xl"></div>
              <img 
                src="https://picsum.photos/seed/fintrack-how/800/1000" 
                alt="How it works" 
                className="relative rounded-[40px] shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-slate-900 py-32 text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400">Choose the plan that fits your financial goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 p-12 rounded-[40px] backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-slate-400 mb-8">Perfect for individuals just starting out.</p>
              <div className="text-5xl font-black mb-12">₹0 <span className="text-lg font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-12">
                {['Manual tracking', 'Basic reports', '1 Bank connection', 'Standard support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={onStart} className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all">Get Started</button>
            </div>

            <div className="bg-indigo-600 p-12 rounded-[40px] shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-8 right-8 bg-white/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-indigo-100 mb-8">For power users who want total control.</p>
              <div className="text-5xl font-black mb-12">₹499 <span className="text-lg font-normal text-indigo-200">/mo</span></div>
              <ul className="space-y-4 mb-12">
                {['Unlimited AI scanning', 'Advanced analytics', 'Unlimited bank sync', 'Family sharing', 'Priority support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-indigo-50">
                    <Check className="w-5 h-5 text-white" />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={onStart} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">Go Premium</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800">FinTrack</span>
          </div>
          <p className="text-slate-400 text-sm">© 2025 FinTrack AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
