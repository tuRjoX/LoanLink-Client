import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add a request interceptor to inject the Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("loanlink_jwt");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Loans API
export const loansAPI = {
  getAll: (params) => api.get("/api/loans", { params }),
  getById: (id) => api.get(`/api/loans/${id}`),
  create: (data) => api.post("/api/loans", data),
  update: (id, data) => api.patch(`/api/loans/${id}`, data),
  delete: (id) => api.delete(`/api/loans/${id}`),
  getByManager: (email, params) =>
    api.get(`/api/loans/manager/${email}`, { params }),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get("/api/users", { params }),
  getByEmail: (email) => api.get(`/api/users/${email}`),
  create: (data) => api.post("/api/users", data),
  update: (id, data) => api.patch(`/api/users/${id}`, data),
};

// Applications API
export const applicationsAPI = {
  getAll: (params) => api.get("/api/applications", { params }),
  getById: (id) => api.get(`/api/applications/${id}`),
  getPending: () => api.get("/api/applications/pending"),
  getApproved: () => api.get("/api/applications/approved"),
  getByUser: (email) => api.get(`/api/applications/user/${email}`),
  create: (data) => api.post("/api/applications", data),
  update: (id, data) => api.patch(`/api/applications/${id}`, data),
  updatePayment: (id, data) =>
    api.patch(`/api/applications/${id}/payment`, data),
  cancel: (id) => api.delete(`/api/applications/${id}`),
};

// Payments API
export const paymentsAPI = {
  createIntent: (data) => api.post("/api/create-payment-intent", data),
  save: (data) => api.post("/api/payments", data),
  getByApplication: (id) => api.get(`/api/payments/application/${id}`),
};

// Stats API
export const statsAPI = {
  getAdminStats: () => api.get("/api/stats/admin"),
  getManagerStats: (email) => api.get(`/api/stats/manager/${email}`),
};

export default api;
