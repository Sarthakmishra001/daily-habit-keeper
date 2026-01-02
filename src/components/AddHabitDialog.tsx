import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface AddHabitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddHabit: (habitName: string) => void;
  existingHabits: string[];
}

export const AddHabitDialog = ({
  open,
  onOpenChange,
  onAddHabit,
  existingHabits,
}: AddHabitDialogProps) => {
  const [habitName, setHabitName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = habitName.trim();

    if (!trimmedName) {
      setError('Please enter a habit name');
      return;
    }

    // Check if habit already exists (case-insensitive)
    if (existingHabits.some(h => h.toLowerCase() === trimmedName.toLowerCase())) {
      setError('This habit already exists');
      return;
    }

    onAddHabit(trimmedName);
    setHabitName('');
    setError('');
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setHabitName('');
      setError('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add More Habit
          </DialogTitle>
          <DialogDescription>
            Add a new habit to track. Your progress will be saved automatically.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="habit-name">Habit Name</Label>
              <Input
                id="habit-name"
                placeholder="e.g., Exercise, Reading, Meditation"
                value={habitName}
                onChange={(e) => {
                  setHabitName(e.target.value);
                  setError('');
                }}
                autoFocus
                className={error ? 'border-destructive' : ''}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              <Plus className="w-4 h-4 mr-2" />
              Add Habit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

