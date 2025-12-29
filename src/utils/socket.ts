import { Server } from 'socket.io';

let io: Server | undefined;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', socket => {
    const userId = socket.handshake.auth.userId;
    if (userId) {
      socket.join(userId); // 🔑 user-specific room
    }
  });
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initSocket() first.');
  }
  return io;
};
