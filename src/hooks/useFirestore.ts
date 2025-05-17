import { useEffect } from "react";
import { Todo } from "../services/todo";
import { listenToTodos, saveTodos, markAsNotified } from "../types/todoService";

export function useFirestoreSync(
  userId: string | null,
  todos: Todo[],
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
) {
  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToTodos(userId, setTodos);
    return () => unsubscribe();
  }, [userId, setTodos]);

  useEffect(() => {
    if (!userId || todos.length === 0) return;
    saveTodos(userId, todos);
  }, [todos, userId]);

  const markTodoAsNotified = async (todoId: string) => {
    if (!userId) return;
    await markAsNotified(userId, todoId);
  };

  return markTodoAsNotified;
}
