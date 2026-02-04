import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { applicationsAPI } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiEye,
  FiTrash2,
  FiCreditCard,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";

const MyLoans = () => {
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?.email && !authLoading) {
      fetchMyApplications();
    }
  }, [user, authLoading]);

  const fetchMyApplications = async () => {
    try {
      const response = await applicationsAPI.getByUser(user.email);
      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch your applications");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appId) => {
    const result = await Swal.fire({
      title: "Cancel Application?",
      text: "Are you sure you want to cancel this application? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        await applicationsAPI.cancel(appId);
        setApplications(applications.filter((app) => app._id !== appId));
        toast.success("Application cancelled successfully");
      } catch (error) {
        toast.error("Failed to cancel application");
      }
    }
  };

  // Filter applications
  const filteredApps = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FiCheckCircle className="text-green-500" />;
      case "rejected":
        return <FiXCircle className="text-red-500" />;
      case "cancelled":
        return <FiXCircle className="text-gray-500" />;
      default:
        return <FiClock className="text-yellow-500" />;
    }
  };

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

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>My Loan Applications - Dashboard | LoanLink</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            My Loan Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track the status of your loan applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total",
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
              label: "Rejected",
              value: stats.rejected,
              icon: <FiXCircle />,
              color: "bg-red-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilter(stat.label.toLowerCase())}
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

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "approved", "rejected", "cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  filter === status
                    ? "bg-primary-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {status}
              </button>
            ),
          )}
        </div>

        {/* Applications List */}
        {filteredApps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm"
          >
            <FiFileText className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {applications.length === 0
                ? "You haven't submitted any loan applications yet."
                : `No ${filter} applications found.`}
            </p>
            {applications.length === 0 && (
              <Link to="/all-loans" className="btn-primary inline-block">
                Browse Loans
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredApps.map((app, index) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Loan Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(app.status)}
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {app.loanTitle}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(app.status)}`}
                        >
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">
                        Applied on{" "}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-bold text-gray-900 dark:text-white">
                            ${parseFloat(app.loanAmount).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">EMI</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${app.emiAmount}/mo
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {app.emiPlan} months
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Interest</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {app.interestRate}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status & Actions */}
                    <div className="flex flex-col gap-3">
                      {/* Payment Status */}
                      <div
                        className={`p-3 rounded-lg ${
                          app.paymentStatus === "paid"
                            ? "bg-green-50 dark:bg-green-900/20"
                            : "bg-yellow-50 dark:bg-yellow-900/20"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {app.paymentStatus === "paid" ? (
                            <>
                              <FiCheckCircle className="text-green-600" />
                              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                Fee Paid
                              </span>
                            </>
                          ) : (
                            <>
                              <FiAlertCircle className="text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                                Fee Unpaid
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="text-xl" />
                        </button>

                        {app.status === "pending" &&
                          app.paymentStatus === "unpaid" && (
                            <Link
                              to={`/payment/${app._id}`}
                              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                            >
                              <FiCreditCard /> Pay $10
                            </Link>
                          )}

                        {app.status === "pending" && (
                          <button
                            onClick={() => handleCancel(app._id)}
                            className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                            title="Cancel Application"
                          >
                            <FiTrash2 className="text-xl" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {app.status === "rejected" && app.rejectionReason && (
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">
                        Rejection Reason:
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {app.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Application Details
                </h2>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(selectedApp.status)}`}
                  >
                    {selectedApp.status}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Loan Type</span>
                  <span className="font-medium">{selectedApp.loanTitle}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Amount Requested</span>
                  <span className="font-bold text-lg">
                    ${parseFloat(selectedApp.loanAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Monthly EMI</span>
                  <span className="font-medium">${selectedApp.emiAmount}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">
                    {selectedApp.emiPlan} months
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Interest Rate</span>
                  <span className="font-medium">
                    {selectedApp.interestRate}% p.a.
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Application Fee</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedApp.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {selectedApp.paymentStatus === "paid"
                      ? "Paid $10"
                      : "Unpaid"}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-500">Applied On</span>
                  <span className="font-medium">
                    {new Date(selectedApp.appliedAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedApp.reason && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Reason:
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 break-words whitespace-pre-line max-h-32 md:max-h-40 overflow-auto w-full">
                    {selectedApp.reason}
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="flex-1 btn-outline"
                >
                  Close
                </button>
                {selectedApp.status === "pending" &&
                  selectedApp.paymentStatus === "unpaid" && (
                    <Link
                      to={`/payment/${selectedApp._id}`}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      <FiCreditCard /> Pay Fee
                    </Link>
                  )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyLoans;
