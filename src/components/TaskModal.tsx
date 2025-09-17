import React, { useState, useEffect } from 'react';
import { Task, TaskCategory } from '../types';
import { formatTaskDateRange, formatDateForInput, formatDateForDisplay } from '../utils/dateHelpers';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, category: TaskCategory, startDate: Date, endDate: Date) => void;
  startDate: Date | null;
  endDate: Date | null;
  task?: Task;
}

const categories: TaskCategory[] = ['To-Do', 'In Progress', 'Review', 'Completed'];

const categoryColors = {
  'To-Do': 'bg-red-500',
  'In Progress': 'bg-yellow-500',
  'Review': 'bg-purple-500',
  'Completed': 'bg-green-500',
};

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  startDate,
  endDate,
  task,
}) => {


  
  const [taskName, setTaskName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('To-Do');
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Editing existing task
        console.log("TaskModal useEffect - editing task:", task.name, "ID:", task.id);
        setTaskName(task.name || '');
        setSelectedCategory(task.category || 'To-Do');
        
        // Ensure dates are Date objects (in case they were serialized as strings)
        let taskStartDate: Date;
        let taskEndDate: Date;
        
        try {
          taskStartDate = task.startDate instanceof Date ? task.startDate : new Date(task.startDate);
          taskEndDate = task.endDate instanceof Date ? task.endDate : new Date(task.endDate);
          
          // Validate dates
          if (isNaN(taskStartDate.getTime())) {
            console.warn("Invalid start date, using fallback", taskStartDate, task.startDate);
            taskStartDate = startDate || new Date();
          }
          if (isNaN(taskEndDate.getTime())) {
            console.warn("Invalid end date, using fallback", taskEndDate, task.endDate);
            taskEndDate = endDate || new Date();
          }
          

          setSelectedStartDate(taskStartDate);
          setSelectedEndDate(taskEndDate);
        } catch (error) {
          console.error("Error parsing task dates:", error);
          setSelectedStartDate(startDate);
          setSelectedEndDate(endDate);
        }
      } else {
        // New task creation
        setTaskName('');
        setSelectedCategory('To-Do');
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
      }
    }
  }, [task, isOpen, startDate, endDate, task?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim() && selectedStartDate && selectedEndDate) {
      onSave(taskName.trim(), selectedCategory, selectedStartDate, selectedEndDate);
      setTaskName('');
      setSelectedCategory('To-Do');
      setSelectedStartDate(null);
      setSelectedEndDate(null);
      onClose();
    }
  };

  const handleClose = () => {
    setTaskName('');
    setSelectedCategory('To-Do');
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    onClose();
  };

  if (!isOpen) return null;

  



  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg mx-2 sm:mx-4 transform transition-all duration-300 ease-out max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl sm:rounded-t-2xl p-4 sm:p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">
                {task ? 'Update your task details' : 'Add a new task to your calendar'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-blue-200 text-xl sm:text-2xl font-light transition-colors duration-200 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20"
            >
              ×
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">

          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date Range
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  From Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={selectedStartDate ? formatDateForInput(selectedStartDate) : ''}
                  onChange={(e) => setSelectedStartDate(new Date(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                />
                {selectedStartDate && (
                  <div className="text-xs text-blue-600 font-medium">
                    {formatDateForDisplay(selectedStartDate)}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={selectedEndDate ? formatDateForInput(selectedEndDate) : ''}
                  onChange={(e) => setSelectedEndDate(new Date(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  required
                />
                {selectedEndDate && (
                  <div className="text-xs text-blue-600 font-medium">
                    {formatDateForDisplay(selectedEndDate)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Task Details
              </h3>
              <label htmlFor="taskName" className="block text-sm font-medium text-gray-700 mb-2">
                Task Name
              </label>
              <input
                type="text"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter a descriptive task name..."
                required
                autoFocus
              />
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Category
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`group p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                      selectedCategory === category
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-4 h-4 rounded-full ${categoryColors[category]} shadow-sm ${
                          selectedCategory === category ? 'ring-2 ring-white ring-offset-2 ring-offset-blue-100' : ''
                        }`}
                      />
                      <span className={`text-sm font-medium ${
                        selectedCategory === category ? 'text-blue-800' : 'text-gray-700'
                      }`}>
                        {category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 sm:px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
              >
                <span className="flex items-center justify-center">
                  {task ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Update Task
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Create Task
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
