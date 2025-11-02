import { motion } from "framer-motion";
import ProductCard from "./ProductCard.jsx";
import products from "../../data/products.json";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedProducts = () => {
  return (
    <section className="featured container">
      <h2>Models</h2>
      <motion.div
        className="products-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map((p, idx) => (
          <motion.div key={p.id} variants={itemVariants}>
            <ProductCard product={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedProducts;
