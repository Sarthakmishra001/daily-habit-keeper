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
      <div className="bg-card border border-border p-2 md:p-4 rounded-lg">
        <p className="text-xs md:text-sm text-muted-foreground text-center leading-tight md:leading-normal">
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
    <div className="bg-card border border-border p-2 md:p-4 rounded-lg">
      <div className="flex items-center justify-between mb-1 md:mb-2">
        <span className="text-xs md:text-sm font-medium text-foreground leading-tight md:leading-normal">
          Today's Progress (Day {todayIndex + 1})
        </span>
        <span className="text-xs md:text-sm text-muted-foreground leading-tight md:leading-normal">
          {completed} of {total} habits
        </span>
      </div>
      <div className="w-full h-2 md:h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {completed === total && total > 0 && (
        <p className="text-[10px] md:text-xs text-accent mt-1 md:mt-2 text-center font-medium leading-tight md:leading-normal">
          ✓ All habits completed for today!
        </p>
      )}
    </div>
  );
};
