import { motion } from 'framer-motion';

interface StockBarProps {
  stock: number;
  total?: number;
}

const StockBar = ({ stock, total = 50 }: StockBarProps) => {
  const percentage = Math.round(((total - stock) / total) * 100);
  const color = percentage > 80 ? 'bg-destructive' : percentage > 50 ? 'bg-primary' : 'bg-accent';

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-muted-foreground font-medium">
          {percentage >= 80 ? '🔥 Quase esgotado!' : `${percentage}% vendido`}
        </span>
        <span className="text-muted-foreground">{stock} restantes</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
};

export default StockBar;
