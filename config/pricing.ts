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
    description: 'Kickstart your journey with some light-hearted fun.',
    features: [
      'Daily dad joke',
      'Monthly pun newsletter',
      "Access to our 'Laughter is the Best Medicine' forum",
      'Random chuckle generator',
      'Joke of the month'
    ],
    monthlyPrice: 900,
    yearlyPrice: 9000
  },
  {
    name: 'Pro',
    description: 'For those who need a steady stream of humor in their lives.',
    features: [
      'Hourly dad jokes',
      'Weekly pun digest',
      "Priority access to 'Laughter is the Best Medicine' forum",
      'Personalized joke recommendations',
      'Monthly comedy podcast',
      "Access to 'The Laugh Library' with 20% more jokes!",
      'Custom joke requests'
    ],
    monthlyPrice: 9900,
    yearlyPrice: 99000
  },
  {
    name: 'Enterprise',
    description: 'For the serious humorist who needs all the laughs.',
    features: [
      'Unlimited dad jokes',
      'Daily pun collection',
      "VIP access to 'Laughter is the Best Medicine' forum",
      'Personalized stand-up routines',
      'Weekly live comedy shows',
      "Access to 'The Laugh Library' (unlimited!)",
      'Jokes on demand',
      "Remove 'Powered by Joke Generator'",
      'Free comedy club membership',
      'Personal comedian hotline'
    ],
    monthlyPrice: 99900,
    yearlyPrice: 999000
  }
];

export default pricingPlans;
