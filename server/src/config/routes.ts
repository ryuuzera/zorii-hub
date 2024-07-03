import express from 'express';
import steamRoutes from '../infra/routes/steam.routes';

const routes = express();

routes.use('/steam', steamRoutes);

export default routes;
