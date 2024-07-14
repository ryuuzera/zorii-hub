import { exec } from 'child_process';
import ffi from 'ffi-napi';

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

    console.log(`stdout: ${stdout}`);
  });
}

export function run(command: string) {
  console.log(`start ${command}`);
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
});

const MB_YESNO = 0x00000004;
const MB_ICONQUESTION = 0x00000020;
const IDYES = 6;
const IDNO = 7;
const MB_TOPMOST = 0x00040000;
