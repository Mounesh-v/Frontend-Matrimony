import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import useAuth from "./hooks/useAuth";
import "./input.css";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

import RegisterGroom from "./pages/RegisterGroom";
import RegisterBride from "./pages/RegisterBride";

import LoginGroom from "./pages/LoginGroom";
import LoginBride from "./pages/LoginBride";

import GroomList from "./pages/GroomList";
import BrideList from "./pages/BrideList";

import GroomProfile from "./pages/GroomProfile";
import BrideProfile from "./pages/BrideProfile";

import UpdateProfile from "./pages/UpdateProfile"; // Groom update
import UpdateBrideProfile from "./pages/UpdateBrideProfile"; // Bride update

import Profile from "./pages/Profile"; // auto-detect profile for logged in user
import Matches from "./components/Matches";
import TestGroom from "./pages/TestGroom";
import Service from "./components/Service";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/admin" replace />;
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/groom-login" element={<LoginGroom />} />
          <Route path="/bride-login" element={<LoginBride />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* Home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/service" element={<Service />} />

          {/* Protected: Register Groom/Bride */}
          <Route
            path="/groom-register"
            element={
              <ProtectedRoute>
                <RegisterGroom />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bride-register"
            element={
              <ProtectedRoute>
                <RegisterBride />
              </ProtectedRoute>
            }
          />

          {/* Protected: Lists */}
          <Route
            path="/grooms"
            element={
              <ProtectedRoute>
                <GroomList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/brides"
            element={
              <ProtectedRoute>
                <BrideList />
              </ProtectedRoute>
            }
          />

          {/* Protected: Profiles */}
          <Route
            path="/groom/:id"
            element={
              <ProtectedRoute>
                <GroomProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bride/:id"
            element={
              <ProtectedRoute>
                <BrideProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected: Update Pages */}
          <Route
            path="/groom/update/:id"
            element={
              <ProtectedRoute>
                <UpdateProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bride/update/:id"
            element={
              <ProtectedRoute>
                <UpdateBrideProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected: Universal Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected: Matches */}
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />

          {/* Protected: Test Page */}
          <Route
            path="/test-groom"
            element={
              <ProtectedRoute>
                <TestGroom />
              </ProtectedRoute>
            }
          />

          {/* Admin Panel (Already Protected) */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}
