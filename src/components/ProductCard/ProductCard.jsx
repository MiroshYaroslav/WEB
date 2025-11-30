import "./ProductCard.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, removeFromFavorites } from "../../redux/actions";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);
  const favorites = useSelector((s) => s.favorites.items);

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
      <p className="power">Power: {product.power}hp</p>
      <div className="card-bottom">
        <span className="price">${product.price}</span>
        <Link to={`/product/${product.id}`} className="view-btn">
          View
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
