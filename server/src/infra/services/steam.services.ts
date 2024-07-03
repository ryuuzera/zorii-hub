const { exec } = require('child_process');
import { error } from 'console';
import fs from 'fs';
import path from 'path';
import vdf from 'vdf';

function getSteamLibraryFolders() {
  const steamPath = path.join(process.env['ProgramFiles(x86)'] as string, 'Steam');
  const libraryFoldersPath = path.join(steamPath, 'steamapps', 'libraryfolders.vdf');

  let libraryFoldersContent;
  try {
    libraryFoldersContent = fs.readFileSync(libraryFoldersPath, 'utf-8');
  } catch (err) {
    console.error('Failed to read libraryfolders.vdf:', err);
    return [];
  }

  const libraries = vdf.parse(libraryFoldersContent);

  const libraryPaths = [] as any;

  for (const key in Object.keys(libraries.libraryfolders)) {
    const libraryPath = libraries.libraryfolders[key];
    libraryPaths.push(libraryPath['path']);
  }
  return libraryPaths;
}

function getInstalledGames(libraryPaths) {
  const installedGames: any = [];

  libraryPaths.forEach((libraryPath) => {
    const appsPath = path.join(libraryPath, 'steamapps');
    if (!fs.existsSync(appsPath)) return;

    const files = fs.readdirSync(appsPath);
    files.forEach((file) => {
      if (file.endsWith('.acf')) {
        const appManifestPath = path.join(appsPath, file);
        let appManifestContent;

        try {
          appManifestContent = fs.readFileSync(appManifestPath, 'utf-8');
        } catch (err) {
          console.error(`Failed to read ${appManifestPath}:`, err);
          return;
        }

        const gameData = vdf.parse(appManifestContent);

        const appId = gameData.AppState.appid;
        const gameName = gameData.AppState.name;
        const gameInstallDir = path.join(libraryPath, 'steamapps', 'common', gameData.AppState.installdir);
        let executablePath = null;

        const findExecutable = (dir) => {
          try {
            const items = fs.readdirSync(dir);
            for (const item of items) {
              const fullPath = path.join(dir, item);
              if (fs.lstatSync(fullPath).isDirectory()) {
                const result = findExecutable(fullPath);
                if (result) return result;
              } else if (item.endsWith('.exe')) {
                return fullPath;
              }
            }
          } catch (err) {}
        };

        executablePath = findExecutable(gameInstallDir);

        installedGames.push({
          appid: appId,
          name: gameName,
          install_dir: gameInstallDir,
          executable: executablePath,
          images: {
            library: `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/header.jpg`,
            libraryHero: `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_hero.jpg`,
            logo: `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/logo.png`,
            portrait: `https://steamcdn-a.akamaihd.net/steam/apps/${appId}/library_600x900.jpg`,
          },
        });
      }
    });
  });

  return installedGames;
}

export function listInstalledGames() {
  const libraryPaths = getSteamLibraryFolders();
  if (libraryPaths.length === 0) {
    throw error('No Steam library paths found.');
  }

  const installedGames = getInstalledGames(libraryPaths);
  if (installedGames.length === 0) {
    throw error('No installed games found.');
  }

  return installedGames;
}

export function runSteamGame(appid) {
  const command = `start steam://run/${appid}`;
  console.log(command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
  });
}
