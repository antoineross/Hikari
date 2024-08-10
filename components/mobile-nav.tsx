// components/mobile-nav.tsx

'use client';

import * as React from 'react';
import Link from 'next/link';
import { MainNavItem } from 'types';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button, buttonVariants } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';

interface MobileNavProps {
  items: MainNavItem[];
  children?: React.ReactNode;
  user?: boolean;
}

export function MobileNav({ items, children, user }: MobileNavProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 mx-auto z-50 top-4 w-full grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden'
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.Eclipse />
          <span className="font-bold">Hikari</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm items-center flex text-center">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
                item.disabled && 'cursor-not-allowed opacity-60'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2 mt-4">
          <ModeToggle />
          <Link
            href={user ? '/dashboard' : '/login'}
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              'px-4'
            )}
          >
            {user ? 'Dashboard' : 'Login'}
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
