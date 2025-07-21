// API utility for authenticated requests
const API_BASE = "https://reactinterviewtask.codetentaclestechnologies.in/api/api";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = options.headers || {};
  if (token) headers["Content-Type"] = headers["Content-Type"] || "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const opts = { ...options, headers };
  const url = `${API_BASE}${endpoint}`;
  return fetch(url, opts);
}

// User list
export async function fetchUserList() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/user-list?token=${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}

// Delete user
export async function deleteUser(userId) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/user-delete/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });
  return res.json();
}

// Product list
export async function fetchProductList() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/product-list?token=${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}

// Add product
export async function addProduct(formData) {
  const token = getToken();
  formData.append("token", token);
  const res = await fetch(`${API_BASE}/add-product`, {
    method: "POST",
    body: formData
  });
  return res.json();
}

// Country list
export async function fetchCountryList() {
  const token = getToken();
  const res = await fetch(`${API_BASE}/country-list?token=${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}

// State list
export async function fetchStateList(country_id) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/state-list?country_id=${country_id}&token=${token}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  return res.json();
}

// Register
export async function registerUser(formData) {
  // Add the token from localStorage
  const token = localStorage.getItem('token');
  if (token) {
    formData.append('token', token);
  }
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    body: formData
  });
  return res.json();
} 