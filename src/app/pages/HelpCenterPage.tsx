import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, MessageSquare, Truck, RotateCcw, CreditCard, User,
  ChevronDown, X, Send, Sparkles, Bot, Info
} from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';

interface FAQItem { id: string; question: string; answer: string; category: string; }

const FAQ_DATA: FAQItem[] = [
  { id: 'q1', category: 'shipping', question: 'How long does shipping take?', answer: 'Standard shipping takes 3-5 business days. Express takes 1-2. International orders take 7-14 business days depending on customs.' },
  { id: 'q2', category: 'shipping', question: 'Can I track my order in real-time?', answer: 'Yes! Once your order ships, we email you a tracking link. You can also visit our Track Order page, enter your Order ID, and view a live shipping timeline.' },
  { id: 'q3', category: 'returns', question: 'What is your return policy?', answer: 'We offer a 30-day hassle-free return policy. Items must be returned in original packaging. Return shipping is free when you print a label from our Returns page.' },
  { id: 'q4', category: 'returns', question: 'How long do refunds take?', answer: 'Once we receive and inspect your return, your refund is processed within 5-7 business days to your original payment method.' },
  { id: 'q5', category: 'payments', question: 'What payment methods do you accept?', answer: 'We accept Visa, MasterCard, American Express, PayPal, Apple Pay, and Google Pay. All transactions are securely encrypted.' },
  { id: 'q6', category: 'accounts', question: 'How do I reset my password?', answer: 'Go to Sign In and click "Forgot Password". Enter your email and we will send you a secure link to reset it immediately.' },
];

export function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    { sender: 'agent', text: "Hi! I'm Olivia, your Orivelle Virtual Assistant. How can I help you today?", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const filteredFAQs = useMemo(() => FAQ_DATA.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (!selectedCat || faq.category === selectedCat);
  }), [searchQuery, selectedCat]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: timeStr }]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      const q = userMsg.toLowerCase();
      let replyText = "I'm sorry, I didn't quite catch that. Try searching our FAQ or email support@orivelle.com.";
      if (q.includes('shipping') || q.includes('delivery') || q.includes('track')) replyText = "We process orders within 24 hours. Use our Track Order page with your Order ID (e.g. ORV-12345) for live updates!";
      else if (q.includes('return') || q.includes('refund')) replyText = "Returns are easy! 30-day free return policy. Head to our Returns portal, select items to return, and print your free prepaid label.";
      else if (q.includes('discount') || q.includes('sale')) replyText = "Check out our Flash Sales page for up to 35% off, or New Arrivals for fresh stock!";
      else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) replyText = "Hello! Hope you're having a great day. What can I help you with today?";
      setChatMessages((prev) => [...prev, { sender: 'agent', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1200);
  };

  const CATEGORIES = [
    { id: 'shipping', name: 'Order & Shipping', icon: Truck, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
    { id: 'returns', name: 'Returns & Refunds', icon: RotateCcw, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
    { id: 'payments', name: 'Payments', icon: CreditCard, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
    { id: 'accounts', name: 'My Account', icon: User, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 min-h-screen relative pb-20">
      <BackgroundDecorations />

      {/* Hero Search Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white py-12 md:py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4 md:space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight"
          >
            How can we help you?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-indigo-200 text-sm max-w-lg mx-auto px-2"
          >
            Search our knowledge base or chat with our support team.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto shadow-2xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1.5 sm:p-2"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for shipping, returns, tracking..."
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white dark:bg-neutral-900 border-none rounded-xl text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 space-y-8 md:space-y-12">
        {/* Category Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCat === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCat(isActive ? null : cat.id)}
                className={`p-4 sm:p-6 rounded-2xl border text-center flex flex-col items-center gap-2 sm:gap-4 transition-all ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                    : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20 text-white' : cat.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="font-semibold text-xs sm:text-sm leading-tight">{cat.name}</span>
              </motion.button>
            );
          })}
        </section>

        {/* FAQ Accordion */}
        <section className="bg-neutral-50 dark:bg-neutral-800/40 p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-md space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-4 flex-wrap gap-2">
            <h2 className="text-base sm:text-xl font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
            {selectedCat && (
              <button onClick={() => setSelectedCat(null)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                Clear Filter
              </button>
            )}
          </div>

          <div className="space-y-3">
            {filteredFAQs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div key={faq.id} className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : faq.id)}
                    className="w-full px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between text-left text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors gap-3"
                  >
                    <span className="font-semibold text-xs sm:text-sm md:text-base leading-snug">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-neutral-500 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-700 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            {filteredFAQs.length === 0 && (
              <div className="text-center py-8 text-neutral-500 text-sm">
                No FAQs found. Try a different search or ask our assistant.
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-indigo-200/20 dark:border-indigo-800/30">
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-2">Still need help?</h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-5 max-w-sm mx-auto">
            Our support team is available 24/7 for live assistance.
          </p>
          <button
            onClick={() => setIsChatOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all text-sm"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
            Open Live Support Chat
          </button>
        </section>
      </main>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 80, scale: 0.97 }}
              className="fixed bottom-0 md:bottom-6 right-0 md:right-6 w-full md:w-[380px] lg:w-[420px] h-[520px] sm:h-[560px] bg-white dark:bg-neutral-800 md:rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-3 sm:p-4 flex items-center justify-between shadow-lg flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/10 relative flex-shrink-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-indigo-700 rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm leading-none flex items-center gap-1">
                      Olivia
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                    </h4>
                    <span className="text-[9px] sm:text-[10px] text-indigo-200">Orivelle Support Agent</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-neutral-900/60 overscroll-contain">
                {chatMessages.map((msg, i) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm shadow-sm ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none border border-neutral-200/50 dark:border-neutral-700/50'
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <span className={`block text-[9px] text-right mt-1 ${isUser ? 'text-indigo-200' : 'text-neutral-400'}`}>{msg.time}</span>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                      {[0, 150, 300].map((delay) => (
                        <span key={delay} className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-2.5 sm:p-3 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-100 dark:bg-neutral-900 border border-transparent rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-neutral-950 transition-all text-neutral-800 dark:text-neutral-100"
                />
                <button
                  type="submit"
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-95 flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
