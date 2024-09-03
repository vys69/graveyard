
'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import ClientLayout from './ClientLayout';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ClientLayout>{children}</ClientLayout>
    </SessionProvider>
  );
}