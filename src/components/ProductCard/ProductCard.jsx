import { motion } from "framer-motion";
import "./ProductCard.css";

const ProductCard = ({ product, index }) => {
  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
    >
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="power">Power: {product.power}hp</p>
      <div className="card-bottom">
        <span className="price">${product.price}</span>
        <button className="btn">View</button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
