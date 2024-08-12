import { CitrusIcon, HomeIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { createClient } from '@/utils/supabase/server';
import { getUser, getUserDetails, getSubscription } from '@/utils/supabase/queries';
import { SidebarNav } from "./sidebar-nav";
import { UserAccountNav } from "@/components/user-account-nav";

export async function Sidebar() {
  const supabase = createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  return (
    <aside className="m-5 mr-0 flex flex-col gap-6 rounded-2xl bg-surface-100/70 px-3 pb-3 pt-5">
      <div className="ml-4 flex size-10 items-center text-primary">
        <Link href="/dashboard">
          <CitrusIcon size={24} strokeWidth={1.5} />
        </Link>
      </div>

      <SidebarNav aria-label="Primary navigation">
        <SidebarNav.Item icon={<HomeIcon size={16} />} href="/dashboard">
          Dashboard
        </SidebarNav.Item>

        <SidebarNav aria-label="Secondary navigation">
          <SidebarNav.Item
            icon={<SettingsIcon size={16} />}
            href="/dashboard/billing"
          >
            Billing
          </SidebarNav.Item>
        </SidebarNav>
      </SidebarNav>
      <div className="mt-auto flex flex-col justify-stretch gap-3">
        <UserAccountNav user={userDetails} />
      </div>
    </aside>
  );
}