type dataType = 'steam' | 'hardwareinfo' | 'steam/recent';

export async function fetchData<T>(type: dataType) {
  try {
    const result = await fetch(`http://${process.env.NEXT_PUBLIC_HOST}:${process.env.NEXT_PUBLIC_PORT}/api/${type}`, {
      cache: 'no-cache',
    });
    if (result.ok) {
      return (await result.json()) as T;
    }
    return null;
  } catch {
    return null;
  }
}
