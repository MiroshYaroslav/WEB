import { useField } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import "./CheckoutInput.css";

const ErrorMessage = ({ message }) => (
  <motion.div
    initial={{ opacity: 0, y: -5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
    className="error-message"
  >
    {message}
  </motion.div>
);

const CheckoutInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  const hasError = meta.touched && meta.error;

  return (
    <div className="checkout-input-group">
      <label htmlFor={props.id || props.name}>{label}</label>
      <input
        className={`checkout-input ${hasError ? "input-error" : ""}`}
        {...field}
        {...props}
      />

      <AnimatePresence>
        {hasError ? <ErrorMessage message={meta.error} /> : null}
      </AnimatePresence>
    </div>
  );
};

export default CheckoutInput;
