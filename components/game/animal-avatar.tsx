'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { getTwemojiUrl, type Animal } from '@/lib/animals';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface AnimalAvatarProps {
  animal: Animal;
  selected?: boolean;
  disabled?: boolean;
  submitted?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AnimalAvatar({
  animal,
  selected = false,
  disabled = false,
  submitted = false,
  onClick,
  size = 'md',
}: AnimalAvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
  };

  const imageSizes = {
    sm: 32,
    md: 48,
    lg: 72,
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || !onClick}
      whileHover={!disabled && onClick ? { scale: 1.1 } : undefined}
      whileTap={!disabled && onClick ? { scale: 0.95 } : undefined}
      className={cn(
        'relative flex items-center justify-center rounded-xl transition-all duration-200',
        sizeClasses[size],
        selected && 'glow-purple ring-2 ring-primary bg-primary/20',
        disabled && !selected && 'opacity-40 cursor-not-allowed',
        !disabled && onClick && 'cursor-pointer hover:bg-surface-2',
        !selected && !disabled && 'bg-surface-1 border border-border'
      )}
      aria-label={`${animal.name}${selected ? ' (selected)' : ''}${disabled ? ' (taken)' : ''}`}
    >
      <Image
        src={getTwemojiUrl(animal.twemojiCode)}
        alt={animal.name}
        width={imageSizes[size]}
        height={imageSizes[size]}
        className="object-contain"
        crossOrigin="anonymous"
      />
      
      {/* Submitted checkmark overlay */}
      {submitted && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-primary/80 rounded-xl"
        >
          <Check className="w-6 h-6 text-primary-foreground" />
        </motion.div>
      )}
      
      {/* Disabled overlay */}
      {disabled && !selected && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 rounded-xl">
          <span className="text-xs text-muted-foreground">Taken</span>
        </div>
      )}
    </motion.button>
  );
}
