export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    name: 'Monthly',
    price: 30
  },
  QUARTERLY: {
    name: 'Quarterly',
    price: 80
  },
  YEARLY: {
    name: 'Yearly',
    price: 250
  }
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS; 