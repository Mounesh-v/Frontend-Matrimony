import { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner"; // <-- import spinner

export default function Login() {
  const { saveToken } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/user/login`, form);

      // CHECK APPROVAL STATUS
      if (res.data.user.status !== "approved") {
        toast.error("Your account is pending admin approval.");
        setLoading(false);
        return;
      }

      // Save JWT token
      saveToken(res.data.token);

      localStorage.setItem("userData", JSON.stringify(res.data.user));
      localStorage.setItem("userId", res.data.user._id);

      toast.success("Login successful!");

      // Role redirect
      if (res.data.user.role === "groom")
        return (window.location.href = "/groom-register");

      if (res.data.user.role === "bride")
        return (window.location.href = "/bride-register");

      window.location.href = "/home";
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-10"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-xl p-8"
        style={{
          backgroundColor: "#FFF0F5",
          borderTop: "6px solid #C2185B",
        }}
      >
        <h1
          className="text-3xl font-bold text-center mb-6"
          style={{ color: "#C2185B" }}
        >
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* EMAIL */}
          <div>
            <input
              type="email"
              required
              className="w-full p-3 rounded-lg border outline-none text-black"
              placeholder="Email"
              style={{ borderColor: "#D81B60" }}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* PASSWORD FIELD */}
          <div className="space-y-4">
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

              {/* EYE TOGGLE */}
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xl"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? "︶" : "👁"}
              </span>
            </div>
          </div>

          {/* SUBMIT BUTTON WITH SPINNER */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold shadow-md transition-all hover:opacity-95 active:scale-95"
            style={{ backgroundColor: "#C2185B", color: "white" }}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size={20} color="#fff" />
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* FOOTER LINKS */}
        <p className="text-center mt-5 text-sm">
          Don't have an account?
          <a
            href="/signup"
            style={{ color: "#D81B60" }}
            className="font-semibold ml-1 hover:underline"
          >
            Signup
          </a>
        </p>

        <p className="text-center mt-5 text-sm">
          Are You Admin?
          <a
            href="/admin"
            style={{ color: "#D81B60" }}
            className="font-semibold ml-1 hover:underline"
          >
            Admin
          </a>
        </p>
      </div>
    </div>
  );
}
