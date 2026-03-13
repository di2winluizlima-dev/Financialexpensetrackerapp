import { useState } from 'react';
import { Check, X } from 'lucide-react';

interface TransactionFormProps {
  onSubmit: (description: string, amount: number, isDefault: boolean, defaultType?: 'both' | 'description') => void;
  onCancel: () => void;
}

export function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [defaultType, setDefaultType] = useState<'both' | 'description'>('both');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !amount) {
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return;
    }

    onSubmit(description.trim(), numAmount, isDefault, defaultType);
    setDescription('');
    setAmount('');
    setIsDefault(false);
    setDefaultType('both');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descrição
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Salário, Aluguel, Conta de luz..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor (positivo para receita, negativo para despesa)
        </label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ex: 5000 ou -150"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Usar como padrão mensal
          </span>
        </label>

        {isDefault && (
          <div className="ml-6 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="defaultType"
                value="both"
                checked={defaultType === 'both'}
                onChange={(e) => setDefaultType(e.target.value as 'both')}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                Descrição e valor fixos
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="defaultType"
                value="description"
                checked={defaultType === 'description'}
                onChange={(e) => setDefaultType(e.target.value as 'description')}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">
                Apenas descrição (valor varia)
              </span>
            </label>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <Check className="w-5 h-5" />
          Adicionar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-3 flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <X className="w-5 h-5" />
          Cancelar
        </button>
      </div>
    </form>
  );
}
