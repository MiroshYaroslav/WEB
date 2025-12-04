import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createUserApi, fetchUsers } from "../../utils/api";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "../../redux/actions";
import "./AuthModal.css";

const AuthModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);

  const [tab, setTab] = useState("sign-in");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({ username: "", email: "", password: "" });

  useEffect(() => {
    if (!isOpen) return;
    setError("");
    const controller = new AbortController();
    setLoading(true);
    fetchUsers({ signal: controller.signal })
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((e) => {
        if (e.name !== "AbortError") {
          console.error(e);
          setError("Failed to load users list.");
        }
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const foundUser = useMemo(() => {
    if (!form.username) return null;
    const u = users.find(
      (u) =>
        u?.username?.toLowerCase?.() === form.username.toLowerCase() ||
        String(u?.id) === form.username,
    );
    return u || null;
  }, [users, form.username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username.trim()) {
      setError("Enter username or user ID.");
      return;
    }
    if (!form.password) {
      setError("Enter password.");
      return;
    }
    if (!foundUser) {
      setError("User not found.");
      return;
    }
    dispatch(setCurrentUser(foundUser));
    onClose?.();
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password;

    if (!username) {
      setError("Enter username.");
      return;
    }
    if (!password) {
      setError("Enter password.");
      return;
    }

    setLoading(true);
    try {
      const created = await createUserApi({
        username,
        email: email || undefined,
        password,
      });
      dispatch(setCurrentUser(created));
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(setCurrentUser(null));
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="auth-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="auth-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="auth-header">
              <h3 id="auth-title">
                {currentUser ? "Account" : "Sign in / Sign up"}
              </h3>
              <button
                className="auth-close"
                aria-label="Close"
                onClick={onClose}
              >
                ×
              </button>
            </div>

            <div className="auth-body">
              {currentUser ? (
                <div>
                  <p style={{ marginBottom: "0.8rem" }}>
                    Logged in as:{" "}
                    <strong>
                      {currentUser.username ?? `User #${currentUser.id}`}
                    </strong>
                  </p>
                  <button className="btn primary" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <div className="tabs">
                    <button
                      className={`tab ${tab === "sign-in" ? "active" : ""}`}
                      onClick={() => setTab("sign-in")}
                    >
                      Sign in
                    </button>
                    <button
                      className={`tab ${tab === "sign-up" ? "active" : ""}`}
                      onClick={() => setTab("sign-up")}
                    >
                      Sign up
                    </button>
                  </div>

                  {tab === "sign-in" ? (
                    <form onSubmit={handleSignin} className="auth-form">
                      <label>
                        Username or ID
                        <input
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          placeholder="e.g. john or 1"
                          disabled={loading}
                        />
                      </label>
                      <label>
                        Password
                        <input
                          name="password"
                          type="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                          disabled={loading}
                        />
                      </label>

                      <button
                        className="btn primary"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Loading..." : "Sign in"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} className="auth-form">
                      <label>
                        Username
                        <input
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          placeholder="e.g. john"
                          disabled={loading}
                        />
                      </label>
                      <label>
                        Email (optional)
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="e.g. john@mail.com"
                          disabled={loading}
                        />
                      </label>
                      <label>
                        Password
                        <input
                          name="password"
                          type="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Enter password"
                          disabled={loading}
                        />
                      </label>
                      <button
                        className="btn primary"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Creating..." : "Create account"}
                      </button>
                    </form>
                  )}

                  {error && <p className="auth-error">{error}</p>}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
