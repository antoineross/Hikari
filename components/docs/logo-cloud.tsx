'use client';

import { useEffect, useState } from 'react';
import {
  StripeSvg,
  NextjsSvg,
  SupabaseSvg,
  VercelSvg,
  GithubSvg
} from '@/components/svg';
import Marquee from '@/components/magicui/marquee';

export const LogoCloud = () => {
  const [primaryColor, setPrimaryColor] = useState('');

  useEffect(() => {
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
            <SupabaseSvg className="size-full" style={{ color: primaryColor }} />
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
};

export const LogoCloudScroll = () => {
  const [primaryColor, setPrimaryColor] = useState('');

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const primaryColorValue = rootStyles.getPropertyValue('--primary');
    setPrimaryColor(primaryColorValue.trim());
  }, []);

  const logos = [
    <NextjsSvg
      key="nextjs"
      className="size-full items-center mx-auto"
      style={{ color: primaryColor }}
    />,
    <VercelSvg
      key="vercel"
      className="size-full items-center mx-auto"
      style={{ color: primaryColor }}
    />,
    <StripeSvg
      key="stripe"
      className="size-full items-center"
      style={{ color: primaryColor }}
    />,
    <SupabaseSvg
      key="supabase"
      className="size-full items-center mx-auto"
      style={{ color: primaryColor }}
    />,
    <GithubSvg
      key="github"
      className="size-full items-center mx-auto"
      style={{ color: primaryColor }}
    />
  ];

  return (
    <div className="logo-cloud-container items-center justify-center mx-auto my-10">
      <p className="mt-24 text-xs uppercase text-primary text-center font-bold tracking-[0.3em]">
        Trusted by these brands
      </p>
      <Marquee
        pauseOnHover
        className="[--duration:20s] gap-20 h-20 my-8 logo-cloud"
      >
        {logos}
      </Marquee>
    </div>
  );
};
