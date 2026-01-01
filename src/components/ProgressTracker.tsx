import { useState, useMemo, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Flame, Trophy, ChevronDown, ChevronUp, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ProgressTrackerProps {
  habits: string[];
  completionMatrix: boolean[][];
  startDate: string;
  totalDays: number;
  getDateForDay: (dayIndex: number) => Date;
}

interface HabitStats {
  name: string;
  progress: number; // percentage
  consistency: 'improving' | 'steady' | 'starting';
  activeDays: number; // days with at least one completion
}

interface StreakData {
  current: number;
  best: number;
  status: 'low' | 'growing' | 'strong';
}

// Animated counter component
const AnimatedCounter = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startValue = displayValue;
    const endValue = value;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(startValue + (endValue - startValue) * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(endValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

// Fire animation component for streaks
const FireAnimation = () => (
  <span className="inline-block animate-pulse text-orange-500">🔥</span>
);

// Progress bar component
const ProgressBar = ({ progress }: { progress: number }) => {
  const filled = Math.round(progress / 10);
  const total = 10;
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-0.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-3 w-3 rounded-sm transition-colors',
              i < filled
                ? 'bg-emerald-500 dark:bg-emerald-400'
                : 'bg-muted'
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 ml-2">
        {progress}%
      </span>
    </div>
  );
};

// Consistency indicator
const ConsistencyIndicator = ({ consistency }: { consistency: HabitStats['consistency'] }) => {
  const config = {
    improving: { icon: ArrowUp, text: 'Improving', emoji: '🔼', color: 'text-emerald-600 dark:text-emerald-400' },
    steady: { icon: Minus, text: 'Steady', emoji: '🙂', color: 'text-blue-600 dark:text-blue-400' },
    starting: { icon: TrendingUp, text: 'Starting', emoji: '🌱', color: 'text-teal-600 dark:text-teal-400' },
  };

  const { icon: Icon, text, emoji, color } = config[consistency];

  return (
    <span className={cn('flex items-center gap-1.5 text-sm font-medium', color)}>
      <span>{emoji}</span>
      <span>{text}</span>
    </span>
  );
};

// Encouraging messages
const getEncouragingMessage = (streaks: StreakData, overallProgress: number) => {
  if (streaks.current >= 7) {
    return "You're on fire! Keep the momentum going! 🔥";
  }
  if (streaks.current >= 3) {
    return "You're building consistency! Every day counts 💪";
  }
  if (overallProgress >= 70) {
    return "You're doing great! Keep up the amazing work! ✨";
  }
  if (overallProgress >= 50) {
    return "You're making progress! Every small step counts! 🌟";
  }
  if (streaks.current > 0) {
    return "You're improving day by day! Keep going! 🌱";
  }
  return "Every journey starts with a single step! You've got this! 💪";
};

export const ProgressTracker = ({
  habits,
  completionMatrix,
  startDate,
  totalDays,
  getDateForDay,
}: ProgressTrackerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<'this' | 'last'>('this');
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );

  // Watch for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Calculate habit statistics (positive only)
  const habitStats = useMemo((): HabitStats[] => {
    return habits.map((habit, habitIndex) => {
      const habitRow = completionMatrix[habitIndex] || [];
      
      // Count active days (days with completion)
      const activeDays = habitRow.filter(Boolean).length;
      
      // Calculate progress: completed / active days (only count days where user was active)
      // If no active days, progress is 0
      const progress = activeDays > 0 
        ? Math.round((activeDays / habitRow.length) * 100) 
        : 0;

      // Calculate consistency trend (compare recent vs earlier performance)
      let consistency: HabitStats['consistency'] = 'starting';
      if (habitRow.length >= 7) {
        const recent = habitRow.slice(-7).filter(Boolean).length;
        const earlier = habitRow.slice(-14, -7).filter(Boolean).length;
        
        if (recent > earlier) {
          consistency = 'improving';
        } else if (recent === earlier && recent > 0) {
          consistency = 'steady';
        }
      } else if (activeDays > 0) {
        consistency = 'steady';
      }

      return {
        name: habit,
        progress,
        consistency,
        activeDays,
      };
    });
  }, [habits, completionMatrix]);

  // Calculate streaks with status indicators
  const streaks = useMemo((): StreakData => {
    if (habits.length === 0 || totalDays === 0) {
      return { current: 0, best: 0, status: 'low' };
    }

    // Calculate current streak (consecutive days from today backwards with at least one habit completed)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDateObj = new Date(startDate);
    startDateObj.setHours(0, 0, 0, 0);
    const todayIndex = Math.min(
      Math.floor((today.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)),
      totalDays - 1
    );

    // Count backwards from today
    for (let dayIndex = todayIndex; dayIndex >= 0; dayIndex--) {
      const hasCompletion = completionMatrix.some((row) => row[dayIndex] === true);
      if (hasCompletion) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate best streak
    let bestStreak = 0;
    let currentBest = 0;
    for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
      const hasCompletion = completionMatrix.some((row) => row[dayIndex] === true);
      if (hasCompletion) {
        currentBest++;
        bestStreak = Math.max(bestStreak, currentBest);
      } else {
        currentBest = 0;
      }
    }

    // Determine status
    let status: 'low' | 'growing' | 'strong' = 'low';
    if (currentStreak >= 7) {
      status = 'strong';
    } else if (currentStreak >= 3) {
      status = 'growing';
    }

    return { current: currentStreak, best: bestStreak, status };
  }, [habits, completionMatrix, startDate, totalDays]);

  // Get week data for charts (only active days)
  const weekData = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDay();
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - currentDay);
    if (selectedWeek === 'last') {
      weekStart.setDate(weekStart.getDate() - 7);
    }
    weekStart.setHours(0, 0, 0, 0);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const startDateObj = new Date(startDate);
    startDateObj.setHours(0, 0, 0, 0);

    const activeDaysData: { day: string; count: number }[] = [];

    days.forEach((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      const dayIndex = Math.floor(
        (date.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayIndex >= 0 && dayIndex < totalDays) {
        const count = completionMatrix.filter((row) => row[dayIndex] === true).length;
        if (count > 0) {
          activeDaysData.push({ day, count });
        }
      }
    });

    return {
      labels: activeDaysData.map((d) => d.day),
      data: activeDaysData.map((d) => d.count),
    };
  }, [selectedWeek, startDate, totalDays, completionMatrix]);

  // Calculate overall progress for pie chart
  const overallProgress = useMemo(() => {
    const totalCells = habits.length * totalDays;
    const completedCells = completionMatrix.flat().filter(Boolean).length;
    const completedPercent = totalCells > 0 ? Math.round((completedCells / totalCells) * 100) : 0;
    const remainingPercent = 100 - completedPercent;

    return {
      completed: completedPercent,
      remaining: remainingPercent,
    };
  }, [habits.length, totalDays, completionMatrix]);

  // Encouraging message
  const encouragingMessage = useMemo(
    () => getEncouragingMessage(streaks, overallProgress.completed),
    [streaks, overallProgress.completed]
  );

  // Bar chart configuration (green gradient only)
  const barChartData = useMemo(() => {
    // Generate green gradient colors
    const greenColors = weekData.labels.map((_, i) => {
      const intensity = 0.6 + (i * 0.05); // Varying intensity
      return `rgba(34, 197, 94, ${intensity})`;
    });

    return {
      labels: weekData.labels,
      datasets: [
        {
          label: 'Habits Completed',
          data: weekData.data,
          backgroundColor: greenColors,
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  }, [weekData]);

  // Chart colors based on theme
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const tooltipBg = isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipText = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';

  const barChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: textColor,
        },
        grid: {
          color: gridColor,
        },
      },
      x: {
        ticks: {
          color: textColor,
        },
        grid: {
          display: false,
        },
      },
    },
  }), [isDarkMode, textColor, gridColor, tooltipBg, tooltipText]);

  // Pie chart configuration (Completed % vs Remaining %)
  const pieChartData = useMemo(() => ({
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [overallProgress.completed, overallProgress.remaining],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green for completed
          'rgba(20, 184, 166, 0.3)', // Teal for remaining (lighter)
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(20, 184, 166)',
        ],
        borderWidth: 2,
      },
    ],
  }), [overallProgress]);

  const pieChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 13,
          },
          color: textColor,
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        titleColor: tooltipText,
        bodyColor: tooltipText,
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function (context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  }), [isDarkMode, textColor, tooltipBg, tooltipText]);

  // Streak status colors
  const streakStatusConfig = {
    low: { bg: 'from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-600 dark:text-blue-400' },
    growing: { bg: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-600 dark:text-emerald-400' },
    strong: { bg: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-600 dark:text-orange-400' },
  };

  const currentStreakConfig = streakStatusConfig[streaks.status];

  return (
    <div className="w-full">
      {/* Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full mb-4 flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span className="font-semibold">📊 Track Your Progress</span>
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>

      {/* Stats Panel */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="space-y-4 pb-4">
          {/* Encouraging Message */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800">
            <CardContent className="pt-6">
              <p className="text-center text-sm md:text-base font-medium text-emerald-700 dark:text-emerald-300">
                {encouragingMessage}
              </p>
            </CardContent>
          </Card>

          {/* Streak Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className={cn('bg-gradient-to-br', currentStreakConfig.bg, currentStreakConfig.border)}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm md:text-base flex items-center gap-2">
                  <FireAnimation />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={cn('text-3xl md:text-4xl font-bold', currentStreakConfig.text)}>
                  <AnimatedCounter value={streaks.current} />
                  <span className="text-lg md:text-xl ml-2">days</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  {streaks.status === 'strong' && '🔥 You\'re on fire!'}
                  {streaks.status === 'growing' && '📈 Keep it up!'}
                  {streaks.status === 'low' && '🌱 Building momentum!'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm md:text-base flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  Best Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">
                  <AnimatedCounter value={streaks.best} />
                  <span className="text-lg md:text-xl ml-2">days</span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  Your personal record! 🏆
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Habit Summary Table (Positive Only) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base md:text-lg">Habit Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Habit</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Consistency</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {habitStats.map((stat, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{stat.name}</TableCell>
                        <TableCell>
                          <ProgressBar progress={stat.progress} />
                        </TableCell>
                        <TableCell className="text-right">
                          <ConsistencyIndicator consistency={stat.consistency} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">Visual Analytics</CardTitle>
                <Tabs value={selectedWeek} onValueChange={(v) => setSelectedWeek(v as 'this' | 'last')}>
                  <TabsList>
                    <TabsTrigger value="this" className="text-xs">This Week</TabsTrigger>
                    <TabsTrigger value="last" className="text-xs">Last Week</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Weekly Bar Chart (Only Active Days) */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                    📊 Weekly Habit Completion
                  </h3>
                  {weekData.labels.length > 0 ? (
                    <div className="h-64 md:h-80">
                      <Bar data={barChartData} options={barChartOptions} />
                    </div>
                  ) : (
                    <div className="h-64 md:h-80 flex items-center justify-center text-muted-foreground">
                      <p>No activity this week yet. Start your journey! 🌱</p>
                    </div>
                  )}
                </div>

                {/* Overall Progress Pie Chart */}
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                    🎯 Overall Progress
                  </h3>
                  <div className="h-64 md:h-80">
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
