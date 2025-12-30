import { Check } from 'lucide-react';

interface HabitTableProps {
  totalDays: number;
  completedDays: boolean[];
  getDateForDay: (dayIndex: number) => Date;
  onToggleDay: (dayIndex: number) => void;
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const HabitTable = ({
  totalDays,
  completedDays,
  getDateForDay,
  onToggleDay,
}: HabitTableProps) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="w-full overflow-x-auto">
      <table className="excel-table w-full min-w-[400px]">
        <thead>
          <tr>
            <th className="w-20 text-center">Day</th>
            <th className="w-40">Date</th>
            <th className="w-24 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: totalDays }, (_, index) => {
            const date = getDateForDay(index);
            const isCompleted = completedDays[index];
            const isToday = date.toDateString() === today.toDateString();
            const isPast = date < today;

            return (
              <tr
                key={index}
                className={`${isCompleted ? 'completed' : ''} ${
                  isToday ? 'ring-2 ring-primary ring-inset' : ''
                }`}
              >
                <td className="text-center font-medium">
                  <span className="text-foreground">Day {index + 1}</span>
                </td>
                <td>
                  <span className={isToday ? 'font-semibold text-primary' : 'text-foreground'}>
                    {formatDate(date)}
                    {isToday && (
                      <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Today
                      </span>
                    )}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    onClick={() => onToggleDay(index)}
                    className={`w-8 h-8 rounded border-2 flex items-center justify-center mx-auto transition-all ${
                      isCompleted
                        ? 'bg-accent border-accent text-accent-foreground animate-check-bounce'
                        : 'border-input bg-background hover:border-primary/50'
                    }`}
                    aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {isCompleted && <Check className="w-5 h-5" />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
