import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import logo from "../assets/Logo.png";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null); // user full data from DB
  const [loading, setLoading] = useState(true);

  // Fetch user details from DB using userId stored in localStorage
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const adminToken = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("userData");

    if (adminToken && !userId) {
      // Admin logged in
      setUser({ role: "admin" });
      setLoading(false);
      return;
    }

    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("userId");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // ROLE LOGIC
  const isAdmin = user?.role === "admin";
  const isUser =
    user?.role === "user" || user?.role === "groom" || user?.role === "bride";

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="fixed top-0 left-0 w-full h-16 px-6 py-4 flex items-center justify-between shadow z-50"
        style={{ backgroundColor: "#C2185B", color: "white" }}
      >
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer flex items-center gap-3"
        >
          <img
            src={logo}
            alt="Logo"
            className="w-9 h-9 md:w-16 md:h-16 object-contain rounded-full"
          />
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {/* ALWAYS SHOW */}
          <Link to="/home" className="font-semibold hover:text-[#D4A437]">
            Home
          </Link>

          <Link to="/service" className="font-semibold hover:text-[#D4A437]">
            Service
          </Link>

          {/* ADMIN MENU */}
          {isAdmin && (
            <>
              <Link
                to="/admin-dashboard"
                className="font-semibold hover:text-[#D4A437]"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-1 rounded font-semibold"
                style={{ backgroundColor: "#D4A437", color: "#212121" }}
              >
                Logout
              </button>
            </>
          )}

          {/* USER MENU */}
          {isUser && !loading && (
            <>
              <Link
                to="/profile"
                className="font-semibold hover:text-[#D4A437]"
              >
                Profile
              </Link>

              <Link
                to="/matches"
                className="font-semibold hover:text-[#D4A437]"
              >
                Matches
              </Link>

              <img
                src={
                  user?.profilePic
                    ? user.profilePic
                    : `https://ui-avatars.com/api/?name=${user?.name}`
                }
                className="w-8 h-8 rounded-full shadow"
              />

              <button
                onClick={handleLogout}
                className="px-4 py-1 rounded font-semibold"
                style={{ backgroundColor: "#D4A437", color: "#212121" }}
              >
                Logout
              </button>
            </>
          )}

          {/* GUEST MENU */}
          {!isAdmin && !isUser && !loading && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1 rounded font-semibold"
                style={{ backgroundColor: "#D4A437", color: "#212121" }}
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-4 py-1 rounded font-semibold"
                style={{ backgroundColor: "#D4A437", color: "#212121" }}
              >
                Signup
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-3xl font-bold"
        >
          ☰
        </button>
      </nav>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div
          className="
      fixed top-0 left-0 h-full w-64 bg-white z-50 
      shadow-2xl border-r-4 border-[#C2185B]
      p-6 flex flex-col gap-5
      animate-slideIn
    "
        >
          {/* HEADER BAR */}
          <div className="flex items-center justify-between pb-4 border-b">
            <h2 className="text-2xl font-bold text-[#C2185B]">Menu</h2>

            <button
              onClick={() => setSidebarOpen(false)}
              className="text-3xl font-bold text-[#C2185B] hover:scale-110 transition"
            >
              ✕
            </button>
          </div>

          {/* ALWAYS SHOW */}
          <div className="flex flex-col gap-4 mt-4">
            <Link
              to="/home"
              onClick={() => setSidebarOpen(false)}
              className="text-lg font-semibold text-gray-700 hover:text-[#C2185B] transition"
            >
              Home
            </Link>

            <Link
              to="/service"
              onClick={() => setSidebarOpen(false)}
              className="text-lg font-semibold text-gray-700 hover:text-[#C2185B] transition"
            >
              Service
            </Link>
          </div>

          {/* ADMIN MENU */}
          {isAdmin && (
            <>
              <div className="border-t pt-4 flex flex-col gap-4">
                <Link
                  to="/admin-dashboard"
                  onClick={() => setSidebarOpen(false)}
                  className="text-lg font-semibold text-gray-700 hover:text-[#C2185B] transition"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 rounded-lg bg-[#C2185B] text-white font-semibold shadow hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}

          {/* USER MENU */}
          {isUser && (
            <>
              <div className="border-t pt-4 flex flex-col gap-4">
                <Link
                  to="/profile"
                  onClick={() => setSidebarOpen(false)}
                  className="text-lg font-semibold text-gray-700 hover:text-[#C2185B] transition"
                >
                  Profile
                </Link>

                <Link
                  to="/matches"
                  onClick={() => setSidebarOpen(false)}
                  className="text-lg font-semibold text-gray-700 hover:text-[#C2185B] transition"
                >
                  Matches
                </Link>

                {/* USER INFO */}
                <div className="flex items-center gap-3 mt-2 p-2 rounded bg-gray-100">
                  <img
                    src={
                      user?.profilePic
                        ? user.profilePic
                        : `https://ui-avatars.com/api/?name=${user?.name}`
                    }
                    className="w-10 h-10 rounded-full shadow"
                  />
                  <span className="font-semibold text-[#C2185B] text-lg">
                    {user?.name}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-2 rounded-lg bg-[#C2185B] text-white font-semibold shadow hover:opacity-90 transition"
                >
                  Logout
                </button>
              </div>
            </>
          )}

          {/* GUEST MENU */}
          {!isAdmin && !isUser && (
            <>
              <div className="border-t pt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    navigate("/login");
                    setSidebarOpen(false);
                  }}
                  className="w-full py-2 rounded-lg bg-[#C2185B] text-white font-semibold shadow hover:opacity-90 transition"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    navigate("/signup");
                    setSidebarOpen(false);
                  }}
                  className="w-full py-2 rounded-lg bg-[#C2185B] text-white font-semibold shadow hover:opacity-90 transition"
                >
                  Signup
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
