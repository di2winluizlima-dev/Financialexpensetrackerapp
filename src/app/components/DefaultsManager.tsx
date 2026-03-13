import { useState } from 'react';
import { Trash2, X, Plus, Bell } from 'lucide-react';
import { DefaultTransaction } from '../types/finance';

interface DefaultsManagerProps {
  defaults: DefaultTransaction[];
  onUpdateDefaults: (defaults: DefaultTransaction[]) => void;
  onClose: () => void;
}

export function DefaultsManager({ defaults, onUpdateDefaults, onClose }: DefaultsManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'both' | 'description'>('both');
  const [hasNotification, setHasNotification] = useState(false);
  const [notificationDay, setNotificationDay] = useState('1');

  const handleDelete = (id: string) => {
    onUpdateDefaults(defaults.filter(d => d.id !== id));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) return;

    const numDay = hasNotification ? parseInt(notificationDay) : undefined;

    const newDefault: DefaultTransaction = {
      id: Date.now().toString(),
      description: description.trim(),
      amount: type === 'both' && amount ? parseFloat(amount) : undefined,
      type,
      notificationDay: numDay
    };

    onUpdateDefaults([...defaults, newDefault]);
    setDescription('');
    setAmount('');
    setType('both');
    setHasNotification(false);
    setNotificationDay('1');
    setShowAddForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Lançamentos Padrão</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Estes lançamentos serão aplicados automaticamente em cada novo mês.
      </p>

      {defaults.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum lançamento padrão configurado</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {defaults.map((def) => (
            <div
              key={def.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-800">{def.description}</p>
                  {def.notificationDay && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 rounded-full">
                      <Bell className="w-3 h-3 text-indigo-600" />
                      <span className="text-xs text-indigo-600">
                        Dia {def.notificationDay}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  {def.type === 'both' 
                    ? `Valor fixo: R$ ${def.amount?.toFixed(2)}` 
                    : 'Valor variável'}
                </p>
              </div>
              <button
                onClick={() => handleDelete(def.id)}
                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg py-3 flex items-center justify-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Adicionar Padrão
        </button>
      ) : (
        <form onSubmit={handleAdd} className="space-y-3 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário, Aluguel..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="both"
                checked={type === 'both'}
                onChange={(e) => setType(e.target.value as 'both')}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Valor fixo</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="description"
                checked={type === 'description'}
                onChange={(e) => setType(e.target.value as 'description')}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Valor variável</span>
            </label>
          </div>

          {type === 'both' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Ex: 5000 ou -150"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          )}

          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasNotification}
                onChange={(e) => setHasNotification(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <Bell className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Notificação mensal
              </span>
            </label>

            {hasNotification && (
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dia do mês
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
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 font-medium transition-colors"
            >
              Adicionar
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setDescription('');
                setAmount('');
                setType('both');
                setHasNotification(false);
                setNotificationDay('1');
              }}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-2 font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}