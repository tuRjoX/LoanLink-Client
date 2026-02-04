import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { loansAPI } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  FiSave,
  FiImage,
  FiDollarSign,
  FiPercent,
  FiList,
  FiFileText,
  FiTag,
} from "react-icons/fi";

const AddLoan = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      emiOptions: [3, 6, 12],
      status: "active",
      showOnHome: false,
    },
  });

  const categories = [
    "Business",
    "Education",
    "Agriculture",
    "Healthcare",
    "Personal",
  ];

  const handleImageChange = (e) => {
    const url = e.target.value;
    setImagePreview(url);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const loanData = {
        ...data,
        managerEmail: user.email,
        managerName: user.displayName,
        interestRate: parseFloat(data.interestRate),
        maxLimit: parseInt(data.maxLimit),
        emiOptions: data.emiOptions.filter(Boolean).map(Number),
        requirements: data.requirements?.split("\n").filter(Boolean) || [],
        createdAt: new Date().toISOString(),
      };

      const response = await loansAPI.create(loanData);

      if (response.data.insertedId) {
        await Swal.fire({
          icon: "success",
          title: "Loan Created!",
          text: "Your new loan product has been added successfully.",
          confirmButtonColor: "#0ea5e9",
        });
        navigate("/dashboard/manage-loans");
      }
    } catch (error) {
      console.error("Error creating loan:", error);
      toast.error(error.response?.data?.message || "Failed to create loan");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add New Loan - Manager Dashboard | LoanLink</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Add New Loan Product
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create a new loan offering for borrowers
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiFileText className="text-primary-600" /> Basic Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Loan Title *
                    </label>
                    <input
                      type="text"
                      {...register("title", { required: "Title is required" })}
                      className="input-field"
                      placeholder="e.g., Small Business Starter Loan"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className="input-field"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status *
                    </label>
                    <select {...register("status")} className="input-field">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Loan Terms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiDollarSign className="text-primary-600" /> Loan Terms
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interest Rate (% per annum) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        {...register("interestRate", {
                          required: "Interest rate is required",
                          min: { value: 1, message: "Minimum is 1%" },
                          max: { value: 30, message: "Maximum is 30%" },
                        })}
                        className="input-field pl-10"
                        placeholder="e.g., 8.5"
                      />
                      <FiPercent className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.interestRate && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.interestRate.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Maximum Loan Amount (USD) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        {...register("maxLimit", {
                          required: "Max limit is required",
                          min: { value: 100, message: "Minimum is $100" },
                        })}
                        className="input-field pl-10"
                        placeholder="e.g., 10000"
                      />
                      <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.maxLimit && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.maxLimit.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      EMI Options (months) *
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {[3, 6, 9, 12, 18, 24, 36].map((month) => (
                        <label
                          key={month}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={month}
                            {...register("emiOptions")}
                            defaultChecked={[3, 6, 12].includes(month)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {month} months
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiList className="text-primary-600" /> Description &
                  Requirements
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 50,
                          message: "Minimum 50 characters required",
                        },
                      })}
                      rows={4}
                      className="input-field"
                      placeholder="Provide a detailed description of the loan product..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Requirements (one per line)
                    </label>
                    <textarea
                      {...register("requirements")}
                      rows={4}
                      className="input-field"
                      placeholder="Valid government ID&#10;Proof of income&#10;Bank statements (last 3 months)&#10;Minimum age: 21 years"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter each requirement on a new line
                    </p>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiImage className="text-primary-600" /> Loan Image
                </h3>
                <div className="grid md:grid-cols-2 gap-4 items-start">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      {...register("image", {
                        required: "Image URL is required",
                      })}
                      onChange={handleImageChange}
                      className="input-field"
                      placeholder="https://example.com/image.jpg"
                    />
                    {errors.image && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.image.message}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Use a high-quality image (recommended: 800x600px)
                    </p>
                  </div>
                  {imagePreview && (
                    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover"
                        onError={(e) =>
                          (e.target.src =
                            "https://via.placeholder.com/400x300?text=Invalid+Image+URL")
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Options */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiTag className="text-primary-600" /> Display Options
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("showOnHome")}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 h-5 w-5"
                  />
                  <div>
                    <span className="text-gray-900 dark:text-white font-medium">
                      Show on Homepage
                    </span>
                    <p className="text-sm text-gray-500">
                      Display this loan in the featured loans section
                    </p>
                  </div>
                </label>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/manage-loans")}
                  className="flex-1 btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FiSave />
                  {submitting ? "Creating..." : "Create Loan"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AddLoan;
