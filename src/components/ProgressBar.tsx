interface ProgressBarProps {
  completedCount: number;
  totalDays: number;
  progressPercentage: number;
}

export const ProgressBar = ({
  completedCount,
  totalDays,
  progressPercentage,
}: ProgressBarProps) => {
  return (
    <div className="w-full bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-foreground">Progress</span>
        <span className="text-sm font-semibold text-foreground">
          {completedCount} / {totalDays} days
        </span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="mt-2 text-right">
        <span className="text-xs text-muted-foreground">
          {progressPercentage}% complete
        </span>
      </div>
    </div>
  );
};
