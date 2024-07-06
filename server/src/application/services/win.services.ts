import { exec } from 'child_process';

export function runShutdown() {
  const command = `start shutdown -s -t 0`;
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
