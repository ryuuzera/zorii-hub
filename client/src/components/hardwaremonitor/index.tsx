'use client';
import { socket } from '@/socket';
import { Typography } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import { CpuInfo } from './cpuInfo';

export default function HardwareMonitor({ data }: any) {
  const [localData, setData] = useState(data);

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
    cpuTemp: parseFloat(localData.cpu.cpuTemps.find((x: any) => x.Text.includes('Package'))?.Value ?? 0),
    cpuLoad: parseFloat(localData.cpu.cpuLoad.find((x: any) => x.Text.includes('Total'))?.Value ?? 0),
  };

  const gpuTemp = localData.gpu.gpuTemps.find((x: any) => x.Text.includes('Core'))?.Value;
  const gpuLoad = localData.gpu.gpuLoad.find((x: any) => x.Text.includes('Core'))?.Value;
  const gpuMem = {
    total: localData.gpu.gpuData.find((x: any) => x.Text.includes('Total'))?.Value,
    used: localData.gpu.gpuData.find((x: any) => x.Text.includes('Used'))?.Value,
    free: localData.gpu.gpuData.find((x: any) => x.Text.includes('Free'))?.Value,
  };
  return (
    <>
      <div className='w-full max-w-7xl flex flex-row flex-wrap items-center justify-evenly'>
        {/* <MonitorCard
          title={
            <div className='flex flex-col w-full gap-2 text-start'>
              <img src='/display.png' className='self-center' alt='display' width={50} />
              <p>{localData.pcName}</p>
            </div>
          }
          description={localData.username}
          className='w-[400px]'
          contentClass='pl-3 pt-0 pb-2'
          headerClass='pt-3 pl-3 pb-1'
          cardContent={
            <div className='grid grid-cols-1 gap-1'>
              <p>CPU: {localData.cpu.cpuName}</p>
              <p>GPU: {localData.gpu.gpuName}</p>
              <p>Memory: {`${convertBytes(localData.memory.memoryTotal, 'B', 'GB').toFixed(2)} GB`}</p>
              <p>OS: {localData.system}</p>
            </div>
          }
        /> */}
        <CpuInfo cpuInfo={cpuInfo} />
        <div className='flex flex-col items-center min-h-[320px] mt-1'>
          <Typography variant='h5'>GPU</Typography>
          <div className='flex flex-row space-x-3'>
            <div className='flex flex-col items-center'>
              <Typography variant='body1'>Load</Typography>
              <Gauge
                width={180}
                height={200}
                value={parseFloat(gpuLoad)}
                innerRadius={55}
                sx={(theme) => ({
                  margin: 0,
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: '2rem',
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#1cbab7',
                    transition: 'all 0.2s',
                    // filter: 'brightness(50%)',
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: '#424750',
                  },
                })}
                text={({ value, valueMax }) => `${value}%`}
              />
            </div>
            <div className='flex flex-col items-center'>
              <Typography variant='body1'>Temp</Typography>
              <Gauge
                width={180}
                height={200}
                value={parseFloat(gpuTemp)}
                innerRadius={55}
                sx={(theme) => ({
                  [`& .${gaugeClasses.valueText}`]: {
                    fontSize: '2rem',
                    color: 'white',
                  },
                  [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#1cbab7',
                    transition: 'all 0.2s',
                    // filter: 'brightness(50%)',
                  },
                  [`& .${gaugeClasses.referenceArc}`]: {
                    fill: '#424750',
                  },
                })}
                text={({ value, valueMax }) => `${value} °C`}
              />
            </div>
          </div>
          <div className='flex flex-col items-start w-full'>
            <Typography variant='body2' className='self-center'>
              VRAM
            </Typography>
            <div className='flex flex-row w-full justify-evenly'>
              <div className='flex flex-col'>
                <Typography variant='body2'>Total:</Typography>
                <Typography variant='body2'>{gpuMem.total}</Typography>
              </div>
              <div className='flex flex-col'>
                <Typography variant='body2'>Used:</Typography>
                <Typography variant='body2'>{gpuMem.used}</Typography>
              </div>
              <div className='flex flex-col'>
                <Typography variant='body2'>Free:</Typography>
                <Typography variant='body2'>{gpuMem.free}</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
