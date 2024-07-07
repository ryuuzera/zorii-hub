"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const steam_controller_1 = require("../controllers/steam.controller");
const steamRoutes = express_1.default.Router();
const steamController = new steam_controller_1.SteamController();
steamRoutes.get('/', steamController.listGames);
steamRoutes.get('/image', steamController.getImage);
steamRoutes.get('/recent', steamController.listRecent);
steamRoutes.get('/gameinfo', steamController.getGameInfo);
exports.default = steamRoutes;
