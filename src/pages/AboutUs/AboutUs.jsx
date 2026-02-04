import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { FiTarget, FiEye, FiAward, FiUsers } from "react-icons/fi";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://i.pravatar.cc/300?img=1",
      bio: "15+ years in microfinance",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image: "https://i.pravatar.cc/300?img=2",
      bio: "Tech innovator & strategist",
    },
    {
      name: "Aisha Rahman",
      role: "Head of Operations",
      image: "https://i.pravatar.cc/300?img=3",
      bio: "Operations excellence expert",
    },
    {
      name: "David Martinez",
      role: "Chief Financial Officer",
      image: "https://i.pravatar.cc/300?img=4",
      bio: "Financial planning specialist",
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - LoanLink</title>
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-blue-700 text-white py-16">
          <div className="container-custom text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              About LoanLink
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl max-w-2xl mx-auto"
            >
              Empowering individuals and businesses through accessible
              microfinance solutions
            </motion.p>
          </div>
        </div>

        {/* Our Story */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Story
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Founded in 2020, LoanLink emerged from a simple yet powerful
                  idea: to make microloans accessible to everyone who needs
                  them. We recognized that traditional banking systems often
                  overlook small businesses and individuals seeking modest
                  financial support.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our platform bridges this gap by providing a streamlined,
                  transparent, and user-friendly system for microloan
                  applications, approvals, and management. We've helped
                  thousands of entrepreneurs, small business owners, and
                  individuals achieve their financial goals.
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Today, we continue to innovate and expand our services, always
                  keeping our core mission at heart: financial inclusion for
                  all.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                  <FiTarget
                    className="text-primary-600 dark:text-primary-400"
                    size={32}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Mission
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To democratize access to microfinance by providing a
                  transparent, efficient, and user-friendly platform that
                  empowers individuals and small businesses to achieve their
                  financial goals and dreams.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg"
              >
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                  <FiEye
                    className="text-primary-600 dark:text-primary-400"
                    size={32}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Our Vision
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  To become the leading microloan platform globally, recognized
                  for our commitment to financial inclusion, innovation, and
                  exceptional customer service, helping millions achieve
                  financial independence.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="section-title">Our Core Values</h2>
              <p className="section-subtitle">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🎯",
                  title: "Transparency",
                  description:
                    "Clear terms, no hidden fees, honest communication",
                },
                {
                  icon: "🤝",
                  title: "Trust",
                  description:
                    "Building lasting relationships through reliability",
                },
                {
                  icon: "⚡",
                  title: "Innovation",
                  description:
                    "Continuous improvement and technological advancement",
                },
                {
                  icon: "❤️",
                  title: "Empathy",
                  description:
                    "Understanding and supporting our customers' needs",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center"
                >
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="section-padding bg-gradient-to-r from-primary-600 to-blue-700 text-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10,000+", label: "Happy Customers" },
                { number: "$5M+", label: "Loans Disbursed" },
                { number: "98%", label: "Satisfaction Rate" },
                { number: "24hrs", label: "Avg. Approval Time" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="section-title">Meet Our Team</h2>
              <p className="section-subtitle">
                Passionate professionals dedicated to your success
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-40 h-40 rounded-full mx-auto mb-4 object-cover border-4 border-primary-200 dark:border-primary-800"
                  />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="section-title">Awards & Recognition</h2>
              <p className="section-subtitle">
                Recognized for excellence in microfinance
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FiAward size={48} />,
                  title: "Best Fintech Platform 2023",
                  org: "Tech Innovation Awards",
                },
                {
                  icon: <FiUsers size={48} />,
                  title: "Customer Choice Award",
                  org: "Financial Services Review",
                },
                {
                  icon: <FiTarget size={48} />,
                  title: "Top 10 Microfinance Platform",
                  org: "Global Finance Magazine",
                },
              ].map((award, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 p-8 rounded-xl text-center"
                >
                  <div className="text-primary-600 dark:text-primary-400 flex justify-center mb-4">
                    {award.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {award.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {award.org}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
