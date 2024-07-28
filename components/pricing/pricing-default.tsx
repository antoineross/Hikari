'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import pricingPlans from '@/config/pricing';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signup');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-primary">
        <div className="container mx-auto rounded-lg bg-white p-6">
          <h1 className="text-4xl font-bold text-center">
            Simple pricing, for everyone.
          </h1>
          <p className="mt-2 text-lg text-muted-foreground text-center">
            It doesn't matter what size your business is, our software won't
            work well for you.
          </p>
          <div className="flex w-fit mx-auto p-3 items-center gap-4 mt-6 justify-center rounded-3xl">
            <Button
              variant={billingInterval === 'month' ? 'default' : 'outline'}
              onClick={() => setBillingInterval('month')}
            >
              Monthly
            </Button>
            <Button
              variant={billingInterval === 'year' ? 'default' : 'outline'}
              onClick={() => setBillingInterval('year')}
            >
              Yearly
            </Button>
          </div>
          <div className="grid gap-8 mt-8 md:grid-cols-3 justify-center">
            {products.map((product) => {
              const price = product?.prices?.find(
                (price) => price.interval === billingInterval
              );
              if (!price) return null;
              const priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currency!,
                minimumFractionDigits: 0
              }).format((price?.unit_amount || 0) / 100);
              const isActive = subscription
                ? product.name === subscription?.prices?.products?.name
                : false;
              const cardBgColor = isActive
                ? 'border-black bg-white text-black'
                : 'bg-white text-black';

              // Use features from the pricingPlans config
              const plan = pricingPlans.find(
                (plan) => plan.name === product.name
              );
              const features = plan ? plan.features : [];

              return (
                <Card
                  key={product.id}
                  className={`p-6 ${cardBgColor} text-center`}
                >
                  <div className="text-5xl font-bold">{priceString}</div>
                  <div className="mt-2 text-xl font-semibold">
                    {product.name}
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    {product.description}
                  </p>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => handleStripeCheckout(price)}
                    className="block w-full py-2 mt-8 text-sm font-semibold text-center"
                  >
                    {subscription ? 'Manage' : 'Subscribe'}
                  </Button>
                  <ul className="mt-6 space-y-2 text-left">
                    {features.map((feature: any, index: any) => (
                      <li key={index} className="flex items-center">
                        <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
