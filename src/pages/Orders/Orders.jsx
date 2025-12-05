import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import { fetchOrders } from "../../utils/api";
import BackLink from "../../utils/BackButton.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.auth.currentUser);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my_orders", currentUser?.id],

    queryFn: () => fetchOrders({ user_id: currentUser?.id }),

    enabled: !!currentUser,
  });

  useEffect(() => {
    if (!currentUser) navigate("/");
  }, [currentUser, navigate]);

  if (isLoading)
    return (
      <section className="container section page-top-offset">
        <Loader />
      </section>
    );
  if (isError)
    return (
      <section className="container section page-top-offset">
        <h2>Failed to load orders</h2>
      </section>
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="container section page-top-offset orders-page">
      <div
        className="page-header-wrapper"
        style={{ justifyContent: "space-between" }}
      >
        <BackLink />
        <h1>My Orders</h1>
        <div className="empty"></div>
      </div>

      {orders.length === 0 ? (
        <p className="no-orders">You haven't placed any orders yet.</p>
      ) : (
        <motion.div
          className="orders-list"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="order-card"
              variants={itemVariants}
            >
              <div className="order-header">
                <div className="order-meta">
                  <span className="order-id">Order #{order.id}</span>
                  <span className="order-date">
                    {new Date(order.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="order-status-block">
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                  <span className="order-total">
                    ${order.total_price.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item) => {
                  const imageSrc = item.product.image
                    ? `http://localhost:8000${item.product.image}`
                    : "/image-car/placeholder.png";
                  return (
                    <div key={item.id} className="order-item-row">
                      <img
                        src={imageSrc}
                        alt={item.product.name}
                        className="item-thumb"
                      />
                      <div className="item-info">
                        <h4>{item.product.name}</h4>
                        <div className="item-specs">
                          {item.engine && <span>⚙️ {item.engine.name}</span>}
                          {item.color && (
                            <span className="spec-color">
                              <span
                                className="color-dot"
                                style={{ backgroundColor: item.color.hex_code }}
                              ></span>
                              {item.color.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="item-price">
                        {item.quantity} x $
                        {item.price_per_unit.toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};

export default Orders;
