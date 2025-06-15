'use client';
import { useSocket } from '@/hook/socket-connection';
import { pageTransition } from '@/lib/transitions';
import { HardwareInfo, HwData } from '@/types/response-schemas/hardwareinfo';
import { convertBytes } from '@/utils/converter/byteconverter';
import { Box, LinearProgress, Typography, useTheme } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import FireIcon from '../fire-icon';
import { CpuInfo } from './cpuInfo';
import { MonitorCard } from './monitorcard';

type HardwareMonitorProps = {
  data: HardwareInfo | null;
};

type RunningGameInfo = {
  framerate: number;
  gameTitle: string;
};

export default function HardwareMonitor({ data }: HardwareMonitorProps) {
  const theme = useTheme();
  const [localData, setData] = useState<HardwareInfo | null>(data);
  const [runningGameInfo, setRunningGameInfo] = useState<RunningGameInfo | null>(null);
  const [debouncedFramerate, setDebouncedFramerate] = useState<number>(0);
  const { socket } = useSocket();

  let handler: any;

  useEffect(() => {
    socket.on('hardware-info', (data) => {
      setData(data);
    });
    socket.on('framerate', (data) => {
      setRunningGameInfo(data);
      if (handler) {
        clearTimeout(handler);
        handler = null;
      }
      handler = setTimeout(() => setDebouncedFramerate(data.framerate), 200);
    });
    socket.on('presentmon-exit', () => {
      setRunningGameInfo(null);
    });

    return () => {};
  }, []);

  const cpuInfo = {
    name: localData?.cpu.cpuName,
    cpuTemp: parseFloat(localData?.cpu.cpuTemps.find((item: HwData) => item.Text.includes('Package'))?.Value ?? ''),
    cpuLoad: parseFloat(localData?.cpu.cpuLoad.find((item: HwData) => item.Text.includes('Total'))?.Value ?? ''),
    clocks: localData?.cpu.cpuClocks
      .filter((item: HwData) => !item.Text.includes('Bus'))
      .map((item: HwData) => ({ min: item.Min, value: item.Value, max: item.Max })),
    temps: localData?.cpu.cpuTemps
      .filter((item: HwData) => !item.Text.includes('Package'))
      .map((item: HwData) => ({ min: item.Min, value: item.Value, max: item.Max })),
    loads: localData?.cpu.cpuLoad
      .filter((item: HwData) => !item.Text.includes('Total'))
      .map((item: HwData) => ({ min: item.Min, value: item.Value, max: item.Max })),
  };

  const gpuTemp = localData?.gpu.gpuTemps.find((item: HwData) => item.Text.includes('Core'))?.Value;
  const gpuLoad = localData?.gpu.gpuLoad.find((item: HwData) => item.Text.includes('Core'))?.Value;
  const gpuMem = {
    total: localData?.gpu.gpuData.find((item: HwData) => item.Text.includes('Total'))?.Value,
    used: localData?.gpu.gpuData.find((item: HwData) => item.Text.includes('Used'))?.Value,
    free: localData?.gpu.gpuData.find((item: HwData) => item.Text.includes('Free'))?.Value,
  };

  const memory = {
    name: localData?.memory.memoryName,
    total: localData?.memory.memoryTotal,
    load: {
      min: parseFloat(localData?.memory.memoryLoad[0]?.Min ?? ''),
      value: parseFloat(localData?.memory.memoryLoad[0]?.Value ?? ''),
      max: parseFloat(localData?.memory.memoryLoad[0]?.Max ?? ''),
    },
    used: {
      min: parseFloat(
        localData?.memory.memoryData.find((item: HwData) => item.Text.includes('Used'))?.Min ?? ''
      ).toFixed(1),
      value: localData?.memory.memoryData.find((item: HwData) => item.Text.includes('Used'))?.Value,
      max: parseFloat(
        localData?.memory.memoryData.find((item: HwData) => item.Text.includes('Used'))?.Max ?? ''
      ).toFixed(1),
    },
    free: {
      min: parseFloat(
        localData?.memory.memoryData.find((item: HwData) => item.Text.includes('Available'))?.Min ?? ''
      ).toFixed(1),
      value: localData?.memory.memoryData.find((item: HwData) => item.Text.includes('Available'))?.Value,
      max: parseFloat(
        localData?.memory.memoryData.find((item: HwData) => item.Text.includes('Available'))?.Max ?? ''
      ).toFixed(1),
    },
  };

  const storage =
    localData?.storage &&
    Object.keys(localData?.storage!)?.map((key: string) => {
      return {
        name: localData?.storage[key].name,
        temperatures: {
          min: localData?.storage[key].temperatures?.find((item: HwData) => item.Text.includes('Temperature'))?.Min,
          value: localData?.storage[key].temperatures?.find((item: HwData) => item.Text.includes('Temperature'))?.Value,
          max: localData?.storage[key].temperatures?.find((item: HwData) => item.Text.includes('Temperature'))?.Max,
        },
        usedSpace: {
          min: localData?.storage[key].load?.find((item: HwData) => item.Text.includes('Used'))?.Min,
          value: localData?.storage[key].load?.find((item: HwData) => item.Text.includes('Used'))?.Value,
          max: localData?.storage[key].load?.find((item: HwData) => item.Text.includes('Used'))?.Max,
        },
        remainingLife: localData?.storage[key].levels?.find((item: HwData) => item.Text.includes('Life'))?.Value,
        total: localData?.storage[key].data?.find((item: HwData) => item.Text.includes('Reads'))?.Value,
      };
    });

  return (
    <motion.div {...pageTransition}>
      <div className="container mx-auto px-4 py-6">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CPU Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg col-span-1 md:col-span-2 lg:col-span-1">
            <CpuInfo cpuInfo={cpuInfo} />
          </div>

          {/* GPU Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <Typography variant="h6" className="text-center mb-4 text-white">
              {localData?.gpu.gpuName}
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <Typography variant="body1" className="text-gray-300 mb-2">GPU Load</Typography>
                <Gauge
                  width={180}
                  height={180}
                  value={parseFloat(gpuLoad ?? '')}
                  innerRadius={55}
                  sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: '1.5rem',
                      fill: theme.palette.text.primary,
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: '#1cbab7',
                      transition: 'all 0.2s',
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                      fill: '#424750',
                    },
                  }}
                  text={({ value }) => `${value}%`}
                />
              </div>
              <div className="flex flex-col items-center">
                <Typography variant="body1" className="text-gray-300 mb-2">GPU Temp</Typography>
                <Gauge
                  width={180}
                  height={180}
                  value={parseFloat(gpuTemp ?? '')}
                  innerRadius={55}
                  sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                      fontSize: '1.5rem',
                      fill: theme.palette.text.primary,
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                      fill: '#1cbab7',
                      transition: 'all 0.2s',
                    },
                    [`& .${gaugeClasses.referenceArc}`]: {
                      fill: '#424750',
                    },
                  }}
                  text={({ value }) => `${value} °C`}
                />
              </div>
            </div>
            <div className="mt-4 bg-gray-700 rounded-lg p-3">
              <Typography variant="body1" className="text-center text-gray-300 mb-2">
                VRAM
              </Typography>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <Typography variant="caption" className="text-gray-400">Total</Typography>
                  <Typography variant="body1">{gpuMem.total}</Typography>
                </div>
                <div>
                  <Typography variant="caption" className="text-gray-400">Used</Typography>
                  <Typography variant="body1">{gpuMem.used}</Typography>
                </div>
                <div>
                  <Typography variant="caption" className="text-gray-400">Free</Typography>
                  <Typography variant="body1">{gpuMem.free}</Typography>
                </div>
              </div>
            </div>
          </div>

          {/* RAM Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <Typography variant="h5" className="text-center mb-4 text-white">
              System Memory
            </Typography>
            <div className="flex flex-col gap-4">
              <div>
                <Typography variant="body1" className="text-gray-300 mb-1">
                  Usage: {memory.load.value}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={memory.load.value} 
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#424750',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#1cbab7',
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-3">
                  <Typography variant="caption" className="text-gray-400">Used</Typography>
                  <Typography variant="body1">{memory.used.value} GB</Typography>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <Typography variant="caption" className="text-gray-400">Available</Typography>
                  <Typography variant="body1">{memory.free.value} GB</Typography>
                </div>
                <div className="bg-gray-700 rounded-lg p-3 col-span-2">
                  <Typography variant="caption" className="text-gray-400">Total</Typography>
                  <Typography variant="body1">
                    {convertBytes(memory.total ?? 0, 'B', 'GB').toFixed(1)} GB
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          {/* CPU Cores Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg overflow-hidden">
            <div className="flex flex-col h-full">
              <Typography variant="h5" className="text-center mb-4 text-white">
                CPU Cores ({cpuInfo?.loads?.length})
              </Typography>
              <div className="overflow-y-auto pr-2" style={{ maxHeight: '400px' }}>
                {cpuInfo?.loads?.map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <Typography variant="body2" className="text-gray-300">
                          Core #{index + 1}
                        </Typography>
                        <Typography variant="body2" className="text-white font-medium">
                          {item.value}%
                        </Typography>
                      </div>
                      <div className="flex items-center gap-3">
                        <Typography variant="body2" className="text-white">
                          {cpuInfo?.clocks && cpuInfo?.clocks[index].value} MHz
                        </Typography>
                        <div className="flex items-center gap-1">
                          <FireIcon
                            color={theme.palette.text.primary}
                            size={12}
                            fillPercentage={(cpuInfo?.temps && parseFloat(cpuInfo?.temps[index].value ?? '')) ?? 0}
                          />
                          <Typography variant="body2" className="text-white">
                            {cpuInfo?.temps && cpuInfo?.temps[index].value}°C
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <LinearProgress
                      variant="determinate"
                      value={parseFloat(item.value ?? '')}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#424750',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#1cbab7',
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Storage Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <Typography variant="h5" className="text-center mb-4 text-white">
              Storage
            </Typography>
            <div className="space-y-4">
              {storage?.map((item, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4">
                  <Typography variant="body1" className="text-white mb-2">
                    {item.name}
                  </Typography>
                  <div className="flex items-center gap-2 mb-2">
                    <Typography variant="caption" className="text-gray-400">Usage:</Typography>
                    <Typography variant="body2" className="text-white">
                      {item.usedSpace.value}
                    </Typography>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={parseFloat(String(item.usedSpace.value).replace('%', ''))}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#424750',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#1cbab7',
                      }
                    }}
                  />
                  {item.temperatures?.value && (
                    <div className="flex items-center gap-2 mt-2">
                      <Typography variant="caption" className="text-gray-400">Temp:</Typography>
                      <Typography variant="body2" className="text-white">
                        {item.temperatures.value}°C
                      </Typography>
                    </div>
                  )}
                  {item.remainingLife && (
                    <div className="flex items-center gap-2 mt-1">
                      <Typography variant="caption" className="text-gray-400">Health:</Typography>
                      <Typography variant="body2" className="text-white">
                        {item.remainingLife}%
                      </Typography>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Game Info/System Info Section */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            {runningGameInfo?.framerate && runningGameInfo?.framerate > 0 ? (
              <div className="flex flex-col items-center h-full justify-center">
                <Typography variant="h5" className="text-white mb-2">
                  Running Game
                </Typography>
                <Typography variant="h6" className="text-gray-300 mb-6">
                  {runningGameInfo?.gameTitle}
                </Typography>
                <div className="flex items-end gap-2">
                  <Typography 
                    variant="h1" 
                    className="text-white transition-all delay-200"
                    style={{ fontSize: '4rem', lineHeight: 1 }}
                  >
                    {Math.trunc(debouncedFramerate ?? 0)}
                  </Typography>
                  <Typography variant="body1" className="text-gray-400 mb-4">
                    fps
                  </Typography>
                </div>
              </div>
            ) : (
              <MonitorCard
                title={
                  <div className="flex justify-between items-center w-full">
                    <Typography variant="h5" className="text-white">
                      {localData?.pcName}
                    </Typography>
                    <img src="/display.png" alt="display" width={40} height={40} />
                  </div>
                }
                description={
                  <Typography variant="body2" className="text-gray-400">
                    {localData?.username}
                  </Typography>
                }
                className="h-full flex flex-col border-none bg-transparent"
                contentClass="pt-4"
                headerClass="pb-3 border-b border-gray-700"
                cardContent={
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <Typography variant="body2" className="text-gray-400">CPU:</Typography>
                      <Typography variant="body2" className="text-white">
                        {localData?.cpu.cpuName}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="body2" className="text-gray-400">GPU:</Typography>
                      <Typography variant="body2" className="text-white">
                        {localData?.gpu.gpuName}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="body2" className="text-gray-400">Memory:</Typography>
                      <Typography variant="body2" className="text-white">
                        {`${convertBytes(localData?.memory.memoryTotal ?? 0, 'B', 'GB').toFixed(2)} GB`}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography variant="body2" className="text-gray-400">OS:</Typography>
                      <Typography variant="body2" className="text-white">
                        {localData?.system}
                      </Typography>
                    </div>
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}