import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX, FiLogOut, FiUser } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, userRole, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Get profile link based on role
  const getProfileLink = () => {
    if (userRole === "admin") return "/dashboard/manage-users";
    if (userRole === "manager") return "/dashboard/manager-profile";
    return "/dashboard/profile";
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md transition-colors ${
            isActive
              ? "text-primary-600 dark:text-primary-400 font-semibold"
              : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          }`
        }
      >
        Home
      </NavLink>
      <NavLink
        to="/all-loans"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md transition-colors ${
            isActive
              ? "text-primary-600 dark:text-primary-400 font-semibold"
              : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          }`
        }
      >
        All Loans
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md transition-colors ${
            isActive
              ? "text-primary-600 dark:text-primary-400 font-semibold"
              : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          }`
        }
      >
        About Us
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md transition-colors ${
            isActive
              ? "text-primary-600 dark:text-primary-400 font-semibold"
              : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
          }`
        }
      >
        Contact
      </NavLink>
      {user && (
        <NavLink
          to="/dashboard/my-loans"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md transition-colors ${
              isActive
                ? "text-primary-600 dark:text-primary-400 font-semibold"
                : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
            }`
          }
        >
          Dashboard
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">LL</span>
            </div>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              LoanLink
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">{navLinks}</div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to={getProfileLink()}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FiUser /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col gap-2">
              {navLinks}
              {!user && (
                <div className="flex flex-col gap-2 mt-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-center bg-primary-600 text-white rounded-md hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
