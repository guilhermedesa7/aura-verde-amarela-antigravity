import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-jersey.jpg';
import feedbackImg1 from '@/assets/feedback-1.jpg';
import feedbackImg2 from '@/assets/feedback-2.jpg';
import Reveal from '@/components/Reveal';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import CustomerStories from '@/components/CustomerStories';
import HistoricTimeline from '@/components/HistoricTimeline';
import UnboxingSection from '@/components/UnboxingSection';
import { products } from '@/lib/store';
import { Star, Shield, Truck, CreditCard, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

const Index = () => {
  return (
    <main>
      <HeroSection />
      <EmotionalSection />
      <ProductsSection />
      <CustomerStories />
      <BenefitsSection />
      <HistoricTimeline />
      <SocialProofSection />
      <UnboxingSection />
      <UrgencySection />
      <Footer />
    </main>
  );
};

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover bg-background"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
    </div>

    <div className="container relative z-10 pt-20">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
        >
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse-gold" />
          <span className="text-xs font-medium tracking-wider uppercase text-primary">
            Copa do Mundo 2026 — Edição Limitada
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] uppercase"
        >
          Vista a<br />
          <span className="text-gradient-gold">paixão</span><br />
          pelo Brasil
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-lg md:text-xl text-foreground/70 max-w-lg leading-relaxed"
        >
          Camisetas premium para quem sente o jogo de verdade. Edição exclusiva Copa 2026.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/colecao"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-gradient-gold text-primary-foreground font-display text-lg tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity shadow-gold"
          >
            Ver Coleção <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/produto/camisa-copa-2026-azul"
            className="inline-flex items-center justify-center gap-2 h-14 px-8 border border-primary/30 text-primary font-display text-lg tracking-wider uppercase rounded-lg hover:bg-primary/10 transition-colors"
          >
            Mais Vendida
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-10 flex items-center gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-primary" />
            Compra segura
          </div>
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4 text-primary" />
            Frete grátis
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-primary fill-primary" />
            4.9/5
          </div>
        </motion.div>
      </div>
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
    >
      <span className="text-xs tracking-widest uppercase">Explore</span>
      <ChevronDown className="w-5 h-5 animate-bounce" />
    </motion.div>
  </section>
);

const EmotionalSection = () => (
  <section className="py-20 md:py-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-green opacity-10" />
    <div className="container relative z-10 text-center max-w-3xl">
      <Reveal>
        <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight uppercase leading-tight">
          Mais do que uma camisa.<br />
          <span className="text-gradient-gold">Um símbolo de quem você é.</span>
        </h2>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          Cada fibra carrega o peso de cinco estrelas. Cada detalhe foi pensado para quem não apenas torce — mas vive o futebol. Chegue na Copa com presença. Mostre sua paixão em grande estilo.
        </p>
      </Reveal>
      <Reveal delay={0.3}>
        <div className="mt-8 flex justify-center gap-8">
          {[
            { icon: '🏆', text: '5x Campeão' },
            { icon: '⭐', text: 'Qualidade Premium' },
            { icon: '🇧🇷', text: 'Orgulho Nacional' },
          ].map((item) => (
            <div key={item.text} className="flex flex-col items-center gap-2">
              <span className="text-3xl">{item.icon}</span>
              <span className="text-xs font-display tracking-wider uppercase text-muted-foreground">{item.text}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  </section>
);

const ProductsSection = () => (
  <section className="py-16 md:py-24">
    <div className="container">
      <Reveal>
        <div className="text-center mb-12">
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary">Coleção Copa 2026</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight uppercase mt-2">
            Escolha sua camisa
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <Reveal delay={0.3}>
        <div className="mt-12 text-center">
          <Link
            to="/colecao"
            className="inline-flex items-center gap-2 font-display tracking-wider uppercase text-primary hover:text-gold-light transition-colors"
          >
            Ver toda a coleção <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Reveal>
    </div>
  </section>
);

const BenefitsSection = () => {
  const benefits = [
    { icon: Award, title: 'Qualidade Premium', desc: 'Tecido Dry-Fit de alta performance com acabamento impecável' },
    { icon: Truck, title: 'Envio Rápido', desc: 'Entrega expressa para todo o Brasil em até 5 dias úteis' },
    { icon: Shield, title: 'Compra Segura', desc: 'Pagamento protegido e garantia de satisfação total' },
    { icon: CreditCard, title: 'Parcele em 12x', desc: 'Pague no cartão, boleto ou Pix com desconto especial' },
  ];

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.1}>
              <div className="text-center group">
                <div className="w-14 h-14 mx-auto rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <b.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-sm md:text-base tracking-wider uppercase">{b.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const SocialProofSection = () => {
  const reviews = [
    { name: 'Ricardo S.', text: 'Qualidade absurda! Melhor camisa que já comprei. Já encomendei a segunda.', rating: 5 },
    { name: 'Felipe M.', text: 'Chegou antes do prazo, material incrível. Minha torcida ficou completa.', rating: 5 },
    { name: 'André L.', text: 'Visual premium de verdade. Todo mundo pergunta onde comprei. Recomendo muito!', rating: 5 },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <Reveal>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-primary fill-primary" />
              ))}
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight uppercase">
              +8.000 torcedores satisfeitos
            </h2>
            <p className="text-muted-foreground mt-2">Nota 4.9/5 baseada em avaliações reais</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.15}>
              <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center font-display text-sm text-primary-foreground font-bold">
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.name}</p>
                    <p className="text-xs text-primary">✓ Compra verificada</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Customer photos */}
        <Reveal delay={0.3}>
          <div className="mt-12">
            <p className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
              📸 Fotos dos nossos clientes
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-colors">
                <img src={feedbackImg1} alt="Camisas Brasil embaladas - cliente satisfeito" className="w-full h-auto object-cover" />
              </div>
              <div className="rounded-lg overflow-hidden border border-border hover:border-primary/30 transition-colors">
                <img src={feedbackImg2} alt="Camisas Brasil e Jordan embaladas - cliente satisfeito" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const UrgencySection = () => {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-06-11T00:00:00');
    const interval = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      if (diff <= 0) return;
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-gold opacity-5" />
      <div className="container relative z-10 text-center">
        <Reveal>
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary">Contagem regressiva</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight uppercase mt-2">
            A Copa está chegando
          </h2>
          <p className="text-muted-foreground mt-2 mb-8">Garanta sua camisa antes que acabe o estoque</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex justify-center gap-4 md:gap-6">
            {[
              { value: time.days, label: 'Dias' },
              { value: time.hours, label: 'Horas' },
              { value: time.minutes, label: 'Min' },
              { value: time.seconds, label: 'Seg' },
            ].map((t) => (
              <div key={t.label} className="bg-card border border-border rounded-lg p-4 md:p-6 min-w-[70px] md:min-w-[100px]">
                <span className="font-display text-3xl md:text-5xl font-bold text-primary">
                  {String(t.value).padStart(2, '0')}
                </span>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{t.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <Link
            to="/colecao"
            className="mt-10 inline-flex items-center justify-center gap-2 h-14 px-10 bg-gradient-gold text-primary-foreground font-display text-lg tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity shadow-gold"
          >
            Garantir Minha Camisa <ArrowRight className="w-5 h-5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default Index;
