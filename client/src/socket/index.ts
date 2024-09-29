import { io } from 'socket.io-client';

export const socket = io(`http://${process.env.NEXT_PUBLIC_HOST}:3001`, {
  autoConnect: false,
});
