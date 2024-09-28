import HardwareMonitor from '@/components/hardwaremonitor';
import { fetchData } from '@/lib/http-utils';
import { HardwareInfo } from '@/types/response-schemas/hardwareinfo';


export default async function HardwareInfoPage() {
  const data = await fetchData<HardwareInfo>('hardwareinfo');

  return (
    <>
      <HardwareMonitor data={data} />
    </>
  );
}
