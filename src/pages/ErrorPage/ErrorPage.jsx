import { Link, useRouteError } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiHome } from "react-icons/fi";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | LoanLink</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">
              404
            </h1>
            <div className="text-4xl font-semibold text-gray-900 dark:text-white mt-4">
              Page Not Found
            </div>
          </div>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {error?.statusText ||
              error?.message ||
              "Sorry, the page you're looking for doesn't exist or has been moved."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <FiHome size={20} />
              Back to Home
            </Link>
            <Link
              to="/all-loans"
              className="btn-outline flex items-center justify-center"
            >
              Browse Loans
            </Link>
          </div>

          {/* Decorative illustration */}
          <div className="mt-12">
            <svg
              className="w-full max-w-md mx-auto"
              viewBox="0 0 500 300"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fillRule="evenodd">
                <circle
                  cx="250"
                  cy="150"
                  r="120"
                  fill="#e0f2fe"
                  opacity="0.5"
                />
                <circle cx="250" cy="150" r="90" fill="#bae6fd" opacity="0.5" />
                <circle cx="250" cy="150" r="60" fill="#7dd3fc" opacity="0.5" />
                <text
                  x="250"
                  y="170"
                  fontFamily="Arial, sans-serif"
                  fontSize="48"
                  fill="#0284c7"
                  textAnchor="middle"
                >
                  ?
                </text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;
