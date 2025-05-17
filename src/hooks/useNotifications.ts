import { useEffect } from 'react';
import { Todo } from '../services/todo';

const useNotifications = (
  todos: Todo[],
  markAsNotified: (id: string) => void
) => {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch((err) =>
        console.warn('Notification permission error:', err)
      );
    }

    const interval = setInterval(() => {
      const now = new Date();

      todos.forEach(todo => {
        if (todo.notified || !todo.reminderTime) return;

        const reminderDate = new Date(todo.reminderTime);
        const timeDiff = reminderDate.getTime() - now.getTime();

        if (timeDiff <= 0 && timeDiff >= -60000) {
          if (Notification.permission === 'granted') {
            new Notification('⏰ Task Reminder', {
              body: `Reminder: "${todo.title}"`,
            });
            markAsNotified(todo.id);
          } else {
            console.warn('Notification not shown: permission not granted');
          }
        }
      });
    }, 15000); 

    return () => clearInterval(interval);
  }, [todos, markAsNotified]);
};

export default useNotifications;
