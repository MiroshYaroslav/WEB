import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const http = axios.create({ baseURL: API });

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
  // Map axios cancel to AbortError
  if (e?.code === "ERR_CANCELED" || e?.name === "CanceledError") {
    throw toAbortError();
  }
  // Prefer server-provided detail if any
  const detail = e?.response?.data?.detail;
  const status = e?.response?.status;
  const base = fallback || e?.message || "Request failed";
  const msg = detail ? `${base} - ${detail}` : status ? `${base}: ${status}` : base;
  const err = new Error(msg);
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

export async function fetchUsers(options = {}) {
  try {
    const res = await http.get(`/users/`, { signal: options.signal });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to fetch users");
  }
}

export async function createUserApi(payload = {}, options = {}) {
  try {
    const res = await http.post(`/users/`, payload, {
      signal: options.signal,
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (e) {
    normalizeAndThrow(e, "Failed to create user");
  }
}
