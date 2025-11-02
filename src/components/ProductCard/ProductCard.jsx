import "./ProductCard.css";

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.image || "/image-car/placeholder.png"} // placeholder якщо немає фото
        alt={product.name}
        className="product-image"
      />
      <h3>{product.name}</h3>
      <p className="power">Power: {product.power}hp</p>
      <div className="card-bottom">
        <span className="price">${product.price}</span>
        <button className="btn">View</button>
      </div>
    </div>
  );
};

export default ProductCard;
