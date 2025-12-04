import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Matches = () => {
  const navigate = useNavigate();
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const fetchAll = async () => {
    try {
      const groomRes = await axios.get(
        `${API}/api/grooms`
      );
      const brideRes = await axios.get(
        `${API}/api/brides`
      );

      const groomList = groomRes.data.data.map((g) => ({
        ...g,
        profileType: "groom",
      }));

      const brideList = brideRes.data.data.map((b) => ({
        ...b,
        profileType: "bride",
      }));

      setAllProfiles([...groomList, ...brideList]);
    } catch (err) {
      console.log("Error loading matches:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Search filter
  const filtered = allProfiles.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.name?.toLowerCase().includes(s) ||
      p.city?.toLowerCase().includes(s) ||
      p.religion?.toLowerCase().includes(s) ||
      p.caste?.toLowerCase().includes(s) ||
      p.education?.toLowerCase().includes(s) ||
      p.occupation?.toLowerCase().includes(s) ||
      p.motherTongue?.toLowerCase().includes(s) ||
      p.income?.toLowerCase().includes(s) ||
      p.about?.toLowerCase().includes(s)
    );
  });

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center text-xl"
        style={{ color: "#C2185B" }}
      >
        Loading Profiles...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-8 my-20"
      style={{ backgroundColor: "#F5F5F5", color: "#212121" }}
    >
      <h1
        className="text-4xl font-bold text-center mb-8"
        style={{ color: "#C2185B" }}
      >
        Matches
      </h1>

      {/* SEARCH BAR */}
      <div className="max-w-xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Search (name, city, caste, religion, occupation...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-lg shadow border focus:outline-none"
          style={{
            borderColor: "#C2185B",
            backgroundColor: "#FFFFFF",
          }}
        />
      </div>

      {/* RESULTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length === 0 && (
          <p className="text-xl text-center col-span-full">No results found</p>
        )}

        {filtered.map((p) => (
          <div
            key={p._id}
            className="rounded-lg shadow-lg overflow-hidden border"
            style={{
              backgroundColor: "#FFFFFF",
              borderColor: "#C2185B20",
            }}
          >
            {/* PHOTO */}
            <div className="h-56 bg-gray-200">
              {p.photos?.length > 0 ? (
                <img
                  src={`${API}${p.photos[0]}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${p.name}&size=300&background=C2185B&color=fff`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* DETAILS */}
            <div className="p-5">
              <h2 className="text-xl font-bold" style={{ color: "#C2185B" }}>
                {p.name}
              </h2>

              {/* Badge */}
              <span
                className="inline-block mt-2 mb-3 px-3 py-1 text-sm rounded-full"
                style={{
                  backgroundColor:
                    p.profileType === "groom" ? "#333333" : "#C2185B",
                  color: "white",
                }}
              >
                {p.profileType === "groom" ? "Groom" : "Bride"}
              </span>

              <p className="mt-1">
                <span className="font-semibold">City:</span> {p.city}
              </p>
              <p>
                <span className="font-semibold">Religion:</span> {p.religion}
              </p>

              {/* VIEW PROFILE BUTTON */}
              <button
                className="mt-4 w-full p-2 rounded font-semibold hover:opacity-90 transition"
                style={{ backgroundColor: "#C2185B", color: "white" }}
                onClick={() =>
                  navigate(
                    p.profileType === "groom"
                      ? `/groom/${p._id}`
                      : `/bride/${p._id}`
                  )
                }
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
