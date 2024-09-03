import { ReactNode } from 'react';
import './globals.css';
import ClientWrapper from '@/components/ClientWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}