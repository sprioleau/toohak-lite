'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSocket } from '@/lib/socket-context';
import { AnimalGrid } from '@/components/game/animal-grid';
import { RoomCodeDisplay } from '@/components/game/room-code-display';
import { Button } from '@/components/ui/button';
import { ANIMALS, getRandomAvailableAnimal } from '@/lib/animals';
import { Shuffle, Check, Loader2 } from 'lucide-react';

function PlayLobbyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');

  const {
    isConnected,
    gameState,
    animalId: joinedAnimalId,
    players,
    joinRoom,
    error,
    clearError,
  } = useSocket();

  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  // Redirect if no code
  useEffect(() => {
    if (!code) {
      router.push('/play');
    }
  }, [code, router]);

  // Navigate to game when it starts
  useEffect(() => {
    if (gameState === 'playing') {
      router.push('/play/game');
    }
  }, [gameState, router]);

  // Handle successful join
  useEffect(() => {
    if (joinedAnimalId) {
      setSelectedAnimal(joinedAnimalId);
      setIsJoining(false);
    }
  }, [joinedAnimalId]);

  // Clear error on animal selection change
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [selectedAnimal]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnimalSelect = (animal: typeof ANIMALS[0]) => {
    if (joinedAnimalId) return; // Already joined
    setSelectedAnimal(animal.id);
  };

  const handleRandomSelect = () => {
    if (joinedAnimalId) return;
    const available = getRandomAvailableAnimal(players);
    if (available) {
      setSelectedAnimal(available.id);
    }
  };

  const handleJoin = () => {
    if (!code || !selectedAnimal || joinedAnimalId) return;
    setIsJoining(true);
    joinRoom(code, selectedAnimal);
  };

  if (!isConnected) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Connecting...</span>
        </div>
      </main>
    );
  }

  // WAITING STATE (after joining)
  if (joinedAnimalId) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
            <Check className="w-12 h-12 text-primary" />
          </div>
          <h2 className="font-funnel text-2xl text-foreground mb-2">
            You&apos;re In!
          </h2>
          <p className="text-muted-foreground mb-6">
            Waiting for the host to start...
          </p>
          <RoomCodeDisplay code={code || ''} size="sm" />
          
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-8 text-sm text-muted-foreground"
          >
            <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
            {players.length} player{players.length !== 1 ? 's' : ''} in lobby
          </motion.div>
        </motion.div>
      </main>
    );
  }

  // ANIMAL SELECTION STATE
  return (
    <main className="min-h-screen flex flex-col p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <RoomCodeDisplay code={code || ''} size="sm" />
          <p className="text-muted-foreground text-sm mt-4">
            Choose your avatar
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4 text-center"
          >
            <p className="text-destructive text-sm">{error}</p>
          </motion.div>
        )}

        {/* Animal Grid */}
        <div className="flex-1 flex items-center justify-center mb-6">
          <div className="w-full max-w-md">
            <AnimalGrid
              selectedAnimal={selectedAnimal || undefined}
              takenAnimals={players}
              onSelect={handleAnimalSelect}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
          <Button
            variant="outline"
            onClick={handleRandomSelect}
            disabled={isJoining}
            className="h-12"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Choose for me
          </Button>

          <Button
            onClick={handleJoin}
            disabled={!selectedAnimal || isJoining}
            className="h-14 font-funnel text-lg"
          >
            {isJoining ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              'Join Game'
            )}
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

export default function PlayLobbyPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </main>
    }>
      <PlayLobbyContent />
    </Suspense>
  );
}
