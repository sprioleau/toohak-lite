'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '@/lib/socket-context';
import { QuestionCard } from '@/components/game/question-card';
import { RatingCircles } from '@/components/game/rating-circles';
import { IndividualRadarChart } from '@/components/charts/individual-radar-chart';
import { Button } from '@/components/ui/button';
import { THE_FIVE_TS } from '@/lib/questions';
import { Check, Loader2 } from 'lucide-react';

export default function PlayGamePage() {
  const router = useRouter();
  const {
    gameState,
    currentQuestion,
    animalId,
    submittedPlayers,
    submitRating,
  } = useSocket();

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [scores, setScores] = useState<(number | null)[]>([null, null, null, null, null]);

  // Check if we've already submitted for this question
  useEffect(() => {
    if (animalId && submittedPlayers.includes(animalId)) {
      setHasSubmitted(true);
    } else {
      setHasSubmitted(false);
      setSelectedRating(null);
    }
  }, [currentQuestion, animalId, submittedPlayers]);

  // Navigate to results when game completes
  useEffect(() => {
    if (gameState === 'results') {
      router.push('/play/results');
    }
  }, [gameState, router]);

  // Redirect if not in game
  useEffect(() => {
    if (gameState === 'lobby' || gameState === 'idle') {
      router.push('/play');
    }
  }, [gameState, router]);

  const handleSubmit = useCallback(() => {
    if (selectedRating === null || hasSubmitted) return;
    
    submitRating(selectedRating);
    setHasSubmitted(true);
    
    // Update local scores for chart
    setScores(prev => {
      const newScores = [...prev];
      newScores[currentQuestion] = selectedRating;
      return newScores;
    });
  }, [selectedRating, hasSubmitted, submitRating, currentQuestion]);

  const currentT = THE_FIVE_TS[currentQuestion];

  if (!currentT) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col p-6">
      <AnimatePresence mode="wait">
        {/* SUBMITTED STATE - Show individual chart */}
        {hasSubmitted ? (
          <motion.div
            key={`submitted-${currentQuestion}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            {/* Success message */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4"
            >
              <Check className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            
            <h2 className="font-funnel text-xl text-foreground mb-1">
              {currentT.title} Submitted
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              {currentQuestion < 4 ? 'Waiting for next question...' : 'Calculating results...'}
            </p>

            {/* Individual Chart */}
            <div className="w-full max-w-md">
              <IndividualRadarChart scores={scores} />
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mt-4">
              {THE_FIVE_TS.map((_, idx) => (
                <div
                  key={idx}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${idx <= currentQuestion ? 'bg-primary' : 'bg-surface-3'}
                  `}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          /* RATING STATE - Show question and rating circles */
          <motion.div
            key={`rating-${currentQuestion}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col"
          >
            {/* Question Card */}
            <div className="flex-1 flex items-center justify-center mb-8">
              <QuestionCard questionIndex={currentQuestion} />
            </div>

            {/* Rating Section */}
            <div className="flex flex-col items-center gap-6">
              <p className="text-sm text-muted-foreground text-center">
                Rate your stewardship (1 = Poor, 5 = Excellent)
              </p>

              <RatingCircles
                value={selectedRating}
                onChange={setSelectedRating}
                disabled={hasSubmitted}
              />

              <Button
                onClick={handleSubmit}
                disabled={selectedRating === null || hasSubmitted}
                size="lg"
                className="w-full max-w-xs h-14 font-funnel text-lg"
              >
                Submit
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
