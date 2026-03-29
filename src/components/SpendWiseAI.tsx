import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, X, ChevronRight, Table as TableIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';

const suggestions = [
  "Where did I spend the most this month?",
  "Analyze my subscription costs",
  "How much can I save if I cut food expenses by 20%?",
  "What is my safe to spend amount today?",
  "Compare this month's spending with last month"
];

export const SpendWiseAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, isTable?: boolean }[]>([
    { role: 'ai', content: "Hi! I'm SpendWise AI. How can I help you manage your finances today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = text;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: `You are SpendWise AI, a financial assistant. The user is asking: "${userMsg}". 
        Provide a helpful, professional response. If the user asks for spending analysis or comparisons, 
        format your data in a clear Markdown table. Keep the tone premium and trustworthy. 
        Use ₹ for currency. 
        
        Example table format:
        | Category | Amount | % of Total |
        |----------|--------|------------|
        | Food     | ₹8,500 | 35%        |
        ` }] }],
      });

      const result = await model;
      const responseText = result.text || "I'm sorry, I couldn't process that. Please try again.";
      
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: responseText,
        isTable: responseText.includes('|')
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* AI Button - positioned by parent container in App.tsx */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200 text-white hover:scale-110 active:scale-95 transition-all"
        title="SpendWise AI"
      >
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 right-2 sm:bottom-24 sm:right-8 w-[calc(100vw-1rem)] sm:w-[450px] h-[75vh] sm:h-[600px] max-h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">SpendWise AI</h3>
                  <p className="text-[10px] text-indigo-100 uppercase tracking-widest">Financial Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    {msg.isTable ? (
                      <div className="overflow-x-auto">
                        <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold">
                          <TableIcon className="w-4 h-4" />
                          <span>Analysis Result</span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          {msg.content.split('\n').map((line, i) => {
                            if (line.includes('|')) {
                              const cells = line.split('|').filter(c => c.trim() !== '');
                              if (line.includes('---')) return null;
                              return (
                                <div key={i} className="grid grid-cols-3 gap-4 py-2 border-b border-slate-50 last:border-0">
                                  {cells.map((cell, j) => (
                                    <span key={j} className={j === 0 ? 'font-medium text-slate-900' : 'text-slate-500'}>
                                      {cell.trim()}
                                    </span>
                                  ))}
                                </div>
                              );
                            }
                            return <p key={i} className="mb-2">{line}</p>;
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <div className="px-6 py-3 border-t border-slate-50 bg-white overflow-x-auto flex gap-2 no-scrollbar">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(s)}
                  className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-full text-xs text-slate-500 border border-slate-100 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-100">
              <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder="Ask SpendWise AI..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm py-2"
                />
                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
