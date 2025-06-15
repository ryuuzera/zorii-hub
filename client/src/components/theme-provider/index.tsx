'use client';

import { createTheme, ThemeProvider as MaterialTheme } from '@mui/material';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { KeepAwake } from 'react-keep-awake';

const materialTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1cbab7',
    },
    secondary: {
      main: '#1c59ba',
    },
  },
});

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <MaterialTheme theme={materialTheme}>
      <NextThemesProvider {...props}>
        <KeepAwake active={true} />
        {children}
      </NextThemesProvider>
    </MaterialTheme>
  );
}
