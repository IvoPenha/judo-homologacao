import axios from 'axios';
import { parseCookies } from 'nookies';
import { Navigate } from 'react-router-dom';

const { 'judo-auth-token': token } = parseCookies();

const api = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
});

if (token) {
  api.defaults.headers.Authorization = `Bearer ${token}`;
} else {
  delete axios.defaults.headers.common.Authorization;
}

api.interceptors.response.use(
  (successRes) => successRes,
  (error) => {
    console.log("error", error);
    if (error.response.status === 401) {
      <Navigate to="/login" />;
    }
    return Promise.reject(error);
  },
);

export default api;
