"use client";

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Something went wrong!
        </h2>
        
        <p className="text-slate-600 mb-6">
          We encountered an unexpected error. Please try again.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg text-left">
            <p className="text-xs text-slate-600 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-medium border-2 border-slate-200 hover:border-slate-300 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}