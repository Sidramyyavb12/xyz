"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

const publicRoutes = ['/', '/about', '/login'];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  
  useEffect(() => {
    const isPublic = publicRoutes.includes(pathname);
    
    if (!isPublic && !isAuthenticated) {
      // Redirect to login if trying to access protected route without auth
      router.push('/login');
    } else if (pathname === '/login' && isAuthenticated) {
      // Redirect to dashboard if already logged in and trying to access login
      router.push('/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  // Show loading state while checking auth
  const isPublic = publicRoutes.includes(pathname);
  if (!isPublic && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>
          <span className="text-slate-600">Loading...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}