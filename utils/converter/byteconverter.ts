type Unit = 'B' | 'KB' | 'MB' | 'GB' | 'TB';

export function convertBytes(value: number, fromUnit: Unit, toUnit: Unit): number {
  const units: { [key in Unit]: number } = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
  };

  const valueInBytes = value * units[fromUnit];
  return valueInBytes / units[toUnit];
}
