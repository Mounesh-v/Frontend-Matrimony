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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState("#D32F2F");
  const [showPass, setShowPass] = useState(false);

  // Handle image preview
  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, profilePic: file });
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // Upload picture if any
      let profilePicName = "";
      if (form.profilePic) profilePicName = form.profilePic.name;

      const res = await axios.post(`${API}/api/user/signup`, {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        profilePic: profilePicName,
      });

      setMsgColor("#2E7D32");
      setMessage("Signup successful! Your account is pending admin approval.");

      // Redirect to login after 2 sec
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      setMsgColor("#D32F2F");
      setMessage(error.response?.data?.message || "Signup failed");
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

        {/* SIGNUP FORM */}
        <form onSubmit={handleSignup} className="space-y-5">
          <div className="flex flex-col items-center">
            <label
              htmlFor="profilePicInput"
              className="w-32 h-32 rounded-full overflow-hidden shadow-md mb-3 border-2 border-pink-600 flex items-center justify-center cursor-pointer bg-gray-100"
            >
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm text-gray-600">
                  choose profile photo
                </span>
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
            <label className="font-semibold text-sm mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
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
            {loading ? <LoadingSpinner size={20} color="#fff" /> : "Signup"}
          </button>
        </form>

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
