import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskCategory, TimeFilter, FilterState } from '../../types';

const initialState: FilterState = {
  categories: ['To-Do', 'In Progress', 'Review', 'Completed'],
  timeFilter: 'all',
  searchQuery: '',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleCategoryFilter: (state, action: PayloadAction<TaskCategory>) => {
      const category = action.payload;
      if (state.categories.includes(category)) {
        state.categories = state.categories.filter(c => c !== category);
      } else {
        state.categories.push(category);
      }
    },
    
    setCategoryFilters: (state, action: PayloadAction<TaskCategory[]>) => {
      state.categories = action.payload;
    },
    
    setTimeFilter: (state, action: PayloadAction<TimeFilter>) => {
      state.timeFilter = action.payload;
    },
    
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    resetFilters: (state) => {
      state.categories = ['To-Do', 'In Progress', 'Review', 'Completed'];
      state.timeFilter = 'all';
      state.searchQuery = '';
    },
    
    selectAllCategories: (state) => {
      state.categories = ['To-Do', 'In Progress', 'Review', 'Completed'];
    },
    
    deselectAllCategories: (state) => {
      state.categories = [];
    },
  },
});

export const {
  toggleCategoryFilter,
  setCategoryFilters,
  setTimeFilter,
  setSearchQuery,
  resetFilters,
  selectAllCategories,
  deselectAllCategories,
} = filtersSlice.actions;

export default filtersSlice.reducer;
