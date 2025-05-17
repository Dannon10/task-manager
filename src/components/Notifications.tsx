import { useEffect } from 'react';
import { Todo } from '../services/todo';

interface NotificationProps {
  todos: Todo[];
  markAsNotified: (id: string) => void;
}

const Notifications: React.FC<NotificationProps> = ({ todos, markAsNotified }) => {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(console.warn);
    }
  }, []);

  useEffect(() => {
    if (!('Notification' in window) || !todos.length) return;

    const normalize = (date: Date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    };

    const interval = setInterval(() => {
      const now = new Date();
      const today = normalize(now);

      const tomorrowDate = new Date();
      tomorrowDate.setDate(tomorrowDate.getDate() + 1);
      const tomorrow = normalize(tomorrowDate);

      todos.forEach(todo => {
        if (!todo.dueDate || todo.notified) return;

        const due = normalize(new Date(todo.dueDate));
        let message = '';

        if (due < today) {
          message = `⚠️ Task "${todo.title}" is overdue!`;
        } else if (due === today) {
          message = `📌 Task "${todo.title}" is due today!`;
        } else if (due === tomorrow) {
          message = `📌 Task "${todo.title}" is due tomorrow!`;
        }

        if (message && Notification.permission === 'granted') {
          new Notification('Task Due Date', { body: message });
          markAsNotified(todo.id);
        }
      });
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [todos, markAsNotified]);

  return null;
};

export default Notifications;
