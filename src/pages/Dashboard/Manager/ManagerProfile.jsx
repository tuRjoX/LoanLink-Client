import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiCamera,
  FiShield,
  FiCalendar,
  FiEdit2,
  FiSave,
} from "react-icons/fi";

const ManagerProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateUserProfile(formData.displayName, formData.photoURL);
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>My Profile - Manager Dashboard | LoanLink</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and update your profile information
          </p>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary-600 to-blue-600"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 md:-mt-16 mb-6">
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="relative">
                  <img
                    src={
                      formData.photoURL ||
                      `https://ui-avatars.com/api/?name=${user?.displayName}&background=0ea5e9&color=fff&size=128`
                    }
                    alt={user?.displayName}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white dark:border-gray-800 object-cover bg-white"
                  />
                  {editing && (
                    <div className="absolute bottom-0 right-0 p-1 bg-primary-600 rounded-lg">
                      <FiCamera className="text-white" />
                    </div>
                  )}
                </div>
                <div className="mt-4 md:mt-0 md:mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.displayName || "Manager"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      Manager
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditing(!editing)}
                className={`mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  editing
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    : "bg-primary-600 text-white hover:bg-primary-700"
                }`}
              >
                <FiEdit2 /> {editing ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            displayName: e.target.value,
                          })
                        }
                        className="input-field pl-10"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="input-field pl-10 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Photo URL
                    </label>
                    <div className="relative">
                      <FiCamera className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="url"
                        value={formData.photoURL}
                        onChange={(e) =>
                          setFormData({ ...formData, photoURL: e.target.value })
                        }
                        className="input-field pl-10"
                        placeholder="https://example.com/photo.jpg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50"
                  >
                    <FiSave /> {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <FiMail className="text-xl text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FiShield className="text-xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Type</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Manager
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <FiCalendar className="text-xl text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user?.metadata?.creationTime
                          ? new Date(
                              user.metadata.creationTime,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <FiUser className="text-xl text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <p className="font-medium text-green-600">Active</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Manager Responsibilities
          </h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              Create and manage loan products for borrowers
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              Review and approve/reject loan applications
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              Monitor application fee payments
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary-600 mt-1">•</span>
              Communicate with borrowers regarding their applications
            </li>
          </ul>
        </motion.div>
      </div>
    </>
  );
};

export default ManagerProfile;
