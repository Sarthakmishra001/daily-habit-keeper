interface ProgressBarProps {
  completedCells: number;
  totalCells: number;
  progressPercentage: number;
}

export const ProgressBar = ({
  completedCells,
  totalCells,
  progressPercentage,
}: ProgressBarProps) => {
  return (
    <div className="w-full bg-card border border-border p-2 md:p-4 rounded-lg">
      <div className="flex items-center justify-between mb-1 md:mb-3">
        <span className="text-xs md:text-sm font-medium text-foreground leading-tight md:leading-normal">Overall Progress</span>
        <span className="text-xs md:text-sm font-semibold text-foreground leading-tight md:leading-normal">
          {completedCells} / {totalCells} checkboxes
        </span>
      </div>
      <div className="w-full h-2 md:h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="mt-0.5 md:mt-2 text-right">
        <span className="text-[10px] md:text-xs text-muted-foreground leading-tight md:leading-normal">
          {progressPercentage}% complete
        </span>
      </div>
    </div>
  );
};
