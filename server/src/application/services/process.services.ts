import { spawn } from 'child_process';
import path from 'path';

export function runExecutable(relativeExePath) {
  const exePath = path.resolve(__dirname, relativeExePath);

  const child = spawn(exePath, {
    detached: true,
    stdio: 'ignore',
  });

  process.on('exit', () => {
    child.kill();
  });

  process.on('SIGINT', () => {
    child.kill();
    process.exit();
  });

  process.on('SIGTERM', () => {
    child.kill();
    process.exit();
  });

  return child;
}
