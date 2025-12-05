import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  loadCart,
  removeFromCart,
  updateCartQuantity,
} from "../../redux/actions";
import "./Cart.css";
import BackLink from "../../utils/BackButton.jsx";
import {
  calculateGrandTotal,
  calculateItemPrice,
} from "../../utils/cartHelpers.js";
import Loader from "../../components/Loader/Loader.jsx";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((s) => s.auth.currentUser);
  const { items: cartItems, loading, error } = useSelector((s) => s.cart);
  const grandTotal = calculateGrandTotal(cartItems);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(loadCart(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  if (!currentUser) {
    return (
      <section className="container section page-top-offset">
        <h2>Please sign in to view your cart.</h2>
        <button
          className="btn"
          onClick={() => navigate(-1)}
          style={{ marginTop: 12 }}
        >
          Go back
        </button>
      </section>
    );
  }

  if (loading && cartItems.length === 0) {
    return (
      <section className="container section page-top-offset">
        <Loader />
      </section>
    );
  }

  const handleRemove = (cartItemId) => {
    dispatch(removeFromCart({ cartItemId }));
  };

  const handleChangeQty = (cartItemId, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    dispatch(updateCartQuantity({ cartItemId, quantity: q }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return (
    <section className="container section cart-page page-top-offset">
      <div
        className="page-header-wrapper"
        style={{ justifyContent: "space-between", paddingBottom: "2rem" }}
      >
        <BackLink />
        <h1 style={{ margin: 0 }}>Your Cart</h1>
        <div className="empty"></div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {cartItems.length === 0 ? (
        <motion.div
          className="empty-cart"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p>Your cart is empty.</p>
          <button className="btn" onClick={() => navigate("/")}>
            Go Shopping
          </button>
        </motion.div>
      ) : (
        <>
          <motion.div
            className="cart-list"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => {
                const price = calculateItemPrice(item);
                const product = item.product || {};

                const imageSrc = product.image
                  ? `http://localhost:8000${product.image}`
                  : "/image-car/placeholder.png";

                const productLink = `/product/${product.id || item.product_id}`;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="cart-row"
                  >
                    <div className="cart-image">
                      <Link to={productLink}>
                        <img src={imageSrc} alt={product.name} />
                      </Link>
                    </div>

                    <div className="cart-details">
                      <Link to={productLink} className="cart-item-title-link">
                        <h3>{product.name}</h3>
                      </Link>

                      <div className="cart-specs">
                        {item.engine && (
                          <div className="spec-tag" title="Engine">
                            ⚙️ {item.engine.name}
                          </div>
                        )}
                        {item.color && (
                          <div className="spec-tag" title="Color">
                            <span
                              className="color-dot"
                              style={{ backgroundColor: item.color.hex_code }}
                            ></span>
                            {item.color.name}
                          </div>
                        )}
                        {item.trim && (
                          <div className="spec-tag" title="Trim">
                            ✨ {item.trim.name}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="cart-right">
                      <div className="cart-price-block">
                        <span className="unit-price">
                          ${price.toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span className="sub-total">
                            Total: ${(price * item.quantity).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="cart-actions">
                        <div className="qty-control">
                          <button
                            onClick={() =>
                              handleChangeQty(item.id, item.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.2, color: "#fff" }}
                            animate={{ scale: 1, color: "#ccc" }}
                          >
                            {item.quantity}
                          </motion.span>
                          <button
                            onClick={() =>
                              handleChangeQty(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <motion.button
                          className="remove-btn"
                          onClick={() => handleRemove(item.id)}
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "#ff4d4d",
                            color: "#fff",
                          }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ✕
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
            </div>
            <div className="summary-row total">
              <span>Grand Total:</span>
              <motion.span
                key={grandTotal}
                initial={{ scale: 1.1, color: "#fff" }}
                animate={{ scale: 1, color: "var(--color-accent)" }}
              >
                ${grandTotal.toLocaleString()}
              </motion.span>
            </div>
            <motion.button
              className="btn checkout-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        </>
      )}
    </section>
  );
};

export default Cart;
