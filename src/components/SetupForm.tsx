import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface SetupFormProps {
  onSetup: (startDate: string, totalDays: number, habits: string[]) => void;
}

const dayPresets = [21, 30, 60, 75, 100];

const defaultHabits = [
  'Wake up at 6 AM',
  'Drink 3L Water',
  'Gym Workout',
  'Study 2 Hours',
  'No Junk Food',
];

export const SetupForm = ({ onSetup }: SetupFormProps) => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [totalDays, setTotalDays] = useState(30);
  const [habits, setHabits] = useState<string[]>(['']);
  const [useDefaults, setUseDefaults] = useState(false);

  const handleAddHabit = () => {
    setHabits([...habits, '']);
  };

  const handleRemoveHabit = (index: number) => {
    if (habits.length > 1) {
      setHabits(habits.filter((_, i) => i !== index));
    }
  };

  const handleHabitChange = (index: number, value: string) => {
    const newHabits = [...habits];
    newHabits[index] = value;
    setHabits(newHabits);
  };

  const handleUseDefaults = () => {
    setHabits(defaultHabits);
    setUseDefaults(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validHabits = habits.filter(h => h.trim() !== '');
    if (startDate && totalDays > 0 && validHabits.length > 0) {
      onSetup(startDate, totalDays, validHabits);
    }
  };

  const validHabitCount = habits.filter(h => h.trim() !== '').length;

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Setup Your Habit Tracker
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Total Days */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Total Days
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {dayPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTotalDays(preset)}
                  className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                    totalDays === preset
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-foreground border-input hover:border-primary/50'
                  }`}
                >
                  {preset} days
                </button>
              ))}
            </div>
            <input
              type="number"
              value={totalDays}
              onChange={(e) => setTotalDays(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="365"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          {/* Habits */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-foreground">
                Habits ({validHabitCount})
              </label>
              {!useDefaults && (
                <button
                  type="button"
                  onClick={handleUseDefaults}
                  className="text-xs text-primary hover:underline"
                >
                  Use example habits
                </button>
              )}
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {habits.map((habit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={habit}
                    onChange={(e) => handleHabitChange(index, e.target.value)}
                    placeholder={`Habit ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  {habits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHabit(index)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddHabit}
              className="mt-2 flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Plus className="w-4 h-4" />
              Add another habit
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={validHabitCount === 0}
            className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Tracker
          </button>
        </form>
      </div>
    </div>
  );
};
