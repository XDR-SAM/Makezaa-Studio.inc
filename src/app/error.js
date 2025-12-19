'use client';

import { useEffect } from 'react';
import Button from '@/components/common/Button';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-8">
          We're sorry, but something unexpected happened. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" onClick={() => window.location.href = '/'}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

