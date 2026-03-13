export interface Transaction {
  id: string;
  description: string;
  amount: number;
  monthKey: string;
  createdAt: string;
}

export interface DefaultTransaction {
  id: string;
  description: string;
  amount?: number;
  type: 'both' | 'description';
}
