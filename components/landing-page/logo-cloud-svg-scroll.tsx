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

export default function LogoCloudScroll() {
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
    <div className="logo-cloud-container w-[90vw] items-center justify-center mx-auto my-10">
      <p className="mt-24 text-xs uppercase text-primary text-center font-bold tracking-[0.3em]">
        Built with these brands
      </p>
      <Marquee
        pauseOnHover
        className="[--duration:20s] gap-20 h-20 my-8 logo-cloud"
      >
        {logos}
      </Marquee>
    </div>
  );
}
