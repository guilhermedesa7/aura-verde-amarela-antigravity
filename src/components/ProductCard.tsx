import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { Product, useStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { trackEvent } from '@/lib/tracking';
import { useState } from 'react';
import StockBar from '@/components/StockBar';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const addToCart = useStore((s) => s.addToCart);
  const [selectedSize, setSelectedSize] = useState('M');

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize);
    trackEvent('AddToCart', {
      content_id: product.id,
      content_name: product.name,
      value: product.price,
      currency: 'BRL',
    });
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={`/produto/${product.id}`}
        onClick={() =>
          trackEvent('ViewContent', {
            content_id: product.id,
            content_name: product.name,
            value: product.price,
            currency: 'BRL',
          })
        }
        className="group block"
      >
        <div className="relative overflow-hidden rounded-lg bg-card shadow-card-premium">
          {product.badge && (
            <span className="absolute top-3 left-3 z-10 bg-gradient-gold text-primary-foreground px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-sm">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute top-3 right-3 z-10 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-bold rounded-sm">
              -{discount}%
            </span>
          )}

          <div className="aspect-square overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              width={800}
              height={800}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 via-background/70 to-transparent p-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <div className="flex gap-1 mb-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`w-8 h-8 text-xs font-bold rounded transition-colors ${
                    selectedSize === size
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 bg-gradient-gold text-primary-foreground font-display text-sm tracking-wider uppercase rounded flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="w-4 h-4" />
              Adicionar
            </button>
          </motion.div>
        </div>

        <div className="mt-4 space-y-1">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-muted-foreground'
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
          </div>
          <h3 className="font-display text-base tracking-wide group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              R$ {product.originalPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            ou 12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')}
          </p>
          <StockBar stock={product.stock} />
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
