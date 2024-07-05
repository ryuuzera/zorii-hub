export type HardwareInfo = {
  username: string;
  system: string;
  pcName: string;
  motherBoard: MotherBoard;
  cpu: CPU;
  gpu: GPU;
  memory: Memory;
  storage: { [key: string]: Storage };
};

export type HwData = {
  id: number;
  Text: string;
  Children: any[];
  Min: string;
  Value: string;
  Max: string;
  ImageURL: string;
};

export type CPU = {
  min: string;
  max: string;
  value: string;
  cpuName: string;
  cpuClocks: HwData[];
  cpuTemps: HwData[];
  cpuLoad: HwData[];
  cpuPowers: HwData[];
};

export type GPU = {
  gpuName: string;
  gpuClocks: HwData[];
  gpuTemps: HwData[];
  gpuLoad: HwData[];
  gpuFans: HwData[];
  gpuControls: HwData[];
  gpuPowers: HwData[];
  gpuData: HwData[];
  gpuThroughput: HwData[];
};

export type Memory = {
  memoryTotal: number;
  memoryName: string;
  memoryLoad: HwData[];
  memoryData: HwData[];
};

export type MotherBoard = {
  motherBoardName: string;
  mcu: Mcu;
};

export type Mcu = {
  mcuName: string;
  mcuVoltages: HwData[];
  mcuTemps: HwData[];
  mcuFans: HwData[];
  mcuControls: HwData[];
};

export type Storage = {
  name: string;
  temperatures?: HwData[];
  load: HwData[];
  levels?: HwData[];
  factors?: HwData[];
  data?: HwData[];
};
