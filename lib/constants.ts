export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'monthly',
    name: 'Monthly',
    price: 30,
    description: 'Basic monthly pickup service',
    pickupDays: ['Monday', 'Wednesday', 'Friday']
  },
  QUARTERLY: {
    id: 'quarterly',
    name: 'Quarterly',
    price: 80,
    description: 'Quarterly subscription with priority pickup',
    pickupDays: ['Monday', 'Wednesday', 'Friday']
  },
  YEARLY: {
    id: 'yearly',
    name: 'Yearly',
    price: 250,
    description: 'Annual subscription with premium benefits',
    pickupDays: ['Monday', 'Wednesday', 'Friday']
  }
} as const;

export const PICKUP_DAYS = ['Monday', 'Wednesday', 'Friday'] as const;

export const PAYMENT_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue'
} as const; 