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

httpServer.listen(process.env.PORT, () => console.log(`Server running on Port ${process.env.PORT}`));

// httpServer.listen(process.env.WEBSOCKET_PORT, () => console.log('Websocket running on port ' + process.env.WEBSOCKET_PORT));
