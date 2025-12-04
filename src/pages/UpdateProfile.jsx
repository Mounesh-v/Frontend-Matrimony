import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [groom, setGroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPhotos, setNewPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const fetchProfile = async () => {
    try {
      if (!id) {
        setMessage("Invalid profile id");
        setLoading(false);
        return;
      }

      const token =
        localStorage.getItem("token") || localStorage.getItem("adminToken");

      let res;
      try {
        res = await axios.get(`${API}/api/grooms/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        if (err.response?.status === 404) {
          res = await axios.get(`${API}/api/grooms/user/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          throw err;
        }
      }

      setGroom(res.data);
    } catch {
      setMessage("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const removePhoto = (url) => {
    setGroom({
      ...groom,
      photos: groom.photos.filter((p) => p !== url),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    const token =
      localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (!token) return navigate("/login");

    const fd = new FormData();

    const fields = [
      "dob",
      "religion",
      "caste",
      "motherTongue",
      "heightCm",
      "weightKg",
      "education",
      "occupation",
      "income",
      "city",
      "state",
      "country",
      "about",
      "phoneNumber",
    ];

    fields.forEach((field) => fd.append(field, groom[field]));

    groom.photos.forEach((photoUrl) =>
      fd.append("existingPhotos", photoUrl)
    );

    newPhotos.forEach((file) => fd.append("photos", file));

    try {
      await axios.put(`${API}/api/grooms/${id}`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      setMessage(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return (
      <div
        className="h-screen flex justify-center items-center text-xl"
        style={{ color: "#C2185B" }}
      >
        Loading profile...
      </div>
    );
  }

  if (!groom) {
    return (
      <div className="h-screen flex justify-center items-center text-xl text-red-600">
        {message || "Profile not found"}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <form
        onSubmit={handleUpdate}
        className="max-w-3xl mx-auto p-8 rounded-xl shadow-xl"
        style={{ backgroundColor: "#FFF0F5" }}
      >
        <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: "#C2185B" }}
        >
          Edit Groom Profile
        </h1>

        {message && (
          <p
            className="mb-4 text-center font-semibold"
            style={{ color: "#C2185B" }}
          >
            {message}
          </p>
        )}

        {/* FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            value={groom.dob ? groom.dob.substring(0, 10) : ""}
            onChange={(e) => setGroom({ ...groom, dob: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#C2185B" }}
          />

          {["religion", "caste", "motherTongue", "heightCm", "weightKg"].map(
            (field) => (
              <input
                key={field}
                type={field.includes("height") || field.includes("weight") ? "number" : "text"}
                value={groom[field] || ""}
                placeholder={
                  field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())
                }
                onChange={(e) =>
                  setGroom({ ...groom, [field]: e.target.value })
                }
                className="w-full p-3 rounded border"
                style={{ borderColor: "#C2185B" }}
              />
            )
          )}

          {["education", "occupation", "income", "city", "state", "country", "phoneNumber"].map(
            (field) => (
              <input
                key={field}
                type="text"
                value={groom[field] || ""}
                placeholder={
                  field.charAt(0).toUpperCase() + field.slice(1)
                }
                onChange={(e) =>
                  setGroom({ ...groom, [field]: e.target.value })
                }
                className="w-full p-3 rounded border"
                style={{ borderColor: "#C2185B" }}
              />
            )
          )}
        </div>

        <textarea
          rows="4"
          value={groom.about || ""}
          placeholder="About"
          onChange={(e) => setGroom({ ...groom, about: e.target.value })}
          className="w-full p-3 mt-4 rounded border"
          style={{ borderColor: "#C2185B" }}
        ></textarea>

        {/* EXISTING PHOTOS */}
        <h2 className="mt-6 font-bold text-lg" style={{ color: "#C2185B" }}>
          Existing Photos
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
          {groom.photos?.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={`${API}${img}`}
                className="w-full h-40 object-cover rounded-lg shadow-md"
              />

              <button
                type="button"
                onClick={() => removePhoto(img)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* NEW PHOTOS */}
        <div className="mt-6">
          <label className="font-bold text-lg" style={{ color: "#C2185B" }}>
            Add New Photos
          </label>
          <input
            type="file"
            multiple
            className="w-full p-3 mt-2 rounded border"
            onChange={(e) => setNewPhotos([...e.target.files])}
            style={{ borderColor: "#C2185B" }}
          />
        </div>

        <button
          className="w-full p-3 mt-6 rounded font-bold shadow-md text-lg transition-all"
          style={{ backgroundColor: "#C2185B", color: "white" }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
