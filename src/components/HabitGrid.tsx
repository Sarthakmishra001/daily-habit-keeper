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
    month: 'numeric',
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

  // Calculate responsive table width
  const mobileWidth = 120 + totalDays * 36;
  const desktopWidth = 150 + totalDays * 60;
  
  return (
    <div className="w-full overflow-x-auto border border-border bg-card">
      <table className="excel-table w-full" style={{ minWidth: `min(100%, ${mobileWidth}px)` }}>
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-muted text-left font-medium border-r border-border min-w-[120px] md:min-w-[150px] px-2 py-1.5 md:px-4 md:py-3 text-xs md:text-sm">
              Habit
            </th>
            {Array.from({ length: totalDays }, (_, dayIndex) => {
              const date = getDateForDay(dayIndex);
              const isToday = dayIndex === todayIndex;
              return (
                <th
                  key={dayIndex}
                  className={`text-center min-w-[36px] md:min-w-[60px] px-1 py-1.5 md:px-2 md:py-2 ${
                    isToday ? 'bg-emerald-100 dark:bg-emerald-900/40' : ''
                  }`}
                >
                  <div className="flex flex-col items-center leading-tight md:leading-normal">
                    <span className={`text-[10px] md:text-xs ${isToday ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-muted-foreground'}`}>
                      Day {dayIndex + 1}
                    </span>
                    <span className={`text-[9px] md:text-[10px] ${isToday ? 'text-emerald-600 dark:text-emerald-500' : 'text-muted-foreground'}`}>
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
            <tr key={habitIndex} className="hover:bg-muted/30">
              <td className="sticky left-0 z-10 bg-card border-r border-border font-medium text-foreground px-2 py-1.5 md:px-4 md:py-3 text-xs md:text-sm">
                <div className="max-w-[120px] md:max-w-[150px] truncate" title={habit}>
                  {habit}
                </div>
              </td>
              {Array.from({ length: totalDays }, (_, dayIndex) => {
                const isCompleted = completionMatrix[habitIndex]?.[dayIndex] || false;
                const isToday = dayIndex === todayIndex;
                return (
                  <td
                    key={dayIndex}
                    className={`text-center p-0.5 md:p-1 ${
                      isToday ? 'bg-emerald-50 dark:bg-emerald-950/30' : ''
                    }`}
                  >
                    <button
                      onClick={() => onToggleCell(habitIndex, dayIndex)}
                      className={`w-5 h-5 md:w-7 md:h-7 border flex items-center justify-center mx-auto ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
                      }`}
                      aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      {isCompleted && <Check className="w-3 h-3 md:w-4 md:h-4" />}
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
