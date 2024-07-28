// @ts-nocheck
// TODO: Fix this when we turn strict mode on.
import { freePlan, proPlan } from '@/config/subscriptions';
import { createServerSupabaseClient } from '@/supabase-server';
import { UserSubscriptionPlan } from '../types';

export async function getUserSubscriptionPlan(
  userId: string
): Promise<UserSubscriptionPlan> {
  const supabase = createServerSupabaseClient();
  const { data: user } = await supabase
    .from('users')
    .select(
      'stripe_subscription_id, stripe_current_period_end, stripe_customer_id, stripe_price_id'
    )
    .eq('id', userId)
    .single();
  if (!user) {
    throw new Error('User not found');
  }

  // Check if user is on a pro plan.
  const isPro =
    user.stripe_price_id &&
    user.stripe_current_period_end?.getTime() + 86_400_000 > Date.now();

  const plan = isPro ? proPlan : freePlan;

  return {
    ...plan,
    ...user,
    stripe_current_period_end: user.stripe_current_period_end?.getTime(),
    isPro
  };
}
