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
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Progress Dashboard
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Days */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Days</div>
          <div className="text-2xl font-bold text-foreground">{totalDays}</div>
        </div>

        {/* Completed Days */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Completed Days</div>
          <div className="text-2xl font-bold text-foreground">
            {completedDays}
          </div>
        </div>

        {/* Completion Percentage */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Completion %</div>
          <div className="text-2xl font-bold text-foreground">
            {completionPercentage}%
          </div>
        </div>
      </div>
    </div>
  );
};

