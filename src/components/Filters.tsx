import React from 'react';
import { TaskCategory, TimeFilter, FilterState } from '../types';

interface FiltersProps {
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

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onToggleCategory,
  onSetTimeFilter,
  onSetSearchQuery,
}) => {
  return (
    <div className="bg-white p-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks by name..."
              value={filters.searchQuery}
              onChange={(e) => onSetSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
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
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {/* Category Filters */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = filters.categories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => onToggleCategory(category)}
                    className={`
                      flex items-center space-x-2 px-3 py-1.5 rounded-full border transition-all
                      ${isSelected
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }
                    `}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${categoryColors[category]} ${
                        isSelected ? 'opacity-100' : 'opacity-60'
                      }`}
                    />
                    <span className="text-sm font-medium">{category}</span>
                    {isSelected && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Filters */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Time Range</h3>
            <div className="flex flex-wrap gap-2">
              {timeFilters.map((timeFilter) => {
                const isSelected = filters.timeFilter === timeFilter.value;
                return (
                  <button
                    key={timeFilter.value}
                    onClick={() => onSetTimeFilter(timeFilter.value)}
                    className={`
                      px-3 py-1.5 rounded-full border transition-all text-sm font-medium
                      ${isSelected
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }
                    `}
                  >
                    {timeFilter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active filters summary */}
        <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
          <span>
            Showing {filters.categories.length} of {categories.length} categories
          </span>
          {filters.searchQuery && (
            <span>
              • Searching for "{filters.searchQuery}"
            </span>
          )}
          <span>
            • Time: {timeFilters.find(tf => tf.value === filters.timeFilter)?.label}
          </span>
        </div>
      </div>
    </div>
  );
};
