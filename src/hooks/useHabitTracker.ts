import { useState, useEffect, useCallback } from 'react';

interface HabitData {
  startDate: string;
  totalDays: number;
  completedDays: boolean[];
}

const STORAGE_KEY = 'daily-habit-tracker';

const getDefaultData = (): HabitData => ({
  startDate: '',
  totalDays: 0,
  completedDays: [],
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

  const [isSetup, setIsSetup] = useState(data.startDate !== '' && data.totalDays > 0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const setupTracker = useCallback((startDate: string, totalDays: number) => {
    setData({
      startDate,
      totalDays,
      completedDays: new Array(totalDays).fill(false),
    });
    setIsSetup(true);
  }, []);

  const toggleDay = useCallback((dayIndex: number) => {
    setData(prev => {
      const newCompletedDays = [...prev.completedDays];
      newCompletedDays[dayIndex] = !newCompletedDays[dayIndex];
      return { ...prev, completedDays: newCompletedDays };
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

  const completedCount = data.completedDays.filter(Boolean).length;
  const progressPercentage = data.totalDays > 0 
    ? Math.round((completedCount / data.totalDays) * 100) 
    : 0;

  return {
    isSetup,
    startDate: data.startDate,
    totalDays: data.totalDays,
    completedDays: data.completedDays,
    completedCount,
    progressPercentage,
    setupTracker,
    toggleDay,
    resetTracker,
    getDateForDay,
  };
};
