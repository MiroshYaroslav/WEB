import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard/ProductCard.jsx";

import sport from "../data/sport.json";
import suv from "../data/suv.json";
import luxury from "../data/luxury.json";
import electric from "../data/electric.json";

const productsByCategory = { sport, suv, luxury, electric };

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const Catalog = () => {
  const { category } = useParams();
  const normalizedCategory = category.toLowerCase();

  const filtered = productsByCategory[normalizedCategory] || [];

  return (
    <div className="category-page container">
      <h1 className="category-title">{category.toUpperCase()}</h1>

      {filtered.length === 0 ? (
        <p>No cars found in this category.</p>
      ) : (
        <motion.div
          className="products-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filtered.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <Link to="/" className="back-btn">
        ← Back to Home
      </Link>
    </div>
  );
};

export default Catalog;
