import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

function Nav({ children }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(
    JSON.parse(localStorage.getItem("theme") ?? "true"),
  );
  const { user } = useAuth();

  const toggleMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", JSON.stringify(newMode));
  };

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
    }
  }, [isDarkMode]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <button className="toggle-btn" onClick={toggleMode}>
        <span className="icon sun">☀️</span>
        <span className="icon moon">🌙</span>
      </button>

      <header>
        <div className="logo">LeeVibes</div>
        <nav>
          <ul>
            <li>
              <Link to="/home" className={isActive("/home") ? "active" : ""}>
                HOME
              </Link>
            </li>
            <li>
              <Link to="/about" className={isActive("/about") ? "active" : ""}>
                ABOUT
              </Link>
            </li>
            {user?.role !== "admin" && (
              <li>
                <Link
                  to="/contact"
                  className={isActive("/contact") ? "active" : ""}
                >
                  CONTACT
                </Link>
              </li>
            )}
            {!user && (
              <li>
                <Link
                  to="/register"
                  className={isActive("/register") ? "active" : ""}
                >
                  REGISTER
                </Link>
              </li>
            )}
            {user && (
              <>
                <li>
                  <Link
                    to="/create-post"
                    className={isActive("/create-post") ? "active" : ""}
                  >
                    NEW POST
                  </Link>
                </li>
                {user && user.role !== "admin" ? (
                  <li className="profile-li">
                    <Link
                      to="/profile"
                      className={isActive("/profile") ? "active" : ""}
                    >
                      <img
                        src={
                          user.profilePic
                            ? user.profilePic.startsWith("avatar")
                              ? `/avatars/${user.profilePic}`
                              : `${process.env.REACT_APP_API_URL?.replace("/api", "")}/uploads/${user.profilePic}`
                            : "/avatars/avatar1.png"
                        }
                        alt="Profile"
                        className="user-avatar-nav"
                      />
                    </Link>
                  </li>
                ) : null}
              </>
            )}

            {user?.role === "admin" && (
              <>
                <li>
                  <Link
                    to="/admin"
                    className={isActive("/admin") ? "active" : ""}
                  >
                    ADMIN
                  </Link>
                </li>
                <li className="profile-li">
                  <Link to="/profile">
                    <img
                      src={
                        user.profilePic
                          ? user.profilePic.startsWith("avatar")
                            ? `/avatars/${user.profilePic}`
                            : `${process.env.REACT_APP_API_URL?.replace("/api", "")}/uploads/${user.profilePic}`
                          : "/default-avatar.png"
                      }
                      alt="Profile"
                      className="user-avatar-nav"
                    />
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main>{children}</main>
    </>
  );
}

export default Nav;
