import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Reveal from '@/components/Reveal';
import feedbackImg1 from '@/assets/feedback-1.jpg';
import feedbackImg2 from '@/assets/feedback-2.jpg';
import camisaAzul from '@/assets/camisa-azul.jpg';
import camisaAmarela from '@/assets/camisa-amarela.jpg';
import azulDetalhe1 from '@/assets/azul-detalhe1.jpg';
import amarelaDetalhe1 from '@/assets/amarela-detalhe1.jpg';

interface Story {
  id: number;
  name: string;
  avatar: string;
  images: string[];
  caption: string;
}

const stories: Story[] = [
  { id: 1, name: 'Ricardo S.', avatar: '🇧🇷', images: [feedbackImg1], caption: 'Chegou perfeita! Qualidade incrível 🔥' },
  { id: 2, name: 'Felipe M.', avatar: '⚽', images: [feedbackImg2], caption: 'Pronto pra Copa! Material premium demais' },
  { id: 3, name: 'André L.', avatar: '🏆', images: [camisaAzul, azulDetalhe1], caption: 'A azul é simplesmente absurda' },
  { id: 4, name: 'Lucas P.', avatar: '💛', images: [camisaAmarela, amarelaDetalhe1], caption: 'Amarela clássica, nunca erra!' },
];

const CustomerStories = () => {
  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeStory === null) return;
    setProgress(0);
    setActiveImage(0);
    const story = stories.find(s => s.id === activeStory);
    if (!story) return;

    timerRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          const imgCount = story.images.length;
          setActiveImage(ai => {
            if (ai + 1 < imgCount) return ai + 1;
            // Move to next story
            const idx = stories.findIndex(s => s.id === activeStory);
            if (idx < stories.length - 1) {
              setActiveStory(stories[idx + 1].id);
            } else {
              setActiveStory(null);
            }
            return 0;
          });
          return 0;
        }
        return p + 2;
      });
    }, 60);

    return () => clearInterval(timerRef.current);
  }, [activeStory]);

  const currentStory = stories.find(s => s.id === activeStory);

  return (
    <section className="py-12">
      <div className="container">
        <Reveal>
          <p className="text-center text-xs font-display tracking-[0.3em] uppercase text-primary mb-6">
            📸 Stories dos clientes
          </p>
        </Reveal>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">
          {stories.map((story, i) => (
            <Reveal key={story.id} delay={i * 0.1}>
              <button
                onClick={() => { setActiveStory(story.id); setActiveImage(0); setProgress(0); }}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-gold">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-2xl overflow-hidden">
                    <img src={story.images[0]} alt={story.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">{story.name}</span>
              </button>
            </Reveal>
          ))}
        </div>

        <AnimatePresence>
          {activeStory !== null && currentStory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex items-center justify-center"
              onClick={() => setActiveStory(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-sm mx-4 aspect-[9/16] rounded-2xl overflow-hidden bg-card"
                onClick={e => e.stopPropagation()}
              >
                {/* Progress bars */}
                <div className="absolute top-3 left-3 right-3 z-10 flex gap-1">
                  {currentStory.images.map((_, i) => (
                    <div key={i} className="flex-1 h-0.5 bg-foreground/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-100"
                        style={{ width: i < activeImage ? '100%' : i === activeImage ? `${progress}%` : '0%' }}
                      />
                    </div>
                  ))}
                </div>

                {/* Header */}
                <div className="absolute top-6 left-3 right-3 z-10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {currentStory.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground">{currentStory.name}</span>
                  </div>
                  <button onClick={() => setActiveStory(null)}>
                    <X className="w-5 h-5 text-foreground/70" />
                  </button>
                </div>

                {/* Image */}
                <img
                  src={currentStory.images[activeImage] || currentStory.images[0]}
                  alt={currentStory.name}
                  className="w-full h-full object-cover"
                />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                  <p className="text-sm text-foreground/90">{currentStory.caption}</p>
                </div>

                {/* Nav */}
                <button
                  className="absolute left-0 top-1/4 bottom-1/4 w-1/3"
                  onClick={() => {
                    if (activeImage > 0) setActiveImage(ai => ai - 1);
                    else {
                      const idx = stories.findIndex(s => s.id === activeStory);
                      if (idx > 0) setActiveStory(stories[idx - 1].id);
                    }
                    setProgress(0);
                  }}
                />
                <button
                  className="absolute right-0 top-1/4 bottom-1/4 w-1/3"
                  onClick={() => {
                    if (activeImage < currentStory.images.length - 1) setActiveImage(ai => ai + 1);
                    else {
                      const idx = stories.findIndex(s => s.id === activeStory);
                      if (idx < stories.length - 1) setActiveStory(stories[idx + 1].id);
                      else setActiveStory(null);
                    }
                    setProgress(0);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CustomerStories;
