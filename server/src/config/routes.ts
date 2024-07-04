import express from 'express';
import steamRoutes from '../infra/routes/steam.routes';
import hardwareRoutes from '../infra/routes/hardware.routes';

const routes = express();

routes.use('/steam', steamRoutes);
routes.use('/hardwareinfo', hardwareRoutes)

export default routes;
