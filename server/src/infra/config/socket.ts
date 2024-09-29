import fs from 'fs';
import path from 'path';
import robot from 'robotjs';
import { Server } from 'socket.io';
import { getCompleteHardwareInfo } from '../../application/services/openhardwaremonitor.service';
import { runSteamGame } from '../../application/services/steam.services';
import { run, runShutdown, runSpawn, volumeUp } from '../../application/services/win.services';

export function setupSocket(io: Server) {
  let lastPosition = { x: 0, y: 0 };
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

    socket.on('mousepos', (data) => {
      const deltaX = data.x;
      const deltaY = data.y;

      const newX = lastPosition.x + deltaX;
      const newY = lastPosition.y + deltaY;

      robot.moveMouse(newX, newY);

      lastPosition = { x: newX, y: newY };
    });

    socket.on('mousestop', () => {
      lastPosition = robot.getMousePos();
      socket.emit('lastpos', lastPosition);
    });

    socket.on('mousestart', () => {
      socket.emit('startpos', robot.getMousePos());
    });
  });

  io.on('disconnect', (socket) => {
    console.log(`user ${socket.id} disconnected`);
  });
}
