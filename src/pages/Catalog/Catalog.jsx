import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query"; // Import
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FiltersPanel from "../../components/FiltersPanel/FiltersPanel.jsx";
import BackLink from "../../utils/BackButton.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { fetchCategories, fetchProducts } from "../../utils/api";
import "./Catalog.css";

const Catalog = () => {
  const { category } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    priceRange: { min: "", max: "" },
    sort: "",
  });

  useEffect(() => window.scrollTo(0, 0), [category]);

  const { data: categoriesList = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 60,
  });

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

  const categoryObj = findCategoryByParam(categoriesList, category);

  const queryParams = {
    category_id: categoryObj?.id,
    search: searchTerm || undefined,
    min_price: filters.priceRange.min || undefined,
    max_price: filters.priceRange.max || undefined,
    sort: filters.sort || undefined,
  };

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => fetchProducts(queryParams),
    enabled: true,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <section className="catalog-page container page-top-offset">
      <div
        className="page-header-wrapper"
        style={{ justifyContent: "space-between" }}
      >
        <BackLink />
        <h1 className="catalog-title">
          {categoryObj ? categoryObj.name.toUpperCase() : "All Cars"}
        </h1>
        <div className="empty"></div>
      </div>

      <FiltersPanel
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        applyFilters={setFilters}
        categoryFromURL={category}
        categoriesList={categoriesList}
      />

      {isLoading && (
        <div className="loading-container">
          <Loader />
        </div>
      )}

      {isError && (
        <p className="error-text">
          {error?.message || "Failed to load products."}
        </p>
      )}

      {!isLoading && products.length === 0 && (
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
