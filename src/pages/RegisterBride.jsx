import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterBride() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const API = import.meta.env.VITE_API_URL; 

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) setIsLoggedIn(true);
    else setShowSignupModal(true);
  }, []);

  const [step, setStep] = useState(1);

  // FORM DATA
  const [form, setForm] = useState({
    dob: "",
    religion: "",
    caste: "",
    motherTongue: "",
    heightCm: "",
    weightKg: "",
    education: "",
    occupation: "",
    income: "",
    city: "",
    state: "",
    country: "",
    about: "",
    phoneNumber: "",
  });

  const [photos, setPhotos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [fileError, setFileError] = useState("");
  const [showFileModal, setShowFileModal] = useState(false);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGroom, setHasGroom] = useState(false);
  const [hasBride, setHasBride] = useState(false);


  // FORM CHANGE HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // IMAGE UPLOAD HANDLER
  const handleImageUpload = (e) => {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const files = Array.from(e.target.files);

    const oversized = files.filter((f) => f.size > MAX_SIZE);
    if (oversized.length > 0) {
      setFileError("One or more files exceed 5MB and were not added.");
      setShowFileModal(true);
    }

    const validFiles = files.filter((f) => f.size <= MAX_SIZE);

    if (validFiles.length + photos.length > 5) {
      setErr("Maximum 5 photos allowed.");
      const accept = validFiles.slice(0, 5 - photos.length);
      const previewURLs = accept.map((file) => URL.createObjectURL(file));
      setPhotos((prev) => [...prev, ...accept]);
      setPreviewImages((prev) => [...prev, ...previewURLs]);
      return;
    }

    setPhotos((prev) => [...prev, ...validFiles]);
    const previewURLs = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previewURLs]);
  };

  const removeImage = (index) => {
    const newPhotos = [...photos];
    const newPreview = [...previewImages];

    newPhotos.splice(index, 1);
    newPreview.splice(index, 1);

    setPhotos(newPhotos);
    setPreviewImages(newPreview);
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const fd = new FormData();
      Object.keys(form).forEach((key) => fd.append(key, form[key]));
      photos.forEach((file) => fd.append("photos", file));

      await axios.post(`${API}/api/brides/register`, fd, {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || localStorage.getItem("adminToken")
          }`,
        },
      });

      navigate("/profile");
    } catch (error) {
      setErr(error.response?.data?.message || "Registration failed.");
    }

    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    const userId = localStorage.getItem("userId");

    if (token || adminToken || userId) {
      setIsLoggedIn(true);
      setShowSignupModal(false);
    } else {
      setIsLoggedIn(false);
      setShowSignupModal(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) return;

    const check = async () => {
      try {
        const groomRes = await axios.get(
          ` ${API}/api/grooms/check/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHasGroom(groomRes.data.exists);

        const brideRes = await axios.get(
          ` ${API}/api/brides/check/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHasBride(brideRes.data.exists);
      } catch (error) {
        console.log("Check failed:", error);
      }
    };
    check();
  }, []);

  return (
    <div
      className="min-h-screen flex justify-center items-center px-4"
      style={{ backgroundColor: "#F5F5F5", color: "#212121" }}
    >
      {/* FILE SIZE MODAL */}
      {showFileModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowFileModal(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4"
            style={{ backgroundColor: "#FFF0F5" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#C2185B" }}>
              File Too Large
            </h3>
            <p className="mb-4">{fileError}</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 rounded font-semibold"
                onClick={() => setShowFileModal(false)}
                style={{ backgroundColor: "#D81B60", color: "white" }}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN FORM */}
      {isLoggedIn && (
        <div
          className="w-full max-w-2xl p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: "#FFF0F5" }}
        >
          <h1
            className="text-3xl font-bold text-center mb-6 my-10"
            style={{ color: "#C2185B" }}
          >
            Bride Registration
          </h1>

          {/* STEP PROGRESS BAR */}
          <div className="mb-6">
            <div className="w-full h-2 rounded bg-[#D81B60]">
              <div
                className="h-2 rounded transition-all duration-300"
                style={{
                  width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
                  backgroundColor: "#FFC107",
                }}
              ></div>
            </div>

            <div className="flex justify-between mt-2 text-sm font-semibold">
              <span style={{ color: step >= 1 ? "#FFC107" : "#D81B60" }}>
                Personal
              </span>
              <span style={{ color: step >= 2 ? "#FFC107" : "#D81B60" }}>
                Background
              </span>
              <span style={{ color: step >= 3 ? "#FFC107" : "#D81B60" }}>
                Photos
              </span>
            </div>
          </div>

          {err && <p className="text-red-600 mb-4">{err}</p>}
          {hasGroom && (
            <div className="mb-4 p-4 rounded bg-yellow-100 border-l-4 border-yellow-400">
              <p className="font-semibold">You already have a groom profile.</p>
              <p className="text-sm">You cannot register as a bride while a groom profile exists. If this is an error, please contact support.</p>
            </div>
          )}
          {hasBride && (
            <div className="mb-4 p-4 rounded bg-green-100 border-l-4 border-green-400">
              <p className="font-semibold">You already have a bride profile.</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => navigate("/profile")}
                  className="px-4 py-2 rounded font-semibold"
                  style={{ backgroundColor: "#D81B60", color: "white" }}
                >
                  View Profile
                </button>
                <button
                  onClick={() => navigate(`/update-bride/${localStorage.getItem("userId")}`)}
                  className="px-4 py-2 rounded font-semibold"
                  style={{ backgroundColor: "#FFC107", color: "#212121" }}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              {/* DOB */}
              <div>
                <label className="font-semibold mb-1 block">Date of Birth</label>
                <input
                  type="date"
                  required
                  name="dob"
                  value={form.dob}
                  onChange={(e) => {
                    const dobValue = e.target.value;
                    setForm({ ...form, dob: dobValue });

                    if (!dobValue) return;

                    const today = new Date();
                    const birthDate = new Date(dobValue);

                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();

                    if (
                      m < 0 ||
                      (m === 0 && today.getDate() < birthDate.getDate())
                    ) {
                      age--;
                    }

                    if (age < 18) {
                      setErr("You must be at least 18 years old to register.");
                    } else {
                      setErr("");
                    }
                  }}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />
              </div>

              {/* Religion */}
              <div className="mt-4">
                <label className="font-semibold mb-1 block">Religion</label>
                <input
                  type="text"
                  required
                  name="religion"
                  value={form.religion}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />
              </div>

              {/* Caste */}
              <div className="mt-4">
                <label className="font-semibold mb-1 block">Caste</label>
                <input
                  type="text"
                  required
                  name="caste"
                  value={form.caste}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />
              </div>

              {/* Mother Tongue */}
              <div className="mt-4">
                <label className="font-semibold mb-1 block">Mother Tongue</label>
                <input
                  type="text"
                  required
                  name="motherTongue"
                  value={form.motherTongue}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />
              </div>

              {/* Phone Number */}
              <div className="mt-4">
                <label className="font-semibold mb-1 block">Phone Number</label>
                <input
                  type="tel"
                  required
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />
              </div>

              {/* NEXT BUTTON */}
              <button
                onClick={() => !err && form.dob && setStep(2)}
                disabled={!!err || !form.dob}
                className={`w-full py-3 mt-6 font-bold rounded ${
                  err || !form.dob ? "opacity-50 cursor-not-allowed" : ""
                }`}
                style={{ backgroundColor: "#C2185B", color: "white" }}
              >
                Next
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  required
                  name="heightCm"
                  type="number"
                  placeholder="Height (cm)"
                  value={form.heightCm}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />

                <input
                  required
                  name="weightKg"
                  type="number"
                  placeholder="Weight (kg)"
                  value={form.weightKg}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />

                <input
                  required
                  name="education"
                  type="text"
                  placeholder="Education"
                  value={form.education}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />

                <input
                  required
                  name="occupation"
                  type="text"
                  placeholder="Occupation"
                  value={form.occupation}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />

                <input
                  required
                  name="income"
                  type="text"
                  placeholder="Annual Income (LPA)"
                  value={form.income}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />

                <input
                  required
                  name="city"
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />

                <input
                  required
                  name="state"
                  type="text"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />

                <input
                  required
                  name="country"
                  type="text"
                  placeholder="Country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full p-3 rounded border"
                  style={{ borderColor: "#D81B60" }}
                />

                <textarea
                  required
                  name="about"
                  placeholder="About yourself"
                  value={form.about}
                  onChange={handleChange}
                  className="w-full p-3 rounded border resize-none h-24"
                  style={{ borderColor: "#D81B60" }}
                ></textarea>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-2 font-bold rounded"
                  style={{ backgroundColor: "#D81B60", color: "white" }}
                >
                  Back
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2 font-bold rounded"
                  style={{ backgroundColor: "#C2185B", color: "white" }}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* STEP 3 — Photos */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <label className="font-semibold block mb-2">
                Upload Photos (max 5MB)
              </label>

              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="w-full p-3 border rounded"
                style={{ borderColor: "#D81B60" }}
              />

              {/* Preview Images */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {previewImages.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt="Preview"
                        className="rounded-lg shadow w-full h-32 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 font-bold rounded"
                  style={{ backgroundColor: "#D81B60", color: "white" }}
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={loading || hasGroom || hasBride}
                  className="px-6 py-2 font-bold rounded"
                  style={{ backgroundColor: "#C2185B", color: "white" }}
                >
                  {loading
                    ? "Submitting..."
                    : hasGroom
                    ? "Disabled: Groom Exists"
                    : hasBride
                    ? "Disabled: Bride Exists"
                    : "Submit"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
