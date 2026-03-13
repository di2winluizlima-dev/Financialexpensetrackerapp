import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function MonthSelector({ currentDate, onDateChange }: MonthSelectorProps) {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const goToCurrentMonth = () => {
    onDateChange(new Date());
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return currentDate.getMonth() === now.getMonth() && 
           currentDate.getFullYear() === now.getFullYear();
  };

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={goToPreviousMonth}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>
      
      <div className="text-center">
        <button
          onClick={goToCurrentMonth}
          className={`text-xl font-semibold ${
            isCurrentMonth() 
              ? 'text-indigo-600' 
              : 'text-gray-800 hover:text-indigo-600'
          } transition-colors`}
        >
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </button>
        {!isCurrentMonth() && (
          <p className="text-xs text-gray-500 mt-1">
            Clique para voltar ao mês atual
          </p>
        )}
      </div>

      <button
        onClick={goToNextMonth}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
}
