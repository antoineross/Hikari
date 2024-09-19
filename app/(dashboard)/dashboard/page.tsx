import { createClient } from '@/utils/supabase/server';
import {
  getUser,
  getUserDetails,
  getSubscription
} from '@/utils/supabase/queries';
import Posts from '@/components/posts';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = createClient();
  const [user, userDetails] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase)
    ]);

  if (!user) {
    return redirect('/signin');
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 gap-4">
      <Posts user={user} />
    </div>
  );
}
