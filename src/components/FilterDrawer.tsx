import React from 'react';
import { TaskCategory, TimeFilter, FilterState } from '../types';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onToggleCategory: (category: TaskCategory) => void;
  onSetTimeFilter: (timeFilter: TimeFilter) => void;
  onSetSearchQuery: (query: string) => void;
}

const categories: TaskCategory[] = ['To-Do', 'In Progress', 'Review', 'Completed'];
const timeFilters: { value: TimeFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: '1-week', label: 'This Week' },
  { value: '2-weeks', label: '2 Weeks' },
  { value: '3-weeks', label: '3 Weeks' },
];

const categoryColors = {
  'To-Do': 'bg-red-500',
  'In Progress': 'bg-yellow-500',
  'Review': 'bg-purple-500',
  'Completed': 'bg-green-500',
};

const categoryIcons = {
  'To-Do': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'In Progress': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  'Review': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  'Completed': (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
};

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onToggleCategory,
  onSetTimeFilter,
  onSetSearchQuery,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Filters & Search</h2>
                <p className="text-blue-100 text-xs sm:text-sm mt-1">Customize your task view</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
            {/* Search Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Tasks
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by task name..."
                  value={filters.searchQuery}
                  onChange={(e) => onSetSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {filters.searchQuery && (
                  <button
                    onClick={() => onSetSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Categories
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {categories.map((category) => {
                  const isSelected = filters.categories.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => onToggleCategory(category)}
                      className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105 ${
                        isSelected
                          ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full ${categoryColors[category]} shadow-sm ${
                              isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-blue-100' : ''
                            }`}
                          />
                          <div className="flex items-center space-x-2">
                            <div className={`${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                              {categoryIcons[category]}
                            </div>
                            <span className={`font-medium ${
                              isSelected ? 'text-blue-800' : 'text-gray-700'
                            }`}>
                              {category}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="text-blue-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Range Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Time Range
              </h3>
              <div className="space-y-2">
                {timeFilters.map((timeFilter) => {
                  const isSelected = filters.timeFilter === timeFilter.value;
                  return (
                    <button
                      key={timeFilter.value}
                      onClick={() => onSetTimeFilter(timeFilter.value)}
                      className={`w-full p-3 rounded-lg border transition-all duration-200 text-left font-medium ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-600 text-white shadow-lg'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{timeFilter.label}</span>
                        {isSelected && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer with Summary */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Active Categories:</span>
                <span className="font-medium text-gray-800">
                  {filters.categories.length} of {categories.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Time Filter:</span>
                <span className="font-medium text-gray-800">
                  {timeFilters.find(tf => tf.value === filters.timeFilter)?.label}
                </span>
              </div>
              {filters.searchQuery && (
                <div className="flex items-center justify-between">
                  <span>Search Query:</span>
                  <span className="font-medium text-gray-800 truncate max-w-32">
                    "{filters.searchQuery}"
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
