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
    <div ref={containerRef} className="relative overflow-hidden whitespace-nowrap w-full">
      {animate ? (
        <div className="w-full overflow-hidden">
          <motion.div
            className="inline-block"
            initial={{ x: '80%' }}
            animate={{ x: '-100%' }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 12,
            }}>
            <Typography ref={textRef} variant="h6" component="div" className="text-white">
              {text}
            </Typography>
          </motion.div>
        </div>
      ) : (
        <Typography ref={textRef} variant="h6" component="div" className="text-white">
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
  const [musicProgress, setProgress] = useState<number[]>([playerState?.player?.videoProgress ?? 0]);
  const glassEffect = 'bg-black/70 rounded-xl backdrop-blur-lg border border-gray-700 shadow-lg';

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
    <div className="relative">
      {/* Background Album Art */}
      <div className="absolute inset-0 rounded-xl overflow-hidden opacity-30 z-0">
        <img 
          className="w-full h-full object-cover blur-md" 
          src={playerState?.video?.thumbnails[0].url ?? ''} 
          alt="Album cover"
        />
      </div>

      {/* Player Content */}
      <div className={`relative flex flex-col p-4 ${glassEffect} z-10`}>
        {/* Header */}
        <Typography variant="h5" component="div" className="text-white text-center mb-4">
          Now Playing
        </Typography>

        {/* Track Info */}
        <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
          <div className="shrink-0">
            <img
              src={
                playerState?.video?.thumbnails && playerState?.video?.thumbnails?.length > 1
                  ? playerState?.video?.thumbnails[1].url
                  : playerState?.video?.thumbnails[0].url
              }
              className="w-32 h-32 md:w-40 md:h-40 rounded-lg shadow-md"
              alt="Track cover"
            />
          </div>
          
          <div className="flex-1 w-full">
            <Marquee text={playerState?.video?.title} />
            <Typography variant="subtitle1" component="div" className="text-gray-300">
              {playerState?.video?.author}
            </Typography>
            <div className="flex gap-2 text-gray-400 text-sm mt-1">
              <span>{secondsToMinutesString(playerState?.player.videoProgress ?? 0)}</span>
              <span>/</span>
              <span>{secondsToMinutesString(playerState?.video.durationSeconds ?? 0)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
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
            className="w-full"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <IconButton 
              className="text-white hover:bg-white/10"
              onClick={() => sendCommand('previous')}
            >
              <SkipBack size={24} />
            </IconButton>
            
            <IconButton
              className="text-white bg-primary hover:bg-primary/90 p-3"
              onClick={() => sendCommand('playPause')}
            >
              {[VideoState.Paused, VideoState.Unknown].includes(playerState?.player.trackState as VideoState) ? (
                <Play size={24} />
              ) : (
                <Pause size={24} />
              )}
            </IconButton>
            
            <IconButton 
              className="text-white hover:bg-white/10"
              onClick={() => sendCommand('next')}
            >
              <SkipForward size={24} />
            </IconButton>
          </div>
          
          <div className="flex items-center gap-2">
            <IconButton
              className="text-white hover:bg-white/10"
              onClick={() => {
                sendCommand(isMuted ? 'unmute' : 'mute');
                setMuted(!isMuted);
              }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </IconButton>
            
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
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
}