import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchProductById, fetchReviews, fetchCategories } from "../../utils/api";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    window.scrollTo(0, 0);

    const loadProductAndMeta = async () => {
      try {
        const prod = await fetchProductById(id, { signal: controller.signal });
        setProduct(prod);

        const revs = await fetchReviews(prod.id, { signal: controller.signal });
        setReviews(Array.isArray(revs) ? revs : []);

        // fetch categories to resolve category_id -> category name
        const cats = await fetchCategories({ signal: controller.signal });
        if (Array.isArray(cats)) {
          const map = {};
          cats.forEach((c) => {
            map[c.id] = c.name;
          });
          setCategoriesMap(map);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load product or reviews.");
          setProduct(null);
          setReviews([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProductAndMeta();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <section className="section container">
        <p>Loading product...</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="section container">
        <h2>{error || "Product not found."}</h2>
      </section>
    );
  }

  const specs = [
    { label: "Power", value: product.power ? `${product.power} HP` : "" },
    {
      label: "Category",
      value:
        product.category_id != null
          ? categoriesMap[product.category_id] || `ID ${product.category_id}`
          : "Uncategorized",
    },
    { label: "Top Speed", value: product.top_speed ? `${product.top_speed} km/h` : "" },
    { label: "0–100 km/h", value: product.acceleration ? `${product.acceleration}s` : "" },
  ];

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
          <p className="product-desc">{product.description}</p>

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
              <h4>{r.username}</h4>
              <p>{r.comment}</p>
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
