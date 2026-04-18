'use client';

import { motion } from 'framer-motion';

interface RoomCodeDisplayProps {
  code: string;
  size?: 'sm' | 'lg';
}

export function RoomCodeDisplay({ code, size = 'lg' }: RoomCodeDisplayProps) {
  const letters = code.split('');
  
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-muted-foreground text-sm uppercase tracking-widest">
        Room Code
      </span>
      <div className="flex gap-2">
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`
              flex items-center justify-center
              bg-surface-2 border border-border rounded-lg
              font-mono font-bold text-foreground
              ${size === 'lg' ? 'w-16 h-20 text-4xl' : 'w-10 h-12 text-xl'}
            `}
          >
            {letter}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
