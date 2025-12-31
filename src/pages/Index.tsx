import { useHabitTracker } from '@/hooks/useHabitTracker';
import { SetupForm } from '@/components/SetupForm';
import { HabitGrid } from '@/components/HabitGrid';
import { ProgressBar } from '@/components/ProgressBar';
import { DailyProgress } from '@/components/DailyProgress';
import { DashboardSummary } from '@/components/DashboardSummary';
import { Footer } from '@/components/Footer';
import { RotateCcw } from 'lucide-react';

const Index = () => {
  const {
    isSetup,
    totalDays,
    habits,
    completionMatrix,
    completedCells,
    totalCells,
    progressPercentage,
    completedDays,
    setupTracker,
    toggleCell,
    resetTracker,
    getDateForDay,
    getTodayIndex,
    getDayProgress,
  } = useHabitTracker();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-sm md:text-xl font-semibold text-foreground">
              Daily Habit Tracker
            </h1>
            {isSetup && (
              <button
                onClick={resetTracker}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-8 flex-1">
        {!isSetup ? (
          <SetupForm onSetup={setupTracker} />
        ) : (
          <div className="space-y-2 md:space-y-6">
            {/* Dashboard Summary */}
            <DashboardSummary
              totalDays={totalDays}
              completedDays={completedDays}
              completionPercentage={progressPercentage}
            />

            {/* Daily Progress */}
            <DailyProgress
              todayIndex={getTodayIndex()}
              totalDays={totalDays}
              getDayProgress={getDayProgress}
              getDateForDay={getDateForDay}
            />

            {/* Overall Progress */}
            <ProgressBar
              completedCells={completedCells}
              totalCells={totalCells}
              progressPercentage={progressPercentage}
            />

            {/* Habit Grid */}
            <HabitGrid
              habits={habits}
              totalDays={totalDays}
              completionMatrix={completionMatrix}
              getDateForDay={getDateForDay}
              getTodayIndex={getTodayIndex}
              onToggleCell={toggleCell}
            />

            {/* Info */}
            <p className="text-center text-[10px] md:text-sm text-muted-foreground leading-tight md:leading-normal">
              Your progress is automatically saved to your browser.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
