export const ytMusicURL = `http://${process.env.NEXT_PUBLIC_HOST}:9863/api/v1/`;
export const ytMusicToken =
  '3eddafe62a00d870a282019c064a5f1e9f3827a45ad056b5d8ca728385337c5ebc192dd27e6dcdf04107c15b82dc6714e37724bea9eea75162e18fa29b3166528f583942744049647b3560db781865126369ebe06552e225296f5c22d1da9e667ec347561e18c42efa2312b9791995ef92644d93a7edf874f698a78d1749c6a1a28edfa309c7575e69840a627897b82c99074f1515eaaca5d76c16229bbc9bf64b7e3eea6a5c4d42232c93c6a787a52d8f33bacb728e3413680f5fed828d1ae39048322803ef02224f540f537b0ad2b21029dc27e71a3f30b9d564e8b75619baf352b72bccb36aff9482ac5ad3f7b32ee601bb76dac6d016a8a75120c8de8287';

export async function fetchPlayerState() {
  try {
    const res = await fetch(`${ytMusicURL}state`, {
      headers: {
        Authorization: ytMusicToken,
      },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
