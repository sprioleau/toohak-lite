'use client';

import { SocketProvider } from '@/lib/socket-context';

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocketProvider>{children}</SocketProvider>;
}
