'use client';
import { socket } from '@/socket';
import { HardwareInfo, HwData } from '@/types/response-schemas/hardwareinfo';
import { convertBytes } from '@/utils/converter/byteconverter';
import { Box, LinearProgress, Typography } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import FireIcon from '../fire-icon';
import { CpuInfo } from './cpuInfo';
import { MonitorCard } from './monitorcard';

type HardwareMonitorProps = {
  data: HardwareInfo | null;
};

export default function HardwareMonitor({ data }: HardwareMonitorProps) {
  const [localData, setData] = useState<HardwareInfo | null>(data);

  useEffect(() => {
    socket.connect();
    socket.on('hardware-info', (data) => {
      setData(data);
    });
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
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
    <>
      <div className='w-full max-w-7xl flex flex-row flex-wrap items-center justify-evenly'>
        <CpuInfo cpuInfo={cpuInfo} />
        <div className='flex flex-col items-center min-h-[320px] mt-1'>
          <Typography variant='h6' mb={1}>
            {localData?.gpu.gpuName}
          </Typography>
          <div className='flex flex-row space-x-3'>
            <div className='flex flex-col items-center'>
              <Typography variant='body1'>Load</Typography>
              <Gauge
                width={180}
                height={200}
                value={parseFloat(gpuLoad ?? '')}
                innerRadius={55}
                sx={(theme) => ({
                  margin: 0,
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: '2rem',
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#1cbab7',
                    transition: 'all 0.2s',
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: '#424750',
                  },
                })}
                text={({ value }) => `${value}%`}
              />
            </div>
            <div className='flex flex-col items-center'>
              <Typography variant='body1'>Temp</Typography>
              <Gauge
                width={180}
                height={200}
                value={parseFloat(gpuTemp ?? '')}
                innerRadius={55}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: '2rem',
                    color: 'white',
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#1cbab7',
                    transition: 'all 0.2s',
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: '#424750',
                  },
                })}
                text={({ value }) => `${value} °C`}
              />
            </div>
          </div>
          <div className='flex flex-col items-start w-full'>
            <Typography variant='body1' className='self-center'>
              VRAM
            </Typography>
            <div className='flex flex-row w-full justify-evenly'>
              <div className='flex flex-col'>
                <Typography variant='body1'>Total:</Typography>
                <Typography variant='body1'>{gpuMem.total}</Typography>
              </div>
              <div className='flex flex-col'>
                <Typography variant='body1'>Used:</Typography>
                <Typography variant='body1'>{gpuMem.used}</Typography>
              </div>
              <div className='flex flex-col'>
                <Typography variant='body1'>Free:</Typography>
                <Typography variant='body1'>{gpuMem.free}</Typography>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center justify-evenly min-w-[380px] min-h-[320px] mt-1 gap-3'>
          <Typography variant='h5'>RAM</Typography>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <LinearProgress sx={{ height: 24 }} variant='determinate' value={memory.load.value} />
          </Box>
          <div className='grid grid-cols-2 w-full'>
            <Typography variant='body1'>Usage {memory.load.value}%</Typography>
            <Typography variant='body1'>Used RAM: {memory.used.value}</Typography>
            <Typography variant='body1'>Available: {memory.free.value}</Typography>
            <Typography variant='body1'>Total {convertBytes(memory.total ?? 0, 'B', 'GB').toFixed(1)} GB</Typography>
          </div>
        </div>
        <div className='overflow-x-scroll items-center justify-evenly min-w-[380px] h-[310px] mt-1 gap-3'>
          <div className='flex flex-col h-full w-full'>
            <div className='flex flex-col w-full items-center mb-2'>
              <Typography variant='h5'>CPU Cores ({cpuInfo?.loads?.length})</Typography>
            </div>

            {cpuInfo?.loads?.map((item, index) => {
              return (
                <div className='flex flex-col gap-1 items-left text-left w-full '>
                  <div className='flex flex-row justify-between'>
                    <div className='flex flex-row space-x-3'>
                      <Typography variant='body2'>Core #{index + 1}</Typography>
                      <Typography variant='body2'>{item.value}</Typography>
                    </div>
                    <div className='flex flex-row space-x-3 items-center'>
                      <Typography variant='body2'>{cpuInfo?.clocks && cpuInfo?.clocks[index].value}</Typography>

                      <div className='flex flex-row items-center  gap-1'>
                        <FireIcon
                          color={'#fff'}
                          size={12}
                          fillPercentage={(cpuInfo?.temps && parseFloat(cpuInfo?.temps[index].value ?? '')) ?? 0}
                        />
                        <Typography variant='body2'>{cpuInfo?.temps && cpuInfo?.temps[index].value}</Typography>
                      </div>
                    </div>
                  </div>
                  <Box sx={{ width: '100%' }} mb={2}>
                    <LinearProgress variant='determinate' value={parseFloat(item.value ?? '')} />
                  </Box>
                </div>
              );
            })}
          </div>
        </div>
        <div className='flex flex-col items-center justify-evenly min-w-[380px] min-h-[320px] mt-1 gap-3'>
          <Typography variant='h5'>Storage</Typography>
          {storage?.map((item) => {
            return (
              <div className='w-full flex flex-col'>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <LinearProgress
                    sx={{ height: 18 }}
                    variant='determinate'
                    value={parseFloat(String(item.usedSpace.value).replace('%', ''))}
                  />
                  <div className='flex flex-row w-full justify-between'>
                    <Typography variant='body1'>{item.name}</Typography>
                    <Typography variant='body1'>{item.usedSpace.value}</Typography>
                  </div>
                </Box>
              </div>
            );
          })}
        </div>
        <MonitorCard
          title={
            <div className='flex flex-col w-full gap-2 text-start'>
              <img src='/display.png' className='self-end' alt='display' width={40} />
              <p>{localData?.pcName}</p>
            </div>
          }
          description={localData?.username}
          className='w-[400px] h-[280px] flex flex-col justify-start border-none'
          contentClass='pl-3 pt-0 pb-2 '
          headerClass='pt-3 pl-3 pb-1 mb-2'
          cardContent={
            <div className='flex flex-col gap-2'>
              <p>CPU: {localData?.cpu.cpuName}</p>
              <p>GPU: {localData?.gpu.gpuName}</p>
              <p>Memory: {`${convertBytes(localData?.memory.memoryTotal ?? 0, 'B', 'GB').toFixed(2)} GB`}</p>
              <p>OS: {localData?.system}</p>
            </div>
          }
        />
      </div>
    </>
  );
}
