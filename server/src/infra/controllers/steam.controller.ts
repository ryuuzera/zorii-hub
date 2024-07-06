import { Request, Response } from 'express';
import path from 'path';
import { listInstalledGames } from '../../application/services/steam.services';
import RecentGameRepository from '../../domain/repository/recentgame.repository';

export class SteamController {
  async listGames(req, res: Response): Promise<Response> {
    const gamesList = listInstalledGames();

    return res.status(200).json(gamesList);
  }

  async getImage(req: Request, res: Response): Promise<Response> {
    const { appId } = req.query;

    if (!appId) return res.status(401).send();
    const steamPath = path.join(process.env['ProgramFiles(x86)'] as string, 'Steam');
    const imagesFolder = path.join(steamPath, 'appcache', 'librarycache');

    const imageName = `${appId}_library_600x900.jpg`;
    // const imagePath = path.join(imagesFolder, imageName);

    const imageUrl = `${req.protocol}://${req.get('host')}/images/${imageName}`;

    return res.send(imageUrl);
  }

  async listRecent(req, res: Response): Promise<Response> {
    try {
      const recentList = await new RecentGameRepository().list();
      return res.status(200).json(recentList);
    } catch (error: any) {
      return res.status(403).send(error.message);
    }
  }

  async getGameInfo(req: Request, res: Response): Promise<Response> {
    const { appId, language } = req.query;
    if (!appId || !language) return res.status(400).send();

    try {
      const gameInfoReq = await fetch(`http://store.steampowered.com/api/appdetails?appids=${appId}&l=${language}`);
      const resGameInfo = await gameInfoReq.json();
      if (gameInfoReq.ok) return res.status(200).json(resGameInfo);

      return res.status(400).send();
    } catch (error: any) {
      return res.status(403).send(error.message);
    }
  }
}
