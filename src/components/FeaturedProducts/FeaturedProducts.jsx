import { motion } from "framer-motion";
import ProductCard from "../ProductCard/ProductCard.jsx";
import { useMemo, useState } from "react";
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
  const [category, setCategory] = useState("All");

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(
        (p) =>
          (category === "All" || p.category === category) &&
          p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort(() => 0.5 - Math.random());
  }, [allProducts, category, searchTerm]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const handleToggle = () => {
    if (visibleCount < filteredProducts.length) {
      setVisibleCount((prev) => prev + 4);
    } else {
      setVisibleCount(4);
    }
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

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search models..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Sport">Sport</option>
          <option value="Luxury">Luxury</option>
          <option value="SUV">SUV</option>
          <option value="Electric">Electric</option>
        </select>
      </div>

      <motion.div
        key={`${category}-${searchTerm}`}
        className="products-grid"
        variants={{
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        initial="visible"
        animate="visible"
      >
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
      </motion.div>

      <button className="view-more-btn" onClick={handleToggle}>
        {visibleCount < filteredProducts.length ? "View More" : "Show Less"}
      </button>
    </motion.section>
  );
};

export default FeaturedProducts;
