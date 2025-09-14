import { useState, useMemo } from 'react';
import { format, startOfYear, endOfYear, eachDayOfInterval, isSameDay, addDays, subDays } from 'date-fns';

interface ActivityData {
  date: string;
  count: number;
  level: number; // 0-4 for intensity levels
}

interface ActivityHeatmapProps {
  data: ActivityData[];
  year?: number;
  onDateClick?: (date: string) => void;
}

const ActivityHeatmap = ({ data, year = new Date().getFullYear(), onDateClick }: ActivityHeatmapProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Generate all days for the year
  const yearDays = useMemo(() => {
    const start = startOfYear(new Date(year, 0, 1));
    const end = endOfYear(new Date(year, 0, 1));
    return eachDayOfInterval({ start, end });
  }, [year]);

  // Create a map for quick lookup
  const dataMap = useMemo(() => {
    const map = new Map<string, ActivityData>();
    data.forEach(item => {
      map.set(item.date, item);
    });
    return map;
  }, [data]);

  // Get intensity level for a date
  const getIntensityLevel = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const activityData = dataMap.get(dateStr);
    return activityData?.level || 0;
  };

  // Get activity count for a date
  const getActivityCount = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const activityData = dataMap.get(dateStr);
    return activityData?.count || 0;
  };

  // Generate weeks for the heatmap
  const weeks = useMemo(() => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    // Find the first Sunday of the year
    const firstDay = yearDays[0];
    const firstSunday = subDays(firstDay, firstDay.getDay());
    
    // Start from the first Sunday
    let currentDate = firstSunday;
    
    // Generate 53 weeks (to cover the entire year)
    for (let week = 0; week < 53; week++) {
      const weekDays: Date[] = [];
      for (let day = 0; day < 7; day++) {
        weekDays.push(addDays(currentDate, day));
      }
      weeks.push(weekDays);
      currentDate = addDays(currentDate, 7);
    }
    
    return weeks;
  }, [yearDays]);

  // Get color class based on intensity level
  const getColorClass = (level: number): string => {
    switch (level) {
      case 0: return 'bg-gray-100 border-gray-200';
      case 1: return 'bg-green-100 border-green-200';
      case 2: return 'bg-green-200 border-green-300';
      case 3: return 'bg-green-300 border-green-400';
      case 4: return 'bg-green-400 border-green-500';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  // Get hover color class
  const getHoverColorClass = (level: number): string => {
    switch (level) {
      case 0: return 'hover:bg-gray-200';
      case 1: return 'hover:bg-green-200';
      case 2: return 'hover:bg-green-300';
      case 3: return 'hover:bg-green-400';
      case 4: return 'hover:bg-green-500';
      default: return 'hover:bg-gray-200';
    }
  };

  const handleDateClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    setSelectedDate(dateStr);
    onDateClick?.(dateStr);
  };

  // Calculate statistics
  const totalDays = yearDays.length;
  const activeDays = data.length;
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = subDays(today, i);
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const activityData = dataMap.get(dateStr);
      
      if (activityData && activityData.count > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, [dataMap]);

  const longestStreak = useMemo(() => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    yearDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const activityData = dataMap.get(dateStr);
      
      if (activityData && activityData.count > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });
    
    return maxStreak;
  }, [yearDays, dataMap]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Activity Heatmap</h3>
          <div className="text-sm text-gray-500">
            {year}
          </div>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{activeDays}</div>
            <div className="text-sm text-gray-600">Active Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{currentStreak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{longestStreak}</div>
            <div className="text-sm text-gray-600">Longest Streak</div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Less</span>
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 border rounded-sm ${getColorClass(level)}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-200">
        <div className="flex space-x-1 min-w-max">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col space-y-1">
              {week.map((day, dayIndex) => {
                const level = getIntensityLevel(day);
                const count = getActivityCount(day);
                const dateStr = format(day, 'yyyy-MM-dd');
                const isToday = isSameDay(day, new Date());
                const isSelected = selectedDate === dateStr;
                
                return (
                  <div
                    key={dayIndex}
                    title={`${format(day, 'MMM d, yyyy')} - ${count > 0 ? `${count} activities` : 'No activity'}${level > 0 ? ` (Level ${level})` : ''}`}
                    className={`
                      w-3 h-3 border rounded-sm cursor-pointer transition-all duration-200
                      ${getColorClass(level)}
                      ${getHoverColorClass(level)}
                      ${isToday ? 'ring-2 ring-blue-500 ring-offset-1' : ''}
                      ${isSelected ? 'ring-2 ring-green-500 ring-offset-1' : ''}
                    `}
                    onClick={() => handleDateClick(day)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Month Labels */}
      <div className="flex mt-2 text-xs text-gray-500">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="flex-1 text-center">
            {format(new Date(year, i, 1), 'MMM')}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHeatmap;
