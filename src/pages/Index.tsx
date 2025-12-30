import { useHabitTracker } from '@/hooks/useHabitTracker';
import { SetupForm } from '@/components/SetupForm';
import { HabitTable } from '@/components/HabitTable';
import { ProgressBar } from '@/components/ProgressBar';
import { RotateCcw } from 'lucide-react';

const Index = () => {
  const {
    isSetup,
    totalDays,
    completedDays,
    completedCount,
    progressPercentage,
    setupTracker,
    toggleDay,
    resetTracker,
    getDateForDay,
  } = useHabitTracker();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-foreground">
              Daily Habit Tracker
            </h1>
            {isSetup && (
              <button
                onClick={resetTracker}
                className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-8">
        {!isSetup ? (
          <SetupForm onSetup={setupTracker} />
        ) : (
          <div className="space-y-6">
            {/* Progress */}
            <ProgressBar
              completedCount={completedCount}
              totalDays={totalDays}
              progressPercentage={progressPercentage}
            />

            {/* Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <HabitTable
                totalDays={totalDays}
                completedDays={completedDays}
                getDateForDay={getDateForDay}
                onToggleDay={toggleDay}
              />
            </div>

            {/* Info */}
            <p className="text-center text-sm text-muted-foreground">
              Your progress is automatically saved to your browser.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
