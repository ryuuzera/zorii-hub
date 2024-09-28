import { httpServer } from './infra/server/app';

httpServer.listen(process.env.PORT, () => console.log(`Server running on Port ${process.env.PORT}`));
