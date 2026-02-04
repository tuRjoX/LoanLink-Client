import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { applicationsAPI } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiEye,
  FiDollarSign,
  FiCalendar,
  FiTrendingUp,
} from "react-icons/fi";

const ApprovedApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    fetchApprovedApplications();
  }, []);

  const fetchApprovedApplications = async () => {
    try {
      const response = await applicationsAPI.getApproved();
      // Filter for this manager's applications
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

  // Calculate stats
  const totalAmount = applications.reduce(
    (sum, app) => sum + parseFloat(app.loanAmount || 0),
    0,
  );
  const paidFees = applications.filter(
    (app) => app.paymentStatus === "paid",
  ).length;

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Approved Applications - Manager Dashboard | LoanLink</title>
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Approved Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View all approved loan applications
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Approved",
              value: applications.length,
              icon: <FiCheckCircle />,
              color: "bg-green-500",
            },
            {
              label: "Total Amount",
              value: `$${totalAmount.toLocaleString()}`,
              icon: <FiDollarSign />,
              color: "bg-blue-500",
            },
            {
              label: "Fees Collected",
              value: `$${paidFees * 10}`,
              icon: <FiTrendingUp />,
              color: "bg-purple-500",
            },
            {
              label: "Paid Fees",
              value: `${paidFees}/${applications.length}`,
              icon: <FiCalendar />,
              color: "bg-orange-500",
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

        {/* Applications Table */}
        {applications.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
            <FiCheckCircle className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Approved Applications
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Approved applications will appear here.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Borrower
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
                      Fee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      Approved
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {applications.map((app) => (
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
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                        ${parseFloat(app.loanAmount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                        ${app.emiAmount}/mo × {app.emiPlan}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            app.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {app.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {app.approvedAt
                          ? new Date(app.approvedAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="p-2 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                        >
                          <FiEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Detail Modal */}
        {selectedApp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg"
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

              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl mb-6">
                <FiCheckCircle className="text-3xl text-green-600" />
                <div>
                  <p className="font-bold text-green-800 dark:text-green-400">
                    Approved
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-500">
                    {selectedApp.approvedAt
                      ? new Date(selectedApp.approvedAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Borrower</span>
                  <span className="font-medium">
                    {selectedApp.applicantName}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">
                    {selectedApp.applicantEmail}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{selectedApp.phone}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Loan</span>
                  <span className="font-medium">{selectedApp.loanTitle}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-bold text-lg">
                    ${parseFloat(selectedApp.loanAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-500">EMI</span>
                  <span className="font-medium">
                    ${selectedApp.emiAmount}/mo × {selectedApp.emiPlan} months
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Application Fee</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedApp.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedApp.paymentStatus === "paid"
                      ? "$10 Paid"
                      : "Unpaid"}
                  </span>
                </div>
              </div>

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

export default ApprovedApplications;
