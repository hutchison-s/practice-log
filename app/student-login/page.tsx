'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import PageTitle from '../ui/components/PageTitle';
import { Loader } from 'lucide-react';
import { useUser } from '../_usercontext/useUser';
import { useEffect, useState } from 'react';

function Page() {
  const { login } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const time = searchParams.get('time');
  const code = searchParams.get('code');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!time || !code) {
      setError('Missing QR code parameters.');
      setIsLoading(false);
      return;
    }

    const init = async () => {
      try {
        const response = await fetch(`/api/auth/qr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ time, code }),
        });

        if (!response.ok) {
          throw new Error('Failed to verify QR code.');
        }

        const { data, message } = await response.json();

        if (!data) {
          setError('Invalid QR code.');
          setIsLoading(false);
          return;
        }

        console.log(message);
        login(data);
        router.push(`/students/${data.id}/log`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading) {
    return (
      <main className="mt-[60px] w-full min-h-full flex flex-col justify-start items-center gap-4 px-3 pt-8 pb-12 md:px-40 md:py-12">
        <PageTitle>
          Verifying QR Code
        </PageTitle>
        <div className="w-full min-h-80 mx-auto mt-8 grid place-items-center">
          <Loader aria-label="Loader" size={120} className="spinner" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mt-[60px] w-full min-h-full flex flex-col justify-start items-center gap-4 px-3 pt-8 pb-12 md:px-40 md:py-12">
        <PageTitle>Error</PageTitle>
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return null;
}

export default Page;
