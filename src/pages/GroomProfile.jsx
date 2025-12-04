import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const GroomProfile = () => {
  const { id } = useParams();
  const [groom, setGroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
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

    if (!activeToken || !groom) {
      setIsOwner(false);
      return;
    }

    const decoded = decodeToken(activeToken);
    if (decoded && decoded.id) {
      // Compare the ID from token with the groom's ID
      setIsOwner(decoded.id === groom._id || decoded.id === id);
    } else {
      setIsOwner(false);
    }
  }, [groom, id]);

  const fetchProfile = async () => {
    try {
      if (!id) {
        setMessage("Invalid profile id");
        setLoading(false);
        return;
      }
      let res;
      try {
        res = await axios.get(` ${API}/api/grooms/${id}`);
      } catch (err) {
        // If 404 or not found, try by userId
        if (err.response?.status === 404) {
          try {
            res = await axios.get(` ${API}/api/grooms/user/${id}`);
          } catch (e2) {
            throw err; // rethrow original
          }
        } else {
          throw err;
        }
      }
      setGroom(res.data);
    } catch (err) {
      console.log("Error:", err);
      setMessage(err.response?.data?.message || "Failed to load profile");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    if (groom) {
      checkOwnership();
    }
  }, [groom, checkOwnership]);

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

  if (!groom) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-red-600">
        <p>{message || "Groom not found"}</p>
      </div>
    );
  }

  // Age calculation
  const age = groom.dob
    ? new Date().getFullYear() - new Date(groom.dob).getFullYear()
    : "N/A";

  return (
    <div
      className="min-h-screen p-10"
      style={{ backgroundColor: "#F5F5F5", color: "#212121" }}
    >
      {/* Main Profile Card */}
      <div
        className="max-w-4xl mx-auto p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: "#FFF0F5" }}
      >
        {/* PHOTO SECTION */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* MAIN PHOTO */}
          <div className="w-full md:w-1/3">
            {groom.photos?.length > 0 ? (
              <img
                src={` ${API}${groom.photos[0]}`}
                className="w-full h-72 object-cover rounded-lg shadow"
                alt="profile"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${groom.name}&size=350&background=1976D2&color=fff`}
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
              {groom.name}
            </h1>

            <p className="text-lg mb-3">
              <span className="font-semibold">Age:</span> {age}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">City:</span> {groom.city || "N/A"}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">Religion:</span>{" "}
              {groom.religion || "N/A"}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">Caste:</span>{" "}
              {groom.caste || "N/A"}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">Mother Tongue:</span>{" "}
              {groom.motherTongue || "N/A"}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">Occupation:</span>{" "}
              {groom.occupation || "N/A"}
            </p>

            <p className="text-lg mb-3">
              <span className="font-semibold">Income:</span>{" "}
              {groom.income || "N/A"}
            </p>
          </div>
        </div>

        {/* ABOUT */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: "#D81B60" }}>
            About
          </h2>
          <p className="text-lg">{groom.about || "No description added"}</p>
        </div>

        {/* GALLERY */}
        {groom.photos?.length > 1 && (
          <div className="mt-8">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "#D81B60" }}
            >
              Photo Gallery
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {groom.photos.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={` ${API}${img}`}
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
            onClick={() => navigate(`/update/${groom._id}`)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default GroomProfile;
