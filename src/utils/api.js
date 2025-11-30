const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

function buildQuery(params = {}) {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) value.forEach((v) => qp.append(key, v));
    else if (value !== undefined && value !== "") qp.append(key, value);
  });
  return qp.toString();
}

export async function fetchProducts(params = {}, options = {}) {
  const qs = buildQuery(params);
  const res = await fetch(`${API}/products${qs ? `?${qs}` : ""}`, {
    signal: options.signal,
  });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function fetchProductById(id, options = {}) {
  const res = await fetch(`${API}/products/${id}`, { signal: options.signal });
  if (!res.ok) throw new Error(`Failed to fetch product ${id}: ${res.status}`);
  return res.json();
}

export async function fetchCategories(options = {}) {
  const res = await fetch(`${API}/categories`, { signal: options.signal });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  return res.json();
}

export async function fetchReviews(productId = undefined, options = {}) {
  const qs = buildQuery({ product_id: productId });
  const res = await fetch(`${API}/reviews${qs ? `?${qs}` : ""}`, {
    signal: options.signal,
  });
  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
  return res.json();
}

export async function postReview(payload = {}, options = {}) {
  const res = await fetch(`${API}/reviews/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: options.signal,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let text = `Failed to post review: ${res.status}`;
    try {
      const j = await res.json();
      if (j?.detail) text = `${text} - ${j.detail}`;
    } catch {
      /* empty */
    }
    throw new Error(text);
  }
  return res.json();
}

export async function fetchPhoneNumbers(options = {}) {
  const res = await fetch(`${API}/phone-numbers/`, { signal: options.signal });
  if (!res.ok) throw new Error(`Failed to fetch phone numbers: ${res.status}`);
  return res.json();
}

export async function fetchFavorites(params = {}, options = {}) {
  const qs = buildQuery(params);
  const res = await fetch(`${API}/favorites${qs ? `?${qs}` : ""}`, {
    signal: options.signal,
  });
  if (!res.ok) throw new Error(`Failed to fetch favorites: ${res.status}`);
  return res.json();
}

export async function createFavorite(payload = {}, options = {}) {
  const res = await fetch(`${API}/favorites/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: options.signal,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let text = `Failed to create favorite: ${res.status}`;
    try {
      const j = await res.json();
      if (j?.detail) text = `${text} - ${j.detail}`;
    } catch {
      /* empty */
    }
    throw new Error(text);
  }
  return res.json();
}

export async function deleteFavorite(id, options = {}) {
  const res = await fetch(`${API}/favorites/${id}`, {
    method: "DELETE",
    signal: options.signal,
  });
  if (!res.ok)
    throw new Error(`Failed to delete favorite ${id}: ${res.status}`);
  return res.json();
}

export async function fetchUsers(options = {}) {
  const res = await fetch(`${API}/users/`, { signal: options.signal });
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json();
}

export async function createUserApi(payload = {}, options = {}) {
  const res = await fetch(`${API}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: options.signal,
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let text = `Failed to create user: ${res.status}`;
    try {
      const j = await res.json();
      if (j?.detail) text = `${text} - ${j.detail}`;
    } catch {
      /* empty */
    }
    throw new Error(text);
  }
  return res.json();
}
