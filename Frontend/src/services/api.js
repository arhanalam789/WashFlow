/**
 * API Service
 *
 * Handles all HTTP requests to the backend API.
 * Includes authentication headers and error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get stored token from localStorage
 * @returns {string|null} JWT token or null
 */
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Set token in localStorage
 * @param {string} token - JWT token
 */
const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Remove token from localStorage
 */
const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Get user from localStorage
 * @returns {Object|null} User object or null
 */
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Set user in localStorage
 * @param {Object} user - User object
 */
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Remove user from localStorage
 */
const removeUser = () => {
  localStorage.removeItem('user');
};

/**
 * Make API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      removeToken();
      removeUser();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    // Try to parse JSON, handle empty or invalid responses
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
      }
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Authentication API
 */
const authAPI = {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Response with user and token
   */
  register: async (userData) => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (response.success) {
      setToken(response.data.token);
      setUser(response.data.user);
    }

    return response;
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<Object>} Response with user and token
   */
  login: async (credentials) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });

    if (response.success) {
      setToken(response.data.token);
      setUser(response.data.user);
    }

    return response;
  },

  /**
   * Logout user
   */
  logout: () => {
    removeToken();
    removeUser();
  },

  /**
   * Get current user profile
   * @returns {Promise<Object>} User data
   */
  getProfile: async () => {
    return await apiRequest('/auth/profile');
  }
};

/**
 * Laundry API
 */
const laundryAPI = {
  /**
   * Submit new laundry request
   * @param {Object} data - Laundry data
   * @returns {Promise<Object>} Created laundry request
   */
  submit: async (data) => {
    return await apiRequest('/laundry/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Get my laundry requests
   * @returns {Promise<Object>} My laundry requests
   */
  getMy: async () => {
    return await apiRequest('/laundry/my');
  },

  /**
   * Get pending requests (Staff)
   * @returns {Promise<Object>} Pending requests
   */
  getPending: async () => {
    return await apiRequest('/laundry/pending');
  },

  /**
   * Mark laundry as collected (Staff)
   * @param {string} id - Laundry ID
   * @returns {Promise<Object>} Updated laundry
   */
  markCollected: async (id) => {
    return await apiRequest(`/laundry/${id}/collect`, {
      method: 'PUT'
    });
  },

  /**
   * Verify laundry items (Staff)
   * @param {string} id - Laundry ID
   * @param {Object} data - Verification data
   * @returns {Promise<Object>} Updated laundry
   */
  verify: async (id, data) => {
    return await apiRequest(`/laundry/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * Update laundry status
   * @param {string} id - Laundry ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated laundry
   */
  updateStatus: async (id, status) => {
    return await apiRequest(`/laundry/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  /**
   * Get laundry by status
   * @param {string} status - Laundry status
   * @returns {Promise<Object>} Laundry requests
   */
  getByStatus: async (status) => {
    return await apiRequest(`/laundry/status/${status}`);
  },

  /**
   * Get laundry with discrepancy
   * @returns {Promise<Object>} Laundry with discrepancy
   */
  getWithDiscrepancy: async () => {
    return await apiRequest('/laundry/discrepancy');
  },

  /**
   * Get laundry statistics
   * @returns {Promise<Object>} Statistics
   */
  getStatistics: async () => {
    return await apiRequest('/laundry/statistics');
  },

  /**
   * Get all laundry requests (Admin)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} All laundry requests
   */
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/laundry/all${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get laundry by ID
   * @param {string} id - Laundry ID
   * @returns {Promise<Object>} Laundry request
   */
  getById: async (id) => {
    return await apiRequest(`/laundry/${id}`);
  }
};

/**
 * Admin API
 */
const adminAPI = {
  /**
   * Get all users
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} All users
   */
  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/users${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get students
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Students
   */
  getStudents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/users/students${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get staff
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Staff
   */
  getStaff: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/admin/users/staff${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User data
   */
  getUserById: async (id) => {
    return await apiRequest(`/admin/users/${id}`);
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  createUser: async (userData) => {
    return await apiRequest('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated user
   */
  updateUser: async (id, data) => {
    return await apiRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  /**
   * Assign bag number to student
   * @param {string} id - Student ID
   * @param {string} bagNumber - Bag number
   * @returns {Promise<Object>} Updated student
   */
  assignBagNumber: async (id, bagNumber) => {
    return await apiRequest(`/admin/users/${id}/assign-bag`, {
      method: 'PUT',
      body: JSON.stringify({ bagNumber })
    });
  },

  /**
   * Deactivate user
   * @param {string} id - User ID
   * @returns {Promise<Object>} Response
   */
  deactivateUser: async (id) => {
    return await apiRequest(`/admin/users/${id}/deactivate`, {
      method: 'PUT'
    });
  },

  /**
   * Activate user
   * @param {string} id - User ID
   * @returns {Promise<Object>} Response
   */
  activateUser: async (id) => {
    return await apiRequest(`/admin/users/${id}/activate`, {
      method: 'PUT'
    });
  },

  /**
   * Delete user
   * @param {string} id - User ID
   * @returns {Promise<Object>} Response
   */
  deleteUser: async (id) => {
    return await apiRequest(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get system analytics
   * @returns {Promise<Object>} Analytics data
   */
  getAnalytics: async () => {
    return await apiRequest('/admin/analytics');
  }
};

export {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  authAPI,
  laundryAPI,
  adminAPI
};
