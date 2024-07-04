import express from 'express';
import HardwareInfoController from '../controllers/hardware.controller';

const hardwareRoutes = express.Router();
const hardwareController = new HardwareInfoController();

hardwareRoutes.get('/', hardwareController.getHardwareInfo);

export default hardwareRoutes;
