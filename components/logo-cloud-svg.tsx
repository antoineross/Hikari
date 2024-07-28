'use client';
import { useEffect, useState } from 'react';
import {
  StripeSvg,
  NextjsSvg,
  SupabaseSvg,
  VercelSvg,
  GithubSvg
} from '@/components/svg';

export default function LogoCloud() {
  const [primaryColor, setPrimaryColor] = useState('');

  useEffect(() => {
    // Get the computed style of the primary color
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColorValue = rootStyles.getPropertyValue('--primary');
    setPrimaryColor(primaryColorValue.trim());
  }, []);

  return (
    <div>
      <p className="mt-12 text-xs uppercase text-primary text-center font-bold tracking-[0.3em]">
        Trusted by these brands
      </p>
      <div className="grid grid-cols-1 place-items-center justify-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
        <div className="flex items-center justify-center h-15 w-24">
          <a href="https://nextjs.org" aria-label="Next.js Link">
            <NextjsSvg className="size-full" style={{ color: primaryColor }} />
          </a>
        </div>
        <div className="flex items-center justify-center h-15 w-24">
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <VercelSvg className="size-full" style={{ color: primaryColor }} />
          </a>
        </div>
        <div className="flex items-center justify-center h-12 w-24">
          <a href="https://stripe.com" aria-label="stripe.com Link">
            <StripeSvg className="size-full" style={{ color: primaryColor }} />
          </a>
        </div>
        <div className="flex items-center justify-center h-15 w-24">
          <a href="https://supabase.io" aria-label="supabase.io Link">
            <SupabaseSvg
              className="size-full"
              style={{ color: primaryColor }}
            />
          </a>
        </div>
        <div className="flex items-center justify-center h-15 w-24">
          <a href="https://github.com" aria-label="github.com Link">
            <GithubSvg className="size-full" style={{ color: primaryColor }} />
          </a>
        </div>
      </div>
    </div>
  );
}
