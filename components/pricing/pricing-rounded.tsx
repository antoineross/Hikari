'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card-header';
import type { Tables } from '@/types_db';
import { getCheckoutURL } from '@/utils/lemonsqueezy/server';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { Moon } from 'lucide-react';
import pricingPlans from '@/config/pricing';
import { getSignedCustomerPortalURL } from '@/utils/lemonsqueezy/server';

interface Plan {
  id: number;
  product_id: number;
  product_name: string;
  variant_id: number;
  name: string;
  description: string;
  price: string;
  is_usage_based: boolean;
  interval: string;
  interval_count: number;
  trial_interval: string | null;
  trial_interval_count: number | null;
  sort: number;
}

interface Props {
  user: User | null | undefined;
  products: Plan[];
  subscription: any; // Update this type as needed
}

type BillingInterval = 'year' | 'month';

export default function PricingRounded({
  user,
  products,
  subscription
}: Props) {
  const router = useRouter();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<number>();
  const currentPath = usePathname();

  const sortedProducts = useMemo(() => {
    const planOrder = ['Starter', 'Premium', 'Enterprise'];
    return products.sort((a, b) => {
      if (a.interval !== b.interval) {
        return a.interval === 'month' ? -1 : 1;
      }
      return planOrder.indexOf(a.name) - planOrder.indexOf(b.name);
    });
  }, [products]);

  const groupedProducts = useMemo(() => {
    const grouped = sortedProducts.reduce<Record<BillingInterval, Plan[]>>((acc, product) => {
      const interval = product.interval as BillingInterval;
      if (!acc[interval]) {
        acc[interval] = [];
      }
      acc[interval].push(product);
      return acc;
    }, {} as Record<BillingInterval, Plan[]>);
    return grouped;
  }, [sortedProducts]);

  const handleCheckout = async (plan: Plan) => {
    setPriceIdLoading(plan.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signup');
    }

    try {
      if (subscription && subscription.status === 'active') {
        // If user is already subscribed, get the customer portal URL
        const customerPortalURL = await getSignedCustomerPortalURL(subscription.lemon_squeezy_id);
        if (customerPortalURL) {
          window.open(customerPortalURL, '_blank', 'noopener,noreferrer');
        } else {
          throw new Error('Customer portal URL is undefined');
        }
      } else {
        // If user is not subscribed, proceed with checkout
        const checkoutUrl = await getCheckoutURL(plan.variant_id);
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          throw new Error('Checkout URL is undefined');
        }
      }
    } catch (error) {
      console.error('Error getting URL:', error);
      // Handle error (e.g., show error message to user)
    }

    setPriceIdLoading(undefined);
  };

  const displayProducts = groupedProducts[billingInterval] || [];

  return (
    <section className="container mx-auto" id="pricing">
      <div className="flex flex-col items-center justify-center w-full min-h-screen py-10 ">
        <h1 className="text-3xl font-bold text-center">
          Flat pricing, no management fees.
        </h1>
        <p className="mt-2 text-center text-muted-foreground">
          Whether you're one person trying to get ahead or a big firm trying
          to take over the world, we've got a plan for you.
        </p>
        <div className="flex items-center justify-center mt-6 space-x-4">
          <Button
            className="rounded-4xl"
            variant={billingInterval === 'month' ? 'default' : 'outline'}
            onClick={() => setBillingInterval('month')}
          >
            Monthly
          </Button>
          <Button
            className="rounded-4xl"
            variant={billingInterval === 'year' ? 'default' : 'outline'}
            onClick={() => setBillingInterval('year')}
          >
            Yearly
          </Button>
        </div>
        <div className="grid gap-6 mt-10 md:grid-cols-3">
          {displayProducts.map((product) => {
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0
            }).format(parseInt(product.price) / 100);
            const isActive = subscription
              ? product.name === subscription?.plan?.name
              : false;
            const cardBgColor = isActive
              ? 'border-black bg-white text-black'
              : 'bg-white text-black';

            const plan = pricingPlans.find(
              (plan) => plan.name === product.name
            );
            const features = plan ? plan.features : [];

            return (
              <Card
                key={product.id}
                className={`w-full max-w-sm rounded-4xl border-2 ${cardBgColor}`}
              >
                <CardHeader className="rounded-t-4xl">
                  <Moon className="h-8 w-8 text-gray-600" />
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold py-8">{priceString}</div>
                  <p className="mt-2 text-muted-foreground">
                    {product.description}
                  </p>
                  <Button
                    variant="default"
                    type="button"
                    onClick={() => handleCheckout(product)}
                    className="mt-4 w-full rounded-4xl"
                  >
                    {isActive ? 'Manage' : (product.price > (subscription?.price ?? 0) ? 'Upgrade' : 'Subscribe')}
                  </Button>
                  <ul className="mt-4 space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckIcon className="text-blue-500" />
                        <span>{feature.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
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