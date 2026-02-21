/**
 * Auth Utility Module - Handles JWT token and authentication logic
 * Usage: Include this file in HTML pages that need auth functionality
 */

// Store token in localStorage
function setToken(token) {
  localStorage.setItem("token", token);
}

// Retrieve token from localStorage
function getToken() {
  return localStorage.getItem("token");
}

// Remove token from localStorage
function clearToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Decode JWT payload (without verifying signature - frontend only)
function decodeToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    // Decode the payload (second part)
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// Get current user data from token
function getCurrentUser() {
  const token = getToken();
  if (!token) {
    return null;
  }
  return decodeToken(token);
}

// Check if user is logged in
function isLoggedIn() {
  const token = getToken();
  if (!token) {
    return false;
  }
  
  const user = decodeToken(token);
  return user !== null;
}

// Check if current user is admin
function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

// Logout: clear token and redirect
function logout() {
  clearToken();
  window.location.href = "/login.html";
}

// Make API call with authentication header
async function authenticatedFetch(url, options = {}) {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers
  });
}

// Redirect to login if not logged in
function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = "/login.html";
    return false;
  }
  return true;
}

// Redirect to home if not admin
function requireAdmin() {
  if (!isAdmin()) {
    window.location.href = "/index.html";
    return false;
  }
  return true;
}

// Protect page: require login and optionally admin role
function protectPage(requireAdminRole = false) {
  if (!requireLogin()) {
    return;
  }
  
  if (requireAdminRole && !requireAdmin()) {
    return;
  }
}

// Export for use in other modules (if using CommonJS)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    setToken,
    getToken,
    clearToken,
    decodeToken,
    getCurrentUser,
    isLoggedIn,
    isAdmin,
    logout,
    authenticatedFetch,
    requireLogin,
    requireAdmin,
    protectPage
  };
}
