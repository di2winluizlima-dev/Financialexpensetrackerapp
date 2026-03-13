export interface Transaction {
  id: string;
  description: string;
  amount: number;
  monthKey: string;
  createdAt: string;
  notificationDay?: number; // Dia do mês para notificação (1-31)
}

export interface DefaultTransaction {
  id: string;
  description: string;
  amount?: number;
  type: 'both' | 'description';
  notificationDay?: number; // Dia do mês para notificação (1-31)
}