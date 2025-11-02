import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import electric from "../../data/electric.json";
import sport from "../../data/sport.json";
import luxury from "../../data/luxury.json";
import suv from "../../data/suv.json";
import "./Catalog.css";

const Catalog = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const dataMap = {
      electric,
      sport,
      luxury,
      suv,
    };

    const normalized = category?.toLowerCase();
    setProducts(dataMap[normalized] || []);
  }, [category]);

  return (
    <section className="catalog-page container">
      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
      <h1 className="catalog-title">{category?.toUpperCase()}</h1>

      {products.length === 0 && (
        <p className="no-products">This category is currently unavailable.</p>
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
          {products.map((product, idx) => (
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
