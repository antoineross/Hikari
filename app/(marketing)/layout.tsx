import Link from 'next/link';

import { marketingConfig } from '@/config/marketing';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { MainNav } from '@/components/navigation/navigation';
import FooterBlack from '@/components/footer/footer-black';
import FooterPrimary from '@/components/footer/footer-primary';
import CircularNavigation from '@/components/navigation/circular-navigation';
import Header from '@/components/header';
import React, { createContext } from 'react';

import { getUser } from '../supabase-server';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children
}: MarketingLayoutProps) {
  const user = await getUser();
  return (
    <div className="flex min-h-screen flex-col items-center w-full">
      <Header
        NavigationComponent={CircularNavigation}
        navigationProps={{ items: marketingConfig.mainNav }}
        navType="circular"
        user={user}
      />
      {/* <Header NavigationComponent={MainNav} 
        navigationProps={{ items: marketingConfig.mainNav }} 
        navType="between" 
        user={user} 
      /> */}
      <main className="flex-1">{children}</main>
      <FooterPrimary />
    </div>
  );
}
