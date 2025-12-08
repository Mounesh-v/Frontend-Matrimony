import React, { useState } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    profilePic: null,
  });

  const API = import.meta.env.VITE_API_URL;

  const [preview, setPreview] = useState(null);
  const [stage, setStage] = useState("signup"); // signup → otp
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState("#D32F2F");
  const [showPass, setShowPass] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, profilePic: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const sendOtp = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${API}/api/otp/send-otp`, {
        email: form.email,
      });

      setStage("otp");
      setMsgColor("#2E7D32");
      setMessage("OTP sent to your email. Check inbox!");

      setTimer(120); // restart 2-minute timer
      setCanResend(false); // disable resend
    } catch (error) {
      console.log(error);
      setMsgColor("#D32F2F");
      setMessage(error.response?.data?.message || "Failed to send OTP");
    }

    setLoading(false);
  };

  React.useEffect(() => {
    if (stage !== "otp") return;

    if (timer === 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, timer]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      await axios.post(`${API}/api/otp/verify-otp`, {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        otp,
        profilePic: form.profilePic ? form.profilePic.name : "",
      });

      setMsgColor("#2E7D32");
      setMessage("Signup successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    } catch (error) {
      setMsgColor("#D32F2F");
      setMessage(error.response?.data?.message || "Invalid OTP");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex my-20 items-center justify-center px-6 py-10"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-xl p-8"
        style={{ backgroundColor: "#FFF0F5", borderTop: "6px solid #C2185B" }}
      >
        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{ color: "#C2185B" }}
        >
          Create Account
        </h1>

        {message && (
          <p
            className="text-center mb-4 font-semibold"
            style={{ color: msgColor }}
          >
            {message}
          </p>
        )}

        {/* ---------------- SIGNUP STAGE ---------------- */}
        {stage === "signup" && (
          <form onSubmit={sendOtp} className="space-y-5">
            <div className="flex flex-col items-center">
              <label
                htmlFor="profilePicInput"
                className="w-32 h-32 rounded-full overflow-hidden shadow-md mb-3 border-2 border-pink-600 flex items-center justify-center cursor-pointer bg-gray-100"
              >
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm text-gray-600">Choose File</span>
                )}
              </label>

              <input
                id="profilePicInput"
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-sm mb-1 block">
                Full Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-3 rounded-lg border outline-none text-black"
                style={{ borderColor: "#D81B60" }}
              />
            </div>

            <div>
              <label className="font-semibold text-sm mb-1 block">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full p-3 rounded-lg border outline-none text-black"
                style={{ borderColor: "#D81B60" }}
              />
            </div>

            <div>
              <label className="font-semibold text-sm mb-1 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
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
            </div>

            <div>
              <label className="font-semibold text-sm mb-1 block">
                Select Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full p-3 rounded-lg border outline-none cursor-pointer"
                style={{ borderColor: "#D81B60" }}
              >
                <option value="user">Normal User</option>
                <option value="groom">Groom</option>
                <option value="bride">Bride</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-bold text-white shadow-md"
              style={{ backgroundColor: "#C2185B" }}
            >
              {loading ? <LoadingSpinner size={20} color="#fff" /> : "Send OTP"}
            </button>
          </form>
        )}

        {/* ---------------- OTP VERIFICATION SCREEN ---------------- */}
        {stage === "otp" && (
          <div className="space-y-5">
            <h2 className="text-center font-semibold text-lg">Verify OTP</h2>

            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full p-3 rounded-lg border text-black"
              style={{ borderColor: "#D81B60" }}
            />

            {/* TIMER */}
            <p
              className="text-center text-sm font-semibold"
              style={{ color: "#C2185B" }}
            >
              {timer > 0
                ? `OTP expires in ${formatTime(timer)}`
                : "OTP expired. Please resend."}
            </p>

            <button
              onClick={verifyOtp}
              disabled={timer === 0}
              className={`w-full py-3 rounded-lg font-bold text-white ${
                timer === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              style={{ backgroundColor: "#C2185B" }}
            >
              {loading ? (
                <LoadingSpinner size={20} color="#fff" />
              ) : (
                "Verify OTP"
              )}
            </button>

            {/* RESEND OTP */}
            <button
              onClick={sendOtp}
              disabled={!canResend}
              className={`w-full py-2 rounded-lg font-semibold ${
                canResend
                  ? "text-[#C2185B]"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              Resend OTP
            </button>
          </div>
        )}

        <p className="text-center mt-5 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold hover:underline"
            style={{ color: "#D81B60" }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
