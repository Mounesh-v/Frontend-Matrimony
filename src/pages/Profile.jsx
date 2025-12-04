import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null); // store logged in user
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const adminToken = localStorage.getItem("adminToken");
      const token =
        localStorage.getItem("token") || localStorage.getItem("adminToken");

      // If admin is logged in → no profile
      if (adminToken && !userId) {
        setError("Admins do not have a matrimony profile.");
        setLoading(false);
        return;
      }

      if (!userId) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      // 1. Fetch user (same as Navbar)
      const userRes = await axios.get(
        `${API}/api/user/${userId}`
      );

      const userData = userRes.data;
      setUser(userData);

      let profileRes;

      // 2. Fetch groom profile
      if (userData.role === "groom") {
        profileRes = await axios.get(
          `${API}/api/grooms/user/${userData._id}`
        );
      }

      // 3. Fetch bride profile
      else if (userData.role === "bride") {
        profileRes = await axios.get(
          `${API}/api/brides/user/${userData._id}`
        );
      }

      // 4. User has no matrimony profile yet
      else {
        setError("You have not created a profile yet.");
        setLoading(false);
        return;
      }

      if (!profileRes.data) {
        setError("Profile not found.");
        setLoading(false);
        return;
      }

      setProfile(profileRes.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError("Failed to load your profile.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center text-xl font-semibold"
        style={{ color: "#C2185B" }}
      >
        Loading Profile...
      </div>
    );
  }

  // If no profile found
  if (error || !profile) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-xl text-red-600">
        <p>{error}</p>

        {user?.role === "groom" && (
          <button
            onClick={() => navigate("/groom-register")}
            className="mt-4 px-6 py-2 rounded font-bold"
            style={{ backgroundColor: "#C2185B", color: "white" }}
          >
            Create Groom Profile
          </button>
        )}

        {user?.role === "bride" && (
          <button
            onClick={() => navigate("/bride-register")}
            className="mt-4 px-6 py-2 rounded font-bold"
            style={{ backgroundColor: "#C2185B", color: "white" }}
          >
            Create Bride Profile
          </button>
        )}
      </div>
    );
  }

  // Calculate age
  const age = profile.dob
    ? new Date().getFullYear() - new Date(profile.dob).getFullYear()
    : "N/A";

  const role = user?.role;

  const shareWhatsApp = (profile) => {
    const adminNumber = "9655326468";

    let message =
      `*New Matrimony Profile*\n\n` +
      `*Name:* ${profile.userId?.name}\n` +
      `*Age:* ${age}\n` +
      `*City:* ${profile.city}\n` +
      `*Religion:* ${profile.religion}\n` +
      `*Caste:* ${profile.caste}\n` +
      `*Mother Tongue:* ${profile.motherTongue}\n` +
      `*Occupation:* ${profile.occupation}\n` +
      `*Income:* ${profile.income}\n\n` +
      `*About:* ${profile.about}\n\n`;

    if (profile.photos?.length > 0) {
      message += `*Photos:* \n`;
      profile.photos.forEach((img, index) => {
        message += `${index + 1}. ${API}${img}\n`;
      });
    }

    const url =
      "https://wa.me/" +
      adminNumber +
      "?text=" +
      encodeURIComponent(message);

    window.open(url, "_blank");
  };

  return (
    <div
      className="min-h-screen p-10"
      style={{ backgroundColor: "#F5F5F5", color: "#212121" }}
    >
      <div
        className="max-w-4xl mx-auto p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: "#FFF0F5" }}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* MAIN PHOTO */}
          <div className="w-full md:w-1/3">
            {profile.photos?.length > 0 ? (
              <img
                src={`${API}${profile?.photos[0]}`}
                className="w-full h-72 object-cover rounded-lg shadow"
                alt="profile"
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${profile.userId?.name}`}
                className="w-full h-72 object-cover rounded-lg shadow"
                alt="avatar"
              />
            )}
          </div>

          {/* DETAILS */}
          <div className="flex-1">
            <h1
              className="text-3xl font-bold mb-3"
              style={{ color: "#C2185B" }}
            >
              {profile.userId?.name}
            </h1>

            <p className="text-lg mb-2">
              <span className="font-semibold">Age:</span> {age}
            </p>

            <p className="text-lg mb-2">
              <span className="font-semibold">Email:</span>{" "}
              {profile.userId?.email}
            </p>

            <p className="text-lg mb-2">
              <span className="font-semibold">City:</span> {profile.city}
            </p>

            <p className="text-lg mb-2">
              <span className="font-semibold">Religion:</span>{" "}
              {profile.religion}
            </p>

            <p className="text-lg mb-2">
              <span className="font-semibold">Caste:</span> {profile.caste}
            </p>

            <p className="text-lg mb-2">
              <span className="font-semibold">Occupation:</span>{" "}
              {profile.occupation}
            </p>

            <p className="text-lg mb-2">
              <span className="font-semibold">Income:</span> {profile.income}
            </p>

            {/* ABOUT */}
            <div className="mt-8">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: "#C2185B" }}
              >
                About
              </h2>
              <p className="text-lg">{profile.about}</p>
            </div>

            {/* EDIT BUTTON */}
            <button
              className="mt-4 px-6 py-2 rounded font-bold shadow"
              style={{ backgroundColor: "#FFC107", color: "#212121" }}
              onClick={() =>
                navigate(
                  role === "bride"
                    ? `/bride/update/${profile._id}`
                    : `/groom/update/${profile._id}`
                )
              }
            >
              Edit Profile
            </button>

            {/* SHARE BUTTON */}
            <button
              className="mt-4 ml-4 px-6 py-2 rounded font-bold shadow"
              style={{ backgroundColor: "#25D366", color: "white" }}
              onClick={() => shareWhatsApp(profile)}
            >
              Share on WhatsApp
            </button>
          </div>
        </div>

        {/* PHOTO GALLERY */}
        {profile.photos?.length > 1 && (
          <div className="mt-10">
            <h2
              className="text-2xl font-bold mb-4"
              style={{ color: "#C2185B" }}
            >
              Photo Gallery
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {profile.photos.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={`${API}${img}`}
                  className="w-full h-48 object-cover rounded-lg shadow"
                  alt="gallery"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
