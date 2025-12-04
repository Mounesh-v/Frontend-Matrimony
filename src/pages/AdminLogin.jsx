import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

export default function AdminLogin() {
  const { saveToken } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [stage, setStage] = useState("login"); // login → otp
  const [otp, setOtp] = useState("");
  const API = import.meta.env.VITE_API_URL;

  // TIMER STATES
  const [timer, setTimer] = useState(0);

  // TIMER EFFECT
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ---------------------- SEND LOGIN OTP (email + password) ----------------------
  const sendLoginOtp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/otp/admin-send-otp`, {
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        setStage("otp");
        setTimer(120); // Start 2-minute timer
      } else {
        setErr(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid admin credentials");
    }

    setLoading(false);
  };

  // ---------------------- RESEND OTP (email only) ----------------------
  const resendOtp = async () => {
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/otp/admin-send-otp`, {
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        setTimer(120); // Restart timer
      } else {
        setErr(res.data.message || "Failed to resend OTP");
      }
    } catch (error) {
      setErr(error.response?.data?.message || "Error resending OTP");
    }

    setLoading(false);
  };

  // ---------------------- VERIFY OTP ----------------------
  const verifyOtp = async () => {
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/otp/admin-verify-otp`, {
        email: form.email,
        otp,
      });

      saveToken(res.data.token);
      window.location.href = "/admin-dashboard";
    } catch (error) {
      setErr(error.response?.data?.message || "Invalid OTP");
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

        {/* ---------------------- LOGIN SCREEN ---------------------- */}
        {stage === "login" && (
          <form onSubmit={sendLoginOtp} className="space-y-4">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
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
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* ---------------------- OTP SCREEN ---------------------- */}
        {stage === "otp" && (
          <div className="space-y-5">
            <h2 className="text-center font-semibold text-lg">Verify OTP</h2>

            <input
              type="text"
              maxLength="6"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-3 rounded-lg border text-black"
              style={{ borderColor: "#D81B60" }}
            />

            {/* TIMER */}
            <p className="text-center font-semibold text-pink-700">
              {timer > 0
                ? `OTP Expires In: ${formatTime(timer)}`
                : "OTP Expired"}
            </p>

            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full p-3 rounded-lg text-white font-bold"
              style={{ backgroundColor: "#C2185B" }}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {/* RESEND OTP */}
            <button
              onClick={resendOtp}
              disabled={loading || timer > 0}
              className={`w-full text-center font-semibold ${
                timer > 0 ? "opacity-40 cursor-not-allowed" : "text-[#C2185B]"
              }`}
            >
              {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : "Resend OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
