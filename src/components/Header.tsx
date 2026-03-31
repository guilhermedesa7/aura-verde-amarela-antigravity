import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const cartCount = useStore((s) => s.cartCount());
  const toggleCart = useStore((s) => s.toggleCart);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-display text-2xl md:text-3xl font-bold tracking-wider text-gradient-gold">
          BRASIL ELITE
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium tracking-wide text-foreground/70 hover:text-primary transition-colors uppercase">
            Home
          </Link>
          <Link to="/colecao" className="text-sm font-medium tracking-wide text-foreground/70 hover:text-primary transition-colors uppercase">
            Coleção
          </Link>
          <Link to="/produto/camisa-titular-copa" className="text-sm font-medium tracking-wide text-foreground/70 hover:text-primary transition-colors uppercase">
            Destaque
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleCart}
            className="relative p-2 text-foreground/70 hover:text-primary transition-colors"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs font-bold flex items-center justify-center"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-foreground/70"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-b border-border"
          >
            <nav className="container py-4 flex flex-col gap-4">
              <Link to="/" onClick={() => setMenuOpen(false)} className="font-display text-lg tracking-wide text-foreground/80 hover:text-primary">HOME</Link>
              <Link to="/colecao" onClick={() => setMenuOpen(false)} className="font-display text-lg tracking-wide text-foreground/80 hover:text-primary">COLEÇÃO</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
