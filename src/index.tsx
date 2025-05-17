import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { UserProvider } from "./types/user";
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from "./components/ErrorBoundary";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
  <UserProvider>
    <ErrorBoundary>
    <App />
    </ErrorBoundary>
    </UserProvider>
  </BrowserRouter>
);

reportWebVitals();
