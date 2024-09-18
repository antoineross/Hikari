'use client';

import * as React from 'react';
import Link from 'next/link';
import { MainNavItem } from 'types';
import { cn } from '@/lib/utils';
import { MobileNav } from '@/components/mobile-nav';
import { Icons } from '@/components/icons';
import { buttonVariants } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { SunIcon } from '@heroicons/react/24/solid'

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
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <nav className="flex flex-wrap items-center justify-between w-full md:w-fit p-2 md:p-1 gap-4 md:gap-20 md:bg-zinc-50 md:dark:bg-zinc-900 md:rounded-full md:px-8 md:border-2 md:border-muted/30 md:dark:border-muted/80 md:shadow-md mx-auto mt-4 backdrop-blur-sm md:backdrop-blur-none">
      <div className="flex items-center space-x-2">
        <div className="bg-slate-50 dark:bg-slate-900 p-1 rounded-full">
          <SunIcon className="size-8 transition-transform duration-300 ease-in-out hover:scale-110" />
        </div>
        <span className="text-lg md:text-xl font-extrabold tracking-tightest">HIKARI</span>
      </div>
      {items?.length ? (
        <div className="hidden md:flex space-x-6">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'text-primary transition-colors hover:text-foreground/80',
                item.disabled && 'cursor-not-allowed opacity-80'
              )}
            >
              {item.title}
            </Link>
          ))}
        </div>
      ) : null}
      <div className="flex items-center space-x-2">
        <div className="hidden md:block">
          <ModeToggle />
        </div>
        <Link
          href={user ? '/dashboard' : '/signin'}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'rounded-full p-2 md:p-5 text-xs md:text-sm hidden md:inline-flex'
          )}
        >
          {user ? 'Dashboard' : 'Login'}
        </Link>
        <button
          className="md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <Icons.close /> : <Icons.Menu />}
          <span className="sr-only">Menu</span>
        </button>
      </div>
      {showMobileMenu && items && (
        <div className="absolute top-full left-0 right-0 w-full md:hidden mt-2">
          <MobileNav items={items}>{children}</MobileNav>
        </div>
      )}
    </nav>
  );
}