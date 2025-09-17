# 📅 Month View Task Planner

A comprehensive task management application with a month calendar view, built with React, TypeScript, and Redux Toolkit. Features drag & drop functionality, task filtering, search capabilities, and localStorage persistence.

## ✨ Features

### 🎯 Task Management
- **Create Tasks**: Drag across multiple days to create tasks spanning date ranges
- **Edit Tasks**: Click on tasks to edit name and category
- **Move Tasks**: Drag and drop tasks to different dates
- **Delete Tasks**: Remove tasks with confirmation
- **Categories**: Organize tasks by To-Do, In Progress, Review, and Completed

### 🗓️ Calendar Interface
- **Month View**: Clean, intuitive calendar grid layout
- **Current Day Highlighting**: Today's date is clearly marked
- **Task Visualization**: Color-coded task bars spanning multiple days
- **Navigation**: Previous/Next month navigation with "Today" quick access

### 🔍 Filtering & Search
- **Category Filters**: Multi-select category filtering
- **Time Filters**: View tasks for 1 week, 2 weeks, 3 weeks, or all time
- **Real-time Search**: Search tasks by name with instant results
- **Active Filter Display**: Clear indication of applied filters

### 💾 Data Persistence
- **localStorage Integration**: All tasks saved locally in browser
- **Redux State Management**: Centralized state with Redux Toolkit
- **Auto-save**: Changes are automatically persisted

### 🎨 User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Tailwind CSS**: Modern, clean styling
- **Notifications**: Success/error notifications for user actions
- **Animations**: Smooth transitions and interactions
- **Drag Selection**: Visual feedback for multi-day task creation

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **State Management**: Redux Toolkit
- **Drag & Drop**: @dnd-kit/core
- **Date Handling**: date-fns
- **Styling**: Tailwind CSS
- **Build Tool**: Create React App
- **Data Storage**: localStorage

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## 🎮 Usage

### Creating Tasks
1. **Single Day Task**: Click on any day to create a single-day task
2. **Multi-Day Task**: Drag across multiple days, then release to open the task modal
3. **Fill in Details**: Enter task name and select category
4. **Save**: Task appears as a colored bar spanning the selected dates

### Managing Tasks
- **Edit**: Click the edit icon on any task
- **Move**: Drag tasks to different dates
- **Delete**: Click the delete icon with confirmation
- **Filter**: Use category checkboxes and time filters
- **Search**: Type in the search box for real-time filtering

### Navigation
- **Month Navigation**: Use arrow buttons to navigate months
- **Today Button**: Quickly return to current month
- **Current Day**: Today's date is highlighted with a blue ring


