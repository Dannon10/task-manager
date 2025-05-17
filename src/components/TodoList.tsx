import { Todo } from '../services/todo';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TodoItem from './TodoItem';
import './todolist.css'
import {   
  PresenceAvailable10Regular,
  PresenceAway10Regular,
  PresenceDnd10Regular
} from '@fluentui/react-icons';

interface TodoListProps {
  todos: Todo[];
  toggleComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (
    id: string,
    title: string,
    dueDate?: Date,
    priority?: 'Low' | 'Medium' | 'High',
    starred?: boolean,
    scheduledForLater?: boolean,
    reminderTime?: Date
  ) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  toggleComplete,
  deleteTodo,
  editTodo,
}) => {
  return (

    <div className='todolist-container'>
      <div className="status-legend">
  <span><PresenceAvailable10Regular color="green" /> Completed</span>
  <span><PresenceDnd10Regular color="red" /> Overdue</span>
  <span><PresenceAway10Regular color="goldenrod" /> Pending</span>
</div>

      {todos.length === 0 ? (
      <div className="no-task">
        <p className='no-taskt-text'>No tasks yet.</p>
        </div>
      ) : (
        <Droppable droppableId="todos-list">
          {(provided) => (
            <ul
              className="todo-list"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {todos.map((todo, index) => (
                <Draggable
                  key={todo.id}
                  draggableId={todo.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`todo-item ${snapshot.isDragging ? 'dragging' : ''}`}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >
                      <TodoItem
                        todo={todo}
                        toggleComplete={toggleComplete}
                        deleteTodo={deleteTodo}
                        editTodo={editTodo}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default TodoList;