import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./FiltersPanel.css";

const categoriesList = ["Sport", "Luxury", "SUV", "Electric"];

const FiltersPanel = ({
  searchTerm,
  setSearchTerm,
  applyFilters,
  categoryFromURL,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortOption, setSortOption] = useState("");
  const [priceError, setPriceError] = useState("");

  const togglePanel = () => setIsOpen((prev) => !prev);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => {
      const newRange = { ...prev, [name]: value };
      const min = parseFloat(newRange.min);
      const max = parseFloat(newRange.max);
      if (!isNaN(min) && !isNaN(max) && min > max) {
        setPriceError("Min price cannot be greater than Max price");
      } else {
        setPriceError("");
      }
      return newRange;
    });
  };

  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleApply = () => {
    applyFilters({
      categories: selectedCategories,
      priceRange,
      sort: sortOption,
    });
    togglePanel();
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setPriceRange({ min: "", max: "" });
    setSortOption("");
    setPriceError("");
  };

  return (
    <div className="filters-container">
      <input
        type="text"
        placeholder="Search models..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button className="filter-btn" onClick={togglePanel}>
        Filters & Sort
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="filters-modal-overlay"
            onClick={togglePanel}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="filters-modal-content"
              onClick={(e) => e.stopPropagation()}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <h3>Filters & Sorting</h3>

              {!categoryFromURL && (
                <div className="filter-group">
                  <label>Categories:</label>
                  {categoriesList.map((cat) => (
                    <div key={cat} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={cat}
                        checked={selectedCategories.includes(cat)}
                        onChange={() => handleCategoryChange(cat)}
                      />
                      <label htmlFor={cat}>{cat}</label>
                    </div>
                  ))}
                </div>
              )}

              <div className="filter-group">
                <label>Price range:</label>
                <div className="price-range">
                  <input
                    type="number"
                    name="min"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={handlePriceChange}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="max"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={handlePriceChange}
                  />
                </div>
                {priceError && <p className="error-text">{priceError}</p>}
              </div>

              <div className="filter-group">
                <label>Sort by:</label>
                <select value={sortOption} onChange={handleSortChange}>
                  <option value="">None</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="power-asc">Power ↑</option>
                  <option value="power-desc">Power ↓</option>
                </select>
              </div>

              <div className="modal-buttons">
                <button
                  className="apply-btn"
                  onClick={handleApply}
                  disabled={!!priceError}
                >
                  Apply
                </button>
                <button className="reset-btn" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FiltersPanel;
