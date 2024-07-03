import express from 'express';
import { SteamController } from '../controllers/steam.controller';

const steamRoutes = express.Router();
const steamController = new SteamController();

steamRoutes.get('/', steamController.listGames);
steamRoutes.get('/image', steamController.getImage)

export default steamRoutes;
