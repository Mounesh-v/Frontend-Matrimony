import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const API = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    const res = await axios.get(
      `${API}/api/admin/users`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUsers(res.data);
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    await axios.delete(
      `${API}/api/admin/delete-user/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: "#F5F5F5", color: "#212121" }}
    >
      {/* TOP BAR */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold" style={{ color: "#C2185B" }}>
          Admin Dashboard
        </h1>
      </div>

      {/* MAIN CONTAINER */}
      <div
        className="rounded-xl shadow-lg p-6 overflow-x-auto"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <h2 className="text-2xl font-bold mb-4" style={{ color: "#C2185B" }}>
          Registered Users
        </h2>

        {users.length === 0 ? (
          <p className="text-center py-10 font-semibold">No users found.</p>
        ) : (
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ backgroundColor: "#FCE4EC" }}>
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
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <>
                  <tr
                    key={u._id}
                    className="border-b hover:bg-[#FFF0F5] transition"
                  >
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 capitalize">{u.role}</td>

                    {/* ACTION BUTTONS */}
                    <td className="p-3 flex gap-3">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="px-4 py-2 rounded text-white shadow hover:opacity-90 transition"
                        style={{ backgroundColor: "#C2185B" }}
                      >
                        View
                      </button>

                      <button
                        onClick={() => deleteUser(u._id)}
                        className="px-4 py-2 rounded text-white shadow hover:opacity-90 transition"
                        style={{ backgroundColor: "#D81B60" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* SHOW DETAILS */}
                  {selectedUser && selectedUser._id === u._id && (
                    <tr className="bg-[#FFF0F5]">
                      <td colSpan="4" className="p-4">
                        <div className="space-y-2">
                          <p>
                            <strong>Name:</strong> {selectedUser.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {selectedUser.email}
                          </p>
                          <p>
                            <strong>Role:</strong> {selectedUser.role}
                          </p>

                          {/* CLOSE BUTTON */}
                          <button
                            onClick={() => setSelectedUser(null)}
                            className="mt-3 px-4 py-2 rounded text-white hover:opacity-90 transition"
                            style={{ backgroundColor: "#333333" }}
                          >
                            Close
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
