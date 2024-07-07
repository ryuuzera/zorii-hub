import { exec } from 'child_process';
import { runExecutable } from './application/services/process.services';
import { httpServer } from './infra/server/app';

const logColorEnv = (env: string) => {
  switch (env) {
    case 'dev':
      return 'cyan';
    case 'prod':
      return 'green';
    case 'test':
      return 'yellow';
  }
  return 'cyan';
};

const relativeExecutablePath = '../../../runtimes/openhardwarelib/OpenHardwareMonitor.exe';
exec(`taskkill /im OpenHardwareMonitor.exe /t`, (err, stdout, stderr) => {
  if (err) {
    // ignore
  }

  runExecutable(relativeExecutablePath);
});

httpServer.listen(process.env.PORT, () => console.log(`Server running on Port ${process.env.PORT}`));
