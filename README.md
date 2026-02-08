# LoanLink Client

Frontend application for **LoanLink** - A comprehensive Microloan Request & Approval Tracker System.

## 🚀 Live Demo

**Live Site URL:** `https://loanlink-3d15f.web.app/`

## 📋 Purpose

LoanLink Client is a modern, responsive web application built with React that enables users to apply for microloans, track applications, and manage loan portfolios. It features role-based dashboards for Admins, Managers, and Borrowers.

## ✨ Key Features

### 🏠 Public Features

- **Modern Landing Page** with Framer Motion animations
- **Loan Browsing** with search and filter capabilities
- **Detailed Loan Information** with application forms
- **Authentication** via Email/Password, Google, and GitHub
- **Theme Toggle** (Light/Dark mode)
- **Fully Responsive** design for all devices

### 👤 Borrower Features

- Apply for loans with detailed application forms
- Track application status (Pending, Approved, Rejected)
- Pay application fees via Stripe ($10 per application)
- View payment history and transaction details
- Cancel pending applications
- Personal dashboard with loan overview

### 👨‍💼 Manager Features

- Add and manage loan products
- View and approve/reject pending applications
- Track approved applications
- Search and filter loans by title/category
- Performance analytics dashboard

### 🔐 Admin Features

- Manage user roles (Admin, Manager, Borrower)
- Suspend users with reason tracking
- Manage all loans in the system
- Toggle loan visibility on homepage
- View all loan applications with filtering
- Comprehensive system analytics

### 💳 Payment Features

- Secure Stripe payment integration
- Fixed $10 application fee
- Payment confirmation and receipts
- Transaction history tracking

### 🎨 Design Features

- Clean, modern UI with Tailwind CSS
- Smooth animations with Framer Motion
- Carousel for testimonials (Swiper.js)
- Toast notifications for user feedback
- Confetti celebration on successful applications
- Loading states and error handling

## 🛠️ Tech Stack & NPM Packages

### Core Dependencies

- **react** (^18.3.1) - UI library
- **react-dom** (^18.3.1) - DOM rendering
- **react-router-dom** (^6.21.1) - Client-side routing
- **vite** (^5.2.0) - Build tool and dev server

### Authentication & API

- **firebase** (^10.7.1) - Authentication and user management
- **axios** (^1.6.5) - HTTP client for API calls

### UI & Styling

- **tailwindcss** (^3.4.1) - Utility-first CSS framework
- **daisyui** (^4.6.0) - Tailwind CSS component library
- **framer-motion** (^11.0.3) - Animation library
- **react-icons** (^5.0.1) - Icon library
- **swiper** (^11.0.5) - Carousel/slider component

### Forms & Validation

- **react-hook-form** (^7.49.3) - Form validation and handling

### Notifications & Feedback

- **react-hot-toast** (^2.4.1) - Toast notifications
- **sweetalert2** (^11.10.3) - Beautiful alert/modal dialogs
- **react-confetti** (^6.1.0) - Celebration effects

### Payments

- **@stripe/react-stripe-js** (^2.4.0) - Stripe React components
- **@stripe/stripe-js** (^2.4.0) - Stripe JavaScript library

### Utilities

- **react-helmet-async** (^2.0.4) - Dynamic page titles/meta
- **localforage** (^1.10.0) - Offline storage
- **jspdf** (^2.5.1) - PDF generation
- **react-to-pdf** (^1.0.1) - React to PDF converter

### Development Tools

- **@vitejs/plugin-react** (^4.3.0) - Vite React plugin
- **eslint** (^9.0.0) - Code linting
- **autoprefixer** (^10.4.16) - CSS vendor prefixing
- **postcss** (^8.4.33) - CSS transformation

## 📁 Project Structure

