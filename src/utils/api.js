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

export async function fetchReviews(productId, options = {}) {
  const res = await fetch(`${API}/reviews?product_id=${productId}`, {
    signal: options.signal,
  });
  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
  return res.json();
}
