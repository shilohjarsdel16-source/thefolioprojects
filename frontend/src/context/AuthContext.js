//frontend/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //On app load: if a token exists in localStorage, fetch the user's data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem("token")) // remove bad token
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  //login():call the backend, save token, store user in state
  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user; //return user so caller can check role
  };

  //register(): POST /auth/register with full payload (auto-login)
  const register = async (payload) => {
    const { data } = await API.post("/auth/register", payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  };

  //registerNoLogin(): POST /auth/register WITHOUT auto-login (for Register->Login flow)
  const registerNoLogin = async (payload) => {
    const { data } = await API.post("/auth/register", payload);
    return data.user; // Return user data, no token/user state set
  };

  //logout():clear token and user from memory
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("registerData");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        registerNoLogin,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

//Custom hook — use this instead of useContext(AuthContext) everywhere
export const useAuth = () => useContext(AuthContext);
