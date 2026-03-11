// API configuration and base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('accessToken');
};

// Set token in localStorage
export const setAuthToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

// Remove token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('accessToken');
};

// Make authenticated API request (core function)
const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Token expired or invalid
    removeAuthToken();
    window.location.href = '/login';
  }

  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.detail || error.message || 'API request failed');
    } catch {
      throw new Error('API request failed');
    }
  }

  return response.json();
};

// GET request
const get = (url: string) => fetchWithAuth(url);

// POST request
const post = (url: string, data: any) =>
  fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// PUT request
const put = (url: string, data: any) =>
  fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

// DELETE request
const del = (url: string) =>
  fetchWithAuth(url, {
    method: 'DELETE',
  });

// Export as both named and default object for flexibility
export const apiClient = {
  get,
  post,
  put,
  delete: del,
};

// Also export as default
export default {
  get,
  post,
  put,
  delete: del,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
};
