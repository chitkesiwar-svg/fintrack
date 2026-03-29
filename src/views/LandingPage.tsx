import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Shield, Zap, PieChart, 
  Globe, ArrowRight, Check, Star, X, Phone, Mail, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

export const LandingPage: React.FC<{ onStart: (user?: any) => void }> = ({ onStart }) => {
  const [authMode, setAuthMode] = useState<'none' | 'select' | 'phone' | 'otp' | 'google'>('none');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isError, setIsError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authMode === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [authMode, timer]);

  const handleGoogleLogin = async () => {
    setAuthMode('google');
    setIsLoading(true);
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'user@gmail.com', name: '', avatar: 'https://ui-avatars.com/api/?name=User&background=random&color=fff', role: 'Admin' })
      });
      const data = await resp.json();
      onStart(data);
    } catch {
      setIsLoading(false);
      setIsError(true);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) return;
    setIsLoading(true);
    // Mock network call speed up
    setTimeout(() => {
      setIsLoading(false);
      setTimer(30);
      setAuthMode('otp');
    }, 200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
    // Auto submit on last digit
    if (value && index === 5 && newOtp.every(v => v !== '')) {
      verifyOtp(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      otpInputs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async (code: string) => {
    // Development Mock bypass: 123456
    if (code === '123456' || code.length === 6) {
      if (attempts >= 3) {
        setIsError(true);
        alert("Too many failed attempts. Please request a new code.");
        return;
      }
      setIsLoading(true);
      try {
        const resp = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: '+91' + phone })
        });
        
        if (!resp.ok) throw new Error('Auth failed');
        
        const data = await resp.json();
        onStart(data);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
        setIsError(true);
      }
    } else {
      setIsError(true);
      setAttempts(prev => prev + 1);
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
      setTimeout(() => setIsError(false), 2000);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    verifyOtp(otp.join(''));
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Auth Modals */}
      <AnimatePresence>
        {authMode !== 'none' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => {
                if (!isLoading) {
                  setAuthMode('none');
                  setOtp(['', '', '', '', '', '']);
                  setPhone('');
                }
              }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={(isError && authMode === 'otp') ? { x: [-10, 10, -10, 10, 0] } : { opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: isError ? 0.3 : 0.2 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 overflow-hidden"
            >
              <button 
                onClick={() => setAuthMode('none')}
                disabled={isLoading}
                className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              {authMode === 'select' && (
                <div className="text-center pt-4">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 shadow-inner">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome Back</h2>
                  <p className="text-slate-500 mb-8 font-medium">Log in or sign up to securely access your financial dashboard.</p>
                  <div className="space-y-4">
                    <button 
                      onClick={handleGoogleLogin}
                      className="w-full py-4 px-6 bg-white border-2 border-slate-100 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all hover:-translate-y-0.5"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Continue with Google
                    </button>
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-slate-100"></div>
                      <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">Or</span>
                      <div className="flex-grow border-t border-slate-100"></div>
                    </div>
                    <button 
                      onClick={() => setAuthMode('phone')}
                      className="w-full py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-xl shadow-slate-200"
                    >
                      <Phone className="w-5 h-5" />
                      Continue with Phone Number
                    </button>
                  </div>
                </div>
              )}

              {authMode === 'google' && (
                <div className="text-center py-8">
                  {isError ? (
                    <>
                      <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <X className="w-10 h-10 text-rose-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Failed</h2>
                      <p className="text-slate-500 font-medium">Could not establish contact with the backend. Please check your connection.</p>
                      <button onClick={() => { setIsError(false); setAuthMode('select'); }} className="mt-8 text-indigo-600 font-bold hover:underline transition-all">Go Back</button>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                      </div>
                      <h2 className="text-2xl font-bold text-slate-800 mb-2">Authenticating</h2>
                      <p className="text-slate-500 font-medium">Securely logging you in with Google...</p>
                    </>
                  )}
                </div>
              )}

              {authMode === 'phone' && (
                <div className="pt-4">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Phone Login</h2>
                  <p className="text-slate-500 mb-8 font-medium">We'll send you a 6-digit secure verification code.</p>
                  <form onSubmit={handleSendOtp}>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Mobile Number</label>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="bg-slate-50 px-4 py-4 rounded-2xl border border-slate-100 font-bold text-slate-600 text-lg relative">
                        +91
                          <div className="absolute -bottom-8 left-0 right-0 flex justify-center text-xs text-indigo-400 font-medium">
                            Auto Verify: Type "123456"
                          </div>
                        </div>
                      <input 
                        type="tel"
                        autoFocus
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210"
                        className="flex-1 bg-slate-50 border-none rounded-2xl px-4 py-4 text-lg font-bold text-slate-800 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-100"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={phone.length !== 10 || isLoading}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:scale-100 hover:-translate-y-0.5 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                    >
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send OTP'}
                    </button>
                  </form>
                </div>
              )}

              {authMode === 'otp' && (
                <div className="pt-4">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify Number</h2>
                  <p className="text-slate-500 mb-8 font-medium">
                    Code sent to <span className="text-slate-800 font-bold">+91 ••••• {phone.slice(-4) || '3210'}</span>
                    <button onClick={() => setAuthMode('phone')} className="ml-2 text-indigo-600 font-bold hover:underline">Edit</button>
                  </p>
                  <form onSubmit={handleVerifyOtp}>
                    <div className="flex justify-between gap-2 mb-8">
                      {otp.map((digit, idx) => (
                        <input 
                          key={idx}
                          ref={el => otpInputs.current[idx] = el}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(idx, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(idx, e)}
                          className={cn(
                            "w-12 h-14 bg-slate-50 border-2 rounded-2xl text-center text-xl font-black outline-none transition-all focus:scale-105",
                            digit ? "border-indigo-600 text-indigo-600 bg-white shadow-lg shadow-indigo-100" : "border-slate-100 text-slate-800 focus:border-indigo-200 focus:bg-white",
                            isError && "border-rose-500 text-rose-500 bg-rose-50"
                          )}
                        />
                      ))}
                    </div>
                    <button 
                      type="submit"
                      disabled={isLoading || otp.some(v => v === '')}
                      className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:scale-100 hover:-translate-y-0.5 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 mb-6"
                    >
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Verify Code'}
                    </button>
                    <div className="text-center font-bold text-sm">
                      {timer > 0 ? (
                        <span className="text-slate-400">Resend code in <span className="text-indigo-600">00:{timer.toString().padStart(2, '0')}</span></span>
                      ) : (
                        <button type="button" onClick={() => setTimer(30)} className="text-indigo-600 hover:text-indigo-700 hover:underline">Resend OTP</button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Sparkles className="text-white w-4 h-4 sm:w-6 sm:h-6" />
          </div>
          <span className="font-bold text-xl sm:text-2xl tracking-tight text-slate-800">FinTrack</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Testimonials</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={() => setAuthMode('select')} className="text-xs sm:text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block">Login</button>
          <button 
            onClick={() => setAuthMode('select')}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="hidden sm:inline">Get Started Free</span>
            <span className="sm:hidden">Get Started</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20 pb-16 sm:pb-32 text-center relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8"
        >
          <Sparkles className="w-3 h-3" />
          <span>AI-Powered Personal Finance</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-6 sm:mb-8"
        >
          Track your money <br />
          <span className="text-indigo-600">automatically</span> with AI.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-xl text-slate-500 mb-8 sm:mb-12 px-2"
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
            onClick={() => onStart({ id: 'user_default_local', name: '', email: 'local@fintrack.app', avatar: 'https://ui-avatars.com/api/?name=User&background=random&color=fff', role: 'Admin', isLoggedIn: true })}
            className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-200 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            Get Started Free
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
      <section className="bg-slate-50 py-16 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">Everything you need to master your money</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base px-2">Powerful features designed to give you total control over your financial life.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {[
              { icon: Zap, title: 'AI Invoice Scanner', desc: 'Just snap a photo and our AI extracts all details automatically.' },
              { icon: PieChart, title: 'Smart Reports', desc: 'Deep visual insights into where your money is going every month.' },
              { icon: Shield, title: 'Budget Planner', desc: 'Set smart limits and get notified before you overspend.' },
              { icon: Globe, title: 'Bank Sync', desc: 'Securely connect your bank accounts for real-time tracking.' },
              { icon: Star, title: 'Multi-currency', desc: 'Manage expenses in any currency with live exchange rates.' },
              { icon: Sparkles, title: 'AI Predictions', desc: 'Our AI predicts future expenses based on your history.' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
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
      <section className="py-16 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="text-3xl sm:text-5xl font-bold text-slate-900 mb-8 sm:mb-12">How FinTrack Works</h2>
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
            <div className="relative hidden lg:block">
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
      <section className="bg-slate-900 py-16 sm:py-32 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400 text-sm sm:text-base">Choose the plan that fits your financial goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 p-6 sm:p-12 rounded-2xl sm:rounded-[40px] backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-slate-400 mb-8">Perfect for individuals just starting out.</p>
              <div className="text-3xl sm:text-5xl font-black mb-8 sm:mb-12">₹0 <span className="text-base sm:text-lg font-normal text-slate-500">/mo</span></div>
              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
                {['Manual tracking', 'Basic reports', '1 Bank connection', 'Standard support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <Check className="w-5 h-5 text-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => setAuthMode('select')} className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all">Get Started</button>
            </div>

            <div className="bg-indigo-600 p-6 sm:p-12 rounded-2xl sm:rounded-[40px] shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-6 right-6 sm:top-8 sm:right-8 bg-white/20 px-3 sm:px-4 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest">Most Popular</div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-indigo-100 mb-8">For power users who want total control.</p>
              <div className="text-3xl sm:text-5xl font-black mb-8 sm:mb-12">₹499 <span className="text-base sm:text-lg font-normal text-indigo-200">/mo</span></div>
              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
                {['Unlimited AI scanning', 'Advanced analytics', 'Unlimited bank sync', 'Family sharing', 'Priority support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-indigo-50">
                    <Check className="w-5 h-5 text-white" />
                    {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => setAuthMode('select')} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold shadow-xl hover:scale-105 transition-all">Go Premium</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
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
