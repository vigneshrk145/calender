import {
  addWeeks,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  isToday,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek
} from 'date-fns';
import { CalendarDay, Task, TimeFilter } from '../types';

export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd'): string => {
  return format(date, formatStr);
};

export const generateCalendarDays = (currentDate: Date): CalendarDay[] => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  return days.map(date => ({
    date,
    isCurrentMonth: isSameMonth(date, currentDate),
    isToday: isToday(date),
    tasks: [],
  }));
};

export const getTasksForDay = (tasks: Task[], date: Date): Task[] => {
  const result = tasks.filter(task => {
    // Ensure task dates are Date objects
    const startDate = task.startDate instanceof Date ? task.startDate : new Date(task.startDate);
    const endDate = task.endDate instanceof Date ? task.endDate : new Date(task.endDate);
    
    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.warn('Invalid task dates:', { task, startDate, endDate });
      return false;
    }
    
    const taskStart = startOfDay(startDate);
    const taskEnd = endOfDay(endDate);
    const checkDate = startOfDay(date);
    
    const isInRange = isWithinInterval(checkDate, {
      start: taskStart,
      end: taskEnd,
    });
    
    // Debug logging for a specific date range to see what's happening
    if (format(date, 'yyyy-MM-dd') >= '2025-07-31' && format(date, 'yyyy-MM-dd') <= '2025-08-21') {
      console.log(`Task "${task.name}" for date ${format(date, 'yyyy-MM-dd')}:`, {
        taskStart: format(taskStart, 'yyyy-MM-dd'),
        taskEnd: format(taskEnd, 'yyyy-MM-dd'),
        checkDate: format(checkDate, 'yyyy-MM-dd'),
        isInRange
      });
    }
    
    return isInRange;
  });
  
  return result;
};

export const filterTasksByTime = (tasks: Task[], timeFilter: TimeFilter): Task[] => {
  if (timeFilter === 'all') return tasks;
  
  const now = startOfDay(new Date());
  const filterWeeks = parseInt(timeFilter.split('-')[0]);
  const filterEnd = endOfDay(addWeeks(now, filterWeeks));
  
  return tasks.filter(task => {
    const taskStart = startOfDay(task.startDate);
    const taskEnd = endOfDay(task.endDate);
    
    // Check if task overlaps with the time range
    return (taskStart <= filterEnd && taskEnd >= now);
  });
};

export const searchTasks = (tasks: Task[], query: string): Task[] => {
  if (!query.trim()) return tasks;
  
  const lowercaseQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.name.toLowerCase().includes(lowercaseQuery)
  );
};

export const getDaysBetween = (startDate: Date, endDate: Date): Date[] => {
  if (isAfter(startDate, endDate)) {
    [startDate, endDate] = [endDate, startDate];
  }
  
  return eachDayOfInterval({
    start: startDate,
    end: endDate,
  });
};

export const isSameDateRange = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

export const formatTaskDateRange = (startDate: Date, endDate: Date): string => {
  if (isSameDay(startDate, endDate)) {
    return format(startDate, 'MMM d, yyyy');
  }
  return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
};

// Format date for HTML date input (YYYY-MM-DD)
export const formatDateForInput = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

// Format date for display (DD/MM/YYYY)
export const formatDateForDisplay = (date: Date): string => {
  return format(date, 'dd/MM/yyyy');
};
