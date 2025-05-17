import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { logoutUser } from './types/authService';
import Error404 from './components/Error404';


export default function App() {
const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <div className="app-container">
      <Routes>
      <Route 
      path='/' 
      element={<Login/>}
      />
      <Route 
      path='/Dashboard' 
      element={<Dashboard 
      handleLogout={handleLogout}/>} 
      />
      <Route 
      path="*" 
      element={<Error404 />} 
      />
      </Routes>
    </div>
  )
}