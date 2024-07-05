import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import routes from '../../config/routes';
import { getCompleteHardwareInfo } from '../services/openhardwaremonitor.service';
import { runShutdown } from '../services/win.services';

require('dotenv').config();
const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.static('public'));

const steamPath = path.join(process.env['ProgramFiles(x86)'] as string, 'Steam');
const imagesFolder = path.join(steamPath, 'appcache', 'librarycache');

app.use('/images', express.static(imagesFolder));

app.use('/api/', routes);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`user conected on id ${socket.id}`);

  socket.on('rungame', (data) => {
    // runSteamGame(data.appid);
  });

  socket.on('shutdown', () => {
    // runShutdown();
    console.log('shutdown')
  });

  setInterval(async () => {
    getCompleteHardwareInfo().then((hardwareInfo) => socket.emit('hardware-info', hardwareInfo));
  }, 500);

  socket.on('disconnect', () => {
    console.log(`User disconnected with id ${socket.id}`);
  });
});

io.on('disconnect', (socket) => {
  console.log(`user ${socket.id} disconnected`);
});

function sendMessage(event, value) {
  io.emit(event, value);
}
export { app, httpServer, sendMessage };
