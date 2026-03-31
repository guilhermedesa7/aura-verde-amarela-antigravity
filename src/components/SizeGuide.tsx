import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Check } from 'lucide-react';

interface SizeGuideProps {
  open: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
}

const sizeData = [
  { size: 'P', chest: '88-94', height: '160-170', weight: '55-65' },
  { size: 'M', chest: '94-100', height: '168-178', weight: '65-75' },
  { size: 'G', chest: '100-108', height: '175-185', weight: '75-88' },
  { size: 'GG', chest: '108-116', height: '180-190', weight: '85-100' },
  { size: 'XGG', chest: '116-124', height: '185-195', weight: '95-115' },
];

const SizeGuide = ({ open, onClose, onSelectSize }: SizeGuideProps) => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [recommended, setRecommended] = useState<string | null>(null);

  const findSize = () => {
    const h = parseInt(height);
    const w = parseInt(weight);
    if (isNaN(h) || isNaN(w)) return;

    for (const s of sizeData) {
      const [minH, maxH] = s.height.split('-').map(Number);
      const [minW, maxW] = s.weight.split('-').map(Number);
      if (h >= minH && h <= maxH && w >= minW && w <= maxW) {
        setRecommended(s.size);
        return;
      }
    }
    // Fallback logic
    if (w > 100 || h > 190) setRecommended('XGG');
    else if (w > 85 || h > 180) setRecommended('GG');
    else if (w > 75 || h > 175) setRecommended('G');
    else if (w > 65 || h > 168) setRecommended('M');
    else setRecommended('P');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-border rounded-xl w-full max-w-md p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <Ruler className="w-5 h-5 text-primary" />
              <h3 className="font-display text-xl font-bold uppercase tracking-wide">Encontre seu tamanho</h3>
            </div>

            {/* Body silhouette + inputs */}
            <div className="flex gap-6 mb-6">
              <div className="flex-shrink-0 w-24 relative">
                <svg viewBox="0 0 80 200" className="w-full h-auto text-primary/20">
                  <ellipse cx="40" cy="25" rx="15" ry="18" fill="currentColor" />
                  <rect x="22" y="42" width="36" height="55" rx="8" fill="currentColor" />
                  <rect x="12" y="50" width="12" height="40" rx="6" fill="currentColor" />
                  <rect x="56" y="50" width="12" height="40" rx="6" fill="currentColor" />
                  <rect x="24" y="95" width="14" height="55" rx="7" fill="currentColor" />
                  <rect x="42" y="95" width="14" height="55" rx="7" fill="currentColor" />
                </svg>
                {recommended && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-primary rounded-full flex items-center justify-center"
                  >
                    <span className="font-display text-lg font-bold text-primary-foreground">{recommended}</span>
                  </motion.div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Altura (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={e => setHeight(e.target.value)}
                    placeholder="Ex: 175"
                    className="mt-1 w-full h-11 bg-muted border border-border rounded-lg px-3 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Peso (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={e => setWeight(e.target.value)}
                    placeholder="Ex: 78"
                    className="mt-1 w-full h-11 bg-muted border border-border rounded-lg px-3 text-sm focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={findSize}
                  className="w-full h-11 bg-gradient-gold text-primary-foreground font-display text-sm tracking-wider uppercase rounded-lg hover:opacity-90 transition-opacity"
                >
                  Descobrir Tamanho
                </button>
              </div>
            </div>

            {/* Recommendation */}
            <AnimatePresence>
              {recommended && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-primary" />
                    <span className="font-display text-sm font-bold uppercase text-primary">
                      Tamanho recomendado: {recommended}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Baseado nas suas medidas, o tamanho {recommended} é ideal para você.
                  </p>
                  <button
                    onClick={() => { onSelectSize(recommended); onClose(); }}
                    className="mt-3 w-full h-10 border border-primary/30 text-primary font-display text-xs tracking-wider uppercase rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Selecionar {recommended} e fechar
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Size chart */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-2 text-left font-display uppercase tracking-wider text-muted-foreground">Tam.</th>
                    <th className="py-2 text-center font-display uppercase tracking-wider text-muted-foreground">Peito</th>
                    <th className="py-2 text-center font-display uppercase tracking-wider text-muted-foreground">Altura</th>
                    <th className="py-2 text-center font-display uppercase tracking-wider text-muted-foreground">Peso</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData.map(s => (
                    <tr
                      key={s.size}
                      className={`border-b border-border/50 ${recommended === s.size ? 'bg-primary/5' : ''}`}
                    >
                      <td className={`py-2 font-bold ${recommended === s.size ? 'text-primary' : ''}`}>{s.size}</td>
                      <td className="py-2 text-center text-muted-foreground">{s.chest}cm</td>
                      <td className="py-2 text-center text-muted-foreground">{s.height}cm</td>
                      <td className="py-2 text-center text-muted-foreground">{s.weight}kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuide;
