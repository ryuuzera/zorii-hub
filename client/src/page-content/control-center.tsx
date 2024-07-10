'use client';
import { Slider } from '@/components/ui/slider';
import { YMusicState } from '@/types/response-schemas/yt-music/state';
import { secondsToMinutesString } from '@/utils/converter/dateformatter';
import { IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const ytMusicURL = 'http://192.168.0.109:9863/api/v1/';
const token =
  '3eddafe62a00d870a282019c064a5f1e9f3827a45ad056b5d8ca728385337c5ebc192dd27e6dcdf04107c15b82dc6714e37724bea9eea75162e18fa29b3166528f583942744049647b3560db781865126369ebe06552e225296f5c22d1da9e667ec347561e18c42efa2312b9791995ef92644d93a7edf874f698a78d1749c6a1a28edfa309c7575e69840a627897b82c99074f1515eaaca5d76c16229bbc9bf64b7e3eea6a5c4d42232c93c6a787a52d8f33bacb728e3413680f5fed828d1ae39048322803ef02224f540f537b0ad2b21029dc27e71a3f30b9d564e8b75619baf352b72bccb36aff9482ac5ad3f7b32ee601bb76dac6d016a8a75120c8de8287';

enum VideoState {
  Unknown = -1,
  Paused = 0,
  Playing = 1,
  Buffering = 2,
}

const Marquee = ({ text }: { text?: string }) => {
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef<any>(null);
  const textRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const textWidth = textRef.current.scrollWidth;
      setAnimate(textWidth > containerWidth);
    }
  }, [text]);

  return (
    <div ref={containerRef} className='relative overflow-hidden whitespace-nowrap w-full'>
      {animate ? (
        <div className='w-full overflow-hidden'>
          <motion.div
            className='inline-block'
            initial={{ x: '80%' }}
            animate={{ x: '-100%' }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 12,
            }}>
            <Typography ref={textRef} variant='h6' sx={{ width: '100%', textWrap: 'nowrap', overflow: 'auto' }}>
              {text}
            </Typography>
          </motion.div>
        </div>
      ) : (
        <Typography ref={textRef} variant='h6' sx={{ width: '100%', textWrap: 'nowrap', overflow: 'auto' }}>
          {text}
        </Typography>
      )}
    </div>
  );
};

