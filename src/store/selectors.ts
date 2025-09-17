import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Task } from '../types';
import { filterTasksByTime, searchTasks, getTasksForDay } from '../utils/dateHelpers';

// Basic selectors
export const selectTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;

export const selectFilters = (state: RootState) => state.filters;
export const selectCategoryFilters = (state: RootState) => state.filters.categories;
export const selectTimeFilter = (state: RootState) => state.filters.timeFilter;
export const selectSearchQuery = (state: RootState) => state.filters.searchQuery;

export const selectCurrentDate = (state: RootState) => state.ui.currentDate;
export const selectIsTaskModalOpen = (state: RootState) => state.ui.isTaskModalOpen;
export const selectIsTaskDetailsModalOpen = (state: RootState) => state.ui.isTaskDetailsModalOpen;
export const selectEditingTaskId = (state: RootState) => state.ui.editingTaskId;
export const selectViewingTaskId = (state: RootState) => state.ui.viewingTaskId;

// Get the actual task objects from the tasks array
export const selectEditingTask = createSelector(
  [selectTasks, selectEditingTaskId],
  (tasks, editingTaskId) => {
   
    
    if (!editingTaskId) {
    
      return null;
    }
    
    // Find the task using string comparison to ensure consistency
  
    const foundTask = tasks.find(task => {
      const match = String(task.id) === String(editingTaskId);
     
      return match;
    });
    
    if (!foundTask) {
      console.error("❌ selectEditingTask - Task not found with ID:", editingTaskId);
      console.error("   Available tasks:", tasks.map(t => ({ id: t.id, name: t.name })));
      return null;
    }
    
   
    
    // Ensure the task has proper Date objects
    const taskWithDates = {
      ...foundTask,
      startDate: foundTask.startDate instanceof Date ? foundTask.startDate : new Date(foundTask.startDate),
      endDate: foundTask.endDate instanceof Date ? foundTask.endDate : new Date(foundTask.endDate),
      createdAt: foundTask.createdAt instanceof Date ? foundTask.createdAt : new Date(foundTask.createdAt),
    };
    
 
    return taskWithDates;
  }
);

export const selectViewingTask = createSelector(
  [selectTasks, selectViewingTaskId],
  (tasks, viewingTaskId) => {
    if (!viewingTaskId) return null;
    return tasks.find(task => task.id === viewingTaskId) || null;
  }
);
export const selectSelectedDateRange = (state: RootState) => state.ui.selectedDateRange;
export const selectDragSelection = (state: RootState) => state.ui.dragSelection;
export const selectIsLoading = (state: RootState) => state.ui.isLoading;
export const selectNotifications = (state: RootState) => state.ui.notifications;

// Computed selectors
export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilters],
  (tasks, filters) => {
    let filtered = tasks;

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((task: Task) => 
        filters.categories.includes(task.category)
      );
    }

    // Filter by time
    filtered = filterTasksByTime(filtered, filters.timeFilter);

    // Filter by search query
    filtered = searchTasks(filtered, filters.searchQuery);

    return filtered;
  }
);

export const selectTasksForDate = createSelector(
  [selectFilteredTasks, (_: RootState, date: Date) => date],
  (tasks, date) => getTasksForDay(tasks, date)
);

export const selectTaskById = createSelector(
  [selectTasks, (_: RootState, taskId: string) => taskId],
  (tasks, taskId) => tasks.find((task: Task) => task.id === taskId)
);

export const selectTasksByCategory = createSelector(
  [selectFilteredTasks],
  (tasks) => {
    const tasksByCategory = {
      'To-Do': [] as Task[],
      'In Progress': [] as Task[],
      'Review': [] as Task[],
      'Completed': [] as Task[],
    };

    tasks.forEach((task: Task) => {
      tasksByCategory[task.category].push(task);
    });

    return tasksByCategory;
  }
);

export const selectTaskStats = createSelector(
  [selectTasks],
  (tasks) => {
    const stats = {
      total: tasks.length,
      byCategory: {
        'To-Do': 0,
        'In Progress': 0,
        'Review': 0,
        'Completed': 0,
      },
      completionRate: 0,
    };

    tasks.forEach((task: Task) => {
      stats.byCategory[task.category]++;
    });

    stats.completionRate = stats.total > 0 
      ? Math.round((stats.byCategory['Completed'] / stats.total) * 100)
      : 0;

    return stats;
  }
);

export const selectUpcomingTasks = createSelector(
  [selectFilteredTasks],
  (tasks) => {
    const now = new Date();
    const upcoming = tasks
      .filter((task: Task) => task.startDate >= now)
      .sort((a: Task, b: Task) => a.startDate.getTime() - b.startDate.getTime())
      .slice(0, 5);

    return upcoming;
  }
);

export const selectOverdueTasks = createSelector(
  [selectFilteredTasks],
  (tasks) => {
    const now = new Date();
    return tasks.filter((task: Task) => 
      task.endDate < now && task.category !== 'Completed'
    );
  }
);

export const selectIsDateInSelection = createSelector(
  [selectDragSelection, (_: RootState, date: Date) => date],
  (dragSelection, date) => {
    if (!dragSelection.startDate || !dragSelection.endDate) return false;
    
    const start = new Date(Math.min(
      dragSelection.startDate.getTime(), 
      dragSelection.endDate.getTime()
    ));
    const end = new Date(Math.max(
      dragSelection.startDate.getTime(), 
      dragSelection.endDate.getTime()
    ));
    
    return date >= start && date <= end;
  }
);
