'use client';
import { Typography } from '@mui/material';
import { Gauge, gaugeClasses, SparkLineChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';

export function CpuInfo({ cpuInfo }: any) {
  const [loadLog, setLoadLog] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    setLoadLog((prev) => {
      const newLog = [...prev, cpuInfo.cpuLoad];
      if (newLog.length > 9) {
        newLog.shift();
      }
      return newLog;
    });
  }, [cpuInfo.cpuLoad]);

  return (
    <div className='flex flex-col items-center min-h-[320px]'>
      <Typography variant='h6' mb={1}>{cpuInfo.name} </Typography>
      <div className='flex flex-row space-x-3'>
        <div className='flex flex-col items-center'>
          <Typography variant='body1'>Load</Typography>
          <Gauge
            width={180}
            height={200}
            value={parseFloat(cpuInfo.cpuLoad)}
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
            text={({ value, valueMax }) => `${value}%`}
          />
        </div>
        <div className='flex flex-col items-center'>
          <Typography variant='body1'>Temp</Typography>
          <Gauge
            width={180}
            height={200}
            value={cpuInfo.cpuTemp}
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
            text={({ value, valueMax }) => `${value} °C`}
          />
        </div>
      </div>
      <div className='flex flex-col items-center w-full transition-all delay-150'>
        <SparkLineChart
          data={loadLog}
          height={50}
          curve='linear'
          yAxis={{
            min: 0,
            max: 100,
          }}
        />
        <Typography variant='body2'>Usage</Typography>
      </div>
    </div>
  );
}
