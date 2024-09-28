import { VideoState, YMusicState } from '@/types/response-schemas/yt-music/state';
import { secondsToMinutesString } from '@/utils/converter/dateformatter';
import { IconButton, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Slider } from '../ui/slider';

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

interface YTMusicPlayerProps {
  playerState?: YMusicState;
  sendCommand: (command: string, data?: any) => Promise<void>;
}
export function YTMusicPlayer({ playerState, sendCommand }: YTMusicPlayerProps) {
  console.log(JSON.stringify(playerState, null, 2));
  const [musicProgress, setProgress] = useState<number[]>([playerState?.player?.videoProgress ?? 0]);
  const glassEffect = 'bg-black rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-85 border';

  const [isChangingProgress, setChangingProgress] = useState<boolean>(false);
  const [isChangingVolume, setChangingVolume] = useState<boolean>(false);
  const [isMuted, setMuted] = useState<boolean>(playerState?.player?.muted ?? false);
  const [volume, setVolume] = useState<number>(playerState?.player?.volume ?? 0);

  useEffect(() => {
    if (!isChangingProgress) setProgress([playerState?.player?.videoProgress ?? 0]);
  }, [playerState?.player?.videoProgress]);

  useEffect(() => {
    if (!isChangingVolume) setVolume(playerState?.player?.volume ?? 0);
  }, [playerState?.player?.volume]);

  return (
    <>
      <div className='flex'>
        <div className='absolute rounded-lg z-0 w-[500px] h-[300px] overflow-hidden opacity-85'>
          <img className='w-[498px] h-[498px] rounded-lg' src={playerState?.video?.thumbnails[0].url ?? ''} />
        </div>
        <div className={`flex flex-col w-[500px] h-[300px] ${glassEffect} z-20 shadow-md`}>
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
                    ? playerState?.video?.thumbnails[1].url
                    : playerState?.video?.thumbnails[0].url
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
            <div className='h-[50px] bg-zinc-950/75 rounded-b-md '>
              <div className='flex flex-row h-full w-full'>
                <div className='flex flex-row w-[200px] justify-evenly justify-self-start'>
                  <IconButton disableRipple onClick={() => sendCommand('previous')}>
                    <SkipBack />
                  </IconButton>
                  <IconButton
                    disableRipple
                    onClick={() => {
                      sendCommand('playPause');
                    }}>
                    {[VideoState.Paused, VideoState.Unknown].includes(playerState?.player.trackState as VideoState) ? (
                      <Play />
                    ) : (
                      <Pause />
                    )}
                  </IconButton>
                  <IconButton disableRipple onClick={() => sendCommand('next')}>
                    <SkipForward />
                  </IconButton>
                </div>
                <div className='flex flex-grow flex-row-reverse pr-2 gap-1'>
                  {!isMuted ? (
                    <IconButton
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
                      onValueChange={(value: number[]) => {
                        setChangingVolume(true);
                        setVolume(value[0]);
                      }}
                      onValueCommit={(value) => {
                        setChangingVolume(false);
                        sendCommand('setVolume', value);
                      }}
                      className={`w-[90px] transition-all delay-200`}
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