```
LoanLink-Client/
├── public/
│   └── loan-icon.svg
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── LoadingSpinner/
│   │   └── LoanCard/
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── firebase/
│   │   └── firebase.config.js
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── Home/
│   │   ├── Auth/
│   │   ├── Loans/
│   │   ├── Dashboard/
│   │   │   ├── Admin/
│   │   │   ├── Manager/
│   │   │   └── Borrower/
│   │   ├── Payment/
│   │   ├── AboutUs/
│   │   ├── ContactUs/
│   │   └── ErrorPage/
│   ├── routes/
│   │   ├── Routes.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   └── ManagerRoute.jsx
│   ├── services/
│   │   └── api.js
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Firebase project (for authentication)
- Stripe account (for payments)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/tuRjoX/LoanLink-Client.git
   cd LoanLink-Client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_API_URL=http://localhost:5000
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

5. **Build for production**

   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Add environment variables in Vercel dashboard**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env` file

### Netlify

1. **Build command:** `npm run build`
2. **Publish directory:** `dist`
3. **Add environment variables in Netlify dashboard**

### Firebase Hosting

1. **Install Firebase CLI**

   ```bash
   npm install -g firebase-tools
   ```

2. **Login and initialize**

   ```bash
   firebase login
   firebase init hosting
   ```

3. **Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔐 Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication methods:
   - Email/Password
   - Google
   - GitHub
3. Add your deployment domain to authorized domains
4. Copy configuration to `.env` file

## 💳 Stripe Configuration

1. Create a Stripe account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your publishable key from API keys section
3. Add to `.env` as `VITE_STRIPE_PUBLISHABLE_KEY`
4. Configure webhook endpoints for payment confirmations

## 📊 Features Breakdown

### Authentication System

- Email/Password registration with validation
- Google OAuth integration
- GitHub OAuth integration
- JWT token management with HTTP-only cookies
- Role-based access control
- Protected routes for different user roles

### Loan Management

- Browse all available loans
- Detailed loan information pages
- Search and filter functionality
- Pagination for large datasets
- Apply for loans with comprehensive forms

### Payment Processing

- Secure Stripe integration
- Fixed $10 application fee
- Payment success confirmation
- Transaction history
- Payment status tracking

### Dashboard Features

- **Admin:** User management, loan oversight, application monitoring
- **Manager:** Loan creation, approval workflow, analytics
- **Borrower:** Application tracking, payment management, profile

### UI/UX Features

- Responsive design (mobile, tablet, desktop)
- Dark/Light theme toggle
- Smooth page transitions
- Loading states
- Error handling
- Toast notifications
- Confetti celebrations
- Accessible components

## 🎯 Route Structure

### Public Routes

- `/` - Home page
- `/all-loans` - Browse all loans
- `/about` - About us page
- `/contact` - Contact page
- `/login` - Login page
- `/register` - Registration page

### Private Routes

- `/loan/:id` - Loan details (All authenticated users)
- `/loan-application/:id` - Apply for loan (Borrowers only)
- `/payment/:applicationId` - Payment page
- `/payment-success` - Payment confirmation

### Dashboard Routes

**Admin Only:**

- `/dashboard/manage-users` - User management
- `/dashboard/all-loans` - All loans management
- `/dashboard/loan-applications` - All applications

**Manager Only:**

- `/dashboard/add-loan` - Create new loan
- `/dashboard/manage-loans` - Manage own loans
- `/dashboard/pending-applications` - Pending approvals
- `/dashboard/approved-applications` - Approved loans
- `/dashboard/manager-profile` - Manager profile

**Borrower:**

- `/dashboard/my-loans` - User's applications
- `/dashboard/profile` - User profile

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**

- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

**Firebase Auth Issues:**

- Verify authorized domains in Firebase Console
- Check API key configuration
- Ensure authentication methods are enabled

**API Connection Issues:**

- Verify `VITE_API_URL` in `.env`
- Check CORS settings on backend
- Ensure backend server is running

**Payment Issues:**

- Verify Stripe keys are correct
- Check webhook configuration
- Test with Stripe test cards

