import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { loansAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import {
  FiDollarSign,
  FiPercent,
  FiCalendar,
  FiCheckCircle,
  FiArrowLeft,
  FiClock,
  FiShield,
  FiTrendingUp,
  FiFileText,
} from "react-icons/fi";

const LoanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoanDetails();
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      const response = await loansAPI.getById(id);
      setLoan(response.data);
    } catch (error) {
      console.error("Error fetching loan:", error);
      toast.error("Failed to load loan details");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      toast.error("Please login to apply for a loan");
      navigate("/login", { state: { from: `/loan/${id}` } });
      return;
    }
    navigate(`/loan-application/${id}`);
  };

  if (loading) return <LoadingSpinner />;

  if (!loan) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Loan Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The loan you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/all-loans" className="btn-primary">
          Browse All Loans
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{loan.title} - LoanLink</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 md:py-8">
        <div className="container-custom px-2 sm:px-4 md:px-0">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to="/all-loans"
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
            >
              <FiArrowLeft className="mr-2" /> Back to All Loans
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              {/* Loan Image */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-4 sm:mb-6">
                <img
                  src={
                    loan.image ||
                    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800"
                  }
                  alt={loan.title}
                  className="w-full h-48 sm:h-64 md:h-80 object-cover object-center"
                />
              </div>

              {/* Loan Details Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="px-4 py-1 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full text-sm font-medium">
                    {loan.category}
                  </span>
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                      loan.status === "active"
                        ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {loan.status === "active" ? "Available" : "Unavailable"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {loan.title}
                </h1>

                <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed break-words max-h-32 sm:max-h-40 md:max-h-60 overflow-auto">
                  {loan.description}
                </p>

                {/* Key Features */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <FiPercent className="text-xl text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Interest Rate
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {loan.interestRate}%
                      </p>
                      <p className="text-xs text-gray-500">per annum</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                      <FiDollarSign className="text-xl text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Maximum Amount
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        ${loan.maxLimit?.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">loan limit</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <FiCalendar className="text-xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        EMI Options
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {loan.emiOptions?.join(", ")} months
                      </p>
                      <p className="text-xs text-gray-500">flexible terms</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <FiClock className="text-xl text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Processing Time
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        24-48 hrs
                      </p>
                      <p className="text-xs text-gray-500">quick approval</p>
                    </div>
                  </div>
                </div>

                {/* Requirements Section */}
                {loan.requirements && loan.requirements.length > 0 && (
                  <div className="mb-6 sm:mb-8">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                      <FiFileText className="text-primary-600" /> Requirements
                    </h3>
                    <ul className="space-y-2 sm:space-y-3">
                      {loan.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <FiCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                            {req}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits Section */}
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                    <FiTrendingUp className="text-primary-600" /> Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                      "Quick and easy application process",
                      "Competitive interest rates",
                      "Flexible repayment options",
                      "No hidden charges",
                      "Dedicated customer support",
                      "Secure transaction process",
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FiCheckCircle className="text-green-500 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 mt-8 lg:mt-0"
            >
              {/* Apply Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Apply for this Loan
                </h3>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Loan Type
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {loan.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Interest Rate
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {loan.interestRate}% p.a.
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Max Amount
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      ${loan.maxLimit?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 sm:py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Application Fee
                    </span>
                    <span className="font-medium text-primary-600 dark:text-primary-400">
                      $10
                    </span>
                  </div>
                </div>

                {loan.status === "active" ? (
                  <button
                    onClick={handleApply}
                    className="w-full btn-primary py-3 text-lg"
                  >
                    Apply Now
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full btn-primary py-3 text-lg opacity-50 cursor-not-allowed"
                  >
                    Currently Unavailable
                  </button>
                )}

                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center mt-3 sm:mt-4">
                  A $10 non-refundable application fee is required
                </p>

                {/* Security Badge */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <FiShield className="text-2xl text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                        Secure Application
                      </p>
                      <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
                        Your data is protected with SSL encryption
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Manager Info */}
              {loan.managerEmail && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mt-4 sm:mt-6">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    Loan Manager
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                    This loan is managed by a verified loan officer. You'll be
                    contacted within 24-48 hours of application submission.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanDetails;
