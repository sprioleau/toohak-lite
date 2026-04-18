'use client';

import { motion } from 'framer-motion';
import { THE_FIVE_TS, type Question } from '@/lib/questions';

interface QuestionCardProps {
  questionIndex: number;
  showProgress?: boolean;
}

export function QuestionCard({ questionIndex, showProgress = true }: QuestionCardProps) {
  const question: Question = THE_FIVE_TS[questionIndex];
  
  if (!question) return null;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center max-w-2xl mx-auto"
    >
      {showProgress && (
        <div className="flex items-center gap-2 mb-6">
          {THE_FIVE_TS.map((_, idx) => (
            <div
              key={idx}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${idx === questionIndex 
                  ? 'bg-primary scale-125' 
                  : idx < questionIndex 
                    ? 'bg-primary/50' 
                    : 'bg-surface-3'
                }
              `}
            />
          ))}
        </div>
      )}

      <motion.h1
        className="font-dancing text-5xl sm:text-7xl text-primary mb-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
      >
        {question.title}
      </motion.h1>

      <motion.p
        className="text-muted-foreground text-sm sm:text-base mb-6 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {'"'}{question.verse}{'"'}
        <span className="block mt-1 text-xs font-medium text-primary/70">
          — {question.verseRef}
        </span>
      </motion.p>

      <motion.p
        className="text-foreground/90 text-base sm:text-lg leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {question.description}
      </motion.p>
    </motion.div>
  );
}
