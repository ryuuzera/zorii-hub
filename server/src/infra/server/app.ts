import cors from 'cors';
import express from 'express';
import http from 'http';
// import iconv from 'iconv';
import ffi from 'ffi-napi';
import path from 'path';
import { Server } from 'socket.io';
import { getCompleteHardwareInfo } from '../../application/services/openhardwaremonitor.service';
import { runSteamGame } from '../../application/services/steam.services';
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

const user32 = new ffi.Library('user32', {
  MessageBoxW: ['int32', ['int32', 'string', 'string', 'uint32']],
});

const MB_YESNO = 0x00000004;
const MB_ICONQUESTION = 0x00000020;
const IDYES = 6;
const IDNO = 7;

io.on('connection', (socket) => {
  console.log(`user conected on id ${socket.id}`);

  socket.on('rungame', (data) => {
    runSteamGame(data).then((res) => socket.emit('recentupdate', res));
  });

  socket.on('shutdown', () => {
    const message = 'Are you sure you want to shutdown the system?';
    const title = 'Confirm Shutdown';

    const messageBuffer = Buffer.from(message, 'utf16le');
    const titleBuffer = Buffer.from(title, 'utf16le');

    const response = user32.MessageBoxW(0, messageBuffer, titleBuffer, MB_YESNO | MB_ICONQUESTION);
    if (response === IDYES) {
      // runShutdown();
      console.log('desligou');
    } else {
      console.log('canceled.');
    }
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
