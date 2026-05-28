import axios from 'axios';

// Create an Axios instance pointing to our backend API
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // This connects React to Express
});

// Middleware for Axios: Runs before every request is sent
API.interceptors.request.use((req) => {
  // If we have a user token in localStorage, attach it to the Authorization header
  const user = JSON.parse(localStorage.getItem('openform_user'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
