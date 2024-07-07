"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SteamController = void 0;
const path_1 = __importDefault(require("path"));
const steam_services_1 = require("../../application/services/steam.services");
const recentgame_repository_1 = __importDefault(require("../../domain/repository/recentgame.repository"));
class SteamController {
    listGames(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const gamesList = (0, steam_services_1.listInstalledGames)();
            return res.status(200).json(gamesList);
        });
    }
    getImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { appId } = req.query;
            if (!appId)
                return res.status(401).send();
            const steamPath = path_1.default.join(process.env['ProgramFiles(x86)'], 'Steam');
            const imagesFolder = path_1.default.join(steamPath, 'appcache', 'librarycache');
            const imageName = `${appId}_library_600x900.jpg`;
            // const imagePath = path.join(imagesFolder, imageName);
            const imageUrl = `${req.protocol}://${req.get('host')}/images/${imageName}`;
            return res.send(imageUrl);
        });
    }
    listRecent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recentList = yield new recentgame_repository_1.default().list();
                return res.status(200).json(recentList);
            }
            catch (error) {
                return res.status(403).send(error.message);
            }
        });
    }
    getGameInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { appId, language } = req.query;
            if (!appId || !language)
                return res.status(400).send();
            try {
                const gameInfoReq = yield fetch(`http://store.steampowered.com/api/appdetails?appids=${appId}&l=${language}`);
                const resGameInfo = yield gameInfoReq.json();
                if (gameInfoReq.ok)
                    return res.status(200).json(resGameInfo);
                return res.status(400).send();
            }
            catch (error) {
                return res.status(403).send(error.message);
            }
        });
    }
}
exports.SteamController = SteamController;
