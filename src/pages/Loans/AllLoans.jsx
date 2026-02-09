import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { loansAPI } from "../../services/api";
import { FiSearch } from "react-icons/fi";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

const AllLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    "all",
    "Business",
    "Education",
    "Agriculture",
    "Healthcare",
    "Personal",
  ];

  useEffect(() => {
    fetchLoans();
  }, [currentPage, searchTerm, selectedCategory]);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== "all" && { category: selectedCategory }),
      };

      const response = await loansAPI.getAll(params);
      setLoans(response.data.loans || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchLoans();
  };

  if (loading && currentPage === 1) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>All Loans - LoanLink</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-12">
          <div className="container-custom text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Browse All Loans
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl"
            >
              Find the perfect loan for your needs
            </motion.p>
          </div>
        </div>

        <div className="container-custom py-12">
          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <FiSearch
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search loans by title or category..."
                      className="input-field pl-10"
                    />
                  </div>
                </form>

                {/* Category Filter */}
                <div className="md:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="input-field"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {loans.length} loan{loans.length !== 1 ? "s" : ""}
              {selectedCategory !== "all" && ` in ${selectedCategory}`}
            </p>
          </div>

          {/* Loans Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                No loans found matching your criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loans.map((loan, index) => (
                  <motion.div
                    key={loan._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden card-hover"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          loan.images
                        }
                        alt={loan.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="badge-info">{loan.category}</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {loan.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {loan.description}
                      </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Interest Rate
                          </span>
                          <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                            {loan.interestRate !== undefined &&
                            loan.interestRate !== null
                              ? `${loan.interestRate}%`
                              : "--"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Max Limit
                          </span>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            ${loan.maxLimit?.toLocaleString()}
                          </span>
                        </div>

                        {loan.emiPlans && loan.emiPlans.length > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              EMI Plans
                            </span>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {loan.emiPlans.join(", ")} months
                            </span>
                          </div>
                        )}
                      </div>

                      <Link
                        to={`/loan/${loan._id}`}
                        className="block w-full text-center btn-primary"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          currentPage === index + 1
                            ? "bg-primary-600 text-white"
                            : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AllLoans;
