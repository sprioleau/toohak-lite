'use client';

import { motion } from 'framer-motion';
import { ANIMALS, type Animal } from '@/lib/animals';
import { AnimalAvatar } from './animal-avatar';

interface AnimalGridProps {
  selectedAnimal?: string;
  takenAnimals: string[];
  submittedAnimals?: string[];
  onSelect?: (animal: Animal) => void;
  compact?: boolean;
}

export function AnimalGrid({
  selectedAnimal,
  takenAnimals,
  submittedAnimals = [],
  onSelect,
  compact = false,
}: AnimalGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`
        grid gap-3
        ${compact 
          ? 'grid-cols-5 sm:grid-cols-10' 
          : 'grid-cols-4 sm:grid-cols-5'
        }
      `}
    >
      {ANIMALS.map((animal, index) => (
        <motion.div
          key={animal.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.02 }}
        >
          <AnimalAvatar
            animal={animal}
            selected={selectedAnimal === animal.id}
            disabled={takenAnimals.includes(animal.id) && selectedAnimal !== animal.id}
            submitted={submittedAnimals.includes(animal.id)}
            onClick={onSelect ? () => onSelect(animal) : undefined}
            size={compact ? 'sm' : 'md'}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
