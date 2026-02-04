import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiHome,
  FiUsers,
  FiFileText,
  FiList,
  FiUser,
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiMenu,
  FiX,
} from "react-icons/fi";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const DashboardLayout = () => {
  const { userRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminLinks = [
    {
      path: "/dashboard/manage-users",
      label: "Manage Users",
      icon: <FiUsers />,
    },
    { path: "/dashboard/all-loans", label: "All Loans", icon: <FiList /> },
    {
      path: "/dashboard/loan-applications",
      label: "Loan Applications",
      icon: <FiFileText />,
    },
  ];

  const managerLinks = [
    { path: "/dashboard/add-loan", label: "Add Loan", icon: <FiPlus /> },
    {
      path: "/dashboard/manage-loans",
      label: "Manage Loans",
      icon: <FiList />,
    },
    {
      path: "/dashboard/pending-applications",
      label: "Pending Applications",
      icon: <FiClock />,
    },
    {
      path: "/dashboard/approved-applications",
      label: "Approved Applications",
      icon: <FiCheckCircle />,
    },
    {
      path: "/dashboard/manager-profile",
      label: "My Profile",
      icon: <FiUser />,
    },
  ];

  const borrowerLinks = [
    { path: "/dashboard/my-loans", label: "My Loans", icon: <FiFileText /> },
    { path: "/dashboard/profile", label: "My Profile", icon: <FiUser /> },
  ];

  const getLinks = () => {
    if (userRole === "admin") return adminLinks;
    if (userRole === "manager") return managerLinks;
    return borrowerLinks;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            <span className="font-medium">
              {sidebarOpen ? "Close Menu" : "Dashboard Menu"}
            </span>
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-white dark:bg-gray-800 shadow-lg
            transition-transform duration-300 ease-in-out
            overflow-y-auto
          `}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Dashboard
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <FiX size={24} />
              </button>
            </div>
            <nav className="space-y-2">
              <NavLink
                to="/"
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`
                }
              >
                <FiHome className="text-xl" />
                <span>Home</span>
              </NavLink>
              {getLinks().map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-4 md:p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
