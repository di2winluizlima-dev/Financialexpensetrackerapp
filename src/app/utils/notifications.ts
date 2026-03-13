import { Transaction } from '../types/finance';

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('Este navegador não suporta notificações');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function showNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'finance-reminder',
      requireInteraction: false
    });
  }
}

export function checkAndShowDueNotifications(transactions: Transaction[]) {
  const today = new Date().getDate();
  
  transactions.forEach(transaction => {
    if (transaction.notificationDay === today) {
      const notificationKey = `notified_${transaction.id}_${new Date().toDateString()}`;
      
      // Verifica se já notificou hoje
      if (!localStorage.getItem(notificationKey)) {
        const isExpense = transaction.amount < 0;
        const title = isExpense ? '💳 Lembrete de Pagamento' : '💰 Lembrete de Receita';
        const body = `${transaction.description}: R$ ${Math.abs(transaction.amount).toFixed(2)}`;
        
        showNotification(title, body);
        
        // Marca como notificado hoje
        localStorage.setItem(notificationKey, 'true');
      }
    }
  });
}

export function hasNotificationsEnabled(): boolean {
  return Notification.permission === 'granted';
}
