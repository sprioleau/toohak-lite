// Shared types for Stewardship5

export type GameState = 'lobby' | 'playing' | 'results';

export interface Player {
  animalId: string;
  socketId: string;
  scores: (number | null)[]; // 5 scores, one per T (null if not yet submitted)
}

export interface Room {
  code: string;
  hostSocketId: string;
  players: Map<string, Player>;
  gameState: GameState;
  currentQuestion: number; // 0-4 for the 5 T's
  submittedThisRound: Set<string>; // animalIds that have submitted current question
}

// Socket event payloads
export interface RoomCreatedPayload {
  roomCode: string;
}

export interface RoomJoinPayload {
  roomCode: string;
  animalId: string;
}

export interface PlayerJoinedPayload {
  animalId: string;
  playerCount: number;
}

export interface PlayerLeftPayload {
  animalId: string;
  playerCount: number;
}

export interface AnimalsTakenPayload {
  takenAnimals: string[];
}

export interface GameStartedPayload {
  questionIndex: number;
}

export interface NextQuestionPayload {
  questionIndex: number;
}

export interface EvalSubmitPayload {
  roomCode: string;
  questionIndex: number;
  value: number;
}

export interface PlayerSubmittedPayload {
  animalId: string;
  submittedCount: number;
  totalPlayers: number;
}

export interface GameCompletePayload {
  results: Record<string, (number | null)[]>; // animalId -> scores array
}

export interface ErrorPayload {
  message: string;
}

// Client-side socket events
export type ClientToServerEvents = {
  'room:create': () => void;
  'room:join': (payload: RoomJoinPayload) => void;
  'room:leave': () => void;
  'game:start': (roomCode: string) => void;
  'game:force-next': (roomCode: string) => void;
  'eval:submit': (payload: EvalSubmitPayload) => void;
};

export type ServerToClientEvents = {
  'room:created': (payload: RoomCreatedPayload) => void;
  'room:joined': (payload: { roomCode: string; animalId: string }) => void;
  'room:player-joined': (payload: PlayerJoinedPayload) => void;
  'room:player-left': (payload: PlayerLeftPayload) => void;
  'room:animals-taken': (payload: AnimalsTakenPayload) => void;
  'game:started': (payload: GameStartedPayload) => void;
  'game:next-question': (payload: NextQuestionPayload) => void;
  'eval:player-submitted': (payload: PlayerSubmittedPayload) => void;
  'game:complete': (payload: GameCompletePayload) => void;
  'error': (payload: ErrorPayload) => void;
};
