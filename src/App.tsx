import React, { useState } from 'react';
import { Calendar } from './components/Calendar';
import { FilterDrawer } from './components/FilterDrawer';
import { NotificationContainer } from './components/NotificationContainer';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { selectFilteredTasks, selectFilters, selectTasks, selectTaskStats } from './store/selectors';
import { setSearchQuery, setTimeFilter, toggleCategoryFilter } from './store/slices/filtersSlice';
import { createTask, deleteTask, updateTask } from './store/slices/tasksSlice';
import { addNotification } from './store/slices/uiSlice';
import { TaskCategory } from './types';

function App() {
  const dispatch = useAppDispatch();
  const allTasks = useAppSelector(selectTasks);
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const filters = useAppSelector(selectFilters);
  const taskStats = useAppSelector(selectTaskStats);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);



  const handleCreateTask = (name: string, category: TaskCategory, startDate: Date, endDate: Date) => {
    dispatch(createTask({ name, category, startDate, endDate }));
    dispatch(addNotification({ type: 'success', message: `Task "${name}" created successfully!` }));
  };

  const handleUpdateTask = (taskId: string, updates: any) => {
    dispatch(updateTask({ taskId, updates }));
    dispatch(addNotification({ type: 'success', message: 'Task updated successfully!' }));
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteTask(taskId));
    dispatch(addNotification({ type: 'info', message: 'Task deleted successfully!' }));
  };

  const handleToggleCategory = (category: TaskCategory) => {
    dispatch(toggleCategoryFilter(category));
  };

  const handleSetTimeFilter = (timeFilter: any) => {
    dispatch(setTimeFilter(timeFilter));
  };

  const handleSetSearchQuery = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 sm:p-3 rounded-xl shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Month View Task Planner
                </h1>
                <p className="hidden sm:flex text-xs sm:text-sm text-gray-600 mt-1 items-center space-x-2 lg:space-x-4">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                    <span className="hidden lg:inline">Drag across days to create tasks</span>
                    <span className="lg:hidden">Drag to create</span>
                  </span>
                  <span className="flex items-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden lg:inline">Click to edit</span>
                    <span className="lg:hidden">Tap to edit</span>
                  </span>
                  <span className="hidden md:flex items-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    <span className="hidden lg:inline">Drag tasks to move them</span>
                    <span className="lg:hidden">Drag to move</span>
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile stats - compact version */}
              <div className="sm:hidden flex items-center space-x-2 text-xs">
                <div className="bg-white rounded-lg px-2 py-1 shadow-md border border-gray-200">
                  <div className="text-gray-500">Tasks</div>
                  <div className="text-sm font-bold text-gray-900 text-center">
                    {filteredTasks.length}
                  </div>
                </div>
                <div className="bg-white rounded-lg px-2 py-1 shadow-md border border-gray-200">
                  <div className="text-gray-500">Done</div>
                  <div className="text-sm font-bold text-green-600 text-center">
                    {taskStats.completionRate}%
                  </div>
                </div>
              </div>
              
              {/* Desktop stats */}
              <div className="hidden sm:flex md:hidden lg:flex items-center space-x-4 lg:space-x-6">
                <div className="bg-white rounded-lg px-3 lg:px-4 py-2 shadow-md border border-gray-200">
                  <div className="text-xs lg:text-sm text-gray-500">Tasks Shown</div>
                  <div className="text-lg font-bold text-gray-900">
                    {filteredTasks.length}
                  </div>
                </div>
                <div className="bg-white rounded-lg px-3 lg:px-4 py-2 shadow-md border border-gray-200">
                  <div className="text-xs lg:text-sm text-gray-500">Completed</div>
                  <div className="text-lg font-bold text-green-600">
                    {taskStats.completionRate}%
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-1 sm:space-x-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm sm:text-base">Filters</span>
                {(filters.categories.length < 4 || filters.searchQuery || filters.timeFilter !== 'all') && (
                  <div className="bg-white bg-opacity-30 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    Active
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <Calendar
            tasks={allTasks}
            filteredTasks={filteredTasks}
            onTaskCreate={handleCreateTask}
            onTaskUpdate={handleUpdateTask}
            onTaskDelete={handleDeleteTask}
          />
        </div>
      </main>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onToggleCategory={handleToggleCategory}
        onSetTimeFilter={handleSetTimeFilter}
        onSetSearchQuery={handleSetSearchQuery}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="flex items-center justify-center space-x-2">
            
              <span className="flex items-center space-x-1">
                <span className="text-blue-600 font-medium">Month Task Planner</span>
              
               
              </span>
            </p>
          </div>
        </div>
      </footer>

      {/* Notifications */}
      <NotificationContainer />
    </div>
  );
}

export default App;
