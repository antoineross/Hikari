'use client';

import { useState, useEffect } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import Link from 'next/link';
import {
  LineChart,
  Package,
  Package2,
  Eclipse,
  ShoppingCart,
  Users2,
  Inbox
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { NavItem, iconComponents } from '@/config/dashboard';

const Sidebar = ({ navConfig }: { navConfig: NavItem[] }) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
      <TooltipProvider>
        <Link
          href="/"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          prefetch={false}
        >
          <Eclipse className="h-5 w-5 transition-all group-hover:scale-110" />
          <span className="sr-only">Hikari Inc</span>
        </Link>
        {navConfig.map((item, index) => {
          const IconComponent =
            iconComponents[item.icon as keyof typeof iconComponents];
          const isActive = pathname === item.href;
          const isDisabled = item.disabled;
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8 ${
                    isDisabled
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {isDisabled ? (
                    <IconComponent className="h-5 w-5 opacity-50" />
                  ) : (
                    <Link
                      href={item.href}
                      className="flex h-full w-full items-center justify-center"
                      prefetch={false}
                    >
                      <IconComponent className="h-5 w-5" />
                    </Link>
                  )}
                  <span className="sr-only">{item.label}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isDisabled ? `${item.label} (Disabled)` : item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </nav>
  );
};

export default Sidebar;
