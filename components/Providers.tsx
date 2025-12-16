"use client";

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { restoreAuth } from '@/store/authSlice';
import ErrorBoundary from './ErrorBoundary';

function AuthRestorer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthRestorer>{children}</AuthRestorer>
      </Provider>
    </ErrorBoundary>
  );
}