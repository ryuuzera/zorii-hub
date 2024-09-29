import { httpServer } from './infra/server/app';

httpServer.listen(process.env.PORT || 3001, () => console.log(`Server running on Port ${process.env.PORT}`));
