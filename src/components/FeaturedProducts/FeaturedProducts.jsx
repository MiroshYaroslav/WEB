import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../ProductCard/ProductCard.jsx";
import { useMemo, useState } from "react";
import FiltersPanel from "../FiltersPanel/FiltersPanel.jsx";
import "./FeaturedProducts.css";

import sport from "../../data/sport.json";
import luxury from "../../data/luxury.json";
import suv from "../../data/suv.json";
import electric from "../../data/electric.json";

const FeaturedProducts = () => {
  const allProducts = useMemo(
    () => [...sport, ...luxury, ...suv, ...electric],
    [],
  );
  const [visibleCount, setVisibleCount] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");

  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    priceRange: { min: "", max: "" },
    sort: "",
  });

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    if (searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (activeFilters.categories.length > 0) {
      result = result.filter((p) =>
        activeFilters.categories.includes(p.category),
      );
    }

    const minPrice = parseFloat(activeFilters.priceRange.min);
    const maxPrice = parseFloat(activeFilters.priceRange.max);
    if (!isNaN(minPrice)) result = result.filter((p) => p.price >= minPrice);
    if (!isNaN(maxPrice)) result = result.filter((p) => p.price <= maxPrice);

    switch (activeFilters.sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "power-asc":
        result.sort((a, b) => a.power - b.power);
        break;
      case "power-desc":
        result.sort((a, b) => b.power - a.power);
        break;
      default:
        break;
    }

    return result;
  }, [allProducts, searchTerm, activeFilters]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleToggle = () => {
    if (visibleCount < filteredProducts.length)
      setVisibleCount((prev) => prev + 4);
    else setVisibleCount(4);
  };

  const applyFilters = (filters) => {
    setActiveFilters(filters);
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
        applyFilters={applyFilters}
      />

      <motion.div
        key={`${searchTerm}-${activeFilters.sort}-${activeFilters.categories.join(",")}`}
        className="products-grid"
      >
        <AnimatePresence>
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
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
          ) : (
            <p className="no-results">No models found.</p>
          )}
        </AnimatePresence>
      </motion.div>

      <button className="view-more-btn" onClick={handleToggle}>
        {visibleCount < filteredProducts.length ? "View More" : "Show Less"}
      </button>
    </motion.section>
  );
};

export default FeaturedProducts;
