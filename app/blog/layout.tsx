import { marketingConfig } from '@/config/marketing';

import CircularNavigation from '@/components/navigation';
import FooterPrimary from '@/components/footer-blog';
import React from 'react';
import { createClient } from '@/utils/supabase/client';
import { getUser } from '@/utils/supabase/queries';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children
}: MarketingLayoutProps) {
  const supabase = createClient();
  const user = await getUser(supabase);

  return (
    <div className="flex min-h-screen flex-col items-center w-full">
      <CircularNavigation items={marketingConfig.mainNav} user={user ? true : false} />
      <main className="flex-1">{children}</main>
      <FooterPrimary />
    </div>
  );
}
