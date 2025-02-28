import Colors from '../constants/colors';

// Initial task data structure
export const initialTasksState = {
  todo: {
    id: 'todo',
    title: 'To Do',
    items: [
      { 
        id: '1', 
        text: 'Learn React Native', 
        completed: false, 
        originalColumn: 'todo',
        dueDate: '2025-03-15',
        priority: 'High',
        assignee: 'John Doe',
        description: 'Complete the React Native tutorial and build a simple app.'
      },
      { 
        id: '2', 
        text: 'Build a mobile app', 
        completed: false, 
        originalColumn: 'todo',
        dueDate: '2025-04-01',
        priority: 'Medium',
        assignee: 'Jane Smith',
        description: 'Create a functioning prototype for the client meeting.'
      }
    ]
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    items: [
      { 
        id: '3', 
        text: 'Implement drag and drop', 
        completed: false, 
        originalColumn: 'inProgress',
        dueDate: '2025-03-10',
        priority: 'High',
        assignee: 'Jane Smith',
        description: 'Add drag and drop functionality between task columns.' 
      }
    ]
  },
  done: {
    id: 'done',
    title: 'Done',
    items: [
      { 
        id: '4', 
        text: 'Create project structure', 
        completed: true, 
        originalColumn: 'todo',
        dueDate: '2025-03-01',
        priority: 'High',
        assignee: 'Jane Smith',
        description: 'Set up the initial project structure and dependencies.' 
      }
    ]
  }
};

// Helper function to get next ID
export const getNextId = (columns) => {
  let maxId = 0;
  Object.values(columns).forEach(column => {
    column.items.forEach(item => {
      const id = parseInt(item.id);
      if (id > maxId) maxId = id;
    });
  });
  return (maxId + 1).toString();
};

// Get color for column background
export const getColumnBackgroundColor = (columnId) => {
  const colorMap = {
    todo: Colors.columnTodo,
    inProgress: Colors.columnInProgress,
    done: Colors.columnDone
  };
  return colorMap[columnId] || Colors.background;
};

// Get color for priority indicator
export const getPriorityColor = (priority) => {
  const colorMap = {
    'High': Colors.priorityHigh,
    'Medium': Colors.priorityMedium,
    'Low': Colors.priorityLow
  };
  return colorMap[priority] || Colors.textSecondary;
};

// Function to create an empty new task
export const createEmptyTask = () => ({
  text: '',
  dueDate: '',
  priority: 'Medium',
  assignee: '',
  description: '',
  completed: false
});


