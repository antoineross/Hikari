import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { LockIcon, Trash2Icon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import { createClient } from '@/utils/supabase/server';
import {
  getUser,
  getUserDetails,
  getSubscription
} from '@/utils/supabase/queries';
import { redirect } from 'next/navigation';
import { UserAccountNav } from '@/components/user-account-nav';
import { updateName, updateEmail } from '@/utils/auth-helpers/server';

export default async function Component() {
  const supabase = createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }
  const isSubscribed = subscription && subscription.status === 'active';

  return (
    <div className="flex min-h-screen flex-col bg-muted/40 gap-4">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <Card className="flex flex-col gap-4">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateName} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={user.user_metadata.full_name || ''}
                  placeholder="Enter your full name"
                />
              </div>
              <Button type="submit">Update Name</Button>
            </form>
            <form action={updateEmail} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="newEmail">Email</Label>
                <Input
                  id="newEmail"
                  name="newEmail"
                  type="email"
                  defaultValue={user.email}
                  placeholder="Enter your new email"
                />
              </div>
              <Button type="submit">Update Email</Button>
            </form>
          </CardContent>
        </Card>
        {isSubscribed ? (
          <Card className="flex flex-col gap-4 w-full">
            <CardHeader>
              <CardTitle>Your Subscription</CardTitle>
              <CardDescription>
                Manage your subscription details.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="plan">Plan</Label>
                <div className="text-muted-foreground">
                  {subscription.prices.products.name}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="renewal">Next Renewal</Label>
                <div className="text-muted-foreground">
                  {new Date(subscription.current_period_end).toLocaleDateString(
                    'en-US',
                    { month: 'long', day: 'numeric', year: 'numeric' }
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="text-muted-foreground">
                  ${(subscription.prices.unit_amount / 100).toFixed(2)} /{' '}
                  {subscription.prices.interval}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">Status</Label>
                <div className="text-muted-foreground capitalize">
                  {subscription.status}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Manage Subscription</Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="flex flex-col gap-4">
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>
                You're currently not subscribed to any plan. Upgrade now to
                unlock more features.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-medium">Starter Plan</h4>
                  <p className="text-muted-foreground">$9/month</p>
                </div>
                <Link href="/pricing">
                  <Button>Upgrade</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your account security settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <LockIcon className="h-5 w-5" />
                <div>
                  <p className="text-sm font-medium">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account.
                  </p>
                </div>
              </div>
              <Switch id="two-factor-auth" />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trash2Icon className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-medium">Delete Account</p>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete your account and all your data.
                    </p>
                  </div>
                </div>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
