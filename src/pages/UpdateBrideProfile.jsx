import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateBrideProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bride, setBride] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPhotos, setNewPhotos] = useState([]);
  const [message, setMessage] = useState("");
  const API = import.meta.env.VITE_API_URL;

  // Fetch Bride Profile
  const fetchProfile = async () => {
    try {
      if (!id) {
        setMessage("Invalid profile id");
        setLoading(false);
        return;
      }

      const token =
        localStorage.getItem("token") || localStorage.getItem("adminToken");

      const res = await axios.get(`${API}/api/brides/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBride(res.data);
    } catch (err) {
      console.log(err);
      setMessage("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  // Remove Photo (frontend only)
  const removePhoto = (url) => {
    setBride({
      ...bride,
      photos: bride.photos.filter((p) => p !== url),
    });
  };

  // Update Bride Profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    const token =
      localStorage.getItem("token") || localStorage.getItem("adminToken");

    if (!token) {
      navigate("/login");
      return;
    }

    const fd = new FormData();

    // Allowed Fields (same pattern as Groom)
    const allowed = [
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

    allowed.forEach((field) => {
      if (bride[field] !== undefined) {
        if (field === "dob") {
          fd.append("dob", bride.dob.substring(0, 10));
        } else {
          fd.append(field, bride[field]);
        }
      }
    });

    // Existing Photos
    bride.photos.forEach((p) => fd.append("existingPhotos", p));

    // New Photos
    newPhotos.forEach((file) => fd.append("photos", file));

    try {
      await axios.put(`${API}/api/brides/${id}`, fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 1200);
    } catch (err) {
      console.log(err);
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

  if (!bride) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        {message || "Profile not found"}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10" style={{ backgroundColor: "#F5F5F5" }}>
      <form
        onSubmit={handleUpdate}
        className="max-w-3xl mx-auto p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: "#FFF0F5" }}
      >
        <h1 className="text-3xl font-bold mb-6" style={{ color: "#C2185B" }}>
          Edit Bride Profile
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
          {/* DOB */}
          <input
            type="date"
            value={bride.dob ? bride.dob.substring(0, 10) : ""}
            onChange={(e) => setBride({ ...bride, dob: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="text"
            value={bride.religion || ""}
            placeholder="Religion"
            onChange={(e) => setBride({ ...bride, religion: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="text"
            value={bride.caste || ""}
            placeholder="Caste"
            onChange={(e) => setBride({ ...bride, caste: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="text"
            value={bride.motherTongue || ""}
            placeholder="Mother Tongue"
            onChange={(e) =>
              setBride({ ...bride, motherTongue: e.target.value })
            }
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="number"
            value={bride.heightCm || ""}
            placeholder="Height (cm)"
            onChange={(e) => setBride({ ...bride, heightCm: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="number"
            value={bride.weightKg || ""}
            placeholder="Weight (kg)"
            onChange={(e) => setBride({ ...bride, weightKg: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="text"
            value={bride.education || ""}
            placeholder="Education"
            onChange={(e) => setBride({ ...bride, education: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="text"
            value={bride.occupation || ""}
            placeholder="Occupation"
            onChange={(e) => setBride({ ...bride, occupation: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="text"
            value={bride.income || ""}
            placeholder="Income"
            onChange={(e) => setBride({ ...bride, income: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="text"
            value={bride.city || ""}
            placeholder="City"
            onChange={(e) => setBride({ ...bride, city: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="text"
            value={bride.state || ""}
            placeholder="State"
            onChange={(e) => setBride({ ...bride, state: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="text"
            value={bride.country || ""}
            placeholder="Country"
            onChange={(e) => setBride({ ...bride, country: e.target.value })}
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />

          <input
            type="text"
            value={bride.phoneNumber || ""}
            placeholder="Phone Number"
            onChange={(e) =>
              setBride({ ...bride, phoneNumber: e.target.value })
            }
            className="w-full p-3 rounded border"
            style={{ borderColor: "#D81B60" }}
          />
        </div>

        {/* About */}
        <textarea
          value={bride.about || ""}
          placeholder="About"
          rows="4"
          onChange={(e) => setBride({ ...bride, about: e.target.value })}
          className="w-full p-3 mt-4 rounded border"
          style={{ borderColor: "#D81B60" }}
        ></textarea>

        {/* Existing Photos */}
        <h2 className="mt-6 font-bold text-lg">Existing Photos</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
          {bride.photos?.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={`${API}${img}`}
                className="w-full h-40 object-cover rounded shadow"
              />
              <button
                type="button"
                onClick={() => removePhoto(img)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-sm rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Add New Photos */}
        <div className="mt-6">
          <label className="font-bold">Add New Photos</label>
          <input
            type="file"
            multiple
            className="w-full p-3 mt-2 border rounded"
            onChange={(e) => setNewPhotos([...e.target.files])}
            style={{ borderColor: "#D81B60" }}
          />
        </div>

        {/* Update Button */}
        <button
          className="w-full mt-6 p-3 rounded font-bold shadow"
          style={{ backgroundColor: "#C2185B", color: "white" }}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateBrideProfile;
