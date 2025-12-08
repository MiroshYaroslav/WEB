import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { clearCart } from "../../redux/actions";
import { createOrder } from "../../utils/api";
import CheckoutInput from "../../components/CheckoutInput/CheckoutInput.jsx";
import BackLink from "../../utils/BackButton.jsx";
import { calculateGrandTotal } from "../../utils/cartHelpers.js";
import "./Checkout.css";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((s) => s.cart.items);

  const currentUser = useSelector((s) => s.auth.currentUser);

  const grandTotal = calculateGrandTotal(cartItems);

  if (cartItems.length === 0) {
    return (
      <section className="container section page-top-offset">
        <h2>Your cart is empty</h2>
        <button className="btn" onClick={() => navigate("/")}>
          Go Shopping
        </button>
      </section>
    );
  }

  const validationSchema = Yup.object({
    first_name: Yup.string().max(15).required("First name is required"),
    last_name: Yup.string().max(20).required("Last name is required"),

    email: Yup.string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format (e.g. name@domain.com)",
      )
      .required("Email is required"),

    phone: Yup.string()
      .matches(/^\d{10,12}$/, "Invalid phone (10-12 digits)")
      .required("Phone is required"),

    address: Yup.string().min(5).required("Address is required"),
  });

  return (
    <section className="container section page-top-offset checkout-page">
      <div
        className="page-header-wrapper"
        style={{ justifyContent: "space-between" }}
      >
        <BackLink />
        <h1>Checkout</h1>
        <div className="empty"></div>
      </div>

      <div className="checkout-content">
        <motion.div
          className="checkout-form-container"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Formik
            initialValues={{
              first_name: currentUser?.first_name || "",
              last_name: currentUser?.last_name || "",
              email: currentUser?.email || "",
              phone: currentUser?.phone || "",
              address: currentUser?.address || "",
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);
              try {
                if (currentUser?.id) {
                  await createOrder(values, { user_id: currentUser.id });
                } else {
                  toast.error("User not identified");
                  return;
                }

                dispatch(clearCart());
                navigate("/success");
              } catch (error) {
                console.error(error);
                toast.error(error.message || "Failed to create order");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, isValid, dirty }) => (
              <Form className="checkout-form">
                <div className="form-row-group">
                  <CheckoutInput
                    label="First Name"
                    name="first_name"
                    type="text"
                    placeholder="Ivan"
                  />
                  <CheckoutInput
                    label="Last Name"
                    name="last_name"
                    type="text"
                    placeholder="Ivanov"
                  />
                </div>

                <CheckoutInput
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="ivan@example.com"
                />
                <CheckoutInput
                  label="Phone Number"
                  name="phone"
                  type="text"
                  placeholder="0991234567"
                />
                <CheckoutInput
                  label="Shipping Address"
                  name="address"
                  type="text"
                  placeholder="Kyiv, Khreshchatyk 1"
                />

                <button
                  type="submit"
                  className="btn submit-order-btn"
                  disabled={isSubmitting || !(isValid && dirty)}
                >
                  {isSubmitting ? "Processing..." : "Confirm Order"}
                </button>
              </Form>
            )}
          </Formik>
        </motion.div>

        <motion.div
          className="order-summary"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3>Order Summary</h3>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <span>
                  {item.quantity} x {item.product?.name}
                </span>
              </div>
            ))}
          </div>
          <div className="summary-total">
            Total Items: {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
          </div>
          <div
            className="summary-total"
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "1rem",
            }}
          >
            <span>Total price:</span>
            <motion.span
              key={grandTotal}
              initial={{ scale: 1.1, color: "#fff" }}
              animate={{ scale: 1, color: "var(--color-accent)" }}
              style={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              ${grandTotal.toLocaleString()}
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Checkout;
