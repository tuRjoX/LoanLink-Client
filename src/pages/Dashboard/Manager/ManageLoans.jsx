import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { loansAPI } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiSearch,
  FiPackage,
} from "react-icons/fi";

const ManageLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLoan, setEditingLoan] = useState(null);

  useEffect(() => {
    fetchMyLoans();
  }, [user]);

  const fetchMyLoans = async () => {
    try {
      const response = await loansAPI.getByManager(user.email);
      setLoans(response.data.loans || []);
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast.error("Failed to fetch your loans");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (loanId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await loansAPI.update(loanId, { status: newStatus });
      setLoans(
        loans.map((loan) =>
          loan._id === loanId ? { ...loan, status: newStatus } : loan,
        ),
      );
      toast.success(
        `Loan ${newStatus === "active" ? "activated" : "deactivated"}`,
      );
    } catch (error) {
      toast.error("Failed to update loan status");
    }
  };

  const handleDeleteLoan = async (loanId, loanTitle) => {
    const result = await Swal.fire({
      title: "Delete Loan?",
      text: `Are you sure you want to delete "${loanTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await loansAPI.delete(loanId);
        setLoans(loans.filter((loan) => loan._id !== loanId));
        toast.success("Loan deleted successfully");
      } catch (error) {
        toast.error("Failed to delete loan");
      }
    }
  };

  const handleUpdateLoan = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updateData = {
      title: formData.get("title"),
      category: formData.get("category"),
      interestRate: parseFloat(formData.get("interestRate")),
      maxLimit: parseInt(formData.get("maxLimit")),
      description: formData.get("description"),
      status: formData.get("status"),
    };

    try {
      await loansAPI.update(editingLoan._id, updateData);
      setLoans(
        loans.map((loan) =>
          loan._id === editingLoan._id ? { ...loan, ...updateData } : loan,
        ),
      );
      setEditingLoan(null);
      toast.success("Loan updated successfully");
    } catch (error) {
      toast.error("Failed to update loan");
    }
  };

  const filteredLoans = loans.filter(
    (loan) =>
      loan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.category?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const categories = [
    "Business",
    "Education",
    "Agriculture",
    "Healthcare",
    "Personal",
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Manage My Loans - Manager Dashboard | LoanLink</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              My Loan Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your loan offerings
            </p>
          </div>
          <Link
            to="/dashboard/add-loan"
            className="btn-primary flex items-center gap-2 w-fit"
          >
            <FiPlus /> Add New Loan
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Loans", value: loans.length },
            {
              label: "Active",
              value: loans.filter((l) => l.status === "active").length,
            },
            {
              label: "Inactive",
              value: loans.filter((l) => l.status === "inactive").length,
            },
            {
              label: "Featured",
              value: loans.filter((l) => l.showOnHome).length,
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-center"
            >
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search your loans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Loans Grid */}
        {filteredLoans.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
            <FiPackage className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Loans Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {loans.length === 0
                ? "You haven't created any loans yet."
                : "No loans match your search."}
            </p>
            {loans.length === 0 && (
              <Link
                to="/dashboard/add-loan"
                className="btn-primary inline-flex items-center gap-2"
              >
                <FiPlus /> Create Your First Loan
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLoans.map((loan, index) => (
              <motion.div
                key={loan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={
                      loan.image ||
                      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400"
                    }
                    alt={loan.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        loan.status === "active"
                          ? "bg-green-500 text-white"
                          : "bg-gray-500 text-white"
                      }`}
                    >
                      {loan.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                      {loan.title}
                    </h3>
                    <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded text-xs font-medium shrink-0">
                      {loan.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {loan.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Interest</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {loan.interestRate}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Max Limit</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${loan.maxLimit?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleToggleStatus(loan._id, loan.status)}
                      className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-1 text-sm transition-colors ${
                        loan.status === "active"
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200"
                          : "bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200"
                      }`}
                      title={
                        loan.status === "active" ? "Deactivate" : "Activate"
                      }
                    >
                      {loan.status === "active" ? <FiEyeOff /> : <FiEye />}
                      {loan.status === "active" ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => setEditingLoan(loan)}
                      className="flex-1 p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 flex items-center justify-center gap-1 text-sm transition-colors"
                    >
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteLoan(loan._id, loan.title)}
                      className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingLoan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Edit Loan
              </h2>
              <form onSubmit={handleUpdateLoan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    name="title"
                    defaultValue={editingLoan.title}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editingLoan.category}
                    className="input-field"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Interest Rate (%)
                    </label>
                    <input
                      name="interestRate"
                      type="number"
                      step="0.1"
                      defaultValue={editingLoan.interestRate}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Limit ($)
                    </label>
                    <input
                      name="maxLimit"
                      type="number"
                      defaultValue={editingLoan.maxLimit}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingLoan.status}
                    className="input-field"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingLoan.description}
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingLoan(null)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageLoans;
