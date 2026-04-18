'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSocket } from '@/lib/socket-context';
import { RoomCodeDisplay } from '@/components/game/room-code-display';
import { AnimalGrid } from '@/components/game/animal-grid';
import { QuestionCard } from '@/components/game/question-card';
import { Timer } from '@/components/game/timer';
import { PlayerStatusList } from '@/components/game/player-status-list';
import { GameCard } from '@/components/game/game-card';
import { Button } from '@/components/ui/button';
import { AVAILABLE_GAMES, getGameById } from '@/lib/questions';
import { Play, Users, Loader2, ArrowLeft } from 'lucide-react';

type HostPhase = 'select-game' | 'lobby' | 'playing';

export default function HostPage() {
  const router = useRouter();
  const {
    isConnected,
    roomCode,
    gameState,
    currentQuestion,
    players,
    submittedPlayers,
    createRoom,
    startGame,
    forceNextQuestion,
    error,
  } = useSocket();

  const [hostPhase, setHostPhase] = useState<HostPhase>('select-game');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [timerKey, setTimerKey] = useState(0);

  const selectedGame = selectedGameId ? getGameById(selectedGameId) : null;
  const questionDuration = selectedGame?.timePerQuestion ?? 45;

  // Handle game selection
  const handleSelectGame = useCallback((gameId: string) => {
    setSelectedGameId(gameId);
    setHostPhase('lobby');
  }, []);

  // Create room when entering lobby phase
  useEffect(() => {
    if (isConnected && hostPhase === 'lobby' && !roomCode) {
      createRoom();
    }
  }, [isConnected, hostPhase, roomCode, createRoom]);

  // Sync hostPhase with gameState
  useEffect(() => {
    if (gameState === 'playing') {
      setHostPhase('playing');
    }
  }, [gameState]);

  // Reset timer when question changes
  useEffect(() => {
    setTimerKey(prev => prev + 1);
  }, [currentQuestion]);

  // Navigate to results when game completes
  useEffect(() => {
    if (gameState === 'results') {
      router.push('/host/results');
    }
  }, [gameState, router]);

  const handleTimerComplete = useCallback(() => {
    forceNextQuestion();
  }, [forceNextQuestion]);

  if (!isConnected && hostPhase !== 'select-game') {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Connecting...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  // GAME SELECTION VIEW
  if (hostPhase === 'select-game') {
    return (
      <main className="min-h-screen flex flex-col p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col max-w-2xl mx-auto w-full"
        >
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-funnel text-4xl sm:text-5xl text-foreground mb-2">
              Select a Game
            </h1>
            <p className="text-muted-foreground text-sm">
              Choose a quiz to host
            </p>
          </div>

          {/* Game Cards */}
          <div className="flex flex-col gap-4">
            {AVAILABLE_GAMES.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onSelect={handleSelectGame}
              />
            ))}
          </div>
        </motion.div>
      </main>
    );
  }

  // LOBBY VIEW
  if (hostPhase === 'lobby' && roomCode) {
    return (
      <main className="min-h-screen flex flex-col p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-funnel text-4xl sm:text-5xl text-primary mb-2">
              {selectedGame?.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {selectedGame?.description}
            </p>
          </div>

          {/* Room Code */}
          <div className="flex justify-center mb-10">
            <RoomCodeDisplay code={roomCode} size="lg" />
          </div>

          {/* Player Count */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-lg font-funnel">
              {players.length} player{players.length !== 1 ? 's' : ''} joined
            </span>
          </div>

          {/* Animal Grid */}
          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="max-w-3xl w-full">
              <AnimalGrid
                takenAnimals={players}
                compact={true}
              />
            </div>
          </div>

          {/* Start Button */}
          <div className="flex justify-center relative">
            <Button
              size="lg"
              onClick={startGame}
              disabled={players.length === 0}
              className="h-14 px-10 text-lg font-funnel gap-2"
            >
              <Play className="w-5 h-5" />
              Start Game
            </Button>
            {players.length === 0 && (
              <p className="absolute mt-16 text-sm text-muted-foreground">
                Waiting for players to join...
              </p>
            )}
          </div>
        </motion.div>
      </main>
    );
  }

  // PLAYING VIEW
  if (hostPhase === 'playing') {
    return (
      <main className="min-h-screen flex flex-col p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 flex flex-col"
          >
            {/* Timer */}
            <div className="flex justify-center mb-8">
              <Timer
                duration={questionDuration}
                onComplete={handleTimerComplete}
                isRunning={true}
                resetKey={timerKey}
              />
            </div>

            {/* Question */}
            <div className="flex-1 flex items-center justify-center mb-8">
              <QuestionCard questionIndex={currentQuestion} />
            </div>

            {/* Player Status */}
            <div className="max-w-2xl mx-auto w-full">
              <PlayerStatusList
                players={players}
                submittedPlayers={submittedPlayers}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    );
  }

  // Fallback / Loading
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="flex items-center gap-3 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading...</span>
      </div>
    </main>
  );
}
