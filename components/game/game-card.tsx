'use client';

import { motion } from 'framer-motion';
import { Timer, HelpCircle } from 'lucide-react';
import type { Game } from '@/lib/questions';

interface GameCardProps {
  game: Game;
  onSelect: (gameId: string) => void;
}

export function GameCard({ game, onSelect }: GameCardProps) {
  return (
    <motion.button
      onClick={() => onSelect(game.id)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="w-full text-left bg-surface-1 border border-border rounded-xl p-6 hover:border-primary/50 hover:bg-surface-2 transition-colors"
    >
      {/* Game Name */}
      <h2 className="font-funnel text-2xl sm:text-3xl text-primary mb-2">
        {game.name}
      </h2>
      
      {/* Description */}
      <p className="text-muted-foreground text-sm sm:text-base mb-4 leading-relaxed">
        {game.description}
      </p>
      
      {/* Meta Info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {/* Question Count */}
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" />
          <span>{game.questions.length} questions</span>
        </div>
        
        {/* Timed Indicator */}
        <div className="flex items-center gap-1.5">
          <Timer className="w-4 h-4" />
          <span>{game.timePerQuestion}s per question</span>
        </div>
      </div>
    </motion.button>
  );
}
