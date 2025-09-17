import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectCurrentDate,
  selectDragSelection,
  selectEditingTask,
  selectEditingTaskId,
  selectIsTaskDetailsModalOpen,
  selectIsTaskModalOpen,
  selectSelectedDateRange,
  selectViewingTask
} from '../store/selectors';
import {
  closeTaskDetailsModal,
  closeTaskModal,
  endDragSelection,
  goToNextMonth,
  goToPreviousMonth,
  goToToday,
  openTaskDetailsModal,
  openTaskModal,
  startDragSelection,
  updateDragSelection,
} from '../store/slices/uiSlice';
import { Task, TaskCategory } from '../types';
import { generateCalendarDays, getDaysBetween } from '../utils/dateHelpers';
import { DayCell } from './DayCell';
import { TaskDetailsModal } from './TaskDetailsModal';
import { TaskModal } from './TaskModal';

interface CalendarProps {
  tasks: Task[];
  filteredTasks?: Task[];
  onTaskCreate: (name: string, category: any, startDate: Date, endDate: Date) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const Calendar: React.FC<CalendarProps> = ({
  tasks,
  filteredTasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const dispatch = useAppDispatch();
  const currentDate = useAppSelector(selectCurrentDate);
  const isTaskModalOpen = useAppSelector(selectIsTaskModalOpen);
  const isTaskDetailsModalOpen = useAppSelector(selectIsTaskDetailsModalOpen);
  const editingTask = useAppSelector(selectEditingTask);
  const viewingTask = useAppSelector(selectViewingTask);
  const selectedDateRange = useAppSelector(selectSelectedDateRange);
  const dragSelection = useAppSelector(selectDragSelection);



  const displayTasks = filteredTasks || tasks;
  const calendarDays = generateCalendarDays(currentDate);

 

  const handlePreviousMonth = () => {
    dispatch(goToPreviousMonth());
  };

  const handleNextMonth = () => {
    dispatch(goToNextMonth());
  };

  const handleTodayClick = () => {
    dispatch(goToToday());
  };

  const handleDragStart = useCallback((date: Date) => {
    dispatch(startDragSelection(date));
  }, [dispatch]);

  const handleDragEnter = useCallback((date: Date) => {
    if (dragSelection.isSelecting) {
      dispatch(updateDragSelection(date));
    }
  }, [dispatch, dragSelection.isSelecting]);

  const handleDragEnd = useCallback(() => {
    dispatch(endDragSelection());
  }, [dispatch]);

  const handleDayClick = useCallback((date: Date) => {
    if (!dragSelection.isSelecting) {
      dispatch(openTaskModal({
        startDate: date,
        endDate: date,
      }));
    }
  }, [dispatch, dragSelection.isSelecting]);

  const handleTaskEdit = useCallback((task: Task) => {
 
    console.log('🎯 handleTaskEdit - all tasks in Calendar:', tasks.map(t => ({ 
      id: t.id, 
      name: t.name, 
      idType: typeof t.id 
    })));
    
    // Ensure dates are Date objects before dispatching
    const startDate = task.startDate instanceof Date ? task.startDate : new Date(task.startDate);
    const endDate = task.endDate instanceof Date ? task.endDate : new Date(task.endDate);
    

    
    dispatch(openTaskModal({
      startDate,
      endDate,
      taskId: task.id,
    }));
  }, [dispatch, tasks]);

  const handleModalSave = useCallback((name: string, category: TaskCategory, startDate: Date, endDate: Date) => {
  
    
    if (editingTask && editingTask.id) {
      // Update existing task

      onTaskUpdate(editingTask.id, { name, category, startDate, endDate });
    } else {
      // Create new task
    
      onTaskCreate(name, category, startDate, endDate);
    }
    dispatch(closeTaskModal());
  }, [editingTask, onTaskCreate, onTaskUpdate, dispatch]);

  const handleModalClose = useCallback(() => {
    dispatch(closeTaskModal());
  }, [dispatch]);

  const handleTaskShowDetails = useCallback((task: Task) => {

   
    dispatch(openTaskDetailsModal(task.id));
  }, [dispatch]);

  const handleTaskDetailsClose = useCallback(() => {
    dispatch(closeTaskDetailsModal());
  }, [dispatch]);

  const handleTaskEditFromDetails = useCallback((task: Task) => {
    dispatch(closeTaskDetailsModal());
    dispatch(openTaskModal({
      startDate: task.startDate,
      endDate: task.endDate,
      taskId: task.id,
    }));
  }, [dispatch]);

  const handleDragEndEvent = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find(t => t.id === taskId); // Use all tasks for finding the dragged task
    const targetDateStr = over.id as string;
    const targetDate = new Date(targetDateStr);

    if (task && over.data.current?.type === 'day') {
      // Calculate the duration of the task
      const taskDuration = task.endDate.getTime() - task.startDate.getTime();
      const newEndDate = new Date(targetDate.getTime() + taskDuration);

      onTaskUpdate(taskId, {
        startDate: targetDate,
        endDate: newEndDate,
      });
    }
  }, [tasks, onTaskUpdate]);

  // Check if a day is in the current selection
  const isInSelection = useCallback((date: Date): boolean => {
    if (!dragSelection.startDate || !dragSelection.endDate) return false;
    
    const selectionDays = getDaysBetween(dragSelection.startDate, dragSelection.endDate);
    return selectionDays.some(day => 
      day.toDateString() === date.toDateString()
    );
  }, [dragSelection.startDate, dragSelection.endDate]);



  return (
    <div className="bg-gradient-to-br from-gray-50 to-white">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6">
          <button
            onClick={handlePreviousMonth}
            className="p-2 sm:p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-md border border-gray-200"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          
          <button
            onClick={handleNextMonth}
            className="p-2 sm:p-3 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:shadow-md border border-gray-200"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          onClick={handleTodayClick}
          className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
        >
          Today
        </button>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="p-2 sm:p-3 lg:p-4 text-center text-xs sm:text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
          >
            <span className="sm:hidden">{day.slice(0, 1)}</span>
            <span className="hidden sm:inline">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <DndContext onDragEnd={handleDragEndEvent}>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, index) => (
            <DayCell
              key={format(day.date, 'yyyy-MM-dd')}
              day={day}
              tasks={displayTasks}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={onTaskDelete}
              onTaskShowDetails={handleTaskShowDetails}
              onDayClick={handleDayClick}
              onDragStart={handleDragStart}
              onDragEnter={handleDragEnter}
              onDragEnd={handleDragEnd}
              isSelecting={dragSelection.isSelecting}
              isInSelection={isInSelection(day.date)}
            />
          ))}
        </div>
      </DndContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        startDate={selectedDateRange.startDate}
        endDate={selectedDateRange.endDate}
        task={editingTask || undefined}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        isOpen={isTaskDetailsModalOpen}
        task={viewingTask}
        onClose={handleTaskDetailsClose}
        onEdit={handleTaskEditFromDetails}
        onDelete={onTaskDelete}
      />
    </div>
  );
};
