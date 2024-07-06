import { getCompleteHardwareInfo } from '../../application/services/openhardwaremonitor.service';

export default class HardwareInfoController {
  async getHardwareInfo(req, res) {
    const hardwareInfo = await getCompleteHardwareInfo();

    res.status(200).json(hardwareInfo);
  }
}
