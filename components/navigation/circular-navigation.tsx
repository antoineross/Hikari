'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { MainNavItem } from 'types';
import { cn } from '@/lib/utils';
import { MobileNav } from '@/components/mobile-nav';
import { Icons } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { siteConfig } from '@/config/site';

interface CircularNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
  user?: boolean;
}

export default function CircularNavigation({
  items,
  children,
  user
}: CircularNavProps) {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <nav className="flex items-center justify-between w-full md:w-fit p-1 gap-20 bg-zinc-50 dark:bg-zinc-900 rounded-full px-8 border-2 border-muted/30 dark:border-muted/80 shadow-md mx-auto mt-4">
      <div className="flex items-center space-x-2">
        <div className="bg-slate-50 dark:bg-slate-900 p-1 rounded-full">
          <Icons.Eclipse />
        </div>
        <span className="text-xl font-bold">{siteConfig.name}</span>
      </div>
      {items?.length ? (
        <div className="hidden md:flex space-x-6">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'text-primary transition-colors hover:text-foreground/80',
                item.href.startsWith(`/${segment}`)
                  ? 'text-foreground'
                  : 'text-foreground/60',
                item.disabled && 'cursor-not-allowed opacity-80'
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      ) : null}
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <Link
          href={user ? '/dashboard' : '/signin'}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'md' }),
            'rounded-2xl p-5'
          )}
        >
          {user ? 'Dashboard' : 'Login'}
        </Link>
        <button
          className="md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <Icons.close /> : <Icons.logo />}
          <span className="font-bold">Menu</span>
        </button>
      </div>
      {showMobileMenu && items && (
        <MobileNav items={items}>{children}</MobileNav>
      )}
    </nav>
  );
}
