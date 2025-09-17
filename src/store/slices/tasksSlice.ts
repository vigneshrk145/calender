import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Task, TaskCategory } from '../../types';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

// Helper function to save to localStorage
const saveToLocalStorage = (tasks: Task[]) => {
  try {
    localStorage.setItem('task-planner-tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

// Helper function to load from localStorage
export const loadFromLocalStorage = (): Task[] => {
  try {
    const savedTasks = localStorage.getItem('task-planner-tasks');
    console.log('Loading from localStorage - raw data:', savedTasks);
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      console.log('Loading from localStorage - parsed data:', parsed);
      const tasks = parsed.map((task: any) => {
        // Ensure dates are properly parsed
        const startDate = new Date(task.startDate);
        const endDate = new Date(task.endDate);
        const createdAt = new Date(task.createdAt);
        
        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || isNaN(createdAt.getTime())) {
          console.warn('Invalid date found in task:', task);
          return null;
        }
        
        const processedTask = {
          ...task,
          startDate,
          endDate,
          createdAt,
        };
        console.log('Processed task:', processedTask);
        return processedTask;
      }).filter(Boolean); // Remove any null entries
      console.log('Final tasks array:', tasks);
      return tasks;
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }
  return [];
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    initializeTasks: (state) => {
      state.loading = true;
      const loadedTasks = loadFromLocalStorage();
      console.log("initializeTasks - loaded from localStorage:", loadedTasks);
      state.tasks = loadedTasks;
      state.loading = false;
      console.log("initializeTasks - tasks in state:", state.tasks);
    },
    
    createTask: (state, action: PayloadAction<{
      name: string;
      category: TaskCategory;
      startDate: Date;
      endDate: Date;
    }>) => {
      const { name, category, startDate, endDate } = action.payload;
      const newTask: Task = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name,
        category,
        startDate,
        endDate,
        createdAt: new Date(),
      };
      
      state.tasks.push(newTask);
      saveToLocalStorage(state.tasks);
    },
    
    updateTask: (state, action: PayloadAction<{
      taskId: string;
      updates: Partial<Omit<Task, 'id' | 'createdAt'>>;
    }>) => {
      const { taskId, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates };
        saveToLocalStorage(state.tasks);
      }
    },
    
    deleteTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      state.tasks = state.tasks.filter(task => task.id !== taskId);
      saveToLocalStorage(state.tasks);
    },
    
    moveTask: (state, action: PayloadAction<{
      taskId: string;
      newStartDate: Date;
      newEndDate: Date;
    }>) => {
      const { taskId, newStartDate, newEndDate } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        state.tasks[taskIndex].startDate = newStartDate;
        state.tasks[taskIndex].endDate = newEndDate;
        saveToLocalStorage(state.tasks);
      }
    },
    
    resizeTask: (state, action: PayloadAction<{
      taskId: string;
      newStartDate: Date;
      newEndDate: Date;
    }>) => {
      const { taskId, newStartDate, newEndDate } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === taskId);
      
      if (taskIndex !== -1) {
        state.tasks[taskIndex].startDate = newStartDate;
        state.tasks[taskIndex].endDate = newEndDate;
        saveToLocalStorage(state.tasks);
      }
    },
    
    clearAllTasks: (state) => {
      state.tasks = [];
      localStorage.removeItem('task-planner-tasks');
    },
    
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  initializeTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  resizeTask,
  clearAllTasks,
  setError,
  clearError,
} = tasksSlice.actions;

export default tasksSlice.reducer;
