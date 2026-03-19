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

  const isFormDataBody =
    typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  // Only set JSON content-type when sending JSON.
  // For FormData, the browser sets the proper multipart boundary automatically.
  if (!isFormDataBody && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

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
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  if (!response.ok) {
    try {
      const error = await response.json();
      let message = 'API request failed';
      if (error.detail) {
        message = Array.isArray(error.detail)
          ? error.detail.map((e: { msg?: string }) => e.msg || JSON.stringify(e)).join(', ')
          : String(error.detail);
      } else if (error.message) {
        message = String(error.message);
      }
      throw new Error(message);
    } catch (e) {
      if (e instanceof Error) throw e;
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

const postForm = (url: string, data: FormData) =>
  fetchWithAuth(url, {
    method: 'POST',
    body: data,
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
  postForm,
  put,
  delete: del,
};

// Also export as default
export default {
  get,
  post,
  postForm,
  put,
  delete: del,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
};
