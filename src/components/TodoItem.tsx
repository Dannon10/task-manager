import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';
import {
  Delete20Regular,
  Edit20Regular,
  StarFilled,
  StarRegular,
  PresenceAvailable10Regular,
  PresenceAway10Regular,
  PresenceDnd10Regular
} from '@fluentui/react-icons';
import CustomCheckbox from './CustomCheckbox';
import './todoitem.css';


interface TodoItemProps {
  todo: Todo;
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

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleComplete,
  deleteTodo,
  editTodo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [dueDate, setDueDate] = useState<Date | undefined>(todo.dueDate);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | undefined>(todo.priority);
  const [starred, setStarred] = useState(todo.starred ?? false);
  const [scheduledForLater, setScheduledForLater] = useState(todo.scheduledForLater ?? false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    if (todo.reminderTime) {
      const r = new Date(todo.reminderTime);
      setReminderEnabled(true);
      setReminderDate(`${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, '0')}-${String(r.getDate()).padStart(2, '0')}`);
      setReminderTime(`${String(r.getHours()).padStart(2, '0')}:${String(r.getMinutes()).padStart(2, '0')}`);
    }
  }, [todo.reminderTime]);

  const handleSave = () => {
    let parsedReminder: Date | undefined;

    if (reminderEnabled && reminderDate && reminderTime) {
      const [year, month, day] = reminderDate.split('-');
      const [hour, minute] = reminderTime.split(':');

      const reminder = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute)
      );

      if (!isNaN(reminder.getTime())) {
        parsedReminder = reminder;
      }
    }

    editTodo(todo.id, title, dueDate, priority, starred, scheduledForLater, parsedReminder);
    setIsEditing(false);
  };

  const getDueStatusIcon = (todo: Todo): React.ReactElement => {
    if (todo.completed) {
      return <PresenceAvailable10Regular color="green" title="Completed" className="task-status complete" />;
    }

    const now = new Date();

    if (!todo.dueDate) {
      return <PresenceAway10Regular color="goldenrod" title="No due date" className="task-status" />;
    }

    const dueDate = new Date(todo.dueDate);

    if (dueDate < now) {
      return <PresenceDnd10Regular color="red" title="Overdue" className="task-status overdue" />;
    }

    return <PresenceAway10Regular color="goldenrod" title="Pending" className="task-status " />;
  };


  return (
    <li className="todo-item-display">
      <div className="completed-box">
        <CustomCheckbox
          label=""
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
        />
      </div>

      {isEditing ? (
        <div className="todo-item-edit">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Edit task title"
          />
          <label className='due-date-label' htmlFor="Due date"> Due Date:</label>
          <input
            type="date"
            value={dueDate ? new Date(dueDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : undefined)}
          />
          <select
            className="todo-item-priority"
            value={priority || ''}
            onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
          >
            <option value="">Select Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <label>
            <button
              type="button"
              onClick={() => setStarred((prev) => !prev)}
              className="star-toggle"
              title="Mark as Starred"
            >
              {starred ? (
                <StarFilled className="star-icon active" />
              ) : (
                <StarRegular className="star-icon" />
              )}
            </button>
          </label>
          <label className='edit-label-checkbox' >
            <CustomCheckbox
              label="Scheduled for Later"
              checked={scheduledForLater}
              onChange={setScheduledForLater}
            />
          </label>
          <label className='edit-label-checkbox'>
            <CustomCheckbox
              label="Set Reminder"
              checked={reminderEnabled}
              onChange={setReminderEnabled}
            />
          </label>
          {reminderEnabled && (
            <>
              <label className='reminder-label' htmlFor="reminderDate">Date</label>
              <input
                type="date"
                placeholder="MM/DD/YYYY"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
              <label className='reminder-label' htmlFor="reminderTime">Time:</label>

              <input
                type="time"
                placeholder="HH:MM (e.g. 14:30)"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </>
          )}
          <div className="todo-item-actions-btns">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          {getDueStatusIcon(todo)}
          <h4 className={todo.completed ? 'completed' : 'pending'}>
            {todo.title}
            {starred && <span> <StarFilled className='star-icon active' /></span>}
          </h4>
          <div className="todo-item-details">
            {dueDate && (
              <span className="todo-item-due-date">
                Due: {new Date(dueDate).toLocaleDateString()}
              </span>
            )}
            <div className="todo-item-dets">
              {priority && <p>{priority} Priority</p>}
              {scheduledForLater && <p>Scheduled for Later</p>}
              {todo.reminderTime && (
                <div>Reminder: {new Date(todo.reminderTime).toLocaleString()}</div>
              )}
            </div>
          </div>
          <div className="todo-item-actions">
            <button className="delete-btn" title="Delete" onClick={() => deleteTodo(todo.id)}>
              <Delete20Regular className="delete-icon" />
            </button>
            <button className="edit-btn" title="Edit" onClick={() => setIsEditing(true)}>
              <Edit20Regular className="edit-icon" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem;