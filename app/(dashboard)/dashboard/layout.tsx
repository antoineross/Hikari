import Link from 'next/link';
import { NavItem, navConfig, iconComponents } from '@/config/dashboard';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { createClient } from '@/utils/supabase/server';
import {
  getUser,
  getUserDetails,
  getSubscription
} from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';
import {
  LineChart,
  Package,
  Receipt,
  Settings,
  ShieldEllipsis,
  ShoppingCart,
  User,
  Inbox
} from 'lucide-react';
import { Navbar } from '@/components/dashboard-navbar';
import Sidebar from '@/components/dashboard-sidebar';
import { Separator } from '@/components/ui/separator';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const supabase = createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }

  // In case you want to get the current pathname in Server.
  // This corresponds to a middleware setting, copy the middleware in root when you use this.

  // const headersList = headers()
  // const pathname = headersList.get('x-current-path') || ''

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <Sidebar navConfig={navConfig as NavItem[]} />
        <nav className="mt-auto flex flex-col items-center gap-2 px-2 sm:py-5">
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/admin"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <ShieldEllipsis className="h-5 w-5" />
                  <span className="sr-only">Admin</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Admin</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/billing"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <Receipt className="h-5 w-5" />
                  <span className="sr-only">Billing</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Billing</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/account"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <User className="h-5 w-5" />
                  <span className="sr-only">Profile</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/dashboard/settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  prefetch={false}
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Navbar userDetails={userDetails} navConfig={navConfig as NavItem[]} />
        <main className="grid flex-1 items-start p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
