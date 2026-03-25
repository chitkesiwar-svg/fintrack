import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Shield, Search, ArrowRight, CreditCard, Plus, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../types';

const INITIAL_CARDS = [
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

const SmartCardSelector = ({ cards, onCardClick }: { cards: any[], onCardClick: (card: any) => void }) => {
  const [activeCard, setActiveCard] = useState(0);
  const scrollLock = React.useRef(false);

  // Fallback if cards array changes size and activeCard goes out of bounds
  useEffect(() => {
    if (activeCard >= cards.length && cards.length > 0) setActiveCard(cards.length - 1);
  }, [cards.length, activeCard]);

  const handleWheel = (e: React.WheelEvent) => {
    if (scrollLock.current || cards.length === 0) return;
    if (e.deltaY > 30) {
      scrollLock.current = true;
      setActiveCard((prev) => (prev - 1 + cards.length) % cards.length);
      setTimeout(() => scrollLock.current = false, 400);
    } else if (e.deltaY < -30) {
      scrollLock.current = true;
      setActiveCard((prev) => (prev + 1) % cards.length);
      setTimeout(() => scrollLock.current = false, 400);
    }
  };

  const handleDragEnd = (event: any, info: any) => {
    if (cards.length === 0) return;
    if (info.offset.y > 40) {
      setActiveCard((prev) => (prev - 1 + cards.length) % cards.length);
    } else if (info.offset.y < -40) {
      setActiveCard((prev) => (prev + 1) % cards.length);
    }
  };

  if (cards.length === 0) return <div className="h-[280px] w-full max-w-md border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center text-slate-400">No cards assigned.</div>;

  return (
    <div className="relative w-full max-w-md h-[280px]" onWheel={handleWheel}>
      <AnimatePresence>
        {cards.map((card, index) => {
          const offset = (index - activeCard + cards.length) % cards.length;
          const isActive = offset === 0;
          
          return (
            <motion.div
              key={card.id}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              onClick={() => isActive ? onCardClick(card) : setActiveCard(index)}
              initial={false}
              animate={{
                top: offset * 24, // Stack spacing
                scale: 1 - offset * 0.05, // Shrink cards behind
                zIndex: cards.length - offset,
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
  // Card System State
  const [cards, setCards] = useState<any[]>(INITIAL_CARDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [showCardSettings, setShowCardSettings] = useState(false);

  // Card Form State
  const [cardForm, setCardForm] = useState({
    type: 'Visa', brand: 'Standard', userName: 'Prashansa C.', balance: 0, mask: '**** 0000', gradient: 'from-slate-900 via-slate-800 to-slate-900', status: 'Active'
  });

  const openCardModal = (card: any = null) => {
    setEditingCard(card);
    if (card) {
      setCardForm({ ...card });
    } else {
      setCardForm({ type: 'Visa', brand: 'Standard', userName: 'Prashansa C.', balance: 0, mask: '**** 0000', gradient: 'from-slate-900 via-slate-800 to-slate-900', status: 'Active' });
    }
    setIsModalOpen(true);
  };

  const saveCard = () => {
    if (editingCard) {
      setCards(cards.map(c => c.id === editingCard.id ? { ...cardForm, id: c.id, shadow: c.shadow || 'shadow-slate-500/20' } : c));
    } else {
      setCards([{ ...cardForm, id: Math.random(), shadow: 'shadow-slate-500/20' }, ...cards]);
    }
    setIsModalOpen(false);
  };

  const toggleCardStatus = (id: number) => {
    setCards(cards.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c));
  };

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
            <button 
              onClick={() => openCardModal()}
              className="flex-1 py-4 px-6 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              <Plus className="w-5 h-5" />
              Add New Card
            </button>
            <button 
              onClick={() => setShowCardSettings(!showCardSettings)}
              className={cn(
                "flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
                showCardSettings 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-200" 
                  : "bg-white border-2 border-slate-100 text-slate-700 hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <CreditCard className="w-5 h-5" />
              Card Settings
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <SmartCardSelector cards={cards} onCardClick={openCardModal} />
        </div>
      </div>

      {/* Card Settings List */}
      <AnimatePresence>
        {showCardSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50">
                <h3 className="font-bold text-slate-800">All Cards</h3>
                <p className="text-xs text-slate-400 mt-1">Manage card status and view details</p>
              </div>
              <div className="divide-y divide-slate-50">
                {cards.map((card, idx) => (
                  <motion.div 
                    key={card.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-12 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", card.gradient)}>
                        {card.type === 'Mastercard' ? (
                          <div className="flex">
                            <div className="w-4 h-4 bg-rose-400 rounded-full opacity-90"></div>
                            <div className="w-4 h-4 bg-amber-400 rounded-full opacity-90 -ml-2"></div>
                          </div>
                        ) : (
                          <span className="text-white text-[8px] font-extrabold italic">VISA</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{card.brand}</p>
                        <p className="text-xs text-slate-400 font-mono">{card.mask}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:block">{card.type}</span>
                      <button
                        onClick={() => toggleCardStatus(card.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                          (card.status || 'Active') === 'Active' 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        )}
                      >
                        {card.status || 'Active'}
                      </button>
                      <button onClick={() => openCardModal(card)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Details/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] shadow-2xl p-8 overflow-hidden z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-6">{editingCard ? 'Edit Card Details' : 'Add New Card'}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Card Type</label>
                  <select 
                    value={cardForm.type} onChange={e => setCardForm({...cardForm, type: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 bg-slate-50"
                  >
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Card Brand (e.g. Platinum)</label>
                  <input 
                    type="text" value={cardForm.brand} onChange={e => setCardForm({...cardForm, brand: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Mask (Last 4 digits)</label>
                  <input 
                    type="text" value={cardForm.mask} onChange={e => setCardForm({...cardForm, mask: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Balance (₹)</label>
                  <input 
                    type="number" value={cardForm.balance} onChange={e => setCardForm({...cardForm, balance: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Card Color Theme</label>
                  <div className="flex gap-2">
                    {['from-slate-900 via-slate-800 to-slate-900', 'from-indigo-600 via-purple-600 to-indigo-800', 'from-emerald-500 via-teal-500 to-emerald-700', 'from-rose-500 via-red-500 to-rose-700'].map(grad => (
                      <button 
                        key={grad} onClick={() => setCardForm({...cardForm, gradient: grad})}
                        className={cn("w-10 h-10 rounded-full bg-gradient-to-br border-2", grad, cardForm.gradient === grad ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-transparent')}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  {editingCard && (
                    <button 
                      onClick={() => { setCards(cards.filter(c => c.id !== editingCard.id)); setIsModalOpen(false); }}
                      className="py-4 px-6 bg-rose-50 text-rose-600 rounded-2xl font-bold flex border border-rose-100 hover:bg-rose-100 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  <button 
                    onClick={saveCard}
                    className="flex-1 py-4 px-6 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                  >
                    <Save className="w-5 h-5" />
                    {editingCard ? 'Save Changes' : 'Add Card'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

