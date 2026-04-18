'use client';

import { SocketProvider } from '@/lib/socket-context';

export default function HostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocketProvider>{children}</SocketProvider>;
}
