// src/utils/api.js
const API_URL = 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const isJson = response.headers?.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    return Promise.reject(error);
  }

  return data;
};

const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Try to get token from localStorage as fallback
    const savedUser = localStorage.getItem('careerai_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.token) {
        headers['Authorization'] = `Bearer ${parsedUser.token}`;
      }
    }
  }
  
  return headers;
};

export const api = {
  get: async (endpoint, token = null) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
  
  post: async (endpoint, body, token = null) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  
  put: async (endpoint, body, token = null) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  
  delete: async (endpoint, token = null) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  }
};
