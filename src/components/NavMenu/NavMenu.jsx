import {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {FiGrid, FiHeart, FiPackage, FiShoppingCart, FiUser,} from "react-icons/fi";
import AuthModal from "../AuthModal/AuthModal";
import "./NavMenu.css";
import {fetchCategories} from "../../utils/api";

const NavMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const currentUser = useSelector((s) => s.auth.currentUser);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setLoadingCategories(true);
    setError("");

    const loadCategories = async () => {
      try {
        const data = await fetchCategories({ signal: controller.signal });
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to load categories:", err);
          setError("Cannot load categories.");
          setCategories([]);
        }
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
    return () => controller.abort();
  }, []);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  return (
    <nav className="nav" ref={dropdownRef}>
      <div className="catalog-dropdown">
        <i
          className={`nav-link catalog-btn icon-btn ${showDropdown ? "active" : ""}`}
          onClick={toggleDropdown}
          title="Catalog"
        >
          <FiGrid size={24} />
        </i>

        <div className={`dropdown-menu ${showDropdown ? "active" : ""}`}>
          {loadingCategories ? (
            <div className="dropdown-item">Loading...</div>
          ) : error ? (
            <div className="dropdown-item error">{error}</div>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat.slug ?? cat.id}
                to={`/catalog/${cat.slug ?? cat.id}`}
                className="dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                {cat.name ?? cat.title ?? "Unnamed"}
              </Link>
            ))
          ) : (
            <div className="dropdown-item">No categories</div>
          )}
        </div>
      </div>

      {currentUser && (
        <>
          <Link to="/favorites" className="nav-link icon-btn" title="Favorites">
            <FiHeart size={24} />
          </Link>

          <Link to="/cart" className="nav-link icon-btn" title="Cart">
            <FiShoppingCart size={24} />
          </Link>

          <Link to="/orders" className="nav-link icon-btn" title="My Orders">
            <FiPackage size={24} />
          </Link>
        </>
      )}

      <button
        className="nav-link icon-btn"
        onClick={() => setIsAuthOpen(true)}
        title={currentUser ? `Signed in as ${currentUser.username}` : "Log in"}
      >
        <FiUser size={24} />
      </button>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
};

export default NavMenu;