export function ControlCenter() {
  const socket = io('http://192.168.0.109:9863/api/v1/realtime', {
    autoConnect: false,
    transports: ['websocket'],
    auth: {
      token: token,
    },
  });
  const glassEffect = 'bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-85 border ';
  const [playerState, setPlayerState] = useState<YMusicState>();
  const [musicProgress, setProgress] = useState<number[]>([playerState?.player?.videoProgress ?? 0]);
  const [isChangingProgress, setChangingProgress] = useState<boolean>(false);
  const [isChangingVolume, setChangingVolume] = useState<boolean>(false);
  const [isMuted, setMuted] = useState<boolean>(playerState?.player?.muted ?? false);
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(playerState?.player?.volume ?? 0);

  const sendCommand = async (command: string, data?: any) => {
    let body: object = {
      command: command,
    };
    if (data) {
      body = {
        ...body,
        data: data,
      };
    }
    await fetch(ytMusicURL + 'command', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    });
  };
  const fetchPlayerState = async () => {
    try {
      const res = await fetch(ytMusicURL + 'state', {
        headers: {
          Authorization: token,
        },
      });
      if (res.ok) {
        const stateData = await res.json();
        setPlayerState(stateData);
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleStateUpdate = (data: YMusicState) => {
    setPlayerState(data);
  };

  useEffect(() => {
    if (!isChangingProgress) setProgress([playerState?.player?.videoProgress ?? 0]);
  }, [playerState?.player?.videoProgress]);

  useEffect(() => {
    if (!isChangingVolume) setVolume(playerState?.player?.volume ?? 0);
  }, [playerState?.player?.volume]);

  useEffect(() => {
    socket.connect();
    socket.on('state-update', handleStateUpdate);

    return () => {
      socket.offAny();
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <div className='flex flex-col w-screen max-w-7xl p-2'>
        <div className='absolute rounded-lg z-0 w-[500px] h-[300px] overflow-hidden opacity-85'>
          <img className='w-[498px] h-[498px] rounded-lg' src={playerState?.video?.thumbnails[0].url ?? ''} />
        </div>
        <div className={`relative flex flex-col w-[500px] h-[300px] ${glassEffect} z-20 shadow-md`}>
          <div className='title w-full flex flex-row justify-center items-center mb-2'>
            <Typography variant='h5' mt={1}>
              Music
            </Typography>
          </div>
          <div className='flex flex-row flex-wrap w-full'>
            <div className='mr-2 bg-black flex items-center justify-center mx-4 h-[120px]'>
              <img
                src={
                  playerState?.video?.thumbnails && playerState?.video?.thumbnails?.length > 1
                    ? playerState?.video.thumbnails[1].url
                    : playerState?.video.thumbnails[0].url
                }
                className='w-[120px]'
              />
            </div>
            <div className='flex flex-col w-[70%] px-3'>
              <Marquee text={playerState?.video?.title} />
              <Typography variant='subtitle1'>{playerState?.video?.author}</Typography>
              <div className='flex flex-row space-x-2'>
                <Typography variant='caption'>
                  {secondsToMinutesString(playerState?.player.videoProgress ?? 0)}
                </Typography>
                <Typography variant='caption'>/</Typography>
                <Typography variant='caption'>
                  {secondsToMinutesString(playerState?.video.durationSeconds ?? 0)}
                </Typography>
              </div>
            </div>
          </div>
          <div className='fixed flex-col w-full bottom-0'>
            <div className='h-[5px] w-full bg-zinc-500'>
              <Slider
                max={playerState?.video?.durationSeconds ?? 0}
                step={1}
                color='red-600'
                value={musicProgress}
                onValueChange={(value: number[]) => {
                  setChangingProgress(true);
                  setProgress(value);
                }}
                onValueCommit={(value) => {
                  setChangingProgress(false);
                  sendCommand('seekTo', value);
                }}
              />
            </div>
            <div className='h-[50px] bg-zinc-950/75 rounded-b-md ' onMouseLeave={() => setShowVolume(false)}>
              <div className='flex flex-row h-full w-full'>
                <div className='flex flex-row w-[200px] justify-evenly justify-self-start'>
                  <IconButton disableRipple onClick={() => sendCommand('previous')}>
                    <SkipBack />
                  </IconButton>
                  <IconButton disableRipple onClick={() => sendCommand('playPause')}>
                    {playerState?.player.trackState == VideoState.Paused ? <Play /> : <Pause />}
                  </IconButton>
                  <IconButton disableRipple onClick={() => sendCommand('next')}>
                    <SkipForward />
                  </IconButton>
                </div>
                <div className='flex flex-grow flex-row-reverse pr-2 gap-1'>
                  {!isMuted ? (
                    <IconButton
                      onMouseEnter={() => {
                        setShowVolume(true);
                      }}
                      disableRipple
                      onClick={() => {
                        sendCommand('mute');
                        setMuted(true);
                      }}>
                      <Volume2 />
                    </IconButton>
                  ) : (
                    <IconButton
                      disableRipple
                      onMouseEnter={() => {
                        setShowVolume(true);
                      }}
                      onClick={() => {
                        sendCommand('unmute');
                        setMuted(false);
                      }}>
                      <VolumeX />
                    </IconButton>
                  )}
                  {
                    <Slider
                      max={100}
                      step={1}
                      value={[volume]}
                      color='white'
                      onValueChange={(value: number[]) => {
                        setChangingVolume(true);
                        setVolume(value[0]);
                      }}
                      onValueCommit={(value) => {
                        setChangingVolume(false);
                        sendCommand('setVolume', value);
                      }}
                      className={`${showVolume ? 'w-[90px]' : 'w-[0px]'} transition-all delay-200`}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
