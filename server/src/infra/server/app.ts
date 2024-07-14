import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { getCompleteHardwareInfo } from '../../application/services/openhardwaremonitor.service';
import { runSteamGame } from '../../application/services/steam.services';
import { run, runShutdown } from '../../application/services/win.services';
import routes from '../../config/routes';

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
    runSteamGame(data).then((res) => socket.emit('recentupdate', res));
  });
  socket.on('shutdown', () => {
    runShutdown();
  });
  socket.on('explorer', () => {
    run('explorer');
  });
  socket.on('hd', () => {
    run('c:\\');
  });
  socket.on('discord', () => {
    run('C:\\Users\\Ryuu\\AppData\\Local\\Discord\\app-1.0.9153\\Discord.exe');
  });
  socket.on('terminal', () => {
    run('wt');
  });
  socket.on('vscode', () => {
    run('code');
  });
  socket.on('arc', () => {
    run('arc --maximized');
  });
  socket.on('calc', () => {
    run('calc');
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
