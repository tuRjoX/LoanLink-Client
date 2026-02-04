import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { applicationsAPI } from "../../services/api";
import {
  FiCheckCircle,
  FiHome,
  FiFileText,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiPrinter,
} from "react-icons/fi";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [application, setApplication] = useState(null);

  const paymentId = searchParams.get("paymentId");
  const applicationId = searchParams.get("applicationId");

  useEffect(() => {
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    // Fetch application details
    if (applicationId) {
      fetchApplication();
    }

    return () => clearTimeout(timer);
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const response = await applicationsAPI.getById(applicationId);
      setApplication(response.data);
    } catch (error) {
      console.error("Error fetching application:", error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Payment Successful - LoanLink</title>
      </Helmet>

      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          colors={["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"]}
        />
      )}

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-green-900/20 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          {/* Success Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            {/* Green Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4"
              >
                <FiCheckCircle className="text-5xl text-green-500" />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-white mb-2"
              >
                Payment Successful!
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-green-100"
              >
                Your application fee has been paid successfully
              </motion.p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Transaction Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Transaction Details
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FiDollarSign />
                      <span>Amount Paid</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">
                      $10.00
                    </span>
                  </div>

                  {paymentId && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                      <div className="flex items-center gap-2 text-gray-500">
                        <FiFileText />
                        <span>Payment ID</span>
                      </div>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {paymentId.slice(0, 20)}...
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FiCalendar />
                      <span>Date</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FiClock />
                      <span>Time</span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Application Info */}
              {application && (
                <div className="bg-primary-50 dark:bg-primary-900/20 rounded-2xl p-6 mb-6 border border-primary-100 dark:border-primary-800">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Application Details
                  </h3>
                  <p className="font-bold text-gray-900 dark:text-white mb-2">
                    {application.loanTitle}
                  </p>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      Amount: $
                      {parseFloat(application.loanAmount).toLocaleString()}
                    </span>
                    <span>EMI: ${application.emiAmount}/mo</span>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6 border border-blue-100 dark:border-blue-800">
                <h3 className="font-bold text-blue-800 dark:text-blue-400 mb-3">
                  📋 What's Next?
                </h3>
                <ol className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <li className="flex items-start gap-2">
                    <span className="font-bold">1.</span>
                    <span>
                      Your application is now being reviewed by our team
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">2.</span>
                    <span>
                      You'll receive an email notification once reviewed
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold">3.</span>
                    <span>Track your application status in your dashboard</span>
                  </li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/dashboard/my-loans"
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                >
                  <FiFileText /> View Applications
                </Link>
                <Link
                  to="/"
                  className="flex-1 btn-outline py-3 flex items-center justify-center gap-2"
                >
                  <FiHome /> Back to Home
                </Link>
              </div>

              {/* Receipt */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => window.print()}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center justify-center gap-2 mx-auto"
                >
                  <FiPrinter /> Print Receipt
                </button>
              </div>
            </div>
          </div>

          {/* Support Info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6"
          >
            Questions? Contact us at{" "}
            <a
              href="mailto:support@loanlink.com"
              className="text-primary-600 hover:underline"
            >
              support@loanlink.com
            </a>
          </motion.p>
        </motion.div>
      </div>
    </>
  );
};

export default PaymentSuccess;
