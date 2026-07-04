import axios from 'axios';
import { supabase } from '../auth/supabaseClient.js';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: `${backendUrl}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (sessionData.session?.access_token) {
    config.headers.Authorization = `Bearer ${sessionData.session.access_token}`;
  }

  return config;
});

// Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      await supabase.auth.signOut();
      window.location.href = '/auth/signin';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
