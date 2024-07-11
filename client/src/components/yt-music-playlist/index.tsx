import { YMusicState } from '@/types/response-schemas/yt-music/state';
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from '../ui/command';

interface YTMusicPlaylistProps {
  playerState?: YMusicState;
  sendCommand: (command: string, data?: any) => Promise<void>;
}
export function YTMusicPlaylist({ playerState, sendCommand }: YTMusicPlaylistProps) {
  return (
    <Command className='rounded-lg border shadow-md'>
      <CommandList>
        <CommandEmpty>Nothing playing yet.</CommandEmpty>
        {playerState?.player?.queue?.items && playerState?.player?.queue?.items.length > 0 && (
          <CommandGroup className='text-slate-200' heading='Playlist'>
            {playerState?.player.queue.items.map((song, index) => {
              const selected = playerState?.player.queue.selectedItemIndex == index;
              return (
                <>
                  <CommandItem
                    key={song.videoId}
                    className={`h-20 ${selected ? 'bg-accent text-accent-foreground' : ''} cursor-pointer`}>
                    <div
                      className='flex flex-row w-full items-center'
                      onClick={() => {
                        sendCommand('playQueueIndex', index.toString());
                      }}>
                      <img src={song.thumbnails[0].url} className='w-[65px] mr-3' />
                      <div className='flex flex-col ml-3 gap-2'>
                        <span className='font-bold text-[1.13rem]'>{song.title}</span>
                        <span className='text-[1rem]'>{song.author}</span>
                      </div>
                      <div className='ml-auto text-[1rem] mr-2'>{song.duration}</div>
                    </div>
                  </CommandItem>
                  <CommandSeparator />
                </>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}
