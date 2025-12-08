import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const http = axios.create({ baseURL: API });

http.interceptors.request.use((config) => {
  try {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
      }
    }
  } catch (error) {
    console.error("Error parsing user from local storage", error);
  }
  return config;
});

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

export async function fetchPhoneNumbers(options = {}) {
  try {
    const res = await http.get(`/phone-numbers/`, { signal: options.signal });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to fetch phone numbers");
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

export async function createCartItem(payload = {}, options = {}) {
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

export async function updateCartItem(id, payload = {}, options = {}) {
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

export async function fetchOrders(params = {}) {
  const qs = buildQuery(params);
  try {
    const res = await http.get(`/orders/${qs ? `?${qs}` : ""}`);
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

export async function registerUser(userData) {
  try {
    const res = await http.post("/auth/register", userData);
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Registration failed");
  }
}
