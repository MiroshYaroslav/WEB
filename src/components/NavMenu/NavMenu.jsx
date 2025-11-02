import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../utils/getCategories";
import "./NavMenu.css";

const NavMenu = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const categories = getCategories();

  // Закриття меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  return (
    <nav className="nav" ref={dropdownRef}>
      <Link to="/" className="nav-link">
        Home
      </Link>

      <div className="catalog-dropdown">
        <i
          className="nav-link catalog-btn"
          onClick={toggleDropdown}
          style={{ fontStyle: "normal" }}
        >
          Catalog
        </i>

        {showDropdown && (
          <div className="dropdown-menu">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/catalog/${cat.slug}`}
                className="dropdown-item"
                onClick={() => setShowDropdown(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <Link to="/cart" className="nav-link">
        Cart
      </Link>
    </nav>
  );
};

export default NavMenu;
