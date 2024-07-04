'use client';

import { createTheme, ThemeProvider as MaterialTheme } from '@mui/material';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

const materialTheme = createTheme({ palette: { mode: 'dark' } });

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <MaterialTheme theme={materialTheme}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </MaterialTheme>
  );
}
