import cors from 'cors';
import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { getSteamPath } from '../../application/services/steam.services';
import routes from '../../config/routes';
import { setupSocket } from '../../infra/config/socket';

require('dotenv').config();
const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.static('public'));

const steamPath = getSteamPath();
const imagesFolder = path.join(steamPath, 'appcache', 'librarycache');

app.use('/images', express.static(imagesFolder));

app.use('/api/', routes);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

setupSocket(io);

export { app, httpServer };
