import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { applicationsAPI } from "../../../services/api";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiFilter,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiEye,
  FiFileText,
} from "react-icons/fi";

const LoanApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const appsPerPage = 10;

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await applicationsAPI.getAll();
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.loanTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || app.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApps.length / appsPerPage);
  const indexOfLastApp = currentPage * appsPerPage;
  const indexOfFirstApp = indexOfLastApp - appsPerPage;
  const currentApps = filteredApps.slice(indexOfFirstApp, indexOfLastApp);

  const getStatusBadge = (status) => {
    const styles = {
      pending:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      approved:
        "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      cancelled:
        "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
    };
    return styles[status] || styles.pending;
  };

  const getPaymentBadge = (status) => {
    return status === "paid"
      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
  };

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    paid: applications.filter((a) => a.paymentStatus === "paid").length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>All Applications - Admin Dashboard | LoanLink</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            All Loan Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and monitor all loan applications across the platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Applications",
              value: stats.total,
              icon: <FiFileText />,
              color: "bg-primary-500",
            },
            {
              label: "Pending",
              value: stats.pending,
              icon: <FiClock />,
              color: "bg-yellow-500",
            },
            {
              label: "Approved",
              value: stats.approved,
              icon: <FiCheckCircle />,
              color: "bg-green-500",
            },
            {
              label: "Paid Fees",
              value: stats.paid,
              icon: <FiDollarSign />,
              color: "bg-blue-500",
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
                placeholder="Search by applicant or loan title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* Applications Table - Desktop */}
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
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Loan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    EMI
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    Applied
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentApps.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                      No applications found
                    </td>
                  </tr>
                ) : (
                  currentApps.map((app) => (
                    <tr
                      key={app._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              app.applicantPhoto ||
                              `https://ui-avatars.com/api/?name=${app.applicantName}&background=0ea5e9&color=fff`
                            }
                            alt={app.applicantName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {app.applicantName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {app.applicantEmail}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {app.loanTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {app.loanCategory}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        ${parseFloat(app.loanAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        ${app.emiAmount}/mo × {app.emiPlan}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPaymentBadge(app.paymentStatus)}`}
                        >
                          {app.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye />
                        </button>
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
                Showing {indexOfFirstApp + 1} to{" "}
                {Math.min(indexOfLastApp, filteredApps.length)} of{" "}
                {filteredApps.length} applications
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

        {/* Applications Cards - Mobile/Tablet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden space-y-4"
        >
          {currentApps.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
              No applications found
            </div>
          ) : (
            currentApps.map((app) => (
              <div
                key={app._id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={
                      app.applicantPhoto ||
                      `https://ui-avatars.com/api/?name=${app.applicantName}&background=0ea5e9&color=fff`
                    }
                    alt={app.applicantName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {app.applicantName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {app.applicantEmail}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedApp(app)}
                    className="p-2 text-primary-600 bg-primary-50 dark:bg-primary-900/30 rounded-lg"
                  >
                    <FiEye />
                  </button>
                </div>

                <p className="font-medium text-gray-900 dark:text-white mb-2">
                  {app.loanTitle}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-1">
                      ${parseFloat(app.loanAmount).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">EMI:</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-1">
                      ${app.emiAmount}/mo
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadge(app.status)}`}
                  >
                    {app.status}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${getPaymentBadge(app.paymentStatus)}`}
                  >
                    {app.paymentStatus}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
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

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Application Details
                </h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2">
                    Applicant Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Name:</span>{" "}
                      <span className="font-medium">
                        {selectedApp.applicantName}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Email:</span>{" "}
                      <span className="font-medium">
                        {selectedApp.applicantEmail}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Phone:</span>{" "}
                      <span className="font-medium">{selectedApp.phone}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">National ID:</span>{" "}
                      <span className="font-medium">
                        {selectedApp.nationalId}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Address:</span>{" "}
                      <span className="font-medium">{selectedApp.address}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2">
                    Employment Info
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Income Source:</span>{" "}
                      <span className="font-medium capitalize">
                        {selectedApp.incomeSource}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Monthly Income:</span>{" "}
                      <span className="font-medium">
                        ${selectedApp.monthlyIncome}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2">
                    Loan Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Loan:</span>{" "}
                      <span className="font-medium">
                        {selectedApp.loanTitle}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Category:</span>{" "}
                      <span className="font-medium">
                        {selectedApp.loanCategory}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Amount:</span>{" "}
                      <span className="font-medium">
                        ${parseFloat(selectedApp.loanAmount).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Interest:</span>{" "}
                      <span className="font-medium">
                        {selectedApp.interestRate}%
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">EMI:</span>{" "}
                      <span className="font-medium">
                        ${selectedApp.emiAmount}/mo × {selectedApp.emiPlan}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2">
                    Status
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Application:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(selectedApp.status)}`}
                      >
                        {selectedApp.status}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Payment:</span>{" "}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPaymentBadge(selectedApp.paymentStatus)}`}
                      >
                        {selectedApp.paymentStatus}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Applied:</span>{" "}
                      <span className="font-medium">
                        {new Date(selectedApp.appliedAt).toLocaleString()}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Manager:</span>{" "}
                      <span className="font-medium">
                        {selectedApp.managerEmail}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {selectedApp.reason && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2">
                    Your Reason:
                  </h3>
                  <div
                    className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-300 break-all break-words max-h-32 md:max-h-40 overflow-auto whitespace-pre-line"
                    style={{ wordBreak: "break-all", overflowX: "auto" }}
                  >
                    {selectedApp.reason}
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedApp(null)}
                className="w-full btn-primary mt-6"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default LoanApplicationsAdmin;
