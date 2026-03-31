import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Flame, X } from 'lucide-react';

const UrgencyBar = () => {
  const [viewers, setViewers] = useState(0);
  const [visible, setVisible] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setViewers(Math.floor(Math.random() * 15) + 8);
    const interval = setInterval(() => {
      setViewers((v) => Math.max(5, v + Math.floor(Math.random() * 5) - 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const messages = [
    { icon: Eye, text: `${viewers} pessoas vendo agora`, color: 'text-primary' },
    { icon: Flame, text: 'Estoque limitado — últimas unidades!', color: 'text-destructive' },
    { icon: Eye, text: '3 vendas nos últimos 30 minutos', color: 'text-primary' },
  ];

  if (!visible) return null;

  const current = messages[messageIndex];

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/50"
    >
      <div className="container flex items-center justify-center h-10 gap-3 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={messageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-sm"
          >
            <current.icon className={`w-4 h-4 ${current.color} ${messageIndex === 1 ? 'animate-pulse' : ''}`} />
            <span className="text-foreground/80 font-medium">{current.text}</span>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={() => setVisible(false)}
          className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default UrgencyBar;
