import { useState } from "react";
import { useNavigate,Link } from "react-router";
import AuthLayout, { AuthLoadingScreen } from "../components/AuthLayout";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const { loading, handleRegister } = useAuth()
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleRegister({ name, email, password })
    navigate("/")
  };
  if (loading) {
    return <AuthLoadingScreen />;
  }


  return (
    <AuthLayout>
      <div className="auth-content">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Sign up to get started with Resume AI</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="name">Full Name</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="email">Email Address</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="password">Password</label>
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign in instead</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

