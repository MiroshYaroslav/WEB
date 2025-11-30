import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../ProductCard/ProductCard.jsx";
import { useEffect, useState } from "react";
import FiltersPanel from "../FiltersPanel/FiltersPanel.jsx";
import "./FeaturedProducts.css";
import { fetchCategories, fetchProducts } from "../../utils/api";
import Loader from "../Loader/Loader.jsx";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: "", max: "" },
    sort: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategoriesList(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    const params = {
      search: searchTerm || undefined,
      min_price: filters.priceRange.min || undefined,
      max_price: filters.priceRange.max || undefined,
      sort: filters.sort || undefined,
      category_id:
        filters.categories.length > 0 ? filters.categories : undefined,
      limit: 200,
    };

    fetchProducts(params, { signal: controller.signal })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load featured products.");
          setProducts([]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [searchTerm, filters]);

  const visibleProducts = products.slice(0, visibleCount);

  const handleToggle = () => {
    if (visibleCount < products.length) setVisibleCount((prev) => prev + 4);
    else setVisibleCount(4);
  };

  return (
    <motion.section
      className="featured container"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <h2 className="featured-title">Models</h2>

      <FiltersPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={setFilters}
        categoriesList={categoriesList}
      />

      {loading && (
        <div className="loading-container">
          <Loader />
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      <motion.div className="products-grid">
        <AnimatePresence>
          {visibleProducts.length > 0
            ? visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            : !loading && <p className="no-results">No models found.</p>}
        </AnimatePresence>
      </motion.div>

      <button className="view-more-btn" onClick={handleToggle}>
        {visibleCount < products.length ? "View More" : "Show Less"}
      </button>
    </motion.section>
  );
};

export default FeaturedProducts;
