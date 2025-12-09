import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  // const { token } = useAuth();
  const token = localStorage.getItem("adminToken");

  const [users, setUsers] = useState([]); // all users
  const [filtered, setFiltered] = useState([]); // users after filter
  const [selectedUser, setSelectedUser] = useState(null);

  const [filter, setFilter] = useState("pending"); // default is pending
  const API = import.meta.env.VITE_API_URL;

  // Fetch all users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
      applyFilter(filter, res.data); // apply current filter
    } catch (error) {
      console.log("Admin fetch error:", error);

      if (error.response?.status === 403) {
        alert("Admin session expired or unauthorized. Please login again.");
        window.location.href = "/admin";
      }
    }
  };

  // Filtering users
  const applyFilter = (type, data = users) => {
    setFilter(type);

    if (type === "all") {
      setFiltered(data);
    } else {
      setFiltered(data.filter((user) => user.status === type));
    }
  };

  // Approve user
  const approveUser = async (id) => {
    await axios.put(
      `${API}/api/admin/approve/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchUsers(); // refresh user list
  };

  // Reject user
  const rejectUser = async (id) => {
    if (!window.confirm("Reject this user?")) return;

    await axios.put(
      `${API}/api/admin/reject/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchUsers(); // refresh user list
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: "#C2185B" }}
        >
          Admin Dashboard
        </h1>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["all", "pending", "approved", "rejected"].map((item) => (
          <button
            key={item}
            onClick={() => applyFilter(item)}
            className={`px-3 py-2 md:px-4 md:py-2 rounded font-semibold shadow text-sm md:text-base ${
              filter === item
                ? "text-white"
                : "text-[#C2185B] border border-[#C2185B]"
            }`}
            style={{
              backgroundColor: filter === item ? "#C2185B" : "transparent",
            }}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {/* USER TABLE / CARD VIEW */}
      <div
        className="rounded-xl shadow-lg p-4 md:p-6"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <h2
          className="text-xl md:text-2xl font-bold mb-4"
          style={{ color: "#C2185B" }}
        >
          {filter.toUpperCase()} USERS
        </h2>

        {filtered.length === 0 ? (
          <p className="text-center py-10 font-semibold">
            No users in this category.
          </p>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="bg-pink-100">
                    <th className="p-3 text-left font-semibold text-[#C2185B]">
                      Name
                    </th>
                    <th className="p-3 text-left font-semibold text-[#C2185B]">
                      Email
                    </th>
                    <th className="p-3 text-left font-semibold text-[#C2185B]">
                      Role
                    </th>
                    <th className="p-3 text-left font-semibold text-[#C2185B]">
                      Status
                    </th>
                    <th className="p-3 text-left font-semibold text-[#C2185B]">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((u) => (
                    <React.Fragment key={u._id}>
                      <tr className="border-b hover:bg-pink-50 transition">
                        <td className="p-3">{u.name}</td>
                        <td className="p-3">{u.email}</td>
                        <td className="p-3 capitalize">{u.role}</td>
                        <td className="p-3 capitalize">{u.status}</td>

                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="px-3 py-2 rounded text-white"
                            style={{ backgroundColor: "#C2185B" }}
                          >
                            View
                          </button>

                          {u.status === "pending" && (
                            <>
                              <button
                                onClick={() => approveUser(u._id)}
                                className="px-3 py-2 rounded text-white"
                                style={{ backgroundColor: "#2E7D32" }}
                              >
                                Approve
                              </button>

                              <button
                                onClick={() => rejectUser(u._id)}
                                className="px-3 py-2 rounded text-white"
                                style={{ backgroundColor: "#D81B60" }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>

                      {/* USER DETAILS (Desktop Expand Row) */}
                      {selectedUser && selectedUser._id === u._id && (
                        <tr className="bg-pink-50">
                          <td colSpan="5" className="p-4">
                            <div className="flex gap-6 items-start">
                              {/* Image */}
                              <img
                                src={selectedUser?.profilePic}
                                className="w-28 h-28 rounded-full object-cover shadow border-2 border-[#C2185B]"
                              />

                              {/* Info */}
                              <div className="space-y-1">
                                <p>
                                  <strong>Name:</strong> {u.name}
                                </p>
                                <p>
                                  <strong>Email:</strong> {u.email}
                                </p>
                                <p>
                                  <strong>Role:</strong> {u.role}
                                </p>
                                <p>
                                  <strong>Status:</strong> {u.status}
                                </p>

                                <button
                                  onClick={() => setSelectedUser(null)}
                                  className="mt-3 px-4 py-2 rounded text-white"
                                  style={{ backgroundColor: "#333" }}
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW (No Scrollbar) */}
            <div className="md:hidden grid grid-cols-1 gap-4">
              {filtered.map((u) => (
                <div
                  key={u._id}
                  className="p-4 rounded-xl shadow border border-pink-200 bg-pink-50"
                >
                  <p>
                    <strong>Name:</strong> {u.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {u.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {u.role}
                  </p>
                  <p>
                    <strong>Status:</strong> {u.status}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-3 py-2 rounded text-white"
                      style={{ backgroundColor: "#C2185B" }}
                    >
                      View
                    </button>

                    {u.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveUser(u._id)}
                          className="px-3 py-2 rounded text-white"
                          style={{ backgroundColor: "#2E7D32" }}
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => rejectUser(u._id)}
                          className="px-3 py-2 rounded text-white"
                          style={{ backgroundColor: "#D81B60" }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>

                  {/* MOBILE DETAIL SECTION */}
                  {selectedUser && selectedUser._id === u._id && (
                    <div className="mt-4 p-4 rounded-xl bg-white border shadow-sm">
                      <div className="flex justify-center mb-4">
                        <img
                          src={selectedUser?.profilePic}
                          className="w-28 h-28 rounded-full object-cover shadow border-2 border-[#C2185B]"
                        />
                      </div>

                      <p>
                        <strong>Name:</strong> {selectedUser.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {selectedUser.email}
                      </p>
                      <p>
                        <strong>Role:</strong> {selectedUser.role}
                      </p>
                      <p>
                        <strong>Status:</strong> {selectedUser.status}
                      </p>

                      <div className="flex justify-center mt-4">
                        <button
                          onClick={() => setSelectedUser(null)}
                          className="px-5 py-2 rounded-lg text-white font-semibold shadow-md"
                          style={{ backgroundColor: "#333" }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
