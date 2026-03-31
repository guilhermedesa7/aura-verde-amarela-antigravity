import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Shield, Truck, RotateCcw, Star, Minus, Plus, ArrowLeft, Check } from 'lucide-react';
import { products, useStore } from '@/lib/store';
import { trackEvent } from '@/lib/tracking';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import SizeGuide from '@/components/SizeGuide';
import StockBar from '@/components/StockBar';

const ProductPage = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const addToCart = useStore((s) => s.addToCart);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-muted-foreground">Produto não encontrado</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    trackEvent('AddToCart', {
      content_id: product.id,
      content_name: product.name,
      value: product.price * quantity,
      currency: 'BRL',
      quantity,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    trackEvent('ClickButton', { content_id: product.id, content_name: 'buy_now' });
    window.location.href = '/checkout';
  };

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  const related = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="pt-20">
      <div className="container py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
      </div>

      <div className="container pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative flex flex-col gap-3"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-card shadow-card-premium">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  width={800}
                  height={800}
                />
              </div>
              {product.badge && (
                <span className="absolute top-4 left-4 bg-gradient-gold text-primary-foreground px-4 py-1.5 text-xs font-bold tracking-wider uppercase rounded-sm z-10">
                  {product.badge}
                </span>
              )}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? 'border-primary' : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              {product.video && (
                <div className="mt-2 rounded-lg overflow-hidden">
                  <video
                    src={product.video}
                    controls
                    playsInline
                    className="w-full rounded-lg"
                    poster={product.images[0]}
                  />
                </div>
              )}
            </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
              ))}
              <span className="text-sm text-muted-foreground ml-2">{product.rating} ({product.reviews} avaliações)</span>
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
              {product.name}
            </h1>

            <div className="mt-4 flex items-end gap-3">
              <span className="font-display text-4xl font-bold text-primary">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="text-lg text-muted-foreground line-through">
                R$ {product.originalPrice.toFixed(2).replace('.', ',')}
              </span>
              <span className="px-2 py-0.5 bg-destructive/20 text-destructive text-sm font-bold rounded">
                -{discount}%
              </span>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              ou 12x de R$ {(product.price / 12).toFixed(2).replace('.', ',')} sem juros
            </p>

            <div className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brasil-green-light">
              <span className="text-lg">💰</span> Pix: R$ {(product.price * 0.9).toFixed(2).replace('.', ',')} (10% off)
            </div>

            <p className="mt-6 text-foreground/70 leading-relaxed">
              {product.description}
            </p>

            {/* Size selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tamanho</span>
                <button onClick={() => setSizeGuideOpen(true)} className="text-xs text-primary hover:underline">Guia de medidas</button>
              </div>
              <div className="flex gap-2 mt-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg font-display text-sm font-bold transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-primary-foreground shadow-gold'
                        : 'bg-muted text-muted-foreground hover:border-primary/30 border border-transparent'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-medium">Quantidade</span>
              <div className="flex items-center bg-muted rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <StockBar stock={product.stock} />

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={handleBuyNow}
                className="h-14 bg-gradient-gold text-primary-foreground font-display text-lg tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity shadow-gold flex items-center justify-center gap-2"
              >
                Comprar Agora
              </button>
              <button
                onClick={handleAddToCart}
                className="h-14 border border-primary/30 text-primary font-display text-base tracking-wider uppercase rounded-lg hover:bg-primary/10 transition-colors flex items-center justify-center gap-2"
              >
                {added ? (
                  <><Check className="w-5 h-5" /> Adicionado!</>
                ) : (
                  <><ShoppingBag className="w-5 h-5" /> Adicionar ao Carrinho</>
                )}
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { icon: Truck, text: 'Frete grátis acima de R$150' },
                { icon: Shield, text: 'Compra 100% segura' },
                { icon: RotateCcw, text: 'Troca grátis em 30 dias' },
                { icon: Heart, text: 'Satisfação garantida' },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <b.icon className="w-4 h-4 text-primary shrink-0" />
                  {b.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <Reveal>
          <div className="mt-16 md:mt-24 max-w-2xl mx-auto">
            <h2 className="font-display text-2xl font-bold tracking-tight uppercase text-center mb-8">
              Perguntas Frequentes
            </h2>
            {[
              { q: 'Qual o material da camisa?', a: 'Tecido premium Dry-Fit com tecnologia de ventilação, garantindo conforto e performance.' },
              { q: 'Como funciona a troca?', a: 'Você tem 30 dias para trocar gratuitamente. Enviamos uma etiqueta de devolução sem custo.' },
              { q: 'Qual o prazo de entrega?', a: 'Entrega em todo o Brasil entre 3 a 7 dias úteis. Frete grátis para compras acima de R$150.' },
              { q: 'É edição limitada mesmo?', a: 'Sim. Cada modelo tem produção limitada e numerada. Quando acabar, não teremos reposição.' },
            ].map((faq, i) => (
              <div key={i} className="border-b border-border py-4">
                <h3 className="font-medium text-sm">{faq.q}</h3>
                <p className="text-sm text-muted-foreground mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16 md:mt-24">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight uppercase text-center mb-8">
                Você também vai gostar
              </h2>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} onSelectSize={setSelectedSize} />
      <Footer />
    </main>
  );
};

export default ProductPage;
