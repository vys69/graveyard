'use client';

import { ReactNode, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/') {
      router.push('/');
    } else if (session && pathname === '/') {
      router.push('/dashboard');
    }
  }, [session, status, router, pathname]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session && pathname !== '/') {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {session && <Sidebar />}
      <main className="flex-grow">{children}</main>
    </div>
  );
}