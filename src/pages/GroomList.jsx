import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GroomList = ({ search }) => {
  const navigate = useNavigate();
  const [grooms, setGrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;

  const fetchGrooms = async () => {
    try {
      const res = await axios.get(`${API}/api/grooms`);
      setGrooms(res.data.data);
    } catch (error) {
      console.log("Error fetching grooms:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGrooms();
  }, []);

  // Search filter
  const filtered = grooms.filter((g) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      g.name?.toLowerCase().includes(s) ||
      g.city?.toLowerCase().includes(s) ||
      g.religion?.toLowerCase().includes(s) ||
      g.caste?.toLowerCase().includes(s) ||
      g.education?.toLowerCase().includes(s) ||
      g.occupation?.toLowerCase().includes(s) ||
      g.motherTongue?.toLowerCase().includes(s) ||
      g.income?.toLowerCase().includes(s) ||
      g.about?.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center text-xl font-semibold"
        style={{ color: "#C2185B" }}
      >
        Loading grooms...
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      {filtered.length === 0 && (
        <p className="text-center col-span-full text-xl">No results found</p>
      )}

      {filtered.map((groom) => (
        <div
          key={groom._id}
          className="rounded-lg shadow-lg overflow-hidden"
          style={{ backgroundColor: "#FFF0F5" }}
        >
          {/* PHOTO */}
          <div className="h-56 bg-gray-200">
            {groom.photos?.length > 0 ? (
              <img
                src={` ${API}${groom.photos[0]}`}
                alt="groom"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${groom.name}&size=300&background=1976D2&color=fff`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* DETAILS */}
          <div className="p-5">
            <h2 className="text-xl font-bold" style={{ color: "#C2185B" }}>
              {groom.name}
            </h2>

            <p className="mt-2">
              <span className="font-semibold">City: </span>
              {groom.city}
            </p>

            <button
              className="mt-4 w-full p-2 rounded font-semibold"
              style={{ backgroundColor: "#C2185B", color: "white" }}
              onClick={() => navigate(`/groom/${groom._id}`)}
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroomList;
