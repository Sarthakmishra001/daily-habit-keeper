import { useState, useEffect, useCallback } from 'react';

interface HabitData {
  startDate: string;
  totalDays: number;
  habits: string[];
  completionMatrix: boolean[][]; // [habitIndex][dayIndex]
}

const STORAGE_KEY = 'daily-habit-tracker-v2';

const getDefaultData = (): HabitData => ({
  startDate: '',
  totalDays: 0,
  habits: [],
  completionMatrix: [],
});

export const useHabitTracker = () => {
  const [data, setData] = useState<HabitData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return getDefaultData();
      }
    }
    return getDefaultData();
  });

  const [isSetup, setIsSetup] = useState(
    data.startDate !== '' && data.totalDays > 0 && data.habits.length > 0
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setupTracker = useCallback((startDate: string, totalDays: number, habits: string[]) => {
    const matrix = habits.map(() => new Array(totalDays).fill(false));
    setData({
      startDate,
      totalDays,
      habits,
      completionMatrix: matrix,
    });
    setIsSetup(true);
  }, []);

  const toggleCell = useCallback((habitIndex: number, dayIndex: number) => {
    setData(prev => {
      const newMatrix = prev.completionMatrix.map(row => [...row]);
      newMatrix[habitIndex][dayIndex] = !newMatrix[habitIndex][dayIndex];
      return { ...prev, completionMatrix: newMatrix };
    });
  }, []);

  const resetTracker = useCallback(() => {
    setData(getDefaultData());
    setIsSetup(false);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getDateForDay = useCallback((dayIndex: number): Date => {
    const start = new Date(data.startDate);
    const date = new Date(start);
    date.setDate(start.getDate() + dayIndex);
    return date;
  }, [data.startDate]);

  // Get today's day index (0-based)
  const getTodayIndex = useCallback((): number => {
    const start = new Date(data.startDate);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [data.startDate]);

  // Get completion count for a specific day
  const getDayProgress = useCallback((dayIndex: number): { completed: number; total: number } => {
    const completed = data.completionMatrix.filter(row => row[dayIndex]).length;
    return { completed, total: data.habits.length };
  }, [data.completionMatrix, data.habits.length]);

  // Overall progress
  const totalCells = data.habits.length * data.totalDays;
  const completedCells = data.completionMatrix.flat().filter(Boolean).length;
  const progressPercentage = totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0;

  return {
    isSetup,
    startDate: data.startDate,
    totalDays: data.totalDays,
    habits: data.habits,
    completionMatrix: data.completionMatrix,
    completedCells,
    totalCells,
    progressPercentage,
    setupTracker,
    toggleCell,
    resetTracker,
    getDateForDay,
    getTodayIndex,
    getDayProgress,
  };
};
