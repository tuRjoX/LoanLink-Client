import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { applicationsAPI } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiCheck,
  FiX,
  FiEye,
  FiClock,
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";

const PendingApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      const response = await applicationsAPI.getPending();
      // Filter applications for this manager's loans
      const myApplications = response.data.filter(
        (app) => app.managerEmail === user.email,
      );
      setApplications(myApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appId) => {
    const result = await Swal.fire({
      title: "Approve Application?",
      text: "This will approve the loan application and notify the borrower.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, approve it!",
    });

    if (result.isConfirmed) {
      setProcessingId(appId);
      try {
        await applicationsAPI.update(appId, {
          status: "approved",
          approvedAt: new Date().toISOString(),
          approvedBy: user.email,
        });
        setApplications(applications.filter((app) => app._id !== appId));
        toast.success("Application approved successfully");
      } catch (error) {
        toast.error("Failed to approve application");
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleReject = async (appId) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Application",
      input: "textarea",
      inputLabel: "Reason for rejection",
      inputPlaceholder:
        "Please provide a reason for rejecting this application...",
      inputAttributes: {
        "aria-label": "Rejection reason",
      },
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Reject",
      inputValidator: (value) => {
        if (!value) {
          return "You need to provide a reason!";
        }
      },
    });

    if (reason) {
      setProcessingId(appId);
      try {
        await applicationsAPI.update(appId, {
          status: "rejected",
          rejectionReason: reason,
          rejectedAt: new Date().toISOString(),
          rejectedBy: user.email,
        });
        setApplications(applications.filter((app) => app._id !== appId));
        toast.success("Application rejected");
      } catch (error) {
        toast.error("Failed to reject application");
      } finally {
        setProcessingId(null);
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Pending Applications - Manager Dashboard | LoanLink</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Pending Applications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review and process loan applications
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg">
            <FiClock />
            <span className="font-medium">{applications.length} Pending</span>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm"
          >
            <FiFileText className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Pending Applications
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All caught up! There are no applications waiting for review.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, index) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Applicant Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={
                          app.applicantPhoto ||
                          `https://ui-avatars.com/api/?name=${app.applicantName}&background=0ea5e9&color=fff`
                        }
                        alt={app.applicantName}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {app.applicantName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {app.applicantEmail}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs font-medium">
                            {app.paymentStatus === "paid"
                              ? "✓ Fee Paid"
                              : "⏳ Fee Unpaid"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Loan Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Loan Type</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {app.loanTitle}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Amount</p>
                        <p className="font-bold text-gray-900 dark:text-white">
                          ${parseFloat(app.loanAmount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">EMI</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          ${app.emiAmount}/mo × {app.emiPlan}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Applied</p>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FiEye className="text-xl" />
                      </button>
                      <button
                        onClick={() => handleApprove(app._id)}
                        disabled={processingId === app._id}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(app._id)}
                        disabled={processingId === app._id}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
                      >
                        <FiX /> Reject
                      </button>
                    </div>
                  </div>
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
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
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

              {/* Applicant */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-6">
                <img
                  src={
                    selectedApp.applicantPhoto ||
                    `https://ui-avatars.com/api/?name=${selectedApp.applicantName}&background=0ea5e9&color=fff`
                  }
                  alt={selectedApp.applicantName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {selectedApp.applicantName}
                  </h3>
                  <p className="text-gray-500">{selectedApp.applicantEmail}</p>
                  <p className="text-sm text-gray-500">{selectedApp.phone}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 flex items-center gap-2">
                    <FiUser className="text-primary-600" /> Personal Information
                  </h3>
                  <div className="space-y-2 text-sm">
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
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 flex items-center gap-2">
                    <FiDollarSign className="text-primary-600" /> Loan Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-gray-500">Loan:</span>{" "}
                      <span className="font-medium">
                        {selectedApp.loanTitle}
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
                        ${selectedApp.emiAmount}/month × {selectedApp.emiPlan}{" "}
                        months
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-500">Fee Status:</span>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                          selectedApp.paymentStatus === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedApp.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {selectedApp.reason && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white border-b pb-2 flex items-center gap-2">
                    <FiFileText className="text-primary-600" /> Reason for Loan
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {selectedApp.reason}
                  </p>
                </div>
              )}

              {selectedApp.notes && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Additional Notes
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedApp.notes}
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="flex-1 btn-outline"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedApp(null);
                    handleApprove(selectedApp._id);
                  }}
                  className="flex-1 btn-primary bg-green-600 hover:bg-green-700"
                >
                  <FiCheck className="inline mr-2" /> Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedApp(null);
                    handleReject(selectedApp._id);
                  }}
                  className="flex-1 btn-primary bg-red-600 hover:bg-red-700"
                >
                  <FiX className="inline mr-2" /> Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default PendingApplications;
