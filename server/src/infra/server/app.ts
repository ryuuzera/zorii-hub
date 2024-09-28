import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { getCompleteHardwareInfo } from '../../application/services/openhardwaremonitor.service';
import { runSteamGame } from '../../application/services/steam.services';
import { run, runShutdown, runSpawn, volumeUp } from '../../application/services/win.services';
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
    runSteamGame(data, socket).then((res) => socket.emit('recentupdate', res));
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
    const baseDir = path.join(process.env.LOCALAPPDATA!, 'Discord');
    const versions = fs.readdirSync(baseDir).filter((dir) => dir.startsWith('app-'));
    const latestVersion = versions.sort().reverse()[0];

    runSpawn(path.join(baseDir, latestVersion, 'Discord.exe'));
  });
  socket.on('terminal', () => {
    run('wt');
  });
  socket.on('vscode', () => {
    runSpawn('code');
  });
  socket.on('edge', () => {
    run('msedge');
  });
  socket.on('calc', () => {
    run('calc');
  });
  socket.on('notepad', () => {
    run('notepad');
  });
  socket.on('ytmusic', () => {
    const baseDir = path.join(process.env.LOCALAPPDATA!, 'youtube_music_desktop_app');

    runSpawn(path.join(baseDir, 'youtube-music-desktop-app.exe'));
  });

  setInterval(async () => {
    getCompleteHardwareInfo().then((hardwareInfo) => socket.emit('hardware-info', hardwareInfo));
  }, 500);

  socket.on('volumeUp', () => {
    console.log('volumeUp');
    volumeUp();
  });

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
