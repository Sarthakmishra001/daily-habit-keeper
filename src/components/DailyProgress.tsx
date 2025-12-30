interface DailyProgressProps {
  todayIndex: number;
  totalDays: number;
  getDayProgress: (dayIndex: number) => { completed: number; total: number };
  getDateForDay: (dayIndex: number) => Date;
}

export const DailyProgress = ({
  todayIndex,
  totalDays,
  getDayProgress,
  getDateForDay,
}: DailyProgressProps) => {
  const isValidDay = todayIndex >= 0 && todayIndex < totalDays;
  
  if (!isValidDay) {
    const hasNotStarted = todayIndex < 0;
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <p className="text-sm text-muted-foreground text-center">
          {hasNotStarted 
            ? `Your challenge starts on ${getDateForDay(0).toLocaleDateString()}`
            : 'Challenge completed! 🎉'
          }
        </p>
      </div>
    );
  }

  const { completed, total } = getDayProgress(todayIndex);
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Today's Progress (Day {todayIndex + 1})
        </span>
        <span className="text-sm text-muted-foreground">
          {completed} of {total} habits
        </span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {completed === total && total > 0 && (
        <p className="text-xs text-accent mt-2 text-center font-medium">
          ✓ All habits completed for today!
        </p>
      )}
    </div>
  );
};
