import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashPage from "./pages/SplashPage";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import PostPage from "./pages/PostPage";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import AdminPage from "./pages/AdminPage";
import MenjaPage from "./pages/MenjaPage";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<SplashPage />} />
      <Route
        path="/home"
        element={
          <Nav>
            <HomePage />
          </Nav>
        }
      />
      <Route
        path="/about"
        element={
          <Nav>
            <AboutPage />
          </Nav>
        }
      />
      <Route
        path="/contact"
        element={
          <Nav>
            <ContactPage />
          </Nav>
        }
      />
      <Route
        path="/login"
        element={
          <Nav>
            <LoginPage />
          </Nav>
        }
      />
      <Route
        path="/register"
        element={
          <Nav>
            <RegisterPage />
          </Nav>
        }
      />
      <Route
        path="/post/:id"
        element={
          <Nav>
            <PostPage />
          </Nav>
        }
      />

      {/* Protected user pages */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Nav>
              <ProfilePage />
            </Nav>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-post"
        element={
          <ProtectedRoute>
            <Nav>
              <CreatePostPage />
            </Nav>
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit-post/:id"
        element={
          <ProtectedRoute>
            <Nav>
              <EditPostPage />
            </Nav>
          </ProtectedRoute>
        }
      />

      {/* Admin page */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <Nav>
              <AdminPage />
            </Nav>
          </ProtectedRoute>
        }
      />
      <Route path="/menja" element={<MenjaPage />} />
    </Routes>
  );
}

export default App;
