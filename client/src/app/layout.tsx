import { ThemeProvider } from '@/components/theme-provider';
import { CurrentGameProvider } from '@/hook/current-game';
import { GameInfoProvider } from '@/hook/game-info';
import { SocketProvider } from '@/hook/socket-connection';
import { TabController } from '@/page-content/home';
import type { Metadata } from 'next';
import { Open_Sans, Roboto_Mono } from 'next/font/google';
import './globals.css';

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-opensans',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'Zorii Hub',
  description: 'Steam Library Launcher',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${openSans.variable} ${robotoMono.variable} font-sans`}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
          <SocketProvider>
            <GameInfoProvider>
              <CurrentGameProvider>
                <TabController className='z-0'>{children}</TabController>
              </CurrentGameProvider>
            </GameInfoProvider>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
