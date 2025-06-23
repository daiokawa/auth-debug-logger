import { Suspense } from 'react';
import Dashboard from '@/components/Dashboard';
import LoadingState from '@/components/LoadingState';

export default function Home() {
  return (
    <Suspense fallback={<LoadingState />}>
      <Dashboard />
    </Suspense>
  );
}