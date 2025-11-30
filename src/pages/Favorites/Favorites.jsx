import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import { fetchProductById } from "../../utils/api";
import { loadFavorites } from "../../redux/actions";
import "./Favorites.css";
import BackLink from "../../utils/BackButton.jsx";
import Loader from "../../components/Loader/Loader.jsx";

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const { items: favorites, loading, error } = useSelector((s) => s.favorites);

  const [products, setProducts] = useState([]);
  const [fetchErr, setFetchErr] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!currentUser?.id) return;
    dispatch(loadFavorites(currentUser.id));
  }, [currentUser?.id, dispatch]);

  const productIds = useMemo(
    () =>
      Array.from(new Set(favorites.map((f) => f.product_id))).filter(Boolean),
    [favorites],
  );

  useEffect(() => {
    if (!productIds.length) {
      setProducts([]);
      return;
    }
    const controller = new AbortController();
    setFetching(true);
    setFetchErr("");
    Promise.all(
      productIds.map((id) =>
        fetchProductById(id, { signal: controller.signal }).catch((e) => {
          console.error("Failed to load product", id, e);
          return null;
        }),
      ),
    )
      .then((list) => setProducts(list.filter(Boolean)))
      .catch((e) => {
        if (e.name !== "AbortError")
          setFetchErr("Failed to load favorite products.");
      })
      .finally(() => setFetching(false));
    return () => controller.abort();
  }, [productIds]);

  if (loading || fetching) {
    return (
      <section className="container section">
        <Loader />
      </section>
    );
  }

  if (!currentUser) {
    return (
      <section className="container section">
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

  return (
    <section className="container section favorites-page">
      <div className="fav-header">
        <BackLink />
        <h1>Your Favorites</h1>
      </div>

      {loading && <p>Loading favorites...</p>}
      {error && <p className="error-text">{error}</p>}

      {fetching && <p>Loading products...</p>}
      {fetchErr && <p className="error-text">{fetchErr}</p>}

      {!fetching && products.length === 0 && (
        <p className="no-favorites">No favorite products yet.</p>
      )}

      <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default Favorites;
