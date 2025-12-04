import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginGroom = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API}/api/grooms/login`,
        form
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data));

      navigate("/profile"); // redirect after success
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
          Groom Login
        </h1>

        {err && <p className="text-red-600 mb-3">{err}</p>}

        {/* EMAIL */}
        <label className="font-semibold">Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded border"
          style={{ borderColor: "#D81B60" }}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        {/* PASSWORD */}
        <label className="font-semibold">Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          className="w-full p-3 mb-6 rounded border"
          style={{ borderColor: "#D81B60" }}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* LOGIN BUTTON */}
        <button
          type="submit"
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
            onClick={() => navigate("/groom-register")}
          >
            Register here
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginGroom;
