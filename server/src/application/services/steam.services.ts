import { exec } from 'child_process';
import { error } from 'console';
import fs from 'fs';
import path from 'path';
import vdf from 'vdf';
import RecentGameRepository from '../../domain/repository/recentgame.repository';
import { startPresentMon } from './presentmon.services';
import { Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

function getSteamLibraryFolders() {
  const steamPath = path.join(process.env['ProgramFiles(x86)'] as string, 'Steam');
  const libraryFoldersPath = path.join(steamPath, 'steamapps', 'libraryfolders.vdf');

  let libraryFoldersContent: string;
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

function getInstalledGames(libraryPaths: any[]) {
  const installedGames: any = [];

  libraryPaths.forEach((libraryPath: string) => {
    const appsPath = path.join(libraryPath, 'steamapps');
    if (!fs.existsSync(appsPath)) return;

    const files = fs.readdirSync(appsPath);
    files.forEach((file) => {
      if (file.endsWith('.acf')) {
        const appManifestPath = path.join(appsPath, file);
        let appManifestContent: string;

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

        const findExecutable = (dir: string) => {
          try {
            const items = fs.readdirSync(dir).sort((a, b) => +b.endsWith('.exe') - +a.endsWith('.exe'));

            for (const item of items) {
              const fullPath = path.join(dir, item);
              if (fullPath.endsWith('.exe') && fs.lstatSync(fullPath).isFile()) {
                return fullPath;
              }
            }

            for (const item of items) {
              const fullPath = path.join(dir, item);
              if (fs.lstatSync(fullPath).isDirectory()) {
                const result = findExecutable(fullPath);
                if (result) return result;
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

function isProcessRunning(processName: string) {
  return new Promise((resolve, reject) => {
    exec(`tasklist`, (err, stdout, stderr) => {
      if (err) {
        return reject(`Error executing tasklist: ${stderr}`);
      }

      resolve(stdout.toLowerCase().includes(processName.toLowerCase()));
    });
  });
}
function getRunningProcesses(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    exec('tasklist', (error, stdout) => {
      if (error) {
        return reject(error);
      }
      const processes = stdout
        .split('\n')
        .slice(3)
        .map((line) => {
          const name = line.substring(0, 25).split('.')[0].trim() + '.exe'; 
          const memoryUsage = line.substring(64).trim(); 

          const memoryInMB = parseInt(memoryUsage.replace(/[^\d]/g, ''), 10) / 1024 || 0;

          return {
            name,
            memoryUsage: memoryInMB,
          };
        })
        .filter((process) => process.name);

      resolve(processes);
    });
  });
}
let processInterval;
export async function runSteamGame(game: { appid: any; name: any }, socket: any) {
  clearInterval(processInterval);
  const recentGame = new RecentGameRepository();
  try {
    await recentGame.create({
      appId: game.appid,
      title: game.name,
    });

    const result = recentGame.list();
    const command = `start steam://run/${game.appid}`;

    const initialProcesses = await getRunningProcesses();

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
      }

      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
    });

    processInterval = setInterval(async () => {
      try {
        const currentProcesses = await getRunningProcesses();

        const initialProcessNames = new Set(initialProcesses.map((proc) => proc.name));

        const newProcesses = currentProcesses.filter((proc) => !initialProcessNames.has(proc.name));
        console.log('New processes detected:', newProcesses);

        const gameExe = newProcesses.reduce(
          (maxProc, proc) => (proc.memoryUsage > maxProc.memoryUsage ? proc : maxProc),
          { name: '', memoryUsage: 0 }
        );

        if (gameExe.name && gameExe.memoryUsage > 500) {
          clearInterval(processInterval);
          startPresentMon(gameExe.name, socket, game.name);
        } else {
          console.log('No new game process detected.');
        }
      } catch (err) {
        console.error('Error fetching current processes:', err);
      }
    }, 10000);

    return result;
  } catch (error: any) {
    console.log(error.message);
    return;
  }
}
