import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FiltersPanel from "../../components/FiltersPanel/FiltersPanel.jsx";

import electric from "../../data/electric.json";
import sport from "../../data/sport.json";
import luxury from "../../data/luxury.json";
import suv from "../../data/suv.json";
import "./Catalog.css";

const Catalog = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: "", max: "" },
    sort: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const dataMap = { electric, sport, luxury, suv };
    const normalized = category?.toLowerCase();
    setProducts(dataMap[normalized] || []);
  }, [category]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) =>
        filters.categories.includes(p.category),
      );
    }

    const minPrice = parseFloat(filters.priceRange.min);
    const maxPrice = parseFloat(filters.priceRange.max);
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price);
      if (!isNaN(minPrice) && price < minPrice) return false;
      if (!isNaN(maxPrice) && price > maxPrice) return false;
      return true;
    });

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filters.sort === "price-asc")
      filtered.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc")
      filtered.sort((a, b) => b.price - a.price);
    if (filters.sort === "power-asc")
      filtered.sort((a, b) => a.power - b.power);
    if (filters.sort === "power-desc")
      filtered.sort((a, b) => b.power - a.power);

    return filtered;
  }, [products, filters, searchTerm]);

  return (
    <section className="catalog-page container">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <h1 className="catalog-title">{category?.toUpperCase()}</h1>

      <FiltersPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={setFilters}
        categoryFromURL={category}
      />

      {filteredProducts.length === 0 && (
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
