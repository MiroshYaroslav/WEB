import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  addToFavorites,
  loadCart,
  removeFromFavorites,
} from "../../redux/actions";
import {
  fetchCategories,
  fetchProductById,
  fetchReviews,
  postReview,
} from "../../utils/api";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify"; // Імпорт для сповіщень
import ContactModal from "../../components/ContactModal/ContactModal.jsx";
import BackLink from "../../utils/BackButton.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import "./ProductPage.css";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((s) => s.auth.currentUser);
  const favorites = useSelector((s) => s.favorites.items);
  const cartItems = useSelector((s) => s.cart.items);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // States for Configurator
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedTrim, setSelectedTrim] = useState(null);

  // UI States
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Form States
  const [form, setForm] = useState({ username: "", rating: "5", comment: "" });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  // Helper Functions
  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  const renderStars = (rating) => {
    const r = Number(rating) || 0;
    return (
      <span className="stars" aria-label={`Rating ${r} of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`star ${i <= r ? "filled" : "empty"}`}>
            ★
          </span>
        ))}
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

  // Data Loading
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    window.scrollTo(0, 0);

    const loadData = async () => {
      try {
        const prod = await fetchProductById(id, { signal: controller.signal });
        setProduct(prod);

        // Ініціалізація дефолтних опцій (перший елемент у списку)
        if (prod) {
          if (prod.engines?.length) setSelectedEngine(prod.engines[0]);
          if (prod.colors?.length) setSelectedColor(prod.colors[0]);
          if (prod.trims?.length) setSelectedTrim(prod.trims[0]);
        }

        const revs = await fetchReviews(prod.id, { signal: controller.signal });
        setReviews(Array.isArray(revs) ? revs : []);

        const cats = await fetchCategories({ signal: controller.signal });
        if (Array.isArray(cats)) {
          const map = {};
          cats.forEach((c) => (map[c.id] = c.name));
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

    loadData();
    return () => controller.abort();
  }, [id]);

  // Modal close on Escape
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && isImageOpen) setIsImageOpen(false);
    };
    if (isImageOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isImageOpen]);

  // Load Cart
  useEffect(() => {
    if (currentUser?.id && cartItems.length === 0) {
      dispatch(loadCart(currentUser.id));
    }
  }, [currentUser?.id, cartItems.length, dispatch]);

  // Handlers
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

    setSubmitLoading(true);
    try {
      const created = await postReview(payload);
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

  // === ЛОГІКА КОШИКА ===

  // Перевіряємо, чи є в кошику товар з ТАКИМИ Ж опціями
  const isCurrentConfigInCart = cartItems.some((item) => {
    return (
      item.product_id === product?.id &&
      item.engine_id === selectedEngine?.id &&
      item.color_id === selectedColor?.id &&
      item.trim_id === selectedTrim?.id
    );
  });

  const handleCartAction = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      toast.error("Please log in to add items to cart.");
      return;
    }

    // 1. Якщо товар вже є -> переходимо до кошика
    if (isCurrentConfigInCart) {
      navigate("/cart");
      return;
    }

    // 2. Якщо немає -> додаємо
    const options = {
      engineId: selectedEngine?.id,
      colorId: selectedColor?.id,
      trimId: selectedTrim?.id,
    };

    try {
      await dispatch(
        addToCart({
          userId: currentUser.id,
          productId: product.id,
          quantity: 1,
          options,
        }),
      );
      toast.success("Successfully added to cart!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  // Розрахунок повної ціни
  const calculateTotalPrice = () => {
    let total = Number(product.base_price) || 0;
    if (selectedEngine) total += Number(selectedEngine.price_modifier) || 0;
    if (selectedColor) total += Number(selectedColor.price_modifier) || 0;
    if (selectedTrim) total += Number(selectedTrim.price_modifier) || 0;
    return total;
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

  // Динамічні специфікації
  const currentPower = selectedEngine?.power || 0;
  const currentAccel = selectedEngine?.acceleration || 0;
  const currentSpeed = selectedEngine?.top_speed || 0;

  const specs = [
    { label: "Power", value: currentPower ? `${currentPower} HP` : "-" },
    {
      label: "Category",
      value:
        product.category_id != null
          ? categoriesMap[product.category_id] || `ID ${product.category_id}`
          : "Uncategorized",
    },
    {
      label: "Top Speed",
      value: currentSpeed ? `${currentSpeed} km/h` : "-",
    },
    {
      label: "0–100 km/h",
      value: currentAccel ? `${currentAccel}s` : "-",
    },
  ];

  const imageSrc = product.image
    ? `http://localhost:8000${product.image}`
    : "/image-car/placeholder.png";

  const isFavorited = favorites.some((f) => f.product_id === product.id);
  const totalPrice = calculateTotalPrice();

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
        {/* Left Col - Image */}
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

        {/* Right Col - Info & Config */}
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

          {/* === CONFIGURATOR === */}
          <div className="configurator">
            {/* Engine Selection */}
            {product.engines?.length > 0 && (
              <div className="config-section">
                <h3>Engine</h3>
                <div className="options-grid">
                  {product.engines.map((eng) => (
                    <div
                      key={eng.id}
                      className={`option-card ${
                        selectedEngine?.id === eng.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedEngine(eng)}
                    >
                      <span className="opt-name">{eng.name}</span>
                      <span className="opt-price">
                        {eng.price_modifier > 0
                          ? `+$${eng.price_modifier}`
                          : eng.price_modifier < 0
                            ? `-$${Math.abs(eng.price_modifier)}`
                            : "Included"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="config-section">
                <h3>
                  Color:{" "}
                  <span style={{ fontWeight: 400, color: "#fff" }}>
                    {selectedColor?.name}
                  </span>
                </h3>
                <div className="colors-row">
                  {product.colors.map((col) => (
                    <div
                      key={col.id}
                      className={`color-circle ${
                        selectedColor?.id === col.id ? "active" : ""
                      }`}
                      style={{ backgroundColor: col.hex_code }}
                      title={`${col.name} ${
                        col.price_modifier > 0
                          ? `(+$${col.price_modifier})`
                          : ""
                      }`}
                      onClick={() => setSelectedColor(col)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Trim Selection */}
            {product.trims?.length > 0 && (
              <div className="config-section">
                <h3>Trim / Package</h3>
                <div className="options-grid">
                  {product.trims.map((trim) => (
                    <div
                      key={trim.id}
                      className={`option-card ${
                        selectedTrim?.id === trim.id ? "active" : ""
                      }`}
                      onClick={() => setSelectedTrim(trim)}
                    >
                      <div className="opt-name">{trim.name}</div>
                      <div className="opt-desc">{trim.description}</div>
                      <div className="opt-price">
                        {trim.price_modifier > 0
                          ? `+$${trim.price_modifier}`
                          : "Included"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* === END CONFIGURATOR === */}

          <div className="price-tag">
            <span>Total Price:</span>
            <span className="price-value">${totalPrice.toLocaleString()}</span>
          </div>

          <div className="product-buttons">
            <button
              className="btn contact-btn"
              onClick={() => setIsContactOpen(true)}
            >
              Call / Contact
            </button>

            {currentUser?.id && (
              <>
                <button
                  className={`btn add-to-cart ${isCurrentConfigInCart ? "in-cart" : ""}`}
                  onClick={handleCartAction}
                >
                  {isCurrentConfigInCart ? "Go to Cart →" : "Add to cart"}
                </button>

                <button
                  className={`product-fav-btn ${isFavorited ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (isFavorited) {
                      const fav = favorites.find(
                        (f) => f.product_id === product.id,
                      );
                      if (fav)
                        dispatch(removeFromFavorites({ favoriteId: fav.id }));
                    } else {
                      dispatch(
                        addToFavorites({
                          userId: currentUser.id,
                          productId: product.id,
                        }),
                      );
                    }
                  }}
                >
                  {isFavorited ? "❤" : "♡"}
                </button>
              </>
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
              <div className="review-header">
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
