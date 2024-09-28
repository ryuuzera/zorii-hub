import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import path from 'path';

let presentMon: ChildProcessWithoutNullStreams;

export function startPresentMon(processName, socket, gameTitle) {
  presentMon = spawn(path.resolve(__dirname, '../../../runtimes/PresentMon.exe'), [
    '--process_name',
    processName,
    '--output_stdout',
    '--stop_existing_session',
    '--terminate_on_proc_exit',
  ]);

  presentMon.stdout.on('data', (data) => {
    var result = data.toString('utf-8').split('\n');
    result.shift();
    result.pop();

    var fps = calculateFPS(result);

    if (fps) {
      socket.emit('framerate', { framerate: +fps, gameTitle: gameTitle });
    }
  });

  presentMon.on('error', (err) => {
    console.error(`Err starting presentMon: ${err.message}`);
  });

  presentMon.on('close', () => {
    socket.emit('presentmon-exit');
  });

  presentMon.on('exit', () => {
    socket.emit('presentmon-exit');
  });
}

function calculateFPS(output) {
  const values = output
    .map((line) => {
      const partsArray = line.split(',');
      if (partsArray.length < 11) return null;
      const value = +partsArray[9];
      return isNaN(value) || value <= 0 ? null : 1000 / value;
    })
    .filter((x) => x);

  if (values.length === 0) return null;

  const fps = values.reduce((sum, value) => sum + value, 0) / values.length;

  return fps.toFixed(2);
}
