import { useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser } from "../types/authService";
import { useUser } from "../services/user";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from 'react-spinners';

export default function UserAuth() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate();

  useEffect(() => {
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  const isOnline = () => {
    if (!navigator.onLine) {
      setError("No internet connection. Please check your network and try again.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogin = async () => {
    if (!isOnline()) return;

    try {
      await loginUser(email, password);
      localStorage.removeItem("filters");
      navigate("/Dashboard");
      alert("Logged in");
    } catch (err) {
      alert("Login failed");
    }
  };

  const handleRegister = async () => {
    if (!isOnline()) return;

    try {
      await registerUser(name, email, password);
      localStorage.removeItem("filters");
      navigate("/Dashboard");
      alert("Registered");
    } catch (err) {
      alert("Registration failed");
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <ClipLoader size={100} loading={true} />
      </div>
    );
  }

  return (
    <div className="sign-in-container">
      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          {error}
        </div>
      )}
      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="username-input"
      />
      <input
        type="email"
        placeholder="example@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="email-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="password-input"
      />
      <button onClick={handleLogin} className="btn btn-login">
        Login
      </button>
      <button onClick={handleRegister} className="btn btn-register">
        Register
      </button>
    </div>
  );
}
