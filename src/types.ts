import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  paymentMethod: string;
  notes?: string;
}

export interface Subscription {
  id: string;
  name: string;
  category: string;
  bankDetails: string;
  amount: number;
  lastPayment: string;
  billingCycle: 'Monthly' | 'Yearly';
  nextBillDate: string;
  status: 'Active' | 'Paused';
  paymentMethod: string;
}

export interface Budget {
  category: string;
  spent: number;
  limit: number;
  color: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  amount: number;
}

export interface EMI {
  id: string;
  name: string;
  amount: number;
  nextPaymentDate: string;
  status: 'Active' | 'Paid';
  totalTenure: number;
  remainingTenure: number;
}
