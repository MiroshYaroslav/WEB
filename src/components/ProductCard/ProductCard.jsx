import "./ProductCard.css";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.image || "/image-car/placeholder.png"}
        alt={product.name}
      />
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
