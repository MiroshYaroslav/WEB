import ProductCard from "./ProductCard.jsx";
import products from "../../data/products.json";

const FeaturedProducts = () => {
  return (
    <section className="featured container">
      <h2>Models</h2>
      <div className="products-grid">
        {products.map((p, idx) => (
          <ProductCard key={p.id} product={p} index={idx} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
