import { Trash2, TrendingUp, TrendingDown, Edit2, Bell } from 'lucide-react';
import { Transaction } from '../types/finance';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

export function TransactionList({ transactions, onDelete, onEdit }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Nenhum lançamento neste mês</p>
        <p className="text-sm mt-2">Adicione receitas e despesas para começar</p>
      </div>
    );
  }

  // Ordenar por data de criação (mais recente primeiro)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-800 mb-3">Lançamentos</h3>
      {sortedTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <div className={`p-2 rounded-full ${
              transaction.amount >= 0 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {transaction.amount >= 0 ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-800">{transaction.description}</p>
                {transaction.notificationDay && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 rounded-full">
                    <Bell className="w-3 h-3 text-indigo-600" />
                    <span className="text-xs text-indigo-600">
                      Dia {transaction.notificationDay}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {new Date(transaction.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className={`font-semibold text-lg ${
              transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {transaction.amount >= 0 ? '+' : ''}R$ {transaction.amount.toFixed(2)}
            </p>
            <button
              onClick={() => onEdit(transaction)}
              className="p-2 rounded-lg hover:bg-indigo-100 text-indigo-600 transition-colors"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onDelete(transaction.id)}
              className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}