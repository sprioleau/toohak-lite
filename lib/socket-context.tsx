'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { connectSocket, disconnectSocket, getSocket, type TypedSocket } from './socket';
import type { GameCompletePayload } from './types';

interface SocketState {
  isConnected: boolean;
  roomCode: string | null;
  isHost: boolean;
  animalId: string | null;
  gameState: 'idle' | 'lobby' | 'playing' | 'results';
  currentQuestion: number;
  players: string[]; // animalIds
  submittedPlayers: string[]; // animalIds that submitted current question
  results: Record<string, (number | null)[]> | null;
  error: string | null;
}

interface SocketContextValue extends SocketState {
  socket: TypedSocket | null;
  createRoom: () => void;
  joinRoom: (roomCode: string, animalId: string) => void;
  startGame: () => void;
  submitRating: (value: number) => void;
  forceNextQuestion: () => void;
  clearError: () => void;
}

const initialState: SocketState = {
  isConnected: false,
  roomCode: null,
  isHost: false,
  animalId: null,
  gameState: 'idle',
  currentQuestion: 0,
  players: [],
  submittedPlayers: [],
  results: null,
  error: null,
};

const SocketContext = createContext<SocketContextValue | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SocketState>(initialState);
  const socketRef = useRef<TypedSocket | null>(null);

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    socket.on('connect', () => {
      setState(prev => ({ ...prev, isConnected: true }));
    });

    socket.on('disconnect', () => {
      setState(prev => ({ ...prev, isConnected: false }));
    });

    socket.on('room:created', ({ roomCode }) => {
      setState(prev => ({
        ...prev,
        roomCode,
        isHost: true,
        gameState: 'lobby',
        players: [],
      }));
    });

    socket.on('room:joined', ({ roomCode, animalId }) => {
      setState(prev => ({
        ...prev,
        roomCode,
        animalId,
        isHost: false,
        gameState: 'lobby',
      }));
    });

    socket.on('room:player-joined', ({ animalId }) => {
      setState(prev => ({
        ...prev,
        players: prev.players.includes(animalId) 
          ? prev.players 
          : [...prev.players, animalId],
      }));
    });

    socket.on('room:player-left', ({ animalId }) => {
      setState(prev => ({
        ...prev,
        players: prev.players.filter(id => id !== animalId),
        submittedPlayers: prev.submittedPlayers.filter(id => id !== animalId),
      }));
    });

    socket.on('room:animals-taken', ({ takenAnimals }) => {
      setState(prev => ({
        ...prev,
        players: takenAnimals,
      }));
    });

    socket.on('game:started', ({ questionIndex }) => {
      setState(prev => ({
        ...prev,
        gameState: 'playing',
        currentQuestion: questionIndex,
        submittedPlayers: [],
      }));
    });

    socket.on('game:next-question', ({ questionIndex }) => {
      setState(prev => ({
        ...prev,
        currentQuestion: questionIndex,
        submittedPlayers: [],
      }));
    });

    socket.on('eval:player-submitted', ({ animalId }) => {
      setState(prev => ({
        ...prev,
        submittedPlayers: prev.submittedPlayers.includes(animalId)
          ? prev.submittedPlayers
          : [...prev.submittedPlayers, animalId],
      }));
    });

    socket.on('game:complete', ({ results }: GameCompletePayload) => {
      setState(prev => ({
        ...prev,
        gameState: 'results',
        results,
      }));
    });

    socket.on('error', ({ message }) => {
      setState(prev => ({ ...prev, error: message }));
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const createRoom = useCallback(() => {
    socketRef.current?.emit('room:create');
  }, []);

  const joinRoom = useCallback((roomCode: string, animalId: string) => {
    socketRef.current?.emit('room:join', { roomCode, animalId });
  }, []);

  const startGame = useCallback(() => {
    if (state.roomCode) {
      socketRef.current?.emit('game:start', state.roomCode);
    }
  }, [state.roomCode]);

  const submitRating = useCallback((value: number) => {
    if (state.roomCode) {
      socketRef.current?.emit('eval:submit', {
        roomCode: state.roomCode,
        questionIndex: state.currentQuestion,
        value,
      });
    }
  }, [state.roomCode, state.currentQuestion]);

  const forceNextQuestion = useCallback(() => {
    if (state.roomCode) {
      socketRef.current?.emit('game:force-next', state.roomCode);
    }
  }, [state.roomCode]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const value: SocketContextValue = {
    ...state,
    socket: socketRef.current,
    createRoom,
    joinRoom,
    startGame,
    submitRating,
    forceNextQuestion,
    clearError,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
