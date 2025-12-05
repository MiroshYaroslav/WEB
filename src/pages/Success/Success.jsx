import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Success.css";

const Success = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <section className="container section page-top-offset success-page">
      <motion.div
        className="success-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
      >
        <div className="success-icon">✅</div>
        <h1>Thank you for your order!</h1>
        <p>Your order has been placed successfully.</p>
        <p>We will contact you shortly to confirm the details.</p>

        <Link to="/" className="btn home-btn">
          Back to Home
        </Link>
      </motion.div>
    </section>
  );
};

export default Success;
