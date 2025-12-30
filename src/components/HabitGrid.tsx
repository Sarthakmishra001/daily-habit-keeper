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
                  className={`min-w-[60px] text-center ${
                    isToday ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-xs ${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                      Day {dayIndex + 1}
                    </span>
                    <span className={`text-[10px] ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
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
                    className={`text-center p-1 ${isToday ? 'bg-primary/5' : ''}`}
                  >
                    <button
                      onClick={() => onToggleCell(habitIndex, dayIndex)}
                      className={`w-7 h-7 rounded border-2 flex items-center justify-center mx-auto transition-all ${
                        isCompleted
                          ? 'bg-accent border-accent text-accent-foreground'
                          : 'border-input bg-background hover:border-primary/50'
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
