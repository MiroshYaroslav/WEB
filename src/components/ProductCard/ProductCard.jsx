import "./ProductCard.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, removeFromFavorites } from "../../redux/actions";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const favorites = useSelector((s) => s.favorites.items);

  if (!product) return null;

  const imageSrc = product.image
    ? `http://localhost:8000${product.image}`
    : "/image-car/placeholder.png";

  const userId = currentUser?.id;
  const favForProduct = favorites.find((f) => f.product_id === product.id);
  const isFavorited = !!favForProduct;

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return;
    if (isFavorited) {
      dispatch(removeFromFavorites({ favoriteId: favForProduct.id }));
    } else {
      dispatch(addToFavorites({ userId, productId: product.id }));
    }
  };

  const baseEngine =
    product.engines && product.engines.length > 0 ? product.engines[0] : null;

  const power = baseEngine ? baseEngine.power : null;

  return (
    <div className="product-card">
      <div className="image-wrap">
        {userId && (
          <button
            className={`fav-btn ${isFavorited ? "active" : ""}`}
            aria-pressed={isFavorited}
            aria-label={
              isFavorited ? "Remove from favorites" : "Add to favorites"
            }
            title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            onClick={toggleFavorite}
          >
            {isFavorited ? "❤" : "♡"}
          </button>
        )}
        <img src={imageSrc} alt={product.name} />
      </div>

      <h3>{product.name}</h3>

      {power ? (
        <p className="power">Power: {power} hp</p>
      ) : (
        <p className="power" style={{ visibility: "hidden" }}>
          No specs
        </p>
      )}

      <div className="card-bottom">
        <span className="price">
          ${Number(product.base_price).toLocaleString()}
        </span>
        <Link to={`/product/${product.id}`} className="view-btn">
          View
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
