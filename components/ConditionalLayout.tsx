"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ProtectedRoute from './ProtectedRoute';

const publicRoutes = ['/', '/about', '/login'];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isPublicRoute) {
    return <ProtectedRoute>{children}</ProtectedRoute>;
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-4 md:p-6 bg-slate-50">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}