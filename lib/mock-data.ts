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

type SubscriptionType = keyof typeof SUBSCRIPTION_PLANS;
type PaymentStatus = 'paid' | 'pending' | 'overdue';
type PickupStatus = 'pending' | 'completed' | 'cancelled';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  subscription_type: SubscriptionType;
  payment_status: PaymentStatus;
  created_at: string;
}

interface Pickup {
  id: string;
  customer_id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: PickupStatus;
  notes?: string;
  created_at: string;
}

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+60123456789',
    address: 'Block A-1-1, Taman Sri Rampai, 53300 Kuala Lumpur',
    subscription_type: 'MONTHLY',
    payment_status: 'paid',
    created_at: '2024-01-15'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+60123456790',
    address: 'Block B-2-3, Taman Melawati, 53100 Kuala Lumpur',
    subscription_type: 'QUARTERLY',
    payment_status: 'pending',
    created_at: '2024-02-01'
  },
  {
    id: '3',
    name: 'Ahmad Abdullah',
    email: 'ahmad@example.com',
    phone: '+60123456791',
    address: 'Block C-3-2, Taman Permata, 53000 Kuala Lumpur',
    subscription_type: 'YEARLY',
    payment_status: 'overdue',
    created_at: '2024-02-15'
  },
  {
    id: '4',
    name: 'Sarah Lee',
    email: 'sarah@example.com',
    phone: '+60123456792',
    address: 'Block D-4-5, Taman Desa, 58100 Kuala Lumpur',
    subscription_type: 'MONTHLY',
    payment_status: 'paid',
    created_at: '2024-03-01'
  },
  {
    id: '5',
    name: 'Raj Kumar',
    email: 'raj@example.com',
    phone: '+60123456793',
    address: 'Block E-1-4, Taman Setiawangsa, 54200 Kuala Lumpur',
    subscription_type: 'YEARLY',
    payment_status: 'paid',
    created_at: '2024-03-10'
  }
];

export const mockPickups: Pickup[] = [
  {
    id: '1',
    customer_id: '1',
    scheduled_date: '2024-03-18',
    scheduled_time: '09:00',
    status: 'pending',
    notes: 'Please ring doorbell twice',
    created_at: '2024-03-17'
  },
  {
    id: '2',
    customer_id: '2',
    scheduled_date: '2024-03-18',
    scheduled_time: '10:30',
    status: 'completed',
    notes: 'Leave at guard house if no one home',
    created_at: '2024-03-17'
  },
  {
    id: '3',
    customer_id: '3',
    scheduled_date: '2024-03-20',
    scheduled_time: '14:00',
    status: 'pending',
    created_at: '2024-03-17'
  },
  {
    id: '4',
    customer_id: '4',
    scheduled_date: '2024-03-20',
    scheduled_time: '15:30',
    status: 'pending',
    notes: 'Call before arrival',
    created_at: '2024-03-17'
  },
  {
    id: '5',
    customer_id: '5',
    scheduled_date: '2024-03-22',
    scheduled_time: '11:00',
    status: 'pending',
    created_at: '2024-03-17'
  }
];

export const mockAnalytics = {
  revenue: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [12400, 13100, 12800, 14200, 13900, 15100]
  },
  customerDistribution: {
    labels: ['Monthly', 'Quarterly', 'Yearly'],
    data: [45, 35, 20]
  },
  pickupCompletion: {
    labels: ['Mon', 'Wed', 'Fri'],
    data: [95, 98, 96]
  },
  metrics: {
    totalCustomers: mockCustomers.length,
    todayPickups: mockPickups.filter(p => p.scheduled_date === '2024-03-18').length,
    monthlyRevenue: mockCustomers.reduce((acc, customer) => {
      return acc + SUBSCRIPTION_PLANS[customer.subscription_type].price;
    }, 0),
    pendingPayments: mockCustomers.filter(c => c.payment_status === 'pending').length
  }
};

export type { Customer, Pickup, SubscriptionType, PaymentStatus, PickupStatus };

// Helper function to check if pickup is available for a given date
export function isPickupAvailable(date: Date): boolean {
  const day = date.getDay();
  // 1 = Monday, 3 = Wednesday, 5 = Friday
  return [1, 3, 5].includes(day);
}

// Helper function to get next available pickup date
export function getNextPickupDate(date: Date = new Date()): Date {
  const nextDate = new Date(date);
  while (!isPickupAvailable(nextDate)) {
    nextDate.setDate(nextDate.getDate() + 1);
  }
  return nextDate;
} 