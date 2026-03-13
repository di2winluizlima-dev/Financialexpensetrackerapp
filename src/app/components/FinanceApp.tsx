import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Calendar, Settings, Check, X, Bell } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { MonthSelector } from './MonthSelector';
import { DefaultsManager } from './DefaultsManager';
import { EditTransactionModal } from './EditTransactionModal';
import { Transaction, DefaultTransaction } from '../types/finance';
import { 
  getTransactions, 
  saveTransactions, 
  getDefaults, 
  saveDefaults,
  applyDefaultsToMonth 
} from '../utils/storage';
import { 
  calculateBalance, 
  getDaysLeftInMonth, 
  getDailyBudget,
  getMonthKey 
} from '../utils/calculations';
import {
  requestNotificationPermission,
  checkAndShowDueNotifications,
  hasNotificationsEnabled
} from '../utils/notifications';

export function FinanceApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [defaults, setDefaults] = useState<DefaultTransaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const monthKey = getMonthKey(currentDate);

  // Carregar dados do localStorage e verificar notificações
  useEffect(() => {
    const savedTransactions = getTransactions(monthKey);
    const savedDefaults = getDefaults();
    
    setTransactions(savedTransactions);
    setDefaults(savedDefaults);

    // Se é um mês novo sem transações, aplicar os padrões
    if (savedTransactions.length === 0 && savedDefaults.length > 0) {
      const newTransactions = applyDefaultsToMonth(savedDefaults, monthKey);
      setTransactions(newTransactions);
      saveTransactions(monthKey, newTransactions);
    }

    // Verificar permissão de notificações
    setNotificationsEnabled(hasNotificationsEnabled());
  }, [monthKey]);

  // Verificar notificações pendentes diariamente
  useEffect(() => {
    if (notificationsEnabled && transactions.length > 0) {
      checkAndShowDueNotifications(transactions);
      
      // Verificar novamente a cada hora
      const interval = setInterval(() => {
        checkAndShowDueNotifications(transactions);
      }, 60 * 60 * 1000); // 1 hora

      return () => clearInterval(interval);
    }
  }, [transactions, notificationsEnabled]);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    
    if (granted) {
      alert('Notificações ativadas! Você receberá lembretes nos dias configurados.');
    } else {
      alert('Permissão de notificação negada. Ative nas configurações do navegador.');
    }
  };

  const handleAddTransaction = (description: string, amount: number, isDefault: boolean, defaultType?: 'both' | 'description', notificationDay?: number) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      description,
      amount,
      monthKey,
      createdAt: new Date().toISOString(),
      notificationDay
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactions(monthKey, updatedTransactions);

    // Se marcado como padrão, adicionar aos padrões
    if (isDefault) {
      const newDefault: DefaultTransaction = {
        id: Date.now().toString(),
        description,
        amount: defaultType === 'both' ? amount : undefined,
        type: defaultType || 'both',
        notificationDay
      };

      const updatedDefaults = [...defaults, newDefault];
      setDefaults(updatedDefaults);
      saveDefaults(updatedDefaults);
    }

    setShowForm(false);
  };

  const handleEditTransaction = (id: string, amount: number, notificationDay?: number) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, amount, notificationDay } : t
    );
    setTransactions(updatedTransactions);
    saveTransactions(monthKey, updatedTransactions);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(monthKey, updatedTransactions);
  };

  const handleUpdateDefaults = (updatedDefaults: DefaultTransaction[]) => {
    setDefaults(updatedDefaults);
    saveDefaults(updatedDefaults);
  };

  const balance = calculateBalance(transactions);
  const daysLeft = getDaysLeftInMonth(currentDate);
  const dailyBudget = getDailyBudget(balance, daysLeft);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Controle Financeiro</h1>
            <div className="flex items-center gap-2">
              {!notificationsEnabled && (
                <button
                  onClick={handleEnableNotifications}
                  className="p-2 rounded-lg hover:bg-yellow-100 text-yellow-600 transition-colors"
                  title="Ativar notificações"
                >
                  <Bell className="w-6 h-6" />
                </button>
              )}
              <button
                onClick={() => setShowDefaults(!showDefaults)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          <MonthSelector 
            currentDate={currentDate} 
            onDateChange={setCurrentDate} 
          />

          {/* Saldo */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Saldo do Mês</p>
                <p className="text-3xl font-bold">
                  R$ {balance.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-white/20 rounded-full">
                {balance >= 0 ? (
                  <TrendingUp className="w-8 h-8" />
                ) : (
                  <TrendingDown className="w-8 h-8" />
                )}
              </div>
            </div>

            {/* Gasto diário disponível */}
            {balance > 0 && daysLeft > 0 && (
              <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-sm opacity-90">
                  Disponível por dia ({daysLeft} dias restantes)
                </p>
                <p className="text-xl font-semibold">
                  R$ {dailyBudget.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Gerenciador de Padrões */}
        {showDefaults && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <DefaultsManager
              defaults={defaults}
              onUpdateDefaults={handleUpdateDefaults}
              onClose={() => setShowDefaults(false)}
            />
          </div>
        )}

        {/* Botão Adicionar */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 shadow-lg mb-4 transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="font-semibold">Adicionar Lançamento</span>
          </button>
        )}

        {/* Formulário */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
            <TransactionForm
              onSubmit={handleAddTransaction}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Lista de Transações */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
            onEdit={setEditingTransaction}
          />
        </div>
      </div>

      {/* Modal de Edição */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onSave={handleEditTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
}