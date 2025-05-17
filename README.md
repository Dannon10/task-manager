TaskManager - Todo App (Internship Technical Test)

A modern, fully functional Todo application built with React and TypeScript, inspired by the Outlook Todo interface.

Project Goals & Evaluation Criteria
Features
Add, edit, delete tasks
Mark tasks as completed
Prioritize tasks: high-priority, starred, scheduled
Drag-and-drop task reordering
Search and filter tasks
Due dates with notifications
Persistent storage using localStorage
Firebase authentication and Firestore sync

Tech Stack

- React + TypeScript
- Fluent UI
- Firebase (Auth + Firestore)
- Custom hooks for localStorage and reminders
- `react-beautiful-dnd` for drag-and-drop

📁 Folder Structure

src/
├── components/ # Reusable UI components
│ ├── AddTodo.tsx
│ ├── Filters.tsx
│ ├── Notifications.tsx
│ ├── TodoItem.tsx
│ ├── TodoList.tsx
│ └── UserAuth.tsx
├── hooks/ # Custom hooks
│ ├── useLocalStorage.ts
│ ├── useNotifications.ts
│ └── useFirestoreSync.ts
├── services/ # External integrations
│ ├── authService.ts
│ └── todoService.ts
├── types/ # TypeScript interfaces
│ ├── todo.ts
│ └── user.ts
├── App.tsx
└── index.tsx

Getting Started

1. Clone the repo  
   `git clone https://github.com/yourusername/taskmanager.git`

2. Navigate into the folder  
   `cd taskmanager`

3. Install dependencies  
   `npm install`

4. Start the app  
   `npm start`

> ⚠️ Replace Firebase config in `authService.ts` and `todoService.ts` with your own credentials.

Demo

Live Preview: https://task-manager-1-five.vercel.app/  
GitHub Repo: https://github.com/Dannon10/task-manager

Notes

- Interface closely follows the Outlook Todo design but uses custom styles.
- All components are modular and fully typed for scalability and maintainability.

📄 License
This project is built solely for educational purposes and assessment. Original design inspired by Outlook Todo but fully re-implemented from scratch.

Acknowledgements
Fluent UI Icons
React Beautiful DnD
Firebase
Vercel

