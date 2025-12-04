import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BrideList = ({ search }) => {
  const navigate = useNavigate();
  const [brides, setBrides] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  const fetchBrides = async () => {
    try {
      const res = await axios.get(`${API}/api/brides`);
      setBrides(res.data.data);
    } catch (error) {
      console.log("Error fetching brides:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBrides();
  }, []);

  const filtered = brides.filter((b) => {
    if (!search) return true;

    const s = search.toLowerCase();

    return (
      b.name?.toLowerCase().includes(s) ||
      b.city?.toLowerCase().includes(s) ||
      b.religion?.toLowerCase().includes(s) ||
      b.caste?.toLowerCase().includes(s) ||
      b.education?.toLowerCase().includes(s) ||
      b.occupation?.toLowerCase().includes(s) ||
      b.motherTongue?.toLowerCase().includes(s) ||
      b.income?.toLowerCase().includes(s) ||
      b.about?.toLowerCase().includes(s)
    );
  });

  if (loading) return <p>Loading brides...</p>;

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      {filtered.length === 0 && (
        <p className="text-center col-span-full text-xl">No results found</p>
      )}

      {filtered.map((bride) => (
        <div
          key={bride._id}
          className="rounded-lg shadow-lg overflow-hidden"
          style={{ backgroundColor: "#FFF0F5" }}
        >
          <div className="h-56 bg-gray-200">
            {bride.photos?.length > 0 ? (
              <img
                src={` ${API}${bride.photos[0]}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${bride.name}&size=300&background=1976D2&color=fff`}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="p-5">
            <h2 className="text-xl font-bold" style={{ color: "#C2185B" }}>
              {bride.name}
            </h2>

            <p className="mt-2">
              <span className="font-semibold">City: </span>
              {bride.city}
            </p>

            <button
              className="mt-4 w-full p-2 rounded font-semibold"
              style={{ backgroundColor: "#C2185B", color: "white" }}
              onClick={() => navigate(`/bride/${bride._id}`)}
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BrideList;
