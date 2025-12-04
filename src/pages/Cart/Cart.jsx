import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  loadCart,
  removeFromCart,
  updateCartQuantity,
} from "../../redux/actions";
import "./Cart.css";
import BackLink from "../../utils/BackButton.jsx";
import Loader from "../../components/Loader/Loader.jsx";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((s) => s.auth.currentUser);
  const { items: cartItems, loading, error } = useSelector((s) => s.cart);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(loadCart(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  if (!currentUser) {
    return (
      <section className="container section">
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
      <section className="container section">
        <Loader />
      </section>
    );
  }

  // === ЛОГІКА РОЗРАХУНКУ ЦІНИ ===
  const calculateItemPrice = (item) => {
    // Ціна = База + Двигун + Колір + Пакет
    const base = Number(item.product?.base_price) || 0;
    const enginePrice = Number(item.engine?.price_modifier) || 0;
    const colorPrice = Number(item.color?.price_modifier) || 0;
    const trimPrice = Number(item.trim?.price_modifier) || 0;

    return base + enginePrice + colorPrice + trimPrice;
  };

  const handleRemove = (cartItemId) => {
    dispatch(removeFromCart({ cartItemId }));
  };

  const handleChangeQty = (cartItemId, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    dispatch(updateCartQuantity({ cartItemId, quantity: q }));
  };

  // Рахуємо загальну суму всього кошика
  const grandTotal = cartItems.reduce(
    (sum, item) => sum + calculateItemPrice(item) * (item.quantity || 1),
    0,
  );

  return (
    <section className="container section cart-page">
      <div className="cart-header">
        <BackLink />
        <h1>Your Cart</h1>
      </div>

      {error && <p className="error-text">{error}</p>}

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button className="btn" onClick={() => navigate("/")}>
            Go Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => {
              const price = calculateItemPrice(item);
              const product = item.product || {};

              // Формуємо посилання на картинку (з машини або, якщо є, з кольору)
              const imageSrc = product.image
                ? `http://localhost:8000${product.image}`
                : "/image-car/placeholder.png";

              const productLink = `/product/${product.id || item.product_id}`;

              return (
                <div key={item.id} className="cart-row">
                  {/* Фото */}
                  <div className="cart-image">
                    <Link to={productLink}>
                      <img src={imageSrc} alt={product.name} />
                    </Link>
                  </div>

                  {/* Інфо про машину та опції */}
                  <div className="cart-details">
                    <Link to={productLink} className="cart-item-title-link">
                      <h3>{product.name}</h3>
                    </Link>

                    {/* Блок модифікацій */}
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

                  {/* Ціна та Дії */}
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
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleChangeQty(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Total Items:</span>
              <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
            </div>
            <div className="summary-row total">
              <span>Grand Total:</span>
              <span>${grandTotal.toLocaleString()}</span>
            </div>
            <button className="btn checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;
