import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';
import filtersReducer from './slices/filtersSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    filters: filtersReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          'ui/setCurrentDate',
          'ui/openTaskModal',
          'ui/startDragSelection',
          'ui/updateDragSelection',
          'tasks/createTask',
          'tasks/updateTask',
          'tasks/moveTask',
          'tasks/resizeTask',
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.startDate', 'payload.endDate', 'payload.createdAt'],
        // Ignore these paths in state
        ignoredPaths: [
          'tasks.tasks',
          'ui.currentDate',
          'ui.selectedDateRange',
          'ui.dragSelection',
          'ui.editingTask',
          'ui.notifications',
        ],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
