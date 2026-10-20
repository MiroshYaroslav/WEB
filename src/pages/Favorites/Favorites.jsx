import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion"; // Import
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { fetchProductById } from "../../utils/api";
import { loadFavorites } from "../../redux/actions";
import BackLink from "../../utils/BackButton.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import "./Favorites.css";

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((s) => s.auth.currentUser);
  const favorites = useSelector((s) => s.favorites.items);

  const productIds = useMemo(
    () =>
      Array.from(new Set(favorites.map((f) => f.product_id))).filter(Boolean),
    [favorites],
  );

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(loadFavorites(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["favorite_products", productIds],
    queryFn: async () => {
      if (productIds.length === 0) return [];
      const requests = productIds.map((id) =>
        fetchProductById(id).catch((err) => {
          console.error(`Failed to load product ${id}`, err);
          return null;
        }),
      );
      const results = await Promise.all(requests);
      return results.filter(Boolean);
    },
    enabled: productIds.length > 0,
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });

  if (!currentUser) {
    return (
      <section className="container section page-top-offset">
        <h2>Please sign in to view your favorites.</h2>
        <button
          className="btn"
          onClick={() => navigate(-1)}
          style={{ marginTop: 12 }}
        >
          Go back
        </button>
      </section>
    );
  }

  if (isLoading && products.length === 0 && productIds.length > 0) {
    return (
      <section className="container section page-top-offset">
        <Loader />
      </section>
    );
  }

  return (
    <section className="container section favorites-page page-top-offset">
      <div
        className="page-header-wrapper"
        style={{ justifyContent: "space-between", paddingBottom: "1rem" }}
      >
        <BackLink />
        <h1 style={{ margin: 0 }}>Your Favorites</h1>
        <div className="empty"></div>
      </div>

      {products.length === 0 && productIds.length === 0 && (
        <p className="no-favorites">No favorite products yet.</p>
      )}

      <AnimatePresence mode="popLayout">
        <motion.div
          className="products-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.35 }}
        >
          {products.map((p, idx) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default Favorites;
