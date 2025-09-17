import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  currentDate: Date;
  isTaskModalOpen: boolean;
  isTaskDetailsModalOpen: boolean;
  editingTaskId: string | null;
  viewingTaskId: string | null;
  selectedDateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
  dragSelection: {
    startDate: Date | null;
    endDate: Date | null;
    isSelecting: boolean;
  };
  isLoading: boolean;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    timestamp: Date;
  }>;
}

const initialState: UIState = {
  currentDate: new Date(),
  isTaskModalOpen: false,
  isTaskDetailsModalOpen: false,
  editingTaskId: null,
  viewingTaskId: null,
  selectedDateRange: {
    startDate: null,
    endDate: null,
  },
  dragSelection: {
    startDate: null,
    endDate: null,
    isSelecting: false,
  },
  isLoading: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentDate: (state, action: PayloadAction<Date>) => {
      state.currentDate = action.payload;
    },
    
    goToNextMonth: (state) => {
      const nextMonth = new Date(state.currentDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      state.currentDate = nextMonth;
    },
    
    goToPreviousMonth: (state) => {
      const prevMonth = new Date(state.currentDate);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      state.currentDate = prevMonth;
    },
    
    goToToday: (state) => {
      state.currentDate = new Date();
    },
    
    openTaskModal: (state, action: PayloadAction<{
      startDate: Date;
      endDate: Date;
      taskId?: string;
    }>) => {
      const { startDate, endDate, taskId } = action.payload;
      console.log("🚀 openTaskModal action:");
      console.log("   - taskId:", taskId, "type:", typeof taskId);
      console.log("   - startDate:", startDate);
      console.log("   - endDate:", endDate);
      
      state.isTaskModalOpen = true;
      state.selectedDateRange = { startDate, endDate };
      state.editingTaskId = taskId || null;
      
      console.log("✅ openTaskModal - modal state updated:");
      console.log("   - isTaskModalOpen:", state.isTaskModalOpen);
      console.log("   - editingTaskId:", state.editingTaskId);
    },
    
    closeTaskModal: (state) => {
      state.isTaskModalOpen = false;
      state.editingTaskId = null;
      state.selectedDateRange = { startDate: null, endDate: null };
    },
    
    openTaskDetailsModal: (state, action: PayloadAction<string>) => {
      state.isTaskDetailsModalOpen = true;
      state.viewingTaskId = action.payload;
    },
    
    closeTaskDetailsModal: (state) => {
      state.isTaskDetailsModalOpen = false;
      state.viewingTaskId = null;
    },
    
    startDragSelection: (state, action: PayloadAction<Date>) => {
      state.dragSelection = {
        startDate: action.payload,
        endDate: action.payload,
        isSelecting: true,
      };
    },
    
    updateDragSelection: (state, action: PayloadAction<Date>) => {
      if (state.dragSelection.isSelecting) {
        state.dragSelection.endDate = action.payload;
      }
    },
    
    endDragSelection: (state) => {
      if (state.dragSelection.startDate && state.dragSelection.endDate) {
        state.selectedDateRange = {
          startDate: state.dragSelection.startDate,
          endDate: state.dragSelection.endDate,
        };
        state.isTaskModalOpen = true;
      }
      state.dragSelection = {
        startDate: null,
        endDate: null,
        isSelecting: false,
      };
    },
    
    cancelDragSelection: (state) => {
      state.dragSelection = {
        startDate: null,
        endDate: null,
        isSelecting: false,
      };
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'info' | 'warning';
      message: string;
    }>) => {
      const { type, message } = action.payload;
      const notification = {
        id: Date.now().toString(),
        type,
        message,
        timestamp: new Date(),
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action: PayloadAction<string>) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setCurrentDate,
  goToNextMonth,
  goToPreviousMonth,
  goToToday,
  openTaskModal,
  closeTaskModal,
  openTaskDetailsModal,
  closeTaskDetailsModal,
  startDragSelection,
  updateDragSelection,
  endDragSelection,
  cancelDragSelection,
  setLoading,
  addNotification,
  removeNotification,
  clearAllNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
