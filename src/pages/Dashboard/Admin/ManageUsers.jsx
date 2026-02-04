import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { usersAPI } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiMail,
  FiShield,
  FiUserCheck,
  FiUserX,
  FiFilter,
} from "react-icons/fi";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole, newRole) => {
    if (currentRole === newRole) return;

    const result = await Swal.fire({
      title: "Change User Role?",
      text: `Are you sure you want to change this user's role to ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0ea5e9",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, change it!",
    });

    if (result.isConfirmed) {
      try {
        await usersAPI.update(userId, { role: newRole });
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, role: newRole } : user,
          ),
        );
        toast.success("User role updated successfully");
      } catch (error) {
        console.error("Error updating user role:", error);
        toast.error("Failed to update user role");
      }
    }
  };

  const handleSuspendUser = async (userId, currentStatus) => {
    const action = currentStatus === "suspended" ? "activate" : "suspend";

    if (currentStatus !== "suspended") {
      // Suspending - collect reason
      const { value: formValues } = await Swal.fire({
        title: "Suspend User",
        html: `
          <style>
            @media (max-width: 600px) {
              .swal2-popup.swal2-responsive-modal {
                width: 98vw !important;
                min-width: 0 !important;
                max-width: 100vw !important;
                padding: 1.5rem 0.5rem !important;
              }
              .swal2-html-container {
                padding: 0 !important;
              }
              #suspendReason, #suspendFeedback {
                font-size: 1rem !important;
              }
            }
            .swal2-popup.swal2-responsive-modal {
              box-sizing: border-box;
              padding: 2rem 1.5rem;
            }
            #suspendReason, #suspendFeedback {
              width: 100%;
              box-sizing: border-box;
              font-size: 1.05rem;
            }
            #suspendFeedback {
              min-height: 80px;
              resize: vertical;
            }
          </style>
          <div style="text-align: left;">
            <label style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 1rem;">Reason for suspension *</label>
            <select id="suspendReason" class="swal2-select">
              <option value="">Select a reason</option>
              <option value="violation">Policy Violation</option>
              <option value="fraud">Fraudulent Activity</option>
              <option value="spam">Spam/Abuse</option>
              <option value="inactive">Prolonged Inactivity</option>
              <option value="request">User Request</option>
              <option value="other">Other</option>
            </select>
            <label style="display: block; margin-top: 16px; margin-bottom: 8px; font-weight: 500; font-size: 1rem;">Additional feedback</label>
            <textarea id="suspendFeedback" class="swal2-textarea" placeholder="Provide additional details..."></textarea>
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Suspend User",
        width:
          window.innerWidth < 600
            ? "98vw"
            : window.innerWidth < 900
              ? "420px"
              : "480px",
        customClass: {
          popup: "swal2-responsive-modal",
        },
        preConfirm: () => {
          const reason = document.getElementById("suspendReason").value;
          const feedback = document.getElementById("suspendFeedback").value;
          if (!reason) {
            Swal.showValidationMessage("Please select a reason for suspension");
            return false;
          }
          return { reason, feedback };
        },
      });

      if (formValues) {
        try {
          await usersAPI.update(userId, {
            status: "suspended",
            suspendReason: formValues.reason,
            suspendFeedback: formValues.feedback,
            suspendedAt: new Date().toISOString(),
          });
          setUsers(
            users.map((user) =>
              user._id === userId
                ? {
                    ...user,
                    status: "suspended",
                    suspendReason: formValues.reason,
                    suspendFeedback: formValues.feedback,
                  }
                : user,
            ),
          );
          toast.success("User suspended successfully");
        } catch (error) {
          console.error("Error suspending user:", error);
          toast.error("Failed to suspend user");
        }
      }
    } else {
      // Activating user
      const result = await Swal.fire({
        title: "Activate User?",
        text: "This will allow the user to access their account again.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#10b981",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, activate!",
      });

      if (result.isConfirmed) {
        try {
          await usersAPI.update(userId, {
            status: "active",
            suspendReason: null,
            suspendFeedback: null,
            suspendedAt: null,
          });
          setUsers(
            users.map((user) =>
              user._id === userId
                ? {
                    ...user,
                    status: "active",
                    suspendReason: null,
                    suspendFeedback: null,
                  }
                : user,
            ),
          );
          toast.success("User activated successfully");
        } catch (error) {
          console.error("Error activating user:", error);
          toast.error("Failed to activate user");
        }
      }
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "manager":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin Dashboard | LoanLink</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Manage Users
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage all registered users
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <FiUser className="text-primary-600" />
            <span>Total Users: {users.length}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Users",
              value: users.length,
              color: "bg-primary-500",
            },
            {
              label: "Admins",
              value: users.filter((u) => u.role === "admin").length,
              color: "bg-red-500",
            },
            {
              label: "Managers",
              value: users.filter((u) => u.role === "manager").length,
              color: "bg-blue-500",
            },
            {
              label: "Borrowers",
              value: users.filter((u) => u.role === "borrower").length,
              color: "bg-green-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className={`w-2 h-2 rounded-full ${stat.color} mb-2`}></div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2">
              <FiFilter className="text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="borrower">Borrower</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table - Desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              user.photoURL ||
                              `https://ui-avatars.com/api/?name=${user.name}&background=0ea5e9&color=fff`
                            }
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <FiMail className="text-sm" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role === "admin" ? (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                            title="Admin roles cannot be modified"
                          >
                            Admin
                          </span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(
                                user._id,
                                user.role,
                                e.target.value,
                              )
                            }
                            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getRoleBadgeColor(user.role)}`}
                          >
                            <option value="borrower">Borrower</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === "suspended"
                              ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          }`}
                        >
                          {user.status === "suspended" ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {user.role === "admin" ? (
                          <span
                            className="p-2 text-gray-400 cursor-not-allowed"
                            title="Admin users cannot be suspended"
                          >
                            <FiShield />
                          </span>
                        ) : (
                          <button
                            onClick={() =>
                              handleSuspendUser(user._id, user.status)
                            }
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === "suspended"
                                ? "text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30"
                                : "text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                            }`}
                            title={
                              user.status === "suspended"
                                ? "Activate User"
                                : "Suspend User"
                            }
                          >
                            {user.status === "suspended" ? (
                              <FiUserCheck />
                            ) : (
                              <FiUserX />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Desktop */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {indexOfFirstUser + 1} to{" "}
                {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                {filteredUsers.length} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === i + 1
                        ? "bg-primary-600 text-white"
                        : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Users Cards - Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden space-y-4"
        >
          {currentUsers.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
              No users found
            </div>
          ) : (
            currentUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={
                      user.photoURL ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=0ea5e9&color=fff`
                    }
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {user.role === "admin" ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                        >
                          Admin
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,
                              user.role,
                              e.target.value,
                            )
                          }
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border-0 cursor-pointer ${getRoleBadgeColor(user.role)}`}
                        >
                          <option value="borrower">Borrower</option>
                          <option value="manager">Manager</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "suspended"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {user.status === "suspended" ? "Suspended" : "Active"}
                      </span>
                    </div>
                  </div>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleSuspendUser(user._id, user.status)}
                      className={`p-2 rounded-lg ${
                        user.status === "suspended"
                          ? "text-green-600 bg-green-50 dark:bg-green-900/30"
                          : "text-red-600 bg-red-50 dark:bg-red-900/30"
                      }`}
                    >
                      {user.status === "suspended" ? (
                        <FiUserCheck />
                      ) : (
                        <FiUserX />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}

          {/* Pagination - Mobile */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default ManageUsers;
