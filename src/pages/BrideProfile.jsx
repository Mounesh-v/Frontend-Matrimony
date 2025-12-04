import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BrideProfile = () => {
  const { id } = useParams();
  const [bride, setBride] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  // Helper function to decode JWT token
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  // Check if current user is the owner
  const checkOwnership = useCallback(() => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");
    const activeToken = token || adminToken;
    const API = import.meta.env.VITE_API_URL;

    if (!activeToken || !bride) {
      setIsOwner(false);
      return;
    }

    const decoded = decodeToken(activeToken);
    if (decoded && decoded.id) {
      // Compare the ID from token with the bride's ID
      setIsOwner(decoded.id === bride._id || decoded.id === id);
    } else {
      setIsOwner(false);
    }
  }, [bride, id]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(` ${API}/api/brides/${id}`);
      setBride(res.data);
    } catch (err) {
      console.log("Error:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (bride) {
      checkOwnership();
    }
  }, [bride, checkOwnership]);

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center text-xl"
        style={{ color: "#C2185B" }}
      >
        Loading profile...
      </div>
    );
  }

  if (!bride) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-red-600">
        Bride not found
      </div>
    );
  }

  // Age calculation
  const age = bride.dob
    ? new Date().getFullYear() - new Date(bride.dob).getFullYear()
    : "N/A";

  return (
    <div
      className="min-h-screen p-10"
      style={{ backgroundColor: "#F5F5F5", color: "#212121" }}
    >
      {/* Main Profile Card */}
      <div
        className="max-w-4xl mx-auto p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: " #C2185B" }}
      >
        {/* PHOTO SECTION */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* MAIN PHOTO */}
          <div className="w-full md:w-1/3">
            {bride.photos?.length > 0 ? (
              <img
                src={` ${API}${bride.photos[0]}`}
                className="w-full h-72 object-cover rounded-lg shadow"
                alt="profile"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${bride.name}&size=350&background=E91E63&color=fff`}
                className="w-full h-72 object-cover rounded-lg shadow"
              />
            )}
          </div>

          {/* DETAILS */}
          <div className="flex-1">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "#C2185B" }}
            >
              {bride.name}
            </h1>

            <p className="text-lg mb-3">
              <span className="font-semibold">Age:</span> {age}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">City:</span> {bride.city || "N/A"}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">Religion:</span>{" "}
              {bride.religion || "N/A"}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">Caste:</span>{" "}
              {bride.caste || "N/A"}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">Mother Tongue:</span>{" "}
              {bride.motherTongue || "N/A"}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">Occupation:</span>{" "}
              {bride.occupation || "N/A"}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">Income:</span>{" "}
              {bride.income || "N/A"}
            </p>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#C2185B" }}>
            About
          </h2>
          <p className="text-lg">{bride.about || "No description added"}</p>
        </div>

        {/* GALLERY */}
        {bride.photos?.length > 1 && (
          <div className="mt-8">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "#C2185B" }}
            >
              Photo Gallery
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {bride.photos.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={`${API}${img}`}
                  className="w-full h-48 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Show Edit button only if user is the owner */}
      {isOwner && (
        <div className="max-w-4xl mx-auto mt-4">
          <button
            className="px-4 py-2 rounded font-bold"
            style={{ backgroundColor: "#FFC107", color: "#212121" }}
            onClick={() => navigate(`/update-bride/${bride._id}`)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default BrideProfile;
