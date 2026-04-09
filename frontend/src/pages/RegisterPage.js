import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const { registerNoLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!/^[A-Za-z\s]+$/.test(formData.name))
      return "Full Name should only contain letters and spaces.";
    if (formData.password.length < 8)
      return "Password must be at least 8 characters.";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match.";
    if (!formData.termsAccepted)
      return "You must agree to terms and conditions.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Simplified payload - default role to member
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "member",
      };

      await registerNoLogin(payload);

      // Store updated formData for Login/Profile
      localStorage.setItem("registerData", JSON.stringify(formData));

      setSuccess("Account created! Please login to continue...");
      // Redirect to Login (no auto-login)
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="register">
        <div className="register-content">
          <div className="register-image">
            <img src="/decorative.png" alt="Sign-up illustration" />
          </div>
          <div className="register-form">
            <section className="plain-section">
              <h1>Register for Updates</h1>
              <p>
                Sign up to receive updates about my projects, achievements, and
                creative journey.
              </p>
            </section>
            {error && (
              <p
                className="error-msg"
                style={{
                  color: "#ff6b6b",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                {error}
              </p>
            )}
            {success && (
              <p
                style={{
                  color: "#4CAF50",
                  textAlign: "center",
                  marginBottom: "20px",
                }}
              >
                {success}
              </p>
            )}
            <form onSubmit={handleSubmit}>
              <label htmlFor="name">Full Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                pattern="[A-Za-z\s]+"
                required
              />

              <label htmlFor="username">Preferred Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                minLength="8"
                required
              />

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <div className="checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleChange}
                    required
                  />
                  I agree to terms and conditions
                </label>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;
