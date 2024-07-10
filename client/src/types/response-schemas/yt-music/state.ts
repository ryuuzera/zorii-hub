export type YMusicState = {
  player: Player;
  video: Video;
  playlistId: string;
};

export type Player = {
  trackState: number;
  videoProgress: number;
  volume: number;
  muted: boolean;
  adPlaying: boolean;
  queue: Queue;
};

export type Queue = {
  autoplay: boolean;
  items: Item[];
  automixItems: any[];
  isGenerating: boolean;
  isInfinite: boolean;
  repeatMode: number;
  selectedItemIndex: number;
};

export type Item = {
  thumbnails: Thumbnail[];
  title: string;
  author: string;
  duration: string;
  selected: boolean;
  videoId: string;
  counterparts: Item[] | null;
};

export type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

export type Video = {
  author: string;
  channelId: string;
  title: string;
  album: null;
  albumId: null;
  likeStatus: number;
  thumbnails: Thumbnail[];
  durationSeconds: number;
  id: string;
};
