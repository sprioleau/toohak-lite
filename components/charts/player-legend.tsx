'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ANIMALS, getTwemojiUrl } from '@/lib/animals';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface PlayerLegendProps {
  players: string[];
  visiblePlayers: string[];
  onTogglePlayer: (animalId: string) => void;
  onShowAll: () => void;
  onHideAll: () => void;
}

// Same color palette as aggregate chart
const PLAYER_COLORS = [
  '#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6',
  '#14b8a6', '#f97316', '#3b82f6', '#ef4444', '#84cc16',
  '#06b6d4', '#a855f7', '#10b981', '#f43f5e', '#eab308',
  '#0ea5e9', '#d946ef', '#64748b', '#78716c', '#71717a',
];

export function PlayerLegend({
  players,
  visiblePlayers,
  onTogglePlayer,
  onShowAll,
  onHideAll,
}: PlayerLegendProps) {
  const getAnimal = (id: string) => ANIMALS.find(a => a.id === id);

  return (
    <div className="flex flex-col gap-4 p-4 bg-surface-1 rounded-xl border border-border">
      <div className="flex items-center justify-between">
        <h3 className="font-funnel text-sm font-medium text-foreground">
          Players
        </h3>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onShowAll}
            className="h-7 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            All
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onHideAll}
            className="h-7 text-xs"
          >
            <EyeOff className="w-3 h-3 mr-1" />
            None
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        {players.map((animalId, index) => {
          const animal = getAnimal(animalId);
          const isVisible = visiblePlayers.includes(animalId);
          const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
          
          if (!animal) return null;

          return (
            <motion.button
              key={animalId}
              onClick={() => onTogglePlayer(animalId)}
              whileHover={{ x: 2 }}
              className={cn(
                'flex items-center gap-3 p-2 rounded-lg transition-all',
                isVisible 
                  ? 'bg-surface-2 border border-border' 
                  : 'opacity-50 hover:opacity-70'
              )}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: isVisible ? color : 'var(--muted)' }}
              />
              <Image
                src={getTwemojiUrl(animal.twemojiCode)}
                alt={animal.name}
                width={24}
                height={24}
                className={cn(
                  'transition-opacity',
                  isVisible ? 'opacity-100' : 'opacity-50'
                )}
                crossOrigin="anonymous"
              />
              <span className={cn(
                'text-sm',
                isVisible ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {animal.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
