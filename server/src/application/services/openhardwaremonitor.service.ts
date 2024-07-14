import os from 'os';

async function fetchHardwareInfo() {
  try {
    const request = await fetch(`http://${process.env.HOST}:8085/data.json`);
    const requestJson = await (await request.json()).Children;
    return requestJson.find(() => true);
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function getCompleteHardwareInfo() {
  const user = os.userInfo();
  //pc
  const pc = await fetchHardwareInfo();
  const pcName = pc.Text;

  //mobo
  const motherBoard = pc.Children?.find((x) => x.ImageURL?.includes('mainboard'));
  const motherBoardName = motherBoard.Text;

  //mcu
  const mcu = motherBoard.Children?.find((x) => x.ImageURL?.includes('chip'));
  const mcuName = mcu.Text;

  const mcuVoltages = mcu.Children?.find((x) => x.Text.includes('Voltages')).Children;

  const mcuTemps = mcu.Children?.find((x) => x.Text.includes('Temperatures')).Children;

  const mcuFans = mcu.Children?.find((x) => x.Text.includes('Fans')).Children;

  const mcuControls = mcu.Children?.find((x) => x.Text.includes('Controls')).Children;

  //cpu
  const cpu = pc.Children?.find((x) => x.ImageURL?.includes('cpu'));
  const cpuClock = {
    min: cpu.Min,
    max: cpu.Max,
    value: cpu.Value,
  };

  const cpuName = os.cpus()[0]?.model || 'Unknown CPU';
  const cpuClocks = cpu.Children?.find((x) => x.Text.includes('Clock')).Children;
  const cpuTemps = cpu.Children?.find((x) => x.Text.includes('Temperature')).Children;
  const cpuLoad = cpu.Children?.find((x) => x.Text.includes('Load')).Children;
  const cpuPowers = cpu.Children?.find((x) => x.Text.includes('Powers')).Children;

  // GPU
  const gpu = pc.Children?.find((x) => x.ImageURL?.includes('nvidia'));
  const gpuName = gpu.Text.replace('NVIDIA', '');
  const gpuClocks = gpu.Children?.find((x) => x.Text.includes('Clocks')).Children;
  const gpuTemps = gpu.Children?.find((x) => x.Text.includes('Temperatures')).Children;
  const gpuLoad = gpu.Children?.find((x) => x.Text.includes('Load')).Children;
  const gpuFans = gpu.Children?.find((x) => x.Text.includes('Fans')).Children;
  const gpuControls = gpu.Children?.find((x) => x.Text.includes('Controls')).Children;
  const gpuPowers = gpu.Children?.find((x) => x.Text.includes('Powers')).Children;
  const gpuData = gpu.Children?.find((x) => x.Text.includes('Data')).Children;
  const gpuThroughput = gpu.Children?.find((x) => x.Text.includes('Throughput')).Children;

  // Memory
  const memory = pc.Children?.find((x) => x.ImageURL?.includes('ram'));
  const memoryName = memory.Text;
  const memoryTotal = os.totalmem();
  const memoryLoad = memory.Children?.find((x) => x.Text.includes('Load')).Children;
  const memoryData = memory.Children?.find((x) => x.Text.includes('Data')).Children;

  // Storage (HDD/SSD)
  const storage = pc.Children?.filter((x) => x.ImageURL?.includes('hdd') || x.ImageURL?.includes('ssd'));
  const storageData = storage.map((drive) => ({
    name: drive.Text,
    temperatures: drive.Children?.find((x) => x.Text.includes('Temperatures'))?.Children,
    load: drive.Children?.find((x) => x.Text.includes('Load')).Children,
    levels: drive.Children?.find((x) => x.Text.includes('Levels'))?.Children,
    factors: drive.Children?.find((x) => x.Text.includes('Factors'))?.Children,
    data: drive.Children?.find((x) => x.Text.includes('Data'))?.Children,
  }));
  const system = os.version();
  const result = {
    username: user.username,
    system,
    pcName,
    motherBoard: {
      motherBoardName,
      mcu: {
        mcuName,
        mcuVoltages,
        mcuTemps,
        mcuFans,
        mcuControls,
      },
    },
    cpu: {
      ...cpuClock,
      cpuName,
      cpuClocks,
      cpuTemps,
      cpuLoad,
      cpuPowers,
    },
    gpu: {
      gpuName,
      gpuClocks,
      gpuTemps,
      gpuLoad,
      gpuFans,
      gpuControls,
      gpuPowers,
      gpuData,
      gpuThroughput,
    },
    memory: {
      memoryTotal,
      memoryName,
      memoryLoad,
      memoryData,
    },
    storage: {
      ...storageData,
    },
  };

  return result;
}
