import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, TaskCategory, FilterState, TimeFilter } from '../types';
import { filterTasksByTime, searchTasks } from '../utils/dateHelpers';

const STORAGE_KEY = 'task-planner-tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    categories: ['To-Do', 'In Progress', 'Review', 'Completed'],
    timeFilter: 'all',
    searchQuery: '',
  });

  

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => {
          // Ensure proper date parsing with validation
          const startDate = new Date(task.startDate);
          const endDate = new Date(task.endDate);
          const createdAt = new Date(task.createdAt);
          
          // Validate dates
          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || isNaN(createdAt.getTime())) {
            console.warn('Invalid date found in task:', task);
            return null;
          }
          
          return {
            ...task,
            startDate,
            endDate,
            createdAt,
          };
        }).filter(Boolean); // Remove any null tasks
        
        console.log('Loaded tasks from localStorage:', parsedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Apply filters whenever tasks or filters change
  useEffect(() => {
    let filtered = tasks;

    // Filter by categories
    filtered = filtered.filter(task => 
      filters.categories.includes(task.category)
    );

    // Filter by time
    filtered = filterTasksByTime(filtered, filters.timeFilter);

    // Filter by search query
    filtered = searchTasks(filtered, filters.searchQuery);

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const createTask = useCallback((
    name: string,
    category: TaskCategory,
    startDate: Date,
    endDate: Date
  ) => {
    const newTask: Task = {
      id: uuidv4(),
      name,
      category,
      startDate,
      endDate,
      createdAt: new Date(),
    };

    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }, []);

  const moveTask = useCallback((taskId: string, newStartDate: Date, newEndDate: Date) => {
    updateTask(taskId, {
      startDate: newStartDate,
      endDate: newEndDate,
    });
  }, [updateTask]);

  const resizeTask = useCallback((taskId: string, newStartDate: Date, newEndDate: Date) => {
    updateTask(taskId, {
      startDate: newStartDate,
      endDate: newEndDate,
    });
  }, [updateTask]);

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const toggleCategoryFilter = useCallback((category: TaskCategory) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const setTimeFilter = useCallback((timeFilter: TimeFilter) => {
    setFilters(prev => ({ ...prev, timeFilter }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters(prev => ({ ...prev, searchQuery }));
  }, []);

  return {
    tasks,
    filteredTasks,
    filters,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    resizeTask,
    updateFilters,
    toggleCategoryFilter,
    setTimeFilter,
    setSearchQuery,
  };
};
