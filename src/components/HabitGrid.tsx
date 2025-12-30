import { Check } from 'lucide-react';

interface HabitGridProps {
  habits: string[];
  totalDays: number;
  completionMatrix: boolean[][];
  getDateForDay: (dayIndex: number) => Date;
  getTodayIndex: () => number;
  onToggleCell: (habitIndex: number, dayIndex: number) => void;
}

const formatShortDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

export const HabitGrid = ({
  habits,
  totalDays,
  completionMatrix,
  getDateForDay,
  getTodayIndex,
  onToggleCell,
}: HabitGridProps) => {
  const todayIndex = getTodayIndex();

  return (
    <div className="w-full overflow-x-auto border border-border rounded-lg bg-card">
      <table className="excel-table w-full" style={{ minWidth: `${150 + totalDays * 60}px` }}>
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-muted min-w-[150px] text-left">
              Habit
            </th>
            {Array.from({ length: totalDays }, (_, dayIndex) => {
              const date = getDateForDay(dayIndex);
              const isToday = dayIndex === todayIndex;
              return (
                <th
                  key={dayIndex}
                  className={`min-w-[60px] text-center transition-colors ${
                    isToday ? 'bg-emerald-100 dark:bg-emerald-900/40' : ''
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-xs ${isToday ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-muted-foreground'}`}>
                      Day {dayIndex + 1}
                    </span>
                    <span className={`text-[10px] ${isToday ? 'text-emerald-600 dark:text-emerald-500' : 'text-muted-foreground'}`}>
                      {formatShortDate(date)}
                    </span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {habits.map((habit, habitIndex) => (
            <tr key={habitIndex}>
              <td className="sticky left-0 z-10 bg-card border-r border-border font-medium text-foreground">
                <div className="max-w-[150px] truncate" title={habit}>
                  {habit}
                </div>
              </td>
              {Array.from({ length: totalDays }, (_, dayIndex) => {
                const isCompleted = completionMatrix[habitIndex]?.[dayIndex] || false;
                const isToday = dayIndex === todayIndex;
                return (
                  <td
                    key={dayIndex}
                    className={`text-center p-1 transition-colors ${
                      isToday ? 'bg-emerald-50 dark:bg-emerald-950/30' : ''
                    }`}
                  >
                    <button
                      onClick={() => onToggleCell(habitIndex, dayIndex)}
                      className={`w-7 h-7 rounded border-2 flex items-center justify-center mx-auto transition-all duration-200 ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm hover:bg-emerald-600 hover:border-emerald-600'
                          : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 hover:border-emerald-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isCompleted && <Check className="w-4 h-4" />}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
