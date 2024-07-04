'use client';
import { convertBytes } from '@/utils/converter/byteconverter';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import { useEffect, useState } from 'react';
import { MonitorCard } from './monitorcard';

export default function HardwareMonitor({ data }: any) {
  async function updateData() {
    try {
      const result = await fetch('http://192.168.0.109:3001/api/hardwareinfo', { cache: 'no-cache' });
      if (result.ok) {
        return await result.json();
      }
      return null;
    } catch {
      return null;
    }
  }
  const [localData, setData] = useState(data);
  let refresh: NodeJS.Timeout;
  useEffect(() => {
    refresh = setInterval(() => {
      updateData()
        .then((data) => setData(data))
        .catch(() => {});
    }, 2000);

    return () => {
      clearInterval(refresh);
    };
  }, []);

  const cpuTemp = localData.cpu.cpuTemps.find((x: any) => x.Text.includes('Package'))?.Value;
  const cpuLoad = localData.cpu.cpuLoad.find((x: any) => x.Text.includes('Total'))?.Value;
  return (
    <>
      <div className='w-full max-w-7xl flex flex-row flex-wrap items-center justify-evenly'>
        <MonitorCard
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
        />
        <div className='border-2 border-white'>
          <Gauge
            width={180}
            height={200}
            value={parseFloat(cpuLoad)}
            innerRadius={55}
            sx={(theme) => ({
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: '2rem',
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: '#4752c4',
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: '#9da0a5',
              },
            })}
            text={({ value, valueMax }) => `${value}%`}
          />
        </div>
        <div className='border-2 border-white'>
          <Gauge
            width={180}
            height={200}
            value={parseFloat(cpuTemp.replace('°C', ''))}
            innerRadius={55}
            sx={(theme) => ({
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: '2rem',
                color: 'white',
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: '#4752c4',
                // filter: 'brightness(50%)',
              },
              [`& .${gaugeClasses.referenceArc}`]: {
                fill: '#9da0a5',
              },
            })}
            text={({ value, valueMax }) => `${value} °C`}
          />
        </div>
      </div>
    </>
  );
}
