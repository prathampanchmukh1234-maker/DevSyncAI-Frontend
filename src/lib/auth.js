/**
 * Authentication Utilities
 * 
 * Handles JWT-based authentication with the backend API
 * - Login/Signup with email/password
 * - Token storage and management
 * - Auto token refresh
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

// Token storage keys
const ACCESS_TOKEN_KEY = 'devsync_access_token';
const REFRESH_TOKEN_KEY = 'devsync_refresh_token';
const USER_KEY = 'devsync_user';

/**
 * Store authentication tokens and user info
 */
export function storeAuth(session, user) {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refresh_token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Get stored access token
 */
export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Get stored user info
 */
export function getStoredUser() {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * Clear all authentication data
 */
export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getAccessToken();
}

/**
 * Sign up a new user
 */
export async function signup(email, password, name) {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed');
  }

  // Store tokens and user info
  storeAuth(data.session, data.user);

  return data;
}

/**
 * Login with email and password
 */
export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Store tokens and user info
  storeAuth(data.session, data.user);

  return data;
}

/**
 * Logout user
 */
export async function logout() {
  const token = getAccessToken();

  if (token) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  clearAuth();
}

/**
 * Refresh access token
 */
export async function refreshToken() {
  const refresh_token = getRefreshToken();

  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token }),
  });

  const data = await response.json();

  if (!response.ok) {
    clearAuth();
    throw new Error(data.message || 'Token refresh failed');
  }

  // Update stored tokens
  localStorage.setItem(ACCESS_TOKEN_KEY, data.session.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.session.refresh_token);

  return data.session;
}

/**
 * Get current user info from API
 */
export async function getCurrentUser() {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token might be expired, try to refresh
      if (response.status === 401) {
        await refreshToken();
        return getCurrentUser(); // Retry with new token
      }
      throw new Error('Failed to get user info');
    }

    const data = await response.json();
    
    // Update stored user info
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    clearAuth();
    return null;
  }
}

/**
 * Make authenticated API request
 */
export async function authenticatedFetch(url, options = {}) {
  const token = getAccessToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    try {
      await refreshToken();
      const newToken = getAccessToken();
      
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        },
      });
    } catch (error) {
      clearAuth();
      throw new Error('Session expired. Please login again.');
    }
  }

  return response;
}

export default {
  signup,
  login,
  logout,
  refreshToken,
  getCurrentUser,
  isAuthenticated,
  getAccessToken,
  getStoredUser,
  authenticatedFetch,
};

// Made with Bob