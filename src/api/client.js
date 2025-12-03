// src/api/client.js

const API = process.env.REACT_APP_API_BASE || "http://localhost:8000";

// ---------- Работа с токеном ----------

export function saveToken(token) {
  localStorage.setItem("access_token", token);
}

export function getToken() {
  return localStorage.getItem("access_token");
}

export function clearToken() {
  localStorage.removeItem("access_token");
}

// аккуратный разбор payload из JWT (base64url)
export function parseToken() {
  const token = getToken();
  if (!token) return null;

  try {
    const payloadBase64Url = token.split(".")[1];
    const payloadBase64 = payloadBase64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payloadBase64Url.length / 4) * 4, "=");

    const json = atob(payloadBase64);
    return JSON.parse(json); // { sub, email, role, exp ... }
  } catch (e) {
    return null;
  }
}

// общие заголовки авторизации
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------- Авторизация ----------

export async function registerUser(email, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function loginUser(email, password) {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  const res = await fetch(`${API}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || `HTTP ${res.status}`);
  }

  const data = await res.json();
  saveToken(data.access_token);
  return data;
}

// ---------- Работа со страницами ----------

// ⛔ У ТЕБЯ ЭТОЙ ФУНКЦИИ НЕ БЫЛО → ФРОНТ НЕ ОТПРАВЛЯЛ ТОКЕН → 401
export async function createPage(name) {
  const res = await fetch(`${API}/pages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

// ---------- Прочие запросы с авторизацией ----------

export async function getPosts(limit) {
  const url = limit ? `${API}/posts?limit=${limit}` : `${API}/posts`;

  const res = await fetch(url, {
    headers: { ...authHeaders() },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function invertImage(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API}/invert-image`, {
    method: "POST",
    body: form,
    headers: { ...authHeaders() },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.blob();
}

export async function sendTimeSpent(pageId, seconds) {
  const res = await fetch(`${API}/pages/${pageId}/time`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ time_spent: seconds }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getKpi() {
  const res = await fetch(`${API}/kpi`, {
    headers: { ...authHeaders() },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
