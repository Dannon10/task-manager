export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: Date;
    reminderTime?: Date;
    priority?: 'Low' | 'Medium' | 'High';
    starred?: boolean;
    scheduledForLater?: boolean;
    notified?: boolean;
}
