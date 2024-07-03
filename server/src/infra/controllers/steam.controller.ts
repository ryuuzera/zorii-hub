import { Request, Response } from 'express';
import path from 'path';
import { listInstalledGames } from '../services/steam.services';

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
}
