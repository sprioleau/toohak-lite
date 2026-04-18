'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RatingCirclesProps {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function RatingCircles({ value, onChange, disabled = false }: RatingCirclesProps) {
  const ratings = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      {ratings.map((rating) => {
        const isSelected = value === rating;
        
        return (
          <motion.button
            key={rating}
            onClick={() => !disabled && onChange(rating)}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.1 } : undefined}
            whileTap={!disabled ? { scale: 0.9 } : undefined}
            animate={isSelected ? { scale: 1.2 } : { scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className={cn(
              'relative flex items-center justify-center rounded-full font-funnel font-bold text-xl sm:text-2xl transition-all duration-200',
              'w-14 h-14 sm:w-16 sm:h-16',
              isSelected && 'glow-indigo bg-primary text-primary-foreground',
              !isSelected && 'bg-surface-2 border-2 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            aria-label={`Rate ${rating} out of 5`}
            aria-pressed={isSelected}
          >
            {rating}
            
            {isSelected && (
              <motion.div
                layoutId="rating-glow"
                className="absolute inset-0 rounded-full bg-primary/20"
                initial={false}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
