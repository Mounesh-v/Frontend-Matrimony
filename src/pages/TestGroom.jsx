import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TestGroom = () => {
  const [groom, setGroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const groomId = "6929c55763b0cee83246236b";

  useEffect(() => {
    fetchGroom();
  }, []);

  const fetchGroom = async () => {
    try {
      const res = await axios.get(
        `${API}/api/grooms/${groomId}`
      );
      setGroom(res.data);
    } catch (err) {
      console.log(err);
      setMessage("Failed to load groom profile");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this groom profile? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const adminToken = localStorage.getItem("adminToken");
      if (!adminToken) {
        setMessage("You need to be logged in as admin to delete a groom");
        return;
      }

      await axios.delete(`${API}/api/grooms/${groomId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      setMessage("Groom profile deleted successfully!");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to delete groom profile"
      );
    }
  };

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center text-xl"
        style={{ color: "#C2185B" }}
      >
        Loading...
      </div>
    );
  }

  if (!groom) {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-red-600">
        {message || "Groom not found"}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-10"
      style={{ backgroundColor: "#F5F5F5", color: "#212121" }}
    >
      <div
        className="max-w-2xl mx-auto p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: "#FFF0F5" }}
      >
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#C2185B" }}>
          {groom.name}
        </h1>

        {message && (
          <p
            className={`mb-4 font-semibold ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mb-4">
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {groom.email}
          </p>
          <p className="text-lg">
            <span className="font-semibold">City:</span> {groom.city || "N/A"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Religion:</span>{" "}
            {groom.religion || "N/A"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Occupation:</span>{" "}
            {groom.occupation || "N/A"}
          </p>
        </div>

        {groom.photos?.length > 0 && (
          <div className="mb-4">
            <img
              src={`${API}${groom.photos[0]}`}
              width="200"
              alt="profile"
              className="rounded shadow"
            />
          </div>
        )}

        <button
          onClick={handleDelete}
          className="px-6 py-2 rounded font-bold"
          style={{ backgroundColor: "#DC2626", color: "white" }}
        >
          Delete Groom Profile
        </button>
      </div>
    </div>
  );
};

export default TestGroom;
