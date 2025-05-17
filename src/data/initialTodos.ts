import { Todo } from '../services/todo';

export const initialTodos: Todo[] = [
  {
    id: '1',
    title: 'Sample Task 1',
    completed: false,
    priority: 'Medium',
    starred: false,
    scheduledForLater: false,
    dueDate: new Date(),
  },
  {
    id: '2',
    title: 'Sample Task 2',
    completed: true,
    priority: 'Low',
    starred: true,
    scheduledForLater: false,
    dueDate: new Date(),
  },
];
