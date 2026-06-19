import type { Metadata } from 'next';

import { QueryProvider } from '@/providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'WearJoy',
  description: 'WearJoy shopping mall client',
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
