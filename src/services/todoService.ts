
import { db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  Timestamp,
  writeBatch,
  updateDoc,
  DocumentReference
} from "firebase/firestore";
import { Todo } from "../types/todo";

export const listenToTodos = (
  userId: string,
  onTodosUpdate: (todos: Todo[]) => void
): (() => void) => {
  const todosRef = collection(db, "users", userId, "todos");

  const unsubscribe = onSnapshot(todosRef, (snapshot) => {
    const todos: Todo[] = snapshot.docs.map((docSnap) => {
      const data = docSnap.data() as Omit<Todo, "id">;

      return {
        ...data,
        id: docSnap.id,
        dueDate: data.dueDate instanceof Timestamp ? data.dueDate.toDate() : undefined,
        reminderTime: data.reminderTime instanceof Timestamp ? data.reminderTime.toDate() : undefined,
        notified: data.notified ?? false,
      };
    });

    onTodosUpdate(todos);
  });

  return unsubscribe;
};

export const saveTodos = async (userId: string, todos: Todo[]) => {
  const todosRef = collection(db, "users", userId, "todos");
  const batch = writeBatch(db);

  todos.forEach((todo) => {
    if (!todo.id || typeof todo.id !== "string" || todo.id.trim() === "") return;

    const sanitizedTodo: any = {
      id: todo.id,
      title: todo.title,
      completed: todo.completed ?? false,
      priority: todo.priority ?? "Low",
      starred: todo.starred ?? false,
      scheduledForLater: todo.scheduledForLater ?? false,
      notified: todo.notified ?? false,
    };

    if (todo.dueDate) {
      sanitizedTodo.dueDate = Timestamp.fromDate(new Date(todo.dueDate));
    }

    if (todo.reminderTime) {
      sanitizedTodo.reminderTime = Timestamp.fromDate(new Date(todo.reminderTime));
    }

    const todoDocRef: DocumentReference = doc(db, "users", userId, "todos", todo.id);
    batch.set(todoDocRef, sanitizedTodo, { merge: true });
  });

  await batch.commit();
};

export const markAsNotified = async (userId: string, todoId: string) => {
  const todoDocRef: DocumentReference = doc(db, "users", userId, "todos", todoId);
  await updateDoc(todoDocRef, { notified: true });
};
