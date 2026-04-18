import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import type { 
  Room, 
  Player, 
  ClientToServerEvents, 
  ServerToClientEvents 
} from './lib/types';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// In-memory room storage (volatile - clears on restart)
const rooms = new Map<string, Room>();
const socketToRoom = new Map<string, { roomCode: string; isHost: boolean; animalId?: string }>();

// Generate a random 4-character room code
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing characters
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Ensure unique code
  return rooms.has(code) ? generateRoomCode() : code;
}

// Get taken animal IDs in a room
function getTakenAnimals(room: Room): string[] {
  return Array.from(room.players.values()).map(p => p.animalId);
}

// Check if all players have submitted for current question
function checkAllSubmitted(room: Room): boolean {
  return room.submittedThisRound.size === room.players.size;
}

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Host creates a new room
    socket.on('room:create', () => {
      const roomCode = generateRoomCode();
      const room: Room = {
        code: roomCode,
        hostSocketId: socket.id,
        players: new Map(),
        gameState: 'lobby',
        currentQuestion: 0,
        submittedThisRound: new Set(),
      };
      
      rooms.set(roomCode, room);
      socketToRoom.set(socket.id, { roomCode, isHost: true });
      socket.join(roomCode);
      
      socket.emit('room:created', { roomCode });
      console.log(`[Room] Created: ${roomCode} by ${socket.id}`);
    });

    // Player joins a room
    socket.on('room:join', ({ roomCode, animalId }) => {
      const room = rooms.get(roomCode.toUpperCase());
      
      if (!room) {
        socket.emit('error', { message: 'Room not found. Check the code and try again.' });
        return;
      }
      
      if (room.gameState !== 'lobby') {
        socket.emit('error', { message: 'Game has already started.' });
        return;
      }
      
      // Check if animal is already taken
      const takenAnimals = getTakenAnimals(room);
      if (takenAnimals.includes(animalId)) {
        socket.emit('error', { message: 'This animal is already taken. Choose another.' });
        socket.emit('room:animals-taken', { takenAnimals });
        return;
      }
      
      // Add player to room
      const player: Player = {
        animalId,
        socketId: socket.id,
        scores: [null, null, null, null, null],
      };
      
      room.players.set(animalId, player);
      socketToRoom.set(socket.id, { roomCode: room.code, isHost: false, animalId });
      socket.join(room.code);
      
      // Notify the joining player
      socket.emit('room:joined', { roomCode: room.code, animalId });
      
      // Broadcast to everyone in room (including host)
      io.to(room.code).emit('room:player-joined', { 
        animalId, 
        playerCount: room.players.size 
      });
      
      // Send updated taken animals list to all
      io.to(room.code).emit('room:animals-taken', { 
        takenAnimals: getTakenAnimals(room) 
      });
      
      console.log(`[Room ${room.code}] Player joined: ${animalId} (${room.players.size} players)`);
    });

    // Host starts the game
    socket.on('game:start', (roomCode) => {
      const room = rooms.get(roomCode);
      
      if (!room) {
        socket.emit('error', { message: 'Room not found.' });
        return;
      }
      
      if (room.hostSocketId !== socket.id) {
        socket.emit('error', { message: 'Only the host can start the game.' });
        return;
      }
      
      if (room.players.size === 0) {
        socket.emit('error', { message: 'Need at least one player to start.' });
        return;
      }
      
      room.gameState = 'playing';
      room.currentQuestion = 0;
      room.submittedThisRound = new Set();
      
      io.to(roomCode).emit('game:started', { questionIndex: 0 });
      console.log(`[Room ${roomCode}] Game started!`);
    });

    // Host forces next question (when timer expires)
    socket.on('game:force-next', (roomCode) => {
      const room = rooms.get(roomCode);
      
      if (!room || room.hostSocketId !== socket.id) return;
      
      advanceQuestion(room, io);
    });

    // Player submits their rating
    socket.on('eval:submit', ({ roomCode, questionIndex, value }) => {
      const room = rooms.get(roomCode);
      const socketInfo = socketToRoom.get(socket.id);
      
      if (!room || !socketInfo || socketInfo.isHost || !socketInfo.animalId) {
        socket.emit('error', { message: 'Invalid submission.' });
        return;
      }
      
      const player = room.players.get(socketInfo.animalId);
      if (!player) return;
      
      // Validate submission
      if (questionIndex !== room.currentQuestion) {
        socket.emit('error', { message: 'Question mismatch. Please refresh.' });
        return;
      }
      
      if (room.submittedThisRound.has(socketInfo.animalId)) {
        socket.emit('error', { message: 'Already submitted for this question.' });
        return;
      }
      
      // Record the score
      player.scores[questionIndex] = value;
      room.submittedThisRound.add(socketInfo.animalId);
      
      // Broadcast submission status
      io.to(roomCode).emit('eval:player-submitted', {
        animalId: socketInfo.animalId,
        submittedCount: room.submittedThisRound.size,
        totalPlayers: room.players.size,
      });
      
      console.log(`[Room ${roomCode}] ${socketInfo.animalId} submitted ${value} for Q${questionIndex}`);
      
      // Check if all players have submitted
      if (checkAllSubmitted(room)) {
        // Small delay then advance
        setTimeout(() => advanceQuestion(room, io), 500);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const socketInfo = socketToRoom.get(socket.id);
      
      if (socketInfo) {
        const room = rooms.get(socketInfo.roomCode);
        
        if (room) {
          if (socketInfo.isHost) {
            // Host disconnected - end the room
            io.to(room.code).emit('error', { message: 'Host disconnected. Room closed.' });
            rooms.delete(room.code);
            console.log(`[Room ${room.code}] Closed (host disconnected)`);
          } else if (socketInfo.animalId) {
            // Player disconnected
            room.players.delete(socketInfo.animalId);
            room.submittedThisRound.delete(socketInfo.animalId);
            
            io.to(room.code).emit('room:player-left', {
              animalId: socketInfo.animalId,
              playerCount: room.players.size,
            });
            
            io.to(room.code).emit('room:animals-taken', {
              takenAnimals: getTakenAnimals(room),
            });
            
            console.log(`[Room ${room.code}] Player left: ${socketInfo.animalId}`);
            
            // If playing and all remaining have submitted, advance
            if (room.gameState === 'playing' && checkAllSubmitted(room)) {
              setTimeout(() => advanceQuestion(room, io), 500);
            }
          }
        }
        
        socketToRoom.delete(socket.id);
      }
      
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  // Helper function to advance to next question or end game
  function advanceQuestion(
    room: Room, 
    io: SocketIOServer<ClientToServerEvents, ServerToClientEvents>
  ) {
    if (room.currentQuestion >= 4) {
      // Game complete
      room.gameState = 'results';
      
      const results: Record<string, (number | null)[]> = {};
      room.players.forEach((player, animalId) => {
        results[animalId] = player.scores;
      });
      
      io.to(room.code).emit('game:complete', { results });
      console.log(`[Room ${room.code}] Game complete!`);
    } else {
      // Next question
      room.currentQuestion++;
      room.submittedThisRound = new Set();
      
      io.to(room.code).emit('game:next-question', { 
        questionIndex: room.currentQuestion 
      });
      console.log(`[Room ${room.code}] Moving to question ${room.currentQuestion}`);
    }
  }

  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Socket.IO server attached`);
  });
});
