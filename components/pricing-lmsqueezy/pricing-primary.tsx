import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';
import PricingDefault from './pricing-default';
import PricingRounded from './pricing-rounded';

export default async function PricingPage() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase)
  ]);

  return (
    <PricingRounded
      user={user}
      products={products ?? []}
      subscription={subscription}
    />

    // <PricingDefault
    //   user={user}
    //   products={products ?? []}
    //   subscription={subscription}
    // />
  );
}
