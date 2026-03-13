import { Transaction } from '../types/finance';

export function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
}

export function getDaysLeftInMonth(date: Date): number {
  const today = new Date();
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  // Se não é o mês atual, retorna 0
  if (date.getMonth() !== today.getMonth() || date.getFullYear() !== today.getFullYear()) {
    return 0;
  }
  
  const daysLeft = lastDay.getDate() - today.getDate();
  return Math.max(0, daysLeft);
}

export function getDailyBudget(balance: number, daysLeft: number): number {
  if (daysLeft <= 0 || balance <= 0) {
    return 0;
  }
  return balance / daysLeft;
}
