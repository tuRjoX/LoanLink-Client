import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { loansAPI } from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiFilter,
  FiDollarSign,
  FiPercent,
  FiPackage,
} from "react-icons/fi";

const AllLoansAdmin = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingLoan, setEditingLoan] = useState(null);
  const loansPerPage = 10;

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await loansAPI.getAll({ limit: 1000 });
      setLoans(response.data.loans || []);
    } catch (error) {
      console.error("Error fetching loans:", error);
      toast.error("Failed to fetch loans");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (loanId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    try {
      await loansAPI.update(loanId, { status: newStatus });
      setLoans(
        loans.map((loan) =>
          loan._id === loanId ? { ...loan, status: newStatus } : loan,
        ),
      );
      toast.success(
        `Loan ${newStatus === "active" ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      console.error("Error updating loan status:", error);
      toast.error("Failed to update loan status");
    }
  };

  const handleShowOnHomeToggle = async (loanId, currentShowOnHome) => {
    const newShowOnHome = !currentShowOnHome;

    try {
      await loansAPI.update(loanId, { showOnHome: newShowOnHome });
      setLoans(
        loans.map((loan) =>
          loan._id === loanId ? { ...loan, showOnHome: newShowOnHome } : loan,
        ),
      );
      toast.success(
        newShowOnHome
          ? "Loan will now appear on Home Page"
          : "Loan removed from Home Page",
      );
    } catch (error) {
      console.error("Error updating showOnHome:", error);
      toast.error("Failed to update Home Page visibility");
    }
  };

  const handleDeleteLoan = async (loanId, loanTitle) => {
    const result = await Swal.fire({
      title: "Delete Loan?",
      text: `Are you sure you want to delete "${loanTitle}"? This action cannot be undone.`,
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
        console.error("Error deleting loan:", error);
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
      console.error("Error updating loan:", error);
      toast.error("Failed to update loan");
    }
  };

  // Filter loans
  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.managerEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || loan.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredLoans.length / loansPerPage);
  const indexOfLastLoan = currentPage * loansPerPage;
  const indexOfFirstLoan = indexOfLastLoan - loansPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirstLoan, indexOfLastLoan);

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
        <title>All Loans - Admin Dashboard | LoanLink</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              All Loans
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage all loan products in the system
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Loans",
              value: loans.length,
              icon: <FiPackage />,
              color: "bg-primary-500",
            },
            {
              label: "Active Loans",
              value: loans.filter((l) => l.status === "active").length,
              icon: <FiEye />,
              color: "bg-green-500",
            },
            {
              label: "Avg Interest",
              value: `${(loans.reduce((a, l) => a + (l.interestRate || 0), 0) / loans.length || 0).toFixed(1)}%`,
              icon: <FiPercent />,
              color: "bg-blue-500",
            },
            {
              label: "Total Max Limit",
              value: `$${(loans.reduce((a, l) => a + (l.maxLimit || 0), 0) / 1000).toFixed(0)}K`,
              icon: <FiDollarSign />,
              color: "bg-purple-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div
                className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center text-white mb-2`}
              >
                {stat.icon}
              </div>
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
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or manager..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Loans Table - Desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Loan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Interest
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Max Limit
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Manager
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Show on Home
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentLoans.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      No loans found
                    </td>
                  </tr>
                ) : (
                  currentLoans.map((loan) => (
                    <tr
                      key={loan._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              loan.image ||
                              "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100"
                            }
                            alt={loan.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {loan.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium">
                          {loan.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                        {loan.interestRate}%
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">
                        ${loan.maxLimit?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {loan.managerEmail}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleStatusToggle(loan._id, loan.status)
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            loan.status === "active"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200"
                          }`}
                        >
                          {loan.status === "active" ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            handleShowOnHomeToggle(loan._id, loan.showOnHome)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            loan.showOnHome
                              ? "bg-primary-600"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                          title={
                            loan.showOnHome
                              ? "Visible on Home"
                              : "Hidden from Home"
                          }
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              loan.showOnHome
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingLoan(loan)}
                            className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                            title="Edit Loan"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteLoan(loan._id, loan.title)
                            }
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Delete Loan"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
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
                Showing {indexOfFirstLoan + 1} to{" "}
                {Math.min(indexOfLastLoan, filteredLoans.length)} of{" "}
                {filteredLoans.length} loans
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Loans Cards - Mobile/Tablet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden space-y-4"
        >
          {currentLoans.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
              No loans found
            </div>
          ) : (
            currentLoans.map((loan) => (
              <div
                key={loan._id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
              >
                <div className="flex gap-4">
                  <img
                    src={
                      loan.image ||
                      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=100"
                    }
                    alt={loan.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {loan.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-xs font-medium">
                        {loan.category}
                      </span>
                      <button
                        onClick={() =>
                          handleStatusToggle(loan._id, loan.status)
                        }
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          loan.status === "active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {loan.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        <strong>{loan.interestRate}%</strong> Interest
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        Max: <strong>${loan.maxLimit?.toLocaleString()}</strong>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Show on Home:</span>
                    <button
                      onClick={() =>
                        handleShowOnHomeToggle(loan._id, loan.showOnHome)
                      }
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        loan.showOnHome
                          ? "bg-primary-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          loan.showOnHome ? "translate-x-5" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingLoan(loan)}
                      className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDeleteLoan(loan._id, loan.title)}
                      className="p-2 text-red-600 bg-red-50 dark:bg-red-900/30 rounded-lg"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingLoan.description}
                    className="input-field"
                    rows={3}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
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

export default AllLoansAdmin;
