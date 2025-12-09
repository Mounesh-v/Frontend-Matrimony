import React, { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

export default function AdminLogin() {
  const { saveToken } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/admin/login`, form);

      // Save admin token
      saveToken(res.data.token);
      localStorage.setItem("adminToken", res.data.token);

      // Redirect to admin dashboard
      window.location.href = "/admin-dashboard";
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid admin credentials");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <div
        className="w-full max-w-md p-8 rounded-xl shadow-lg"
        style={{ backgroundColor: "#FFF0F5", borderTop: "6px solid #C2185B" }}
      >
        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{ color: "#C2185B" }}
        >
          Admin Login
        </h1>

        {err && <p className="text-red-600 font-semibold mb-3">{err}</p>}

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Admin Email"
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              className="w-full p-3 rounded border pr-10"
              style={{ borderColor: "#D81B60" }}
            />

            {/* EYE ICON */}
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? "︶" : "👁"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 rounded font-bold text-white mt-3"
            style={{ backgroundColor: "#C2185B" }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
