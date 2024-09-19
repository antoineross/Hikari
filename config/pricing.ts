interface Plan {
  name: string;
  description: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
}

const pricingPlans: Plan[] = [
  {
    name: 'Starter',
    description: 'Kickstart your journey with essential templates and community access.',
    features: [
      'Access to basic template library',
      'Monthly community newsletter',
      "Entry to our 'Template Exchange' forum",
      'Random template suggestions',
      'Template of the month'
    ],
    monthlyPrice: 900,
    yearlyPrice: 9000
  },
  {
    name: 'Pro',
    description: 'For those who need advanced templates and enhanced community engagement.',
    features: [
      'Access to premium template library',
      'Weekly community digest',
      "Priority access to 'Template Exchange' forum",
      'Personalized template recommendations',
      'Monthly expert webinar',
      "Access to exclusive templates with 20% more features!",
      'Custom template requests'
    ],
    monthlyPrice: 9900,
    yearlyPrice: 99000
  },
  {
    name: 'Enterprise',
    description: 'For organizations that require comprehensive templates and dedicated support.',
    features: [
      'Unlimited access to all templates',
      'Daily template updates',
      "VIP access to 'Template Exchange' forum",
      'Personalized consulting sessions',
      'Weekly live Q&A sessions',
      "Access to the complete template library (unlimited!)",
      'Templates on demand',
      "Remove 'Powered by Template Generator'",
      'Free membership to exclusive community events',
      'Dedicated support h2otline'
    ],
    monthlyPrice: 99900,
    yearlyPrice: 999000
  }
];

export default pricingPlans;

import { Tables } from '@/types/db';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}

export const dummyPricing: ProductWithPrices[] = [
  {
    id: 'dummy-basic',
    name: 'Basic Plan',
    description: 'For individuals just getting started',
    prices: [
      {
        id: 'dummy-basic-price-month',
        currency: 'USD',
        unit_amount: 999,
        interval: 'month',
        interval_count: 1,
        trial_period_days: null,
        type: 'recurring',
        active: true,
        product_id: 'dummy-basic'
      },
      {
        id: 'dummy-basic-price-year',
        currency: 'USD',
        unit_amount: 9990,
        interval: 'year',
        interval_count: 1,
        trial_period_days: null,
        type: 'recurring',
        active: true,
        product_id: 'dummy-basic'
      }
    ],
    image: null,
    metadata: null,
    active: null
  },
  {
    id: 'dummy-pro',
    name: 'Pro Plan',
    description: 'For growing businesses',
    prices: [
      {
        id: 'dummy-pro-price-month',
        currency: 'USD',
        unit_amount: 2999,
        interval: 'month',
        interval_count: 1,
        trial_period_days: null,
        type: 'recurring',
        active: true,
        product_id: 'dummy-pro'
      },
      {
        id: 'dummy-pro-price-year',
        currency: 'USD',
        unit_amount: 29990,
        interval: 'year',
        interval_count: 1,
        trial_period_days: null,
        type: 'recurring',
        active: true,
        product_id: 'dummy-pro'
      }
    ],
    image: null,
    metadata: null,
    active: null
  },
  {
    id: 'dummy-enterprise',
    name: 'Enterprise Plan',
    description: 'For large organizations',
    prices: [
      {
        id: 'dummy-enterprise-price-month',
        currency: 'USD',
        unit_amount: 9999,
        interval: 'month',
        interval_count: 1,
        trial_period_days: null,
        type: 'recurring',
        active: true,
        product_id: 'dummy-enterprise'
      },
      {
        id: 'dummy-enterprise-price-year',
        currency: 'USD',
        unit_amount: 99990,
        interval: 'year',
        interval_count: 1,
        trial_period_days: null,
        type: 'recurring',
        active: true,
        product_id: 'dummy-enterprise'
      }
    ],
    image: null,
    metadata: null,
    active: null
  }
];
