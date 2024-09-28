import { exec, spawn } from 'child_process';
import ffi from 'ffi-napi';
import {
  APPCOMMAND_VOLUME_DOWN,
  APPCOMMAND_VOLUME_MUTE,
  APPCOMMAND_VOLUME_UP,
  HWND_BROADCAST,
  WM_APPCOMMAND,
} from '../const/win.const';

export function runShutdown() {
  const command = `start shutdown -s -t 0 -f`;

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
}

export function runSpawn(command: string) {
  const child = spawn(command, {
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    shell: true,
  });

  child.unref();
}

export function run(command: string) {
  exec(`start ${command}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
  });
}

const user32 = new ffi.Library('user32', {
  MessageBoxW: ['int32', ['int32', 'string', 'string', 'uint32']],
  SendMessageW: ['int32', ['uint32', 'uint32', 'uint32', 'uint32']],
});

function sendVolumeCommand(command: number): void {
  user32.SendMessageW(HWND_BROADCAST, WM_APPCOMMAND, 0, command);
}

export function volumeUp(): void {
  sendVolumeCommand(APPCOMMAND_VOLUME_UP);
}

export function volumeDown(): void {
  sendVolumeCommand(APPCOMMAND_VOLUME_DOWN);
}

export function muteVolume(): void {
  sendVolumeCommand(APPCOMMAND_VOLUME_MUTE);
}
