import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./NavMenu.css";
import { fetchCategories } from "../../utils/api";

const NavMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState("");

  // Закриваємо дропдаун при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Завантаження категорій з бекенду
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
      <Link to="/" className="nav-link">
        Home
      </Link>

      <div className="catalog-dropdown">
        <i
          className={`nav-link catalog-btn ${showDropdown ? "active" : ""}`}
          onClick={toggleDropdown}
        >
          Catalog
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

      <Link to="/cart" className="nav-link">
        Cart
      </Link>
    </nav>
  );
};

export default NavMenu;
