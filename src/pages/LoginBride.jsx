import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginBride = () => {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/brides/login`,
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data));

      navigate("/bride-profile");
    } catch (error) {
      setErr(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div
      className="w-full h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F5F5F5", color: "#212121" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: "#FFF0F5" }}
      >
        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{ color: "#C2185B" }}
        >
          Bride Login
        </h1>

        {/* ERROR MESSAGE */}
        {err && (
          <p className="text-red-600 text-center mb-3 text-sm">{err}</p>
        )}

        {/* EMAIL */}
        <label className="font-semibold block mb-1">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full p-3 mb-3 rounded border"
          style={{ borderColor: "#D81B60" }}
          value={form.email}
          onChange={handleChange}
        />

        {/* PASSWORD */}
        <label className="font-semibold block mb-1">Password</label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          className="w-full p-3 mb-4 rounded border"
          style={{ borderColor: "#D81B60" }}
          value={form.password}
          onChange={handleChange}
        />

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 rounded font-bold shadow transition ease-in-out duration-150 hover:opacity-95 active:scale-95"
          style={{ backgroundColor: "#C2185B", color: "white" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* REGISTER LINK */}
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <span
            className="cursor-pointer font-semibold"
            style={{ color: "#D81B60" }}
            onClick={() => navigate("/bride-register")}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginBride;
