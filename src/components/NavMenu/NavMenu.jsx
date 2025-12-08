import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiGrid,
  FiHeart,
  FiLogOut,
  FiPackage,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import { setCurrentUser } from "../../redux/actions";
import { fetchCategories } from "../../utils/api";
import "./NavMenu.css";

const NavMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  // Функція виходу
  const handleSignOut = () => {
    dispatch(setCurrentUser(null));
    navigate("/login");
  };

  return (
    <nav className="nav" ref={dropdownRef}>
      {currentUser && (
        <>
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

          <Link to="/favorites" className="nav-link icon-btn" title="Favorites">
            <FiHeart size={24} />
          </Link>

          <Link to="/cart" className="nav-link icon-btn" title="Cart">
            <FiShoppingCart size={24} />
          </Link>

          <Link to="/orders" className="nav-link icon-btn" title="My Orders">
            <FiPackage size={24} />
          </Link>

          <span className="nav-user-name" title={currentUser.username}>
            <FiUser size={24} />
          </span>

          <button
            className="nav-link icon-btn logout-btn"
            onClick={handleSignOut}
            title="Sign Out"
          >
            <FiLogOut size={24} />
          </button>
        </>
      )}
    </nav>
  );
};

export default NavMenu;
