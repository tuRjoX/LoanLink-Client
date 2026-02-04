import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { loansAPI, applicationsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiDollarSign,
  FiFileText,
  FiMapPin,
  FiBriefcase,
  FiAlertCircle,
} from "react-icons/fi";

const LoanApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.displayName?.split(" ")[0] || "",
      lastName: user?.displayName?.split(" ").slice(1).join(" ") || "",
    },
  });

  const watchLoanAmount = watch("loanAmount");
  const watchEmiPlan = watch("emiPlan");

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
      navigate("/all-loans");
    } finally {
      setLoading(false);
    }
  };

  const calculateEMI = () => {
    if (!watchLoanAmount || !watchEmiPlan || !loan) return 0;
    const principal = parseFloat(watchLoanAmount);
    const rate = loan.interestRate / 100 / 12;
    const months = parseInt(watchEmiPlan);
    const emi =
      (principal * rate * Math.pow(1 + rate, months)) /
      (Math.pow(1 + rate, months) - 1);
    return isNaN(emi) ? 0 : emi.toFixed(2);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const applicationData = {
        ...data,
        loanId: id,
        loanTitle: loan.title,
        loanCategory: loan.category,
        interestRate: loan.interestRate,
        applicantEmail: user.email,
        applicantName: `${data.firstName} ${data.lastName}`,
        applicantPhoto: user.photoURL || "",
        managerEmail: loan.managerEmail,
        emiAmount: calculateEMI(),
        status: "pending",
        paymentStatus: "unpaid",
        appliedAt: new Date().toISOString(),
      };

      const response = await applicationsAPI.create(applicationData);

      if (response.data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Application Submitted!",
          text: "Your loan application has been submitted successfully. Please proceed to pay the $10 application fee.",
          confirmButtonText: "Pay Now",
          confirmButtonColor: "#0ea5e9",
        });
        navigate(`/payment/${response.data.insertedId}`);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!loan) {
    return (
      <div className="container-custom py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Loan Not Found
        </h2>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Apply for {loan.title} - LoanLink</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container-custom">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              to={`/loan/${id}`}
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
            >
              <FiArrowLeft className="mr-2" /> Back to Loan Details
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Application Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Loan Application Form
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Please fill in all the required information to apply for the{" "}
                  {loan.title}
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Personal Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiUser className="text-primary-600" /> Personal
                      Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          {...register("firstName", {
                            required: "First name is required",
                          })}
                          className="input-field"
                          placeholder="Enter first name"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          {...register("lastName", {
                            required: "Last name is required",
                          })}
                          className="input-field"
                          placeholder="Enter last name"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiPhone className="text-primary-600" /> Contact
                      Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          {...register("phone", {
                            required: "Phone number is required",
                            pattern: {
                              value: /^[0-9+\-\s()]+$/,
                              message: "Invalid phone number",
                            },
                          })}
                          className="input-field"
                          placeholder="+1 (555) 000-0000"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          National ID *
                        </label>
                        <input
                          type="text"
                          {...register("nationalId", {
                            required: "National ID is required",
                          })}
                          className="input-field"
                          placeholder="Enter national ID number"
                        />
                        {errors.nationalId && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.nationalId.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiMapPin className="text-primary-600" /> Address
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Address *
                      </label>
                      <textarea
                        {...register("address", {
                          required: "Address is required",
                        })}
                        rows={3}
                        className="input-field"
                        placeholder="Enter your full address including city, state, and postal code"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Employment Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiBriefcase className="text-primary-600" /> Employment
                      Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Income Source *
                        </label>
                        <select
                          {...register("incomeSource", {
                            required: "Income source is required",
                          })}
                          className="input-field"
                        >
                          <option value="">Select income source</option>
                          <option value="employed">Employed</option>
                          <option value="self-employed">Self-Employed</option>
                          <option value="business">Business Owner</option>
                          <option value="freelancer">Freelancer</option>
                          <option value="retired">Retired</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.incomeSource && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.incomeSource.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Monthly Income (USD) *
                        </label>
                        <input
                          type="number"
                          {...register("monthlyIncome", {
                            required: "Monthly income is required",
                            min: {
                              value: 100,
                              message: "Minimum income should be $100",
                            },
                          })}
                          className="input-field"
                          placeholder="Enter monthly income"
                        />
                        {errors.monthlyIncome && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.monthlyIncome.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiDollarSign className="text-primary-600" /> Loan Details
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Loan Amount (USD) *
                        </label>
                        <input
                          type="number"
                          {...register("loanAmount", {
                            required: "Loan amount is required",
                            min: {
                              value: 100,
                              message: "Minimum loan amount is $100",
                            },
                            max: {
                              value: loan.maxLimit,
                              message: `Maximum loan amount is $${loan.maxLimit}`,
                            },
                          })}
                          className="input-field"
                          placeholder={`Max: $${loan.maxLimit?.toLocaleString()}`}
                        />
                        {errors.loanAmount && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.loanAmount.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          EMI Plan (Months) *
                        </label>
                        <select
                          {...register("emiPlan", {
                            required: "Please select an EMI plan",
                          })}
                          className="input-field"
                        >
                          <option value="">Select EMI duration</option>
                          {loan.emiOptions?.map((option) => (
                            <option key={option} value={option}>
                              {option} Months
                            </option>
                          ))}
                        </select>
                        {errors.emiPlan && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.emiPlan.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Purpose */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiFileText className="text-primary-600" /> Loan Purpose
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reason for Loan *
                      </label>
                      <textarea
                        {...register("reason", {
                          required: "Please provide a reason for the loan",
                          minLength: {
                            value: 20,
                            message:
                              "Please provide more details (min 20 characters)",
                          },
                        })}
                        rows={4}
                        className="input-field"
                        placeholder="Explain why you need this loan and how you plan to use it"
                      />
                      {errors.reason && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.reason.message}
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        {...register("notes")}
                        rows={3}
                        className="input-field"
                        placeholder="Any additional information you'd like to provide"
                      />
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      {...register("agreeTerms", {
                        required: "You must agree to the terms",
                      })}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      I agree to the{" "}
                      <Link to="#" className="text-primary-600 hover:underline">
                        Terms and Conditions
                      </Link>{" "}
                      and
                      <Link to="#" className="text-primary-600 hover:underline">
                        {" "}
                        Privacy Policy
                      </Link>
                      . I understand that a non-refundable $10 application fee
                      is required. *
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-sm text-red-500">
                      {errors.agreeTerms.message}
                    </p>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Sidebar - Loan Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Loan Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Loan Type
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {loan.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Category
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {loan.category}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Interest Rate
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {loan.interestRate}% p.a.
                    </span>
                  </div>
                  {watchLoanAmount && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">
                        Loan Amount
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${parseFloat(watchLoanAmount).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {watchEmiPlan && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">
                        EMI Duration
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {watchEmiPlan} months
                      </span>
                    </div>
                  )}
                  {watchLoanAmount && watchEmiPlan && (
                    <div className="flex justify-between items-center py-3 bg-primary-50 dark:bg-primary-900/20 -mx-6 px-6 rounded-lg">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Estimated EMI
                      </span>
                      <span className="font-bold text-xl text-primary-600 dark:text-primary-400">
                        ${calculateEMI()}/mo
                      </span>
                    </div>
                  )}
                </div>

                {/* Fee Notice */}
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <FiAlertCircle className="text-yellow-600 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-400 text-sm">
                        Application Fee: $10
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-500 mt-1">
                        This fee is non-refundable and required to process your
                        application.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Help Text */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Need help?{" "}
                    <Link
                      to="/contact"
                      className="text-primary-600 hover:underline"
                    >
                      Contact us
                    </Link>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanApplication;
