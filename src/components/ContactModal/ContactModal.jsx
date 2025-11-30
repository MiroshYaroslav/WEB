import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchPhoneNumbers } from "../../utils/api";
import "./ContactModal.css";

const ContactModal = ({ isOpen, onClose, title = "Contact us" }) => {
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;
    const controller = new AbortController();
    const load = async () => {
      setError("");
      setLoading(true);
      try {
        const list = await fetchPhoneNumbers({ signal: controller.signal });
        if (!ignore) setNumbers(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!ignore) {
          console.error(e);
          setError("Failed to load phone numbers.");
          setNumbers([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="contact-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="contact-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="contact-header">
              <h3 id="contact-title">{title}</h3>
              <button
                className="contact-close"
                aria-label="Close"
                onClick={onClose}
              >
                ×
              </button>
            </div>
            <div className="contact-body">
              {loading && <p>Loading phone numbers...</p>}
              {error && <p className="contact-error">{error}</p>}
              {!loading &&
                !error &&
                (numbers?.length ? (
                  <ul className="phone-list">
                    {numbers.map((pn) => (
                      <li key={pn.id} className="phone-item">
                        <a href={`tel:${pn.number}`} className="phone-number">
                          {pn.number}
                        </a>
                        {pn.description && (
                          <div className="phone-desc">{pn.description}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No contact numbers yet.</p>
                ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;
