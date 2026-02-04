import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { applicationsAPI, paymentsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import {
  FiCreditCard,
  FiLock,
  FiCheck,
  FiDollarSign,
  FiFileText,
  FiShield,
  FiAlertCircle,
} from "react-icons/fi";

// Load Stripe - Use your Stripe publishable key from environment
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
);

// Card Element Styles
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#374151",
      "::placeholder": {
        color: "#9ca3af",
      },
      fontFamily: "Inter, system-ui, sans-serif",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
};

// Checkout Form Component
const CheckoutForm = ({ application, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setCardError("");

    try {
      // Create payment intent on backend
      const { data: intentData } = await paymentsAPI.createIntent({
        applicationId: application._id,
        amount: 1000, // $10.00 in cents
      });

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user.displayName,
              email: user.email,
            },
          },
        },
      );

      if (error) {
        setCardError(error.message);
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {
        // Save payment record
        await paymentsAPI.save({
          applicationId: application._id,
          paymentIntentId: paymentIntent.id,
          amount: 10,
          status: "completed",
        });

        // Update application payment status (using dedicated payment endpoint)
        await applicationsAPI.updatePayment(application._id, {
          paymentStatus: "paid",
        });

        toast.success("Payment successful!");
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setCardError("Payment failed. Please try again.");
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Card Details
        </label>
        <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus-within:border-primary-500 transition-colors">
          <CardElement options={cardElementOptions} />
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
            <FiAlertCircle /> {cardError}
          </p>
        )}
      </div>

      {/* Security Info */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <FiLock className="text-green-500" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? (
          <>
            <span className="animate-spin">⏳</span> Processing...
          </>
        ) : (
          <>
            <FiCreditCard /> Pay $10.00
          </>
        )}
      </button>
    </form>
  );
};

// Main Payment Page
const Payment = () => {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    try {
      const response = await applicationsAPI.getById(applicationId);

      // Check if already paid
      if (response.data.paymentStatus === "paid") {
        toast.error("This application fee has already been paid.");
        navigate("/dashboard/my-loans");
        return;
      }

      setApplication(response.data);
    } catch (error) {
      console.error("Error fetching application:", error);
      toast.error("Application not found");
      navigate("/dashboard/my-loans");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentId) => {
    navigate(
      `/payment-success?paymentId=${paymentId}&applicationId=${applicationId}`,
    );
  };

  if (loading) return <LoadingSpinner />;
  if (!application) return null;

  return (
    <>
      <Helmet>
        <title>Pay Application Fee - LoanLink</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8">
              {/* Payment Form - Left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="md:col-span-3"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Pay Application Fee
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Complete your payment to submit your loan application
                  </p>

                  {/* Amount Box */}
                  <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Amount Due
                        </p>
                        <p className="text-4xl font-bold text-primary-600">
                          $10.00
                        </p>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
                        <FiDollarSign className="text-3xl text-primary-600" />
                      </div>
                    </div>
                  </div>

                  {/* Stripe Elements Wrapper */}
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      application={application}
                      onSuccess={handlePaymentSuccess}
                    />
                  </Elements>

                  {/* Payment Methods */}
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 text-center mb-4">
                      Accepted Payment Methods
                    </p>
                    <div className="flex justify-center gap-4">
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="font-bold text-blue-600">VISA</span>
                      </div>
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="font-bold text-red-600">MC</span>
                      </div>
                      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <span className="font-bold text-blue-500">AMEX</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Order Summary - Right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="md:col-span-2"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-8">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                    Application Summary
                  </h2>

                  <div className="space-y-4">
                    {/* Loan Info */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center gap-3 mb-3">
                        <FiFileText className="text-primary-600" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {application.loanTitle}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Amount</span>
                          <span className="font-medium">
                            $
                            {parseFloat(
                              application.loanAmount,
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">EMI Plan</span>
                          <span className="font-medium">
                            {application.emiPlan} months
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Monthly EMI</span>
                          <span className="font-medium">
                            ${application.emiAmount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Interest Rate</span>
                          <span className="font-medium">
                            {application.interestRate}% p.a.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Fee Breakdown */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-500">Application Fee</span>
                        <span className="font-medium">$10.00</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary-600">$10.00</span>
                      </div>
                    </div>

                    {/* Security Badge */}
                    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3">
                        <FiShield className="text-2xl text-green-600" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-400">
                            Secure Payment
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-500">
                            256-bit SSL encryption
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Refund Policy */}
                    <div className="text-center text-xs text-gray-500 mt-4">
                      <p>Non-refundable application processing fee</p>
                      <p className="mt-1">
                        Questions? Contact support@loanlink.com
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
