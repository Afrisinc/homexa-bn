import { Server } from 'socket.io';

let io: Server | undefined;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', socket => {
    const userId = socket.handshake.auth.userId;

    if (userId) {
      // Join user-specific room for receiving notifications
      socket.join(userId);
      console.log(`User ${userId} connected to socket`);
    } else {
      console.warn('Socket connection without userId');
    }

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected from socket`);
    });
  });
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initSocket() first.');
  }
  return io;
};
