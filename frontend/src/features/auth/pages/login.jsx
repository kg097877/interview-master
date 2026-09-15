import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";
import AuthLayout, { AuthLoadingScreen } from "../components/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error, handleLogin } = useAuth()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({ email, password })
    if (success) {
      navigate("/")
    }
  };
  if (loading) {
    return <AuthLoadingScreen />;
  }

  return (
    <AuthLayout>
      <div className="auth-content">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Enter your details to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <div className="auth-actions">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>

          {error && (
            <p className="form-error" style={{ color: '#f87171', fontSize: '13px', margin: '0 0 8px 0', textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Create one now</Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
