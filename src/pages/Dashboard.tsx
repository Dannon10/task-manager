import { useState, useEffect, useReducer, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import TodoList from '../components/TodoList';
import AddTodo from '../components/AddTodo';
import { useFirestoreSync } from '../hooks/useFirestore';
import { doc, deleteDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import Navsection from '../components/Navsection';
import TaskPanel from '../components/TaskPanel';
import { ClipLoader } from 'react-spinners';
import Notifications from '../components/Notifications';
import useNotifications from '../hooks/useNotifications';
import { ErrorCircle12Regular } from '@fluentui/react-icons';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority?: 'Low' | 'Medium' | 'High';
  starred?: boolean;
  scheduledForLater?: boolean;
  notified?: boolean;
  reminderTime?: Date;
};

type FilterState = {
  searchTerm: string;
  showCompleted: boolean;
  showStarred: boolean;
  showScheduledForLater: boolean;
  selectedPriority: 'Low' | 'Medium' | 'High' | undefined;
  showDueDate: 'Overdue' | 'Upcoming' | 'All';
};

type FilterAction =
  | { type: 'SET_FILTERS'; payload: Partial<FilterState> }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_COMPLETED'; payload: boolean }
  | { type: 'SET_STARRED'; payload: boolean }
  | { type: 'SET_SCHEDULED'; payload: boolean }
  | { type: 'SET_PRIORITY'; payload: 'Low' | 'Medium' | 'High' | undefined }
  | { type: 'SET_DUE_DATE'; payload: 'Overdue' | 'Upcoming' | 'All' };

const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_FILTERS':
      return { ...state, ...action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_COMPLETED':
      return { ...state, showCompleted: action.payload };
    case 'SET_STARRED':
      return { ...state, showStarred: action.payload };
    case 'SET_SCHEDULED':
      return { ...state, showScheduledForLater: action.payload };
    case 'SET_PRIORITY':
      return { ...state, selectedPriority: action.payload };
    case 'SET_DUE_DATE':
      return { ...state, showDueDate: action.payload };
    default:
      return state;
  }
};

type DashboardProps = {
  handleLogout: () => void;
};

export default function Dashboard({ handleLogout }: DashboardProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFilterDropdown = () => setShowFilters((prev) => !prev);
  const handleCloseFilters = () => setShowFilters(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const markAsNotified = useFirestoreSync(userId, todos, setTodos);
  useNotifications(todos, markAsNotified);

  const storageKey = userId ? `todos_${userId}` : 'todos';

  useEffect(() => {
    if (userId) {
      const storedTodos = localStorage.getItem(storageKey);
      if (storedTodos) {
        setTodos(JSON.parse(storedTodos));
      }
    }
  }, [userId, storageKey]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem(storageKey, JSON.stringify(todos));
    }
  }, [todos, userId, storageKey]);

  const [filterState, dispatch] = useReducer(filterReducer, {
    searchTerm: '',
    showCompleted: true,
    showStarred: false,
    showScheduledForLater: false,
    selectedPriority: undefined,
    showDueDate: 'All',
  });

  const addTodo = (
    title: string,
    dueDate?: Date,
    priority?: 'Low' | 'Medium' | 'High',
    starred?: boolean,
    scheduledForLater?: boolean,
    reminderTime?: Date
  ) => {
    if (!title || !title.trim()) return;
    const newTodo: Todo = {
      id: uuidv4(),
      title: title.trim(),
      completed: false,
      dueDate,
      priority,
      starred,
      scheduledForLater,
      notified: false,
      reminderTime,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleComplete = (id: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = async (id: string) => {
    if (!userId) return;
    try {
      const todoRef = doc(db, 'users', userId, 'todos', id);
      await deleteDoc(todoRef);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('Failed to delete todo from Firestore:', error);
      setError('Failed to delete todo. Please try again.');
    }
  };

  const editTodo = (
    id: string,
    title: string,
    dueDate?: Date,
    priority?: 'Low' | 'Medium' | 'High',
    starred?: boolean,
    scheduledForLater?: boolean,
    reminderTime?: Date
  ) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              title: title.trim(),
              dueDate,
              priority,
              starred,
              scheduledForLater,
              reminderTime,
              notified: false,
            }
          : todo
      )
    );
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;

    const updatedTodos = Array.from(todos);
    const [movedItem] = updatedTodos.splice(source.index, 1);
    updatedTodos.splice(destination.index, 0, movedItem);
    setTodos(updatedTodos);
  };

  const handleSearchTermChange = (term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  };

  const handleFiltersChange = (filterValues: FilterState) => {
    dispatch({ type: 'SET_FILTERS', payload: filterValues });
  };

  const filteredTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesSearch = todo.title.toLowerCase().includes(filterState.searchTerm.toLowerCase());
      const matchesCompleted = filterState.showCompleted || !todo.completed;
      const matchesStarred = filterState.showStarred ? todo.starred : true;
      const matchesScheduled = filterState.showScheduledForLater ? todo.scheduledForLater : true;
      const matchesPriority = filterState.selectedPriority ? todo.priority === filterState.selectedPriority : true;

      let matchesDueDate = true;
      if (filterState.showDueDate === 'Overdue') {
        matchesDueDate = todo.dueDate ? todo.dueDate < new Date() : false;
      } else if (filterState.showDueDate === 'Upcoming') {
        matchesDueDate = todo.dueDate ? todo.dueDate >= new Date() : false;
      }

      return matchesSearch && matchesCompleted && matchesStarred && matchesScheduled && matchesPriority && matchesDueDate;
    });
  }, [todos, filterState]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    handleFiltersChange({
      searchTerm: '',
      showCompleted: true,
      showStarred: false,
      showScheduledForLater: false,
      selectedPriority: undefined,
      showDueDate: 'All',
    });
  }, []);

  if (isLoading) {
    return (
      <div className="loading">
        <ClipLoader size={100} loading={true} />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {error && (
        <div className="error-message">
          <ErrorCircle12Regular />
          {error}
        </div>
      )}
      <Navsection 
        handleLogout={handleLogout} 
        onSearchChange={handleSearchTermChange} 
      />
      <TaskPanel
        onCloseFilters={handleCloseFilters}
        onToggleFilters={toggleFilterDropdown}
        showFilters={showFilters}
        onFiltersChange={handleFiltersChange}
        dispatch={dispatch}
      />
      <AddTodo addTodo={addTodo} />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <TodoList
          todos={filteredTodos}
          toggleComplete={toggleComplete}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      </DragDropContext>
      <Notifications todos={todos} markAsNotified={markAsNotified} />
    </div>
  );
}
