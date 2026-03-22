import { Transaction, Subscription, Budget, SavingsGoal, FamilyMember, EMI } from './types';

export const DUMMY_TRANSACTIONS: Transaction[] = [
  { id: '1', merchant: 'Amazon', category: 'Shopping', amount: 4500, date: '2025-08-15', status: 'Completed', paymentMethod: 'HDFC Credit Card' },
  { id: '2', merchant: 'Uber', category: 'Travel', amount: 850, date: '2025-08-14', status: 'Completed', paymentMethod: 'Paytm' },
  { id: '3', merchant: 'Starbucks', category: 'Food', amount: 450, date: '2025-08-14', status: 'Completed', paymentMethod: 'HDFC Credit Card' },
  { id: '4', merchant: 'Zomato', category: 'Food', amount: 1200, date: '2025-08-13', status: 'Completed', paymentMethod: 'ICICI Debit Card' },
  { id: '5', merchant: 'Netflix', category: 'Subscriptions', amount: 649, date: '2025-08-12', status: 'Completed', paymentMethod: 'HDFC Credit Card' },
  { id: '6', merchant: 'Reliance Digital', category: 'Shopping', amount: 15000, date: '2025-08-10', status: 'Pending', paymentMethod: 'HDFC Credit Card' },
];

export const DUMMY_SUBSCRIPTIONS: Subscription[] = [
  { id: '1', name: 'Netflix', category: 'Entertainment', bankDetails: 'HDFC Bank **** 1234', amount: 649, lastPayment: '2025-08-01', billingCycle: 'Monthly', nextBillDate: '2025-09-01', status: 'Active', paymentMethod: 'Credit Card' },
  { id: '2', name: 'Spotify', category: 'Entertainment', bankDetails: 'ICICI Bank **** 5678', amount: 119, lastPayment: '2025-08-05', billingCycle: 'Monthly', nextBillDate: '2025-09-05', status: 'Active', paymentMethod: 'Debit Card' },
  { id: '3', name: 'Apple Music', category: 'Entertainment', bankDetails: 'HDFC Bank **** 1234', amount: 99, lastPayment: '2025-08-10', billingCycle: 'Monthly', nextBillDate: '2025-09-10', status: 'Paused', paymentMethod: 'Credit Card' },
  { id: '4', name: 'Gym Membership', category: 'Health', bankDetails: 'Cash', amount: 2500, lastPayment: '2025-08-01', billingCycle: 'Monthly', nextBillDate: '2025-09-01', status: 'Active', paymentMethod: 'UPI' },
  { id: '5', name: 'Cloud Storage', category: 'Utilities', bankDetails: 'HDFC Bank **** 1234', amount: 130, lastPayment: '2025-08-12', billingCycle: 'Monthly', nextBillDate: '2025-09-12', status: 'Active', paymentMethod: 'Credit Card' },
];

export const DUMMY_EMIS: EMI[] = [
  { id: '1', name: 'Car Loan', amount: 15000, nextPaymentDate: '2025-09-05', status: 'Active', totalTenure: 60, remainingTenure: 42 },
  { id: '2', name: 'Home Loan', amount: 45000, nextPaymentDate: '2025-09-01', status: 'Active', totalTenure: 240, remainingTenure: 180 },
  { id: '3', name: 'iPhone EMI', amount: 5500, nextPaymentDate: '2025-09-10', status: 'Active', totalTenure: 12, remainingTenure: 4 },
];

export const DUMMY_BUDGETS: Budget[] = [
  { category: 'Food', spent: 8500, limit: 12000, color: '#6366f1' },
  { category: 'Shopping', spent: 15000, limit: 10000, color: '#f43f5e' },
  { category: 'Travel', spent: 4200, limit: 5000, color: '#10b981' },
  { category: 'Utilities', spent: 3000, limit: 4000, color: '#f59e0b' },
];

export const DUMMY_SAVINGS: SavingsGoal[] = [
  { id: '1', name: 'New MacBook Pro', target: 180000, current: 45000, deadline: '2025-12-31', icon: 'Laptop' },
  { id: '2', name: 'Europe Trip', target: 500000, current: 120000, deadline: '2026-06-30', icon: 'Plane' },
];

export const DUMMY_FAMILY: FamilyMember[] = [
  { id: '1', name: 'Prashansa', email: 'prashansa@gmail.com', role: 'Admin', avatar: 'https://picsum.photos/seed/prashansa/100/100' },
  { id: '2', name: 'Rahul', email: 'rahul@gmail.com', role: 'Member', avatar: 'https://picsum.photos/seed/rahul/100/100' },
];

export const CATEGORIES = [
  'Food', 'Travel', 'Shopping', 'Utilities', 'Entertainment', 'Subscriptions', 'Salary', 'Investments', 'Health', 'Education', 'Custom'
];

export const MONTHLY_TREND_DATA = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 67000 },
  { month: 'Jul', amount: 72000 },
  { month: 'Aug', amount: 87000 },
  { month: 'Sep', amount: 65000 },
  { month: 'Oct', amount: 58000 },
  { month: 'Nov', amount: 62000 },
  { month: 'Dec', amount: 70000 },
];
