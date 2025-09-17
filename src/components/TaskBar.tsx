import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '../types';

interface TaskBarProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onShowDetails: (task: Task) => void;
  style?: React.CSSProperties;
}

const categoryColors = {
  'To-Do': 'bg-gradient-to-r from-red-500 to-red-600 border-red-600 shadow-red-200',
  'In Progress': 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-yellow-600 shadow-yellow-200',
  'Review': 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-600 shadow-purple-200',
  'Completed': 'bg-gradient-to-r from-green-500 to-green-600 border-green-600 shadow-green-200',
};

export const TaskBar: React.FC<TaskBarProps> = ({
  task,
  onEdit,
  onDelete,
  onShowDetails,
  style,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const transformStyle = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, ...transformStyle }}
      className={`
        relative p-2 rounded-lg border-l-4 text-white text-xs font-medium
        hover:shadow-lg transition-all duration-200 select-none hover:scale-105
        ${categoryColors[task.category]}
        ${isDragging ? 'opacity-50 z-50 shadow-2xl scale-110' : 'z-10 shadow-md'}
      `}
    >
      <div className="flex items-center justify-between">
        <div 
          {...listeners}
          {...attributes}
          className="truncate flex-1 pr-2 cursor-move" 
          title="Drag to move or click to view details"
          onClick={(e) => {
            e.stopPropagation();
            console.log('🔵 TaskBar main area clicked - showing details for:', task.name);
            onShowDetails(task);
          }}
        >
          {task.name}
        </div>
        <div className="flex space-x-1 sm:space-x-2" style={{ pointerEvents: 'auto' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('🔥🔥🔥 EDIT BUTTON CLICKED in TaskBar for task:', task.name, task.id);
              console.log('🔥 onEdit function type:', typeof onEdit);
              console.log('🔥 Event details:', e.type, e.target);
              onEdit(task);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="opacity-70 hover:opacity-100 transition-opacity p-1 sm:p-1.5 hover:bg-black hover:bg-opacity-20 rounded z-20 relative min-w-[28px] min-h-[28px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center"
            title="Edit task"
            style={{ pointerEvents: 'auto' }}
          >
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              console.log('🗑️ DELETE BUTTON CLICKED for task:', task.name);
              onDelete(task.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            className="opacity-70 hover:opacity-100 transition-opacity p-1 sm:p-1.5 hover:bg-black hover:bg-opacity-20 rounded z-20 relative min-w-[28px] min-h-[28px] sm:min-w-[32px] sm:min-h-[32px] flex items-center justify-center"
            title="Delete task"
            style={{ pointerEvents: 'auto' }}
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="text-xs opacity-90 mt-1">
        {task.category}
      </div>
    </div>
  );
};
