import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query"; // Import
import ProductCard from "../ProductCard/ProductCard.jsx";
import FiltersPanel from "../FiltersPanel/FiltersPanel.jsx";
import Loader from "../Loader/Loader.jsx";
import { fetchCategories, fetchProducts } from "../../utils/api";
import "./FeaturedProducts.css";

const FeaturedProducts = () => {
  const [visibleCount, setVisibleCount] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: "", max: "" },
    sort: "",
  });

  const { data: categoriesList = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60,
  });

  const queryParams = {
    search: searchTerm || undefined,
    min_price: filters.priceRange.min || undefined,
    max_price: filters.priceRange.max || undefined,
    sort: filters.sort || undefined,
    category_id: filters.categories.length > 0 ? filters.categories : undefined,
    limit: 200,
  };

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["featured_products", queryParams],
    queryFn: () => fetchProducts(queryParams),
    staleTime: 1000 * 60 * 5,
  });

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

      {isLoading && (
        <div className="loading-container">
          <Loader />
        </div>
      )}

      {isError && (
        <p className="error-text">
          {error?.message || "Failed to load featured products."}
        </p>
      )}

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
            : !isLoading && <p className="no-results">No models found.</p>}
        </AnimatePresence>
      </motion.div>

      {!isLoading && products.length > 4 && (
        <button className="view-more-btn" onClick={handleToggle}>
          {visibleCount < products.length ? "View More" : "Show Less"}
        </button>
      )}
    </motion.section>
  );
};

export default FeaturedProducts;
