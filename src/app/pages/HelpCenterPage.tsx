import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  MessageSquare,
  Truck,
  RotateCcw,
  CreditCard,
  User,
  ExternalLink,
  ChevronDown,
  X,
  Send,
  Sparkles,
  Bot
} from 'lucide-react';
import { BackgroundDecorations } from '../components/BackgroundDecorations';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'q1',
    category: 'shipping',
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. International orders can take between 7-14 business days depending on customs processing.'
  },
  {
    id: 'q2',
    category: 'shipping',
    question: 'Can I track my order in real-time?',
    answer: 'Yes! Once your order ships, we will email you a tracking link. You can also visit our Track Order page directly, enter your Order ID, and view a live shipping timeline.'
  },
  {
    id: 'q3',
    category: 'returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day hassle-free return policy. Items must be returned in their original packaging and unworn condition. Return shipping is free when you print a label from our Returns page.'
  },
  {
    id: 'q4',
    category: 'returns',
    question: 'How long do refunds take to process?',
    answer: 'Once we receive and inspect your returned package, your refund will be processed back to your original payment method within 5-7 business days.'
  },
  {
    id: 'q5',
    category: 'payments',
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are securely encrypted.'
  },
  {
    id: 'q6',
    category: 'accounts',
    question: 'How do I reset my password?',
    answer: 'Go to the Sign In page and click "Forgot Password". Enter your email address and we will send you a secure link to reset your password immediately.'
  }
];

export function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: "Hi there! I'm Olivia, your Orivelle Virtual Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Filter FAQs
  const filteredFAQs = useMemo(() => {
    return FAQ_DATA.filter((faq) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCat || faq.category === selectedCat;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCat]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg, time: timeStr }]);
    setChatInput('');
    setIsTyping(true);

    // Simulate Agent Reply
    setTimeout(() => {
      let replyText = "I'm sorry, I didn't quite catch that. Could you rephrase your question? Alternatively, you can search our FAQ section or email our support desk at support@orivelle.com.";
      const query = userMsg.toLowerCase();

      if (query.includes('shipping') || query.includes('delivery') || query.includes('track')) {
        replyText = "We process orders within 24 hours. For real-time updates, you can use our Track Order page! Simply enter your Order ID (like ORV-12345) to view a live status stepper.";
      } else if (query.includes('return') || query.includes('refund')) {
        replyText = "Returns are easy! We offer a 30-day free return policy. Just head over to our Returns portal page, retrieve your order details, select items to return, and print your free prepaid shipping label.";
      } else if (query.includes('discount') || query.includes('promo') || query.includes('sale')) {
        replyText = "Check out our Flash Sales page for up to 35% discount on products, or our New Arrivals page to see what's fresh in stock!";
      } else if (query.includes('hello') || query.includes('hi ') || query.includes('hey')) {
        replyText = "Hello! Hope you are having a wonderful day. Let me know what questions you have about shipping, returns, or our catalog!";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 transition-colors duration-300 min-h-screen relative pb-20">
      <BackgroundDecorations />

      {/* Glassmorphic Search Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold tracking-tight"
          >
            How can we help you?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-indigo-200 text-sm md:text-base max-w-lg mx-auto"
          >
            Search our knowledge base or chat with our support team for quick help.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto shadow-2xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-2"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shipping, returns, order tracking..."
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-neutral-900 border-none rounded-xl text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-4.5" />
            </div>
          </motion.div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 space-y-12">
        {/* Categories Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { id: 'shipping', name: 'Order & Shipping', icon: Truck, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30' },
            { id: 'returns', name: 'Returns & Refunds', icon: RotateCcw, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
            { id: 'payments', name: 'Payments & Bills', icon: CreditCard, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
            { id: 'accounts', name: 'Account Settings', icon: User, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' }
          ].map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCat === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCat(isActive ? null : cat.id)}
                className={`p-6 rounded-2xl border text-center flex flex-col items-center gap-4 transition-all ${
                  isActive
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                    : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${cat.color} ${isActive ? 'text-white bg-white/20' : ''}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-sm">{cat.name}</span>
              </motion.button>
            );
          })}
        </section>

        {/* FAQs Accordion */}
        <section className="bg-neutral-50 dark:bg-neutral-800/40 p-6 md:p-10 rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-4">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h2>
            {selectedCat && (
              <button
                onClick={() => setSelectedCat(null)}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400"
              >
                Clear Category Filter
              </button>
            )}
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => {
              const isOpen = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors"
                  >
                    <span className="font-semibold text-sm md:text-base">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-5 pt-1 text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-700 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredFAQs.length === 0 && (
              <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm">
                No FAQs found. Try searching for something else or ask our assistant below.
              </div>
            )}
          </div>
        </section>

        {/* Still Need Help? Section */}
        <section className="text-center bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 p-8 rounded-3xl border border-indigo-200/20 dark:border-indigo-800/30">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Still need help?</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 max-w-md mx-auto">
            Our customer care specialists are available 24/7. Chat with us now for instantaneous support.
          </p>
          <button
            onClick={() => setIsChatOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all hover:scale-103"
          >
            <MessageSquare className="w-5 h-5 fill-white/10" />
            Open Live Support Chat
          </button>
        </section>
      </main>

      {/* Floating Chat Modal */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Chat Backdrop on Mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsChatOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* Chat Box */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed bottom-0 md:bottom-6 right-0 md:right-6 w-full md:w-[400px] h-[550px] bg-white dark:bg-neutral-800 md:rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/10 relative">
                    <Bot className="w-5 h-5" />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-indigo-700 rounded-full" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm leading-none flex items-center gap-1">
                      Olivia
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                    </h4>
                    <span className="text-[10px] text-indigo-200">Orivelle Support Agent</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-neutral-900/60">
                {chatMessages.map((msg, index) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-none border border-neutral-200/50 dark:border-neutral-700/50'
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                        <span className={`block text-[9px] text-right mt-1 ${isUser ? 'text-indigo-200' : 'text-neutral-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 bg-neutral-100 dark:bg-neutral-900 border border-transparent rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-neutral-950 transition-all text-neutral-800 dark:text-neutral-100"
                />
                <button
                  type="submit"
                  className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
