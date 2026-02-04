import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { loansAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  FiArrowRight,
  FiCheckCircle,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Home = () => {
  const { user } = useAuth();
  const [featuredLoans, setFeaturedLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedLoans();
  }, []);

  const fetchFeaturedLoans = async () => {
    try {
      const response = await loansAPI.getAll({ limit: 6, showOnHome: true });
      setFeaturedLoans(response.data.loans || []);
    } catch (error) {
      console.error("Error fetching loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Small Business Owner",
      image: "https://i.pravatar.cc/150?img=1",
      text: "LoanLink helped me get the funding I needed to expand my bakery. The process was quick and transparent!",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Freelance Developer",
      image: "https://i.pravatar.cc/150?img=2",
      text: "Amazing platform! I got approved within 24 hours and the interest rates are very competitive.",
      rating: 5,
    },
    {
      id: 3,
      name: "Aisha Rahman",
      role: "Entrepreneur",
      image: "https://i.pravatar.cc/150?img=3",
      text: "The customer service is excellent and the repayment terms are flexible. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Home - LoanLink | Microloan Management System</title>
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-blue-700 text-white section-padding overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Get Your <span className="text-yellow-300">Microloan</span>{" "}
                Today
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-100">
                Empowering individuals and small businesses with accessible
                financial solutions. Quick approval, competitive rates, and
                flexible repayment terms.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/all-loans"
                  className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
                >
                  Explore Loans <FiArrowRight className="inline ml-2" />
                </Link>
                <Link
                  to={user ? "/dashboard/my-loans" : "/register"}
                  className="btn-outline border-white text-white hover:bg-white hover:text-primary-600"
                >
                  {user ? "Go to Dashboard" : "Get Started"}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block"
            >
              <img
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600"
                alt="Loan Management"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <FiUsers />, label: "Active Users", value: "10,000+" },
              {
                icon: <FiDollarSign />,
                label: "Loans Disbursed",
                value: "$5M+",
              },
              { icon: <FiCheckCircle />, label: "Success Rate", value: "98%" },
              {
                icon: <FiTrendingUp />,
                label: "Average Approval",
                value: "24hrs",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl text-primary-600 dark:text-primary-400 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Loans Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Available Loans</h2>
            <p className="section-subtitle">
              Browse our selection of microloans tailored to your needs
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredLoans.map((loan, index) => (
                <motion.div
                  key={loan._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden card-hover"
                >
                  <img
                    src={
                      loan.images?.[0] ||
                      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400"
                    }
                    alt={loan.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {loan.title}
                      </h3>
                      <span className="badge-info">{loan.category}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {loan.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Interest
                        </span>
                        <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">
                          {loan.interestRate !== undefined &&
                          loan.interestRate !== null
                            ? `${loan.interestRate}%`
                            : "--"}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Max Limit
                        </span>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          ${loan.maxLimit?.toLocaleString()}
                        </div>
                      </div>
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
          )}

          <div className="text-center mt-12">
            <Link to="/all-loans" className="btn-primary">
              View All Loans <FiArrowRight className="inline ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Get your loan in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Account",
                description:
                  "Sign up and complete your profile with basic information",
                icon: "📝",
              },
              {
                step: "02",
                title: "Apply for Loan",
                description: "Choose a loan and fill out the application form",
                icon: "💼",
              },
              {
                step: "03",
                title: "Get Approved",
                description: "Receive approval and get your funds deposited",
                icon: "✅",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-primary-600 dark:text-primary-400 font-bold mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="section-padding bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">What Our Customers Say</h2>
            <p className="section-subtitle">Real stories from real people</p>
          </motion.div>

          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            navigation
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg h-full">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    "{testimonial.text}"
                  </p>
                  <div className="flex text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Why Choose LoanLink?</h2>
            <p className="section-subtitle">
              We're committed to making microloans accessible to everyone
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "⚡",
                title: "Fast Approval",
                desc: "Get approved in 24 hours",
              },
              {
                icon: "🔒",
                title: "Secure Platform",
                desc: "Bank-level security",
              },
              { icon: "💰", title: "Low Interest", desc: "Competitive rates" },
              {
                icon: "🤝",
                title: "24/7 Support",
                desc: "Always here to help",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-blue-700 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers and get the financial
              support you need today.
            </p>
            <Link
              to={user ? "/all-loans" : "/register"}
              className="btn-primary bg-white text-primary-600 hover:bg-gray-100"
            >
              {user ? "Browse Loans" : "Apply Now"}{" "}
              <FiArrowRight className="inline ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Home;
