import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fromRegister, setFromRegister] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Prefill from register data
  useEffect(() => {
    const registerData = localStorage.getItem("registerData");
    if (registerData) {
      try {
        const data = JSON.parse(registerData);
        setEmail(data.email);
        setPassword(data.password);
        setFromRegister(true);
      } catch (e) {
        console.error("Invalid register data");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      // Clear register data after successful login
      localStorage.removeItem("registerData");
      // Redirect: profile for users, admin for admins
      navigate(user.role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register-content">
        <div className="register-form">
          <h2 className="login-title">Welcome Back to LeeVibes ✨</h2>
          <p className="login-subtitle">
            Connect, share, and vibe with music lovers worldwide.
          </p>

          {error && (
            <p
              className="error-msg"
              style={{
                color: "#ff6b6b",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
          {fromRegister && (
            <p
              style={{
                color: "#4CAF50",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Welcome back! Your details are pre-filled.
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email:</label>
            <input
              id="login-email"
              className="input-with-icon"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="login-password">Password:</label>
            <input
              id="login-password"
              className="input-with-icon"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? <span className="spinner"></span> : "Login"}
            </button>
          </form>

          <div className="forgot-password">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <div className="social-login">
            <p>Or continue with</p>
            <div className="social-login-grid">
              <button className="social-btn google">Google</button>
              <button className="social-btn fb">Facebook</button>
              <button className="social-btn apple">Apple</button>
            </div>
          </div>

          <div className="login-highlights">
            <h3>Why LeeVibes?</h3>
            <div className="feature-grid">
              <div className="feature-card">
                <span>🔒</span>
                <p>Secure Login</p>
              </div>
              <div className="feature-card">
                <span>⚡</span>
                <p>Instant Access</p>
              </div>
              <div className="feature-card">
                <span>🎵</span>
                <p>Music Community</p>
              </div>
            </div>
          </div>

          <p className="register-link">
            Don&apos;t have an account?{" "}
            <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
