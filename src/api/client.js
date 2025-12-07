// src/api/client.js

const API = process.env.REACT_APP_API_BASE || "http://127.0.0.1:8000";

// ---------------- TOKEN ------------------

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
    return JSON.parse(json); // { sub, email, role, exp, ... }
  } catch (e) {
    return null;
  }
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------------- AUTH ------------------

export async function loginUser(email, password) {
  const body = new URLSearchParams();
  body.append("username", email);       // backend ждёт "username"
  body.append("password", password);

  const res = await fetch(`${API}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Неверный логин или пароль");
  }

  const data = await res.json(); // {access_token, token_type}
  saveToken(data.access_token);
  return data;
}

export async function registerUser(email, password) {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || "Ошибка регистрации");
  }

  return res.json(); // UserOut {id,email,role}
}

// ---------------- KPI / PAGES ------------------

export async function sendTimeSpent(pageId, seconds) {
  const res = await fetch(`${API}/pages/${pageId}/time`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ time_spent: seconds }),
  });

  if (!res.ok) {
    throw new Error(`Ошибка KPI: ${res.status}`);
  }
}

export async function getKpi() {
  const res = await fetch(`${API}/kpi`, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error(`Доступ запрещён: ${res.status}`);
  }

  return res.json();
}

// ---------------- POSTS ------------------

export async function getPosts(limit) {
  const url = limit ? `${API}/posts?limit=${limit}` : `${API}/posts`;

  const res = await fetch(url, {
    headers: {
      ...authHeaders(),
    },
  });

  if (!res.ok) {
    throw new Error(`Ошибка загрузки постов: ${res.status}`);
  }

  return res.json();
}

// ---------------- IMAGE INVERTER ------------------

export async function invertImage(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API}/invert-image`, {
    method: "POST",
    headers: {
      ...authHeaders(),
      // Content-Type не ставим – браузер сам проставит boundary
    },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Ошибка инвертации: ${res.status}`);
  }

  return res.blob();
}
