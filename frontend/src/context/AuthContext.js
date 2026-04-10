//frontend/src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

const AuthContext = createContext();

const normalizeAuthResponse = (res) => {
  const payload = res.data?.data || res.data;
  return {
    user: payload?.user || payload,
    token: payload?.token || payload?.accessToken || res.data?.token,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //On app load: if a token exists in localStorage, fetch the user's data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/auth/me")
        .then((res) => {
          const { user: meUser } = normalizeAuthResponse(res);
          setUser(meUser);
        })
        .catch(() => localStorage.removeItem("token")) // remove bad token
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  //login(): call the backend, save token, store user in state
  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const { user: loginUser, token } = normalizeAuthResponse(res);
    if (!token) throw new Error("Login response did not include a token");
    localStorage.setItem("token", token);
    setUser(loginUser);
    return loginUser; // return user so caller can check role
  };

  //register(): POST /auth/register with full payload (auto-login)
  const register = async (payload) => {
    const res = await API.post("/auth/register", payload);
    const { user: registerUser, token } = normalizeAuthResponse(res);
    if (token) {
      localStorage.setItem("token", token);
      setUser(registerUser);
    }
    return registerUser;
  };

  //registerNoLogin(): POST /auth/register WITHOUT auto-login (for Register->Login flow)
  const registerNoLogin = async (payload) => {
    const res = await API.post("/auth/register", payload);
    const { user: registerUser } = normalizeAuthResponse(res);
    return registerUser; // Return user data, no token/user state set
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
