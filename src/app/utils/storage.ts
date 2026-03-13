import { Transaction, DefaultTransaction } from '../types/finance';

const TRANSACTIONS_PREFIX = 'finance_transactions_';
const DEFAULTS_KEY = 'finance_defaults';

export function getTransactions(monthKey: string): Transaction[] {
  try {
    const data = localStorage.getItem(TRANSACTIONS_PREFIX + monthKey);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(monthKey: string, transactions: Transaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_PREFIX + monthKey, JSON.stringify(transactions));
  } catch (error) {
    console.error('Erro ao salvar transações:', error);
  }
}

export function getDefaults(): DefaultTransaction[] {
  try {
    const data = localStorage.getItem(DEFAULTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveDefaults(defaults: DefaultTransaction[]): void {
  try {
    localStorage.setItem(DEFAULTS_KEY, JSON.stringify(defaults));
  } catch (error) {
    console.error('Erro ao salvar padrões:', error);
  }
}

export function applyDefaultsToMonth(defaults: DefaultTransaction[], monthKey: string): Transaction[] {
  return defaults.map(def => ({
    id: `default_${def.id}_${monthKey}`,
    description: def.description,
    amount: def.amount || 0,
    monthKey,
    createdAt: new Date().toISOString()
  }));
}
