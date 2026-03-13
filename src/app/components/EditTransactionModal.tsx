import { useState } from 'react';
import { X, Check, Bell, BellOff } from 'lucide-react';
import { Transaction } from '../types/finance';

interface EditTransactionModalProps {
  transaction: Transaction;
  onSave: (id: string, amount: number, notificationDay?: number) => void;
  onClose: () => void;
}

export function EditTransactionModal({ transaction, onSave, onClose }: EditTransactionModalProps) {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [hasNotification, setHasNotification] = useState(!!transaction.notificationDay);
  const [notificationDay, setNotificationDay] = useState(
    transaction.notificationDay?.toString() || '1'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return;
    }

    const numDay = hasNotification ? parseInt(notificationDay) : undefined;
    
    if (hasNotification && (numDay === undefined || numDay < 1 || numDay > 31)) {
      alert('Por favor, escolha um dia válido (1-31)');
      return;
    }

    onSave(transaction.id, numAmount, numDay);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Editar Lançamento</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={transaction.description}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              autoFocus
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasNotification}
                onChange={(e) => setHasNotification(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Ativar notificação mensal
              </span>
            </label>

            {hasNotification && (
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dia do mês para lembrete
                </label>
                <select
                  value={notificationDay}
                  onChange={(e) => setNotificationDay(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>
                      Dia {day}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Você receberá uma notificação todo dia {notificationDay} do mês
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <Check className="w-5 h-5" />
              Salvar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-3 flex items-center justify-center gap-2 font-medium transition-colors"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
