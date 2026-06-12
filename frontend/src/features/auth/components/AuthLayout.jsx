import { Outlet } from "react-router";
import "../auth.scss";

export function AuthLoadingScreen() {
  return (
    <div className="auth-loading">
      <div className="auth-loading-bg">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="auth-loading-card">
        <div className="auth-loading-spinner"></div>
        <p className="auth-loading-text">Loading...</p>
        <div className="auth-loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default function AuthLayout({ children }) {

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="auth-card">
        {children || <Outlet />}
      </div>
    </div>
  );
}
