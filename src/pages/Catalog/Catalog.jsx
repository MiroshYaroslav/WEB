import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FiltersPanel from "../../components/FiltersPanel/FiltersPanel.jsx";
import "./Catalog.css";
import { fetchCategories, fetchProducts } from "../../utils/api";
import BackLink from "../../utils/BackButton.jsx";
import Loader from "../../components/Loader/Loader.jsx";

const Catalog = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: { min: "", max: "" },
    sort: "",
  });

  useEffect(() => window.scrollTo(0, 0), [category]);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategoriesList(data))
      .catch(console.error);
  }, []);

  function findCategoryByParam(list, param) {
    if (!param) return undefined;
    const p = decodeURIComponent(param).toString().toLowerCase();
    return list.find((c) => {
      if (!c) return false;
      if (c.slug && c.slug.toString().toLowerCase() === p) return true;
      if (String(c.id) === param) return true;
      if (c.name && c.name.toString().toLowerCase() === p) return true;
      return false;
    });
  }

  useEffect(() => {
    if (!categoriesList.length) return;

    const categoryObj = findCategoryByParam(categoriesList, category);

    const controller = new AbortController();
    setLoading(true);
    setError("");

    const params = {
      category_id: categoryObj?.id,
      search: searchTerm || undefined,
      min_price: filters.priceRange.min || undefined,
      max_price: filters.priceRange.max || undefined,
      sort: filters.sort || undefined,
    };

    fetchProducts(params, { signal: controller.signal })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Failed to load products.");
          setProducts([]);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [category, categoriesList, searchTerm, filters]);

  const categoryObj = findCategoryByParam(categoriesList, category);

  return (
    <section className="catalog-page container">
      <BackLink />

      <h1 className="catalog-title">
        {categoryObj ? categoryObj.name.toUpperCase() : "All Cars"}
      </h1>

      <FiltersPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={setFilters}
        categoryFromURL={category}
        categoriesList={categoriesList}
      />

      {loading && (
        <div className="loading-container">
          <Loader />
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
      {!loading && products.length === 0 && (
        <p className="no-products">No products found.</p>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={category || "no-cat"}
          className="products-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >
          {products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Catalog;
