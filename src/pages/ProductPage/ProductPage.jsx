import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, removeFromFavorites } from "../../redux/actions";
import { AnimatePresence, motion } from "framer-motion";
import {
  fetchCategories,
  fetchProductById,
  fetchReviews,
  postReview,
} from "../../utils/api";
import ContactModal from "../../components/ContactModal/ContactModal.jsx";
import "./ProductPage.css";
import BackLink from "../../utils/BackButton.jsx";
import Loader from "../../components/Loader/Loader.jsx";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const favorites = useSelector((s) => s.favorites.items);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const [form, setForm] = useState({ username: "", rating: "5", comment: "" });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const [hoverRating, setHoverRating] = useState(0);

  const formatDate = (iso) => {
    try {
      if (!iso) return "";
      const d = new Date(iso);
      return d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso ?? "";
    }
  };

  const renderStars = (rating) => {
    const r = Number(rating) || 0;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= r ? "filled" : "empty"}`}
          aria-hidden="true"
        >
          ★
        </span>,
      );
    }
    return (
      <span className="stars" aria-label={`Rating ${r} of 5`}>
        {stars}
      </span>
    );
  };

  const StarButton = ({ value }) => {
    const active = value <= (hoverRating || Number(form.rating));
    const handleKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setForm((s) => ({ ...s, rating: String(value) }));
      }
    };
    return (
      <button
        type="button"
        className={`star-button ${active ? "filled" : ""}`}
        onMouseEnter={() => setHoverRating(value)}
        onMouseLeave={() => setHoverRating(0)}
        onFocus={() => setHoverRating(value)}
        onBlur={() => setHoverRating(0)}
        onClick={() => setForm((s) => ({ ...s, rating: String(value) }))}
        onKeyDown={handleKey}
        aria-label={`${value} star${value > 1 ? "s" : ""}`}
        aria-pressed={Number(form.rating) === value}
      >
        ★
      </button>
    );
  };

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

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isImageOpen) setIsImageOpen(false);
      }
    };
    if (isImageOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isImageOpen]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!form.username.trim()) {
      setSubmitError("Please enter your name.");
      return;
    }
    const rating = Number(form.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setSubmitError("Rating must be an integer between 1 and 5.");
      return;
    }

    const payload = {
      product_id: product.id,
      username: form.username.trim(),
      rating,
      comment: form.comment.trim() || null,
    };

    const controller = new AbortController();
    setSubmitLoading(true);
    try {
      const created = await postReview(payload, { signal: controller.signal });
      setReviews((r) => [created, ...r]);
      setForm({ username: "", rating: "5", comment: "" });
      setSubmitSuccess("Review submitted.");
      setTimeout(() => setSubmitSuccess(""), 2500);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Failed to submit review.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <section className="section container">
        <Loader />
      </section>
    );
  if (error || !product)
    return (
      <section className="section container">
        <h2>{error || "Product not found."}</h2>
      </section>
    );

  const specs = [
    { label: "Power", value: product.power ? `${product.power} HP` : "" },
    {
      label: "Category",
      value:
        product.category_id != null
          ? categoriesMap[product.category_id] || `ID ${product.category_id}`
          : "Uncategorized",
    },
    {
      label: "Top Speed",
      value: product.top_speed ? `${product.top_speed} km/h` : "",
    },
    {
      label: "0–100 km/h",
      value: product.acceleration ? `${product.acceleration}s` : "",
    },
  ];

  const imageSrc = product.image
    ? `http://localhost:8000${product.image}`
    : "/image-car/placeholder.png";

  return (
    <section className="section container product-page-container">
      <div className="page-header">
        <BackLink />
      </div>
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
            src={imageSrc}
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

          <div className="product-buttons">
            <button
              className="btn contact-btn"
              onClick={() => setIsContactOpen(true)}
            >
              Call / Contact
            </button>
            {currentUser?.id && (
              <button
                className={`product-fav-btn ${favorites.some((f) => f.product_id === product.id) ? "active" : ""}`}
                aria-pressed={favorites.some(
                  (f) => f.product_id === product.id,
                )}
                aria-label={
                  favorites.some((f) => f.product_id === product.id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const fav = favorites.find(
                    (f) => f.product_id === product.id,
                  );
                  if (fav)
                    dispatch(removeFromFavorites({ favoriteId: fav.id }));
                  else
                    dispatch(
                      addToFavorites({
                        userId: currentUser.id,
                        productId: product.id,
                      }),
                    );
                }}
              >
                {favorites.some((f) => f.product_id === product.id)
                  ? "❤"
                  : "♡"}
              </button>
            )}
          </div>
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
        <form className="review-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              name="username"
              value={form.username}
              onChange={handleFormChange}
              placeholder="Your name"
              aria-label="Your name"
              disabled={submitLoading}
            />
            <div className="rating-stars" role="radiogroup" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((v) => (
                <StarButton key={v} value={v} />
              ))}
            </div>
          </div>
          <input type="hidden" name="rating" value={form.rating} />
          <textarea
            name="comment"
            value={form.comment}
            onChange={handleFormChange}
            placeholder="Write your review (optional)"
            rows={4}
            disabled={submitLoading}
          />
          <div className="form-actions">
            <button
              type="submit"
              className="btn submit-btn"
              disabled={submitLoading}
            >
              {submitLoading ? "Submitting..." : "Submit Review"}
            </button>
            {submitError && <div className="form-error">{submitError}</div>}
            {submitSuccess && (
              <div className="form-success">{submitSuccess}</div>
            )}
          </div>
        </form>

        {reviews.length > 0 ? (
          reviews.map((r, i) => (
            <div key={r.id ?? i} className="review-card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h4>{r.username}</h4>
                <div style={{ textAlign: "right" }}>
                  {renderStars(r.rating)}
                  <div className="review-date">{formatDate(r.created_at)}</div>
                </div>
              </div>
              <p>{r.comment}</p>
            </div>
          ))
        ) : (
          <p className="no-reviews">No reviews yet.</p>
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
              src={imageSrc}
              alt={product.name}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </section>
  );
};

export default ProductPage;
