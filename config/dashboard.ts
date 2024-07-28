import {
  LineChart,
  Package,
  Package2,
  Settings,
  ShoppingCart,
  Users2,
  Inbox
} from 'lucide-react';

export interface NavItem {
  href: string;
  icon: keyof typeof iconComponents;
  label: string;
  disabled?: boolean;
}

export const iconComponents = {
  Inbox,
  ShoppingCart,
  Package,
  Users2,
  LineChart
};

export const navConfig = [
  { href: '/dashboard', icon: 'Inbox', label: 'Dashboard' },
  { href: '/dashboard/orders', icon: 'ShoppingCart', label: 'Orders' },
  {
    href: '/dashboard/customer',
    icon: 'Users2',
    label: 'Customers',
    disabled: true
  },
  {
    href: '/dashboard/analytics',
    icon: 'LineChart',
    label: 'Analytics',
    disabled: true
  }
];
