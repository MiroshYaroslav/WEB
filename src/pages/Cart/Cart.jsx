import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductById } from "../../utils/api";
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

  const productIds = useMemo(
    () =>
      Array.from(new Set(cartItems.map((c) => c.product_id))).filter(Boolean),
    [cartItems],
  );

  const [products, setProducts] = React.useState([]);
  const [fetchErr, setFetchErr] = React.useState("");
  const [fetching, setFetching] = React.useState(false);

  useEffect(() => {
    if (currentUser?.id) dispatch(loadCart(currentUser.id));
  }, [currentUser?.id, dispatch]);

  useEffect(() => {
    if (!productIds.length) {
      setProducts([]);
      return;
    }

    const controller = new AbortController();
    setFetching(true);
    setFetchErr("");

    Promise.all(
      productIds.map((id) =>
        fetchProductById(id, { signal: controller.signal }).catch(() => null),
      ),
    )
      .then((list) => setProducts(list.filter(Boolean)))
      .catch((e) => {
        if (e.name !== "AbortError")
          setFetchErr("Failed to load cart products.");
      })
      .finally(() => setFetching(false));

    return () => controller.abort();
  }, [productIds]);

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

  if (loading || fetching) {
    return (
      <section className="container section">
        <Loader />
      </section>
    );
  }

  const itemsWithProduct = cartItems.map((ci) => ({
    cartItem: ci,
    product: products.find((p) => p.id === ci.product_id) || null,
  }));

  const handleRemove = (cartItemId) => {
    dispatch(removeFromCart({ cartItemId }));
  };

  const handleChangeQty = (cartItemId, qty) => {
    const q = Math.max(1, Number(qty) || 1);
    dispatch(updateCartQuantity({ cartItemId, quantity: q }));
  };

  const total = itemsWithProduct.reduce(
    (sum, { cartItem, product }) =>
      sum + (product?.price ?? 0) * (cartItem.quantity || 1),
    0,
  );

  return (
    <section className="container section cart-page">
      <div className="cart-header">
        <BackLink />
        <h1>Your Cart</h1>
      </div>

      {error && <p className="error-text">{error}</p>}
      {fetchErr && <p className="error-text">{fetchErr}</p>}

      {itemsWithProduct.length === 0 ? (
        <p className="no-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {itemsWithProduct.map(({ cartItem, product }) => (
              <div key={cartItem.id} className="cart-row">
                <div className="cart-image">
                  <img
                    src={
                      product?.image
                        ? `http://localhost:8000${product.image}`
                        : "/image-car/placeholder.png"
                    }
                    alt={product?.name ?? `Product #${cartItem.product_id}`}
                  />
                </div>
                <div className="cart-body">
                  <h3>{product?.name ?? `Product #${cartItem.product_id}`}</h3>
                  <p className="cart-price">${product?.price ?? "—"}</p>
                  <div className="cart-actions">
                    <label>
                      Qty
                      <input
                        type="number"
                        min="1"
                        value={cartItem.quantity ?? 1}
                        onChange={(e) =>
                          handleChangeQty(cartItem.id, e.target.value)
                        }
                      />
                    </label>
                    <button
                      className="btn"
                      onClick={() => handleRemove(cartItem.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div>
              Total: <strong>${total.toFixed(2)}</strong>
            </div>
            <button className="btn primary">Proceed to checkout</button>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;
