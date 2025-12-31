/**
 * Dashboard Summary Component
 * 
 * Displays top-level statistics for the habit tracker:
 * - Total Days
 * - Completed Days (days with at least one completed habit)
 * - Completion Percentage
 * 
 * Updates live when checkboxes are toggled.
 */

interface DashboardSummaryProps {
  totalDays: number;
  completedDays: number;
  completionPercentage: number;
}

export const DashboardSummary = ({
  totalDays,
  completedDays,
  completionPercentage,
}: DashboardSummaryProps) => {
  return (
    <div className="bg-card border border-border p-2 md:p-6 rounded-lg">
      <h2 className="text-sm md:text-lg font-semibold text-foreground mb-2 md:mb-4">
        Progress Dashboard
      </h2>
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {/* Total Days */}
        <div className="bg-muted/50 p-2 md:p-4 rounded-lg">
          <div className="text-[10px] md:text-sm text-muted-foreground mb-0.5 md:mb-1 leading-tight md:leading-normal">Total Days</div>
          <div className="text-base md:text-2xl font-semibold text-foreground leading-tight md:leading-normal">{totalDays}</div>
        </div>

        {/* Completed Days */}
        <div className="bg-muted/50 p-2 md:p-4 rounded-lg">
          <div className="text-[10px] md:text-sm text-muted-foreground mb-0.5 md:mb-1 leading-tight md:leading-normal">Completed Days</div>
          <div className="text-base md:text-2xl font-semibold text-foreground leading-tight md:leading-normal">
            {completedDays}
          </div>
        </div>

        {/* Completion Percentage */}
        <div className="bg-muted/50 p-2 md:p-4 rounded-lg">
          <div className="text-[10px] md:text-sm text-muted-foreground mb-0.5 md:mb-1 leading-tight md:leading-normal">Completion %</div>
          <div className="text-base md:text-2xl font-semibold text-foreground leading-tight md:leading-normal">
            {completionPercentage}%
          </div>
        </div>
      </div>
    </div>
  );
};

