import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import PricingRounded from './pricing-rounded';

export default async function PricingPage() {
  const supabase = createClient();
  const [user, products] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
  ]);

  const subscription = user ? await getSubscription(supabase, user.id) : null;

  return (
    <PricingRounded
      user={user}
      products={products ?? []}
      subscription={subscription}
    />
  );
}
