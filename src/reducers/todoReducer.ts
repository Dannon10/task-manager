import { Todo } from '../services/todo';

interface TodoAction {
  type: string;
  payload?: any;
}

const initialState: Todo[] = [];

export const todoReducer = (state = initialState, action: TodoAction): Todo[] => {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload];
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case 'EDIT_TODO':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, ...action.payload.updatedTodo }
          : todo
      );
    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.payload);
    case 'REORDER_TODOS':
      const reordered = Array.from(state);
      const [removed] = reordered.splice(action.payload.startIndex, 1);
      reordered.splice(action.payload.endIndex, 0, removed);
      return reordered;
    default:
      return state;
  }
};
