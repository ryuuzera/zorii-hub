import express from 'express';
import { SteamController } from '../controllers/steam.controller';

const steamRoutes = express.Router();
const steamController = new SteamController();

steamRoutes.get('/', steamController.listGames);
steamRoutes.get('/image', steamController.getImage);
steamRoutes.get('/recent', steamController.listRecent);
steamRoutes.get('/gameinfo', steamController.getGameInfo);

export default steamRoutes;
