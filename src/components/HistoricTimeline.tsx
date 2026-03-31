import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Reveal from '@/components/Reveal';

const moments = [
  { year: '1958', title: 'Suécia', desc: 'Pelé com 17 anos conquista o primeiro título mundial.', emoji: '🏆' },
  { year: '1962', title: 'Chile', desc: 'Garrincha brilha e o Brasil é bicampeão.', emoji: '🏆' },
  { year: '1970', title: 'México', desc: 'A seleção perfeita. Pelé, Tostão, Rivelino — tricampeões.', emoji: '🏆' },
  { year: '1994', title: 'EUA', desc: 'Romário comanda a conquista do tetra após 24 anos.', emoji: '🏆' },
  { year: '2002', title: 'Japão/Coreia', desc: 'Ronaldo ressurge e o Brasil é pentacampeão.', emoji: '🏆' },
  { year: '2026', title: 'EUA/Canadá/México', desc: 'A próxima conquista começa com você vestindo a camisa.', emoji: '⭐' },
];

const HistoricTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section ref={containerRef} className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-green opacity-5" />
      <div className="container relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-xs font-medium tracking-[0.3em] uppercase text-primary">Nossa história</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight uppercase mt-2">
              Momentos que nos<br />
              <span className="text-gradient-gold">fizeram gigantes</span>
            </h2>
          </div>
        </Reveal>

        <div className="relative max-w-3xl mx-auto">
          {/* Animated line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-border">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-primary via-primary to-primary/0"
            />
          </div>

          {moments.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.1}>
              <div className={`relative flex items-start gap-6 mb-12 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                {/* Dot */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />

                {/* Content */}
                <div className={`ml-16 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-card border border-border rounded-lg p-5 hover:border-primary/30 transition-colors"
                  >
                    <div className={`flex items-center gap-3 mb-2 ${i % 2 === 0 ? 'md:justify-end' : ''}`}>
                      <span className="text-2xl">{m.emoji}</span>
                      <div>
                        <span className="font-display text-2xl font-bold text-primary">{m.year}</span>
                        <span className="text-sm text-muted-foreground ml-2">{m.title}</span>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed">{m.desc}</p>
                  </motion.div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HistoricTimeline;
