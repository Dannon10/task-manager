import UserAuth from '../components/UserAuth';
import './login.css';

const Login = () => {
  return (
    <div className="login-page-container">
      <div className="login-page-content">
        <h1 className='title'>Task Manager</h1>
        <div className="sign-in-info">
        <h2 className="login-header">Sign In</h2>
        <p>(Don't have an account? Fill form and register, Already have an account? Fill and login.)</p>
        </div>
        <UserAuth />
      </div>
    </div>
  );
};

export default Login;
