export type TaskCategory = 'To-Do' | 'In Progress' | 'Review' | 'Completed';

export type TimeFilter = '1-week' | '2-weeks' | '3-weeks' | 'all';

export interface Task {
  id: string;
  name: string;
  category: TaskCategory;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
}

export interface FilterState {
  categories: TaskCategory[];
  timeFilter: TimeFilter;
  searchQuery: string;
}

export interface DragSelection {
  startDate: Date | null;
  endDate: Date | null;
  isSelecting: boolean;
}
