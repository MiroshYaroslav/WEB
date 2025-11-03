import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import sport from "../../data/sport.json";
import luxury from "../../data/luxury.json";
import suv from "../../data/suv.json";
import electric from "../../data/electric.json";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const all = [...sport, ...luxury, ...suv, ...electric];
    setProduct(all.find((p) => p.id.toString() === id));
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <section className="section container">
        <h2>Product not found.</h2>
      </section>
    );
  }

  const description = product.description;

  const specs = [
    { label: "Power", value: product.power ? `${product.power} HP` : "" },
    { label: "Category", value: product.category || "" },
    { label: "Top Speed", value: product.topSpeed || "" },
    { label: "0–100 km/h", value: product.acceleration || "" },
  ];

  const reviews = product.reviews || [];

  return (
    <section className="section container product-page-container">
      <motion.div
        className="product-page"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="product-image"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="clickable"
            onClick={() => setIsImageOpen(true)}
          />
        </motion.div>

        <motion.div
          className="product-info"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <h1>{product.name}</h1>
          <p className="product-desc">{description}</p>

          <div className="product-specs">
            {specs.map((s, i) => (
              <div key={i} className="spec-item">
                <span>{s.label}</span>
                <strong>{s.value}</strong>
              </div>
            ))}
          </div>

          <p className="product-price">${product.price}</p>

          <button className="btn add-to-cart">Add to Cart</button>
        </motion.div>
      </motion.div>

      <motion.div
        className="reviews-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2>Customer Reviews</h2>
        {reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div key={i} className="review-card">
              <h4>{r.name}</h4>
              <p>{r.text}</p>
            </div>
          ))
        ) : (
          <p>No reviews yet.</p>
        )}
      </motion.div>

      <AnimatePresence>
        {isImageOpen && (
          <motion.div
            className="image-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageOpen(false)}
          >
            <motion.img
              src={product.image}
              alt={product.name}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProductPage;
