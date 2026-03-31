import { X, Plus, Minus, ShoppingBag, ArrowRight, Shield } from 'lucide-react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '@/lib/tracking';
import { Button } from '@/components/ui/button';

const CartDrawer = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal } = useStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    trackEvent('InitiateCheckout', { value: cartTotal(), currency: 'BRL' });
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={() => setCartOpen(false)}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl tracking-wider uppercase flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Seu Carrinho
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-4 p-6">
                <ShoppingBag className="w-16 h-16 opacity-30" />
                <p className="font-display text-lg tracking-wide">Carrinho vazio</p>
                <p className="text-sm text-center">Escolha sua camisa e vista a paixão pelo Brasil</p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={`${item.product.id}-${item.size}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4 bg-muted/50 rounded-lg p-3"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-md"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display text-sm tracking-wide truncate">{item.product.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">Tamanho: {item.size}</p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          R$ {item.product.price.toFixed(2).replace('.', ',')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="w-7 h-7 rounded bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="w-7 h-7 rounded bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="ml-auto text-destructive/70 hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 border-t border-border space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-display text-xl text-primary">
                      R$ {cartTotal().toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    ou até 12x de R$ {(cartTotal() / 12).toFixed(2).replace('.', ',')}
                  </p>
                  <Button
                    onClick={handleCheckout}
                    className="w-full h-14 font-display text-lg tracking-wider uppercase bg-gradient-gold text-primary-foreground hover:opacity-90 transition-opacity"
                  >
                    Finalizar Compra <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5" />
                    Compra 100% segura
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
