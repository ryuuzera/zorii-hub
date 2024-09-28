import { fetchPlayerState } from '@/lib/yt-music';
import { ControlCenter } from '@/page-content/control-center';

export default async function ControlCenterPage() {
  const playerStateData = await fetchPlayerState();

  return (
    <>
      <ControlCenter playerStateData={playerStateData} />
    </>
  );
}
