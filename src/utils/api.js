import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiUrl) {
  throw new Error(
    "VITE_API_URL is missing. Copy .env.development.example to .env.local or set it in Vercel.",
  );
}

export const API_BASE_URL = configuredApiUrl.replace(/\/+$/, "");

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export function getApiAssetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

const http = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

let authCallbacks = {};
let refreshInProgress = false;
let refreshWaiters = [];

export function configureAuthCallbacks(callbacks) {
  authCallbacks = callbacks;
}

function settleRefreshWaiters(error, accessToken) {
  refreshWaiters.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(accessToken);
  });
  refreshWaiters = [];
}

function getPersistedCurrentUser() {
  // Support the old standalone value while reading the actual redux-persist
  // format used by this app (persist:root -> auth -> currentUser).
  const standaloneUser = localStorage.getItem("currentUser");
  if (standaloneUser) {
    try {
      const parsed = JSON.parse(standaloneUser);
      if (parsed?.access_token) return parsed;
    } catch {
      // Try the redux-persist state below.
    }
  }

  const persistedRoot = localStorage.getItem("persist:root");
  if (!persistedRoot) return null;

  try {
    const root = JSON.parse(persistedRoot);
    const auth =
      typeof root.auth === "string" ? JSON.parse(root.auth) : root.auth;
    return auth?.currentUser ?? null;
  } catch (error) {
    console.error("Error parsing persisted auth state", error);
    return null;
  }
}

http.interceptors.request.use((config) => {
  const user = authCallbacks.getCurrentUser
    ? authCallbacks.getCurrentUser()
    : getPersistedCurrentUser();
  if (user?.access_token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestPath = String(originalRequest?.url || "").split("?")[0];
    const isAuthEndpoint =
      /(?:^|\/)auth\/(token|register|refresh|logout)\/?$/.test(requestPath);

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      isAuthEndpoint
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (refreshInProgress) {
      return new Promise((resolve, reject) => {
        refreshWaiters.push({ resolve, reject });
      }).then((accessToken) => {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return http(originalRequest);
      });
    }

    refreshInProgress = true;

    let accessToken;
    try {
      const response = await http.post(
        "/auth/refresh",
        {},
        { withCredentials: true },
      );
      accessToken = response.data?.access_token;
      if (!accessToken)
        throw new Error("Refresh response did not include access_token");
    } catch (refreshError) {
      refreshInProgress = false;
      settleRefreshWaiters(refreshError);
      try {
        await authCallbacks.logout?.();
      } finally {
        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.assign("/login");
        }
      }
      return Promise.reject(refreshError);
    }

    authCallbacks.updateAccessToken?.(accessToken);
    settleRefreshWaiters(null, accessToken);
    refreshInProgress = false;

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return http(originalRequest);
  },
);

function buildQuery(params = {}) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((v) => qp.append(key, v));
    else if (value !== undefined && value !== "") qp.append(key, value);
  });
  return qp.toString();
}

function toAbortError() {
  const err = new Error("Aborted");
  err.name = "AbortError";
  return err;
}

function normalizeAndThrow(e, fallback) {
  if (e?.code === "ERR_CANCELED" || e?.name === "CanceledError") {
    throw toAbortError();
  }

  const detail = e?.response?.data?.detail;
  const status = e?.response?.status;
  const base = fallback || e?.message || "Request failed";

  let msg = base;

  if (detail) {
    if (typeof detail === "string") {
      msg = detail;
    } else if (Array.isArray(detail)) {
      msg = detail.map((err) => err.msg).join(", ");
    }
  } else if (status) {
    msg = `${base} (Code: ${status})`;
  }

  const err = new Error(msg);
  err.status = status;
  throw err;
}

export async function fetchProducts(params = {}, options = {}) {
  const qs = buildQuery(params);
  try {
    const res = await http.get(`/products${qs ? `?${qs}` : ""}`, {
      signal: options.signal,
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to fetch products");
  }
}

export async function fetchProductById(id, options = {}) {
  try {
    const res = await http.get(`/products/${id}`, { signal: options.signal });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, `Failed to fetch product ${id}`);
  }
}

export async function fetchCategories(options = {}) {
  try {
    const res = await http.get(`/categories`, { signal: options.signal });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to fetch categories");
  }
}

export async function fetchReviews(productId = undefined, options = {}) {
  const qs = buildQuery({ product_id: productId });
  try {
    const res = await http.get(`/reviews${qs ? `?${qs}` : ""}`, {
      signal: options.signal,
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to fetch reviews");
  }
}

export async function postReview(payload = {}, options = {}) {
  try {
    const res = await http.post(`/reviews/`, payload, {
      signal: options.signal,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to post review");
  }
}

export async function fetchCallbackContacts(options = {}) {
  try {
    const res = await http.get(`/callback-contacts/`, {
      signal: options.signal,
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to fetch contact numbers");
  }
}

export async function fetchFavorites(params = {}, options = {}) {
  const qs = buildQuery(params);
  try {
    const res = await http.get(`/favorites${qs ? `?${qs}` : ""}`, {
      signal: options.signal,
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to fetch favorites");
  }
}

export async function createFavorite(payload = {}, options = {}) {
  try {
    const res = await http.post(`/favorites/`, payload, {
      signal: options.signal,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to create favorite");
  }
}

export async function deleteFavorite(id, options = {}) {
  try {
    const res = await http.delete(`/favorites/${id}`, {
      signal: options.signal,
    });
    return res.data ?? { success: true };
  } catch (e) {
    normalizeAndThrow(e, `Failed to delete favorite ${id}`);
  }
}

export async function fetchCartItems(params = {}, options = {}) {
  const qs = buildQuery(params);
  try {
    const res = await http.get(`/cart${qs ? `?${qs}` : ""}`, {
      signal: options.signal,
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to fetch cart items");
  }
}

export async function createCartItemAPI(payload = {}, options = {}) {
  try {
    const res = await http.post(`/cart/`, payload, {
      signal: options.signal,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to create cart item");
  }
}

export async function updateCartItemAPI(id, payload = {}, options = {}) {
  try {
    const res = await http.patch(`/cart/${id}`, payload, {
      signal: options.signal,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, `Failed to update cart item ${id}`);
  }
}

export async function deleteCartItem(id, options = {}) {
  try {
    const res = await http.delete(`/cart/${id}`, {
      signal: options.signal,
    });
    return res.data ?? { success: true };
  } catch (e) {
    normalizeAndThrow(e, `Failed to delete cart item ${id}`);
  }
}

export async function createOrder(payload = {}, params = {}) {
  const qs = buildQuery(params);
  try {
    const res = await http.post(`/orders/${qs ? `?${qs}` : ""}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to create order");
  }
}

export async function fetchOrders() {
  try {
    const res = await http.get("/orders/my");
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to fetch orders");
  }
}

export async function loginUser(credentials) {
  const formData = new FormData();
  formData.append("username", credentials.email);
  formData.append("password", credentials.password);

  try {
    const res = await http.post("/auth/token", formData);
    return { ...res.data.user, access_token: res.data.access_token };
  } catch (e) {
    normalizeAndThrow(e, "Login failed");
  }
}

export async function logoutUserAPI() {
  const res = await http.post("/auth/logout", {}, { withCredentials: true });
  return res.data;
}

export async function registerUser(userData) {
  try {
    const res = await http.post("/auth/register", userData);
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Registration failed");
  }
}
