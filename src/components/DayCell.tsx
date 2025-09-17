import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { format, isSameDay } from 'date-fns';
import { CalendarDay, Task } from '../types';
import { TaskBar } from './TaskBar';
import { getTasksForDay } from '../utils/dateHelpers';

interface DayCellProps {
  day: CalendarDay;
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskShowDetails: (task: Task) => void;
  onDayClick: (date: Date) => void;
  onDragStart: (date: Date) => void;
  onDragEnter: (date: Date) => void;
  onDragEnd: () => void;
  isSelecting: boolean;
  isInSelection: boolean;
}

export const DayCell: React.FC<DayCellProps> = ({
  day,
  tasks,
  onTaskEdit,
  onTaskDelete,
  onTaskShowDetails,
  onDayClick,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isSelecting,
  isInSelection,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: format(day.date, 'yyyy-MM-dd'),
    data: {
      type: 'day',
      date: day.date,
    },
  });

  const dayTasks = getTasksForDay(tasks, day.date);
  const dayNumber = format(day.date, 'd');

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      onDragStart(day.date);
    }
  };

  const handleMouseEnter = () => {
    if (isSelecting) {
      onDragEnter(day.date);
    }
  };

  const handleMouseUp = () => {
    if (isSelecting) {
      onDragEnd();
    }
  };

  const handleClick = () => {
    onDayClick(day.date);
  };

  return (
    <div
      ref={setNodeRef}
      className={`
        relative min-h-[80px] sm:min-h-[100px] lg:min-h-[140px] border-r border-b border-gray-200 p-1 sm:p-2 lg:p-3 cursor-pointer transition-all duration-200
        ${day.isCurrentMonth 
          ? 'bg-white hover:bg-gray-50' 
          : 'bg-gray-50 hover:bg-gray-100 text-gray-400'
        }
        ${day.isToday 
          ? 'bg-gradient-to-br from-blue-50 to-purple-50 ring-1 sm:ring-2 ring-blue-400 ring-inset shadow-inner' 
          : ''
        }
        ${isOver ? 'bg-blue-100 shadow-inner' : ''}
        ${isInSelection ? 'bg-gradient-to-br from-blue-100 to-purple-100 border-blue-400 shadow-inner' : ''}
        hover:shadow-sm
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {/* Day number */}
      <div className="flex justify-between items-center mb-1 sm:mb-2">
        <span
          className={`
            text-sm sm:text-base lg:text-lg font-semibold
            ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
            ${day.isToday ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm shadow-lg' : ''}
          `}
        >
          {dayNumber}
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-1">
        {dayTasks.map((task) => {
          // Check if this is the first day of the task
          const isTaskStart = isSameDay(task.startDate, day.date);
          
          if (!isTaskStart) {
            // For continuation days, show a simpler bar
            return (
              <div
                key={`${task.id}-continuation`}
                className={`
                  h-5 rounded-sm text-xs text-white flex items-center px-1
                  ${task.category === 'To-Do' ? 'bg-red-500' : ''}
                  ${task.category === 'In Progress' ? 'bg-yellow-500' : ''}
                  ${task.category === 'Review' ? 'bg-purple-500' : ''}
                  ${task.category === 'Completed' ? 'bg-green-500' : ''}
                  opacity-80
                `}
              >
                <span className="truncate">···</span>
              </div>
            );
          }

          return (
            <TaskBar
              key={task.id}
              task={task}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              onShowDetails={onTaskShowDetails}
            />
          );
        })}
      </div>

      {/* Task count indicator for days with many tasks */}
      {dayTasks.length > 3 && (
        <div className="absolute bottom-1 right-1 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          +{dayTasks.length - 3}
        </div>
      )}
    </div>
  );
};
