import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import camisaAzul from '@/assets/camisa-azul.jpg';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const UnboxingSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lidRotation = useTransform(scrollYProgress, [0.2, 0.5], [0, -120]);
  const lidY = useTransform(scrollYProgress, [0.2, 0.5], [0, -100]);
  const shirtY = useTransform(scrollYProgress, [0.4, 0.7], [60, -20]);
  const shirtScale = useTransform(scrollYProgress, [0.4, 0.7], [0.8, 1]);
  const shirtOpacity = useTransform(scrollYProgress, [0.35, 0.5], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.5, 0.65], [0, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.6, 0.75], [30, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[150vh] py-24">
      <div className="sticky top-0 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="relative w-72 h-80 md:w-96 md:h-[28rem]">
          {/* Glow effect */}
          <motion.div
            style={{ opacity: glowOpacity }}
            className="absolute inset-0 -inset-x-12 bg-gradient-gold rounded-full blur-3xl opacity-20"
          />

          {/* Box body */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 md:w-80 h-48 md:h-56">
            <div className="w-full h-full bg-card border border-border rounded-b-xl rounded-t-none relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-border/20 to-transparent" />
              {/* Brasil Elite label on box */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                <span className="font-display text-xs tracking-[0.3em] uppercase text-primary/40">Brasil Elite</span>
              </div>
              {/* Tissue paper texture */}
              <div className="absolute inset-x-4 top-8 bottom-4 bg-muted/30 rounded-lg border border-border/30" />
            </div>
          </div>

          {/* Shirt rising from box */}
          <motion.div
            style={{ y: shirtY, scale: shirtScale, opacity: shirtOpacity }}
            className="absolute bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 w-44 md:w-56 z-10"
          >
            <div className="rounded-lg overflow-hidden shadow-gold">
              <img src={camisaAzul} alt="Camiseta Copa 2026" className="w-full h-auto" />
            </div>
          </motion.div>

          {/* Box lid */}
          <motion.div
            style={{
              rotateX: lidRotation,
              y: lidY,
              transformOrigin: 'top center',
            }}
            className="absolute bottom-48 md:bottom-56 left-1/2 -translate-x-1/2 w-[17rem] md:w-[21.5rem] h-8 z-20"
          >
            <div className="w-full h-full bg-card border border-border rounded-t-xl relative">
              <div className="absolute inset-0 bg-gradient-to-b from-border/30 to-transparent rounded-t-xl" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary/20 rounded-full" />
            </div>
          </motion.div>
        </div>

        {/* Text */}
        <motion.div
          style={{ opacity: textOpacity, y: textY }}
          className="text-center mt-8"
        >
          <h3 className="font-display text-2xl md:text-4xl font-bold tracking-tight uppercase">
            Uma experiência<br />
            <span className="text-gradient-gold">premium</span>
          </h3>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm mx-auto">
            Cada detalhe pensado — da embalagem ao acabamento. Receber sua camisa é tão especial quanto vestir.
          </p>
          <Link
            to="/colecao"
            className="mt-6 inline-flex items-center gap-2 font-display text-sm tracking-wider uppercase text-primary hover:text-gold-light transition-colors"
          >
            Garantir a minha <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UnboxingSection;
