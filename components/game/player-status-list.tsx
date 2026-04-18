'use client';

import { motion } from 'framer-motion';
import { ANIMALS, getTwemojiUrl } from '@/lib/animals';
import { Check, Clock } from 'lucide-react';
import Image from 'next/image';

interface PlayerStatusListProps {
  players: string[]; // animalIds
  submittedPlayers: string[]; // animalIds that have submitted
}

export function PlayerStatusList({ players, submittedPlayers }: PlayerStatusListProps) {
  const getAnimal = (id: string) => ANIMALS.find(a => a.id === id);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>Players</span>
        <span>{submittedPlayers.length} / {players.length} submitted</span>
      </div>
      
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {players.map((animalId) => {
          const animal = getAnimal(animalId);
          const hasSubmitted = submittedPlayers.includes(animalId);
          
          if (!animal) return null;

          return (
            <motion.div
              key={animalId}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div
                className={`
                  w-12 h-12 rounded-lg flex items-center justify-center
                  transition-all duration-300
                  ${hasSubmitted 
                    ? 'bg-primary/20 border-2 border-primary' 
                    : 'bg-surface-2 border border-border'
                  }
                `}
              >
                <Image
                  src={getTwemojiUrl(animal.twemojiCode)}
                  alt={animal.name}
                  width={32}
                  height={32}
                  className={hasSubmitted ? 'opacity-100' : 'opacity-60'}
                  crossOrigin="anonymous"
                />
              </div>
              
              {/* Status indicator */}
              <motion.div
                initial={hasSubmitted ? { scale: 0 } : undefined}
                animate={hasSubmitted ? { scale: 1 } : undefined}
                className={`
                  absolute -bottom-1 -right-1 w-5 h-5 rounded-full
                  flex items-center justify-center
                  ${hasSubmitted 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-surface-3 text-muted-foreground'
                  }
                `}
              >
                {hasSubmitted ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
