import {
  Utensils,
  Fuel,
  ShoppingBag,
  Stethoscope,
  Plane,
  Receipt,
  Film,
  Zap,
  MoreHorizontal
} from 'lucide-react';

export const CATEGORIES = [
  {
    id: 'food',
    name: 'Food',
    icon: Utensils,
    color: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: 'rgba(249, 115, 22, 0.3)',
    description: 'Groceries, Restaurants, Snacks & Dining out'
  },
  {
    id: 'fuel',
    name: 'Fuel',
    icon: Fuel,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
    description: 'Petrol, Diesel, EV Charging & Gas station'
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: ShoppingBag,
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
    description: 'Clothes, Electronics, Footwear & Accessories'
  },
  {
    id: 'medical',
    name: 'Medical',
    icon: Stethoscope,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    description: 'Medicines, Doctor Visits, Health Checkups'
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: Plane,
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    description: 'Flights, Trains, Cabs, Bus & Vacations'
  },
  {
    id: 'bills',
    name: 'Bills',
    icon: Receipt,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    description: 'Electricity, Water, Internet, Rent & Utilities'
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: Film,
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.15)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    description: 'Movies, Concerts, OTT Subscriptions & Gaming'
  },
  {
    id: 'recharge',
    name: 'Recharge',
    icon: Zap,
    color: '#eab308',
    bgColor: 'rgba(234, 179, 8, 0.15)',
    borderColor: 'rgba(234, 179, 8, 0.3)',
    description: 'Mobile Top-up, DTH Recharge, Broadband'
  },
  {
    id: 'others',
    name: 'Others',
    icon: MoreHorizontal,
    color: '#a1a1aa',
    bgColor: 'rgba(161, 161, 170, 0.15)',
    borderColor: 'rgba(161, 161, 170, 0.3)',
    description: 'Miscellaneous, Gifts, Cash & Unexpected Expense'
  }
];

export const getCategoryById = (id) => {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
};
