import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface SetupFormProps {
  onSetup: (startDate: string, totalDays: number) => void;
}

const presetDays = [21, 30, 60, 75, 100];

export const SetupForm = ({ onSetup }: SetupFormProps) => {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [totalDays, setTotalDays] = useState(30);
  const [customDays, setCustomDays] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const days = customDays ? parseInt(customDays, 10) : totalDays;
    if (startDate && days > 0) {
      onSetup(startDate, days);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
          Start Your Habit Tracker
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                required
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Preset Days */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Number of Days
            </label>
            <div className="flex flex-wrap gap-2">
              {presetDays.map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    setTotalDays(days);
                    setCustomDays('');
                  }}
                  className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${
                    totalDays === days && !customDays
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-input text-foreground hover:bg-muted'
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>

          {/* Custom Days */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Or enter custom days
            </label>
            <input
              type="number"
              min="1"
              max="365"
              value={customDays}
              onChange={(e) => setCustomDays(e.target.value)}
              placeholder="Enter number..."
              className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          >
            Create Tracker
          </button>
        </form>
      </div>
    </div>
  );
};
