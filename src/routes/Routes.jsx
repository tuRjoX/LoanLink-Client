import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ManagerRoute from "./ManagerRoute";
import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import AllLoans from "../pages/Loans/AllLoans";
import LoanDetails from "../pages/Loans/LoanDetails";
import LoanApplication from "../pages/Loans/LoanApplication";
import AboutUs from "../pages/AboutUs/AboutUs";
import ContactUs from "../pages/ContactUs/ContactUs";
import ErrorPage from "../pages/ErrorPage/ErrorPage";

// Admin Pages
import ManageUsers from "../pages/Dashboard/Admin/ManageUsers";
import AllLoansAdmin from "../pages/Dashboard/Admin/AllLoansAdmin";
import LoanApplicationsAdmin from "../pages/Dashboard/Admin/LoanApplicationsAdmin";

// Manager Pages
import AddLoan from "../pages/Dashboard/Manager/AddLoan";
import ManageLoans from "../pages/Dashboard/Manager/ManageLoans";
import PendingApplications from "../pages/Dashboard/Manager/PendingApplications";
import ApprovedApplications from "../pages/Dashboard/Manager/ApprovedApplications";
import ManagerProfile from "../pages/Dashboard/Manager/ManagerProfile";

// Borrower Pages
import MyLoans from "../pages/Dashboard/Borrower/MyLoans";
import BorrowerProfile from "../pages/Dashboard/Borrower/BorrowerProfile";

// Payment
import Payment from "../pages/Payment/Payment";
import PaymentSuccess from "../pages/Payment/PaymentSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/all-loans",
        element: <AllLoans />,
      },
      {
        path: "/loan/:id",
        element: (
          <PrivateRoute>
            <LoanDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/loan-application/:id",
        element: (
          <PrivateRoute>
            <LoanApplication />
          </PrivateRoute>
        ),
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <ContactUs />,
      },
      {
        path: "/payment/:applicationId",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
      {
        path: "/payment-success",
        element: (
          <PrivateRoute>
            <PaymentSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      // Admin Routes
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-loans",
        element: (
          <AdminRoute>
            <AllLoansAdmin />
          </AdminRoute>
        ),
      },
      {
        path: "loan-applications",
        element: (
          <AdminRoute>
            <LoanApplicationsAdmin />
          </AdminRoute>
        ),
      },
      // Manager Routes
      {
        path: "add-loan",
        element: (
          <ManagerRoute>
            <AddLoan />
          </ManagerRoute>
        ),
      },
      {
        path: "manage-loans",
        element: (
          <ManagerRoute>
            <ManageLoans />
          </ManagerRoute>
        ),
      },
      {
        path: "pending-applications",
        element: (
          <ManagerRoute>
            <PendingApplications />
          </ManagerRoute>
        ),
      },
      {
        path: "approved-applications",
        element: (
          <ManagerRoute>
            <ApprovedApplications />
          </ManagerRoute>
        ),
      },
      {
        path: "manager-profile",
        element: (
          <ManagerRoute>
            <ManagerProfile />
          </ManagerRoute>
        ),
      },
      // Borrower Routes
      {
        path: "my-loans",
        element: <MyLoans />,
      },
      {
        path: "profile",
        element: <BorrowerProfile />,
      },
    ],
  },
]);

export default router;
