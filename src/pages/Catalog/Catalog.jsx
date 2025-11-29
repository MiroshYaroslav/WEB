import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FiltersPanel from "../../components/FiltersPanel/FiltersPanel.jsx";
import { fetchCategories, fetchProducts } from "../../utils/api";
import "./Catalog.css";

const Catalog = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: "", max: "" },
    sort: "",
  });

  // Scroll to top on category change
  useEffect(() => window.scrollTo(0, 0), [category]);

  // Fetch all categories
  useEffect(() => {
    fetchCategories()
      .then((data) => setCategoriesList(data))
      .catch(console.error);
  }, []);

  // Find category object by URL name or id or slug
  const categoryObj = useMemo(() => {
    if (!categoriesList || categoriesList.length === 0) return undefined;
    const paramRaw = category || "";
    const norm = (s) =>
      String(s || "")
        .toLowerCase()
        .replace(/[-_]+/g, " ")
        .trim();

    // 1) try match by exact name (case-insensitive and normalized)
    const byName = categoriesList.find(
      (c) => norm(c.name) === norm(paramRaw),
    );
    if (byName) return byName;

    // 2) try match by numeric id (URL might be '/categories/3')
    const id = Number(paramRaw);
    if (!Number.isNaN(id)) {
      const byId = categoriesList.find((c) => Number(c.id) === id);
      if (byId) return byId;
    }

    // 3) try partial/slug match: compare normalized name to normalized param
    const bySlug = categoriesList.find((c) => norm(c.name).includes(norm(paramRaw)));
    return bySlug;
  }, [category, categoriesList]);

  // Fetch products by category_id
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    const params = {};
    if (categoryObj?.id) params.category_id = categoryObj.id;

    fetchProducts(params, { signal: controller.signal })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load products from backend.");
          setProducts([]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [categoryObj]);

  // Apply front-end filters
  const filteredProducts = useMemo(() => {
    let result = [...products];
    const minPrice = parseFloat(filters.priceRange.min);
    const maxPrice = parseFloat(filters.priceRange.max);

    result = result.filter((p) => {
      const price = parseFloat(p.price);
      if (!isNaN(minPrice) && price < minPrice) return false;
      if (!isNaN(maxPrice) && price > maxPrice) return false;
      return true;
    });

    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "power-asc":
        result.sort((a, b) => (a.power || 0) - (b.power || 0));
        break;
      case "power-desc":
        result.sort((a, b) => (b.power || 0) - (a.power || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, filters, searchTerm]);

  return (
    <section className="catalog-page container">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <h1 className="catalog-title">
        {categoryObj ? categoryObj.name.toUpperCase() : "All Cars"}
      </h1>

      <FiltersPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={setFilters}
        categoryFromURL={category}
        categoriesList={categoriesList}
      />

      {loading && <p className="loading">Loading products...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && filteredProducts.length === 0 && (
        <p className="no-products">No products found.</p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={category || "no-cat"}
          className="products-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Catalog;
