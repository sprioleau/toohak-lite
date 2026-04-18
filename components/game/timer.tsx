'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TimerProps {
  duration: number; // in seconds
  onComplete: () => void;
  isRunning: boolean;
  resetKey?: number; // Change this to reset the timer
}

export function Timer({ duration, onComplete, isRunning, resetKey }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  const reset = useCallback(() => {
    setTimeLeft(duration);
  }, [duration]);

  // Reset when resetKey changes
  useEffect(() => {
    reset();
  }, [resetKey, reset]);

  // Countdown logic
  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const isUrgent = timeLeft <= 5;
  const progress = (timeLeft / duration) * 100;

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        animate={isUrgent ? { scale: [1, 1.05, 1] } : undefined}
        transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
        className={cn(
          'text-5xl sm:text-6xl font-mono font-bold tabular-nums',
          isUrgent ? 'text-destructive' : 'text-foreground'
        )}
      >
        {timeLeft}
      </motion.div>
      
      {/* Progress bar */}
      <div className="w-48 h-2 bg-surface-2 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full',
            isUrgent ? 'bg-destructive' : 'bg-primary'
          )}
          initial={{ width: '100%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      <span className="text-xs text-muted-foreground uppercase tracking-wide">
        seconds remaining
      </span>
    </div>
  );
}
