import Hero from "../components/Hero/Hero";
import FeaturedProducts from "../components/ProductCard/FeaturedProducts";
import AboutBMW from "../components/About/AboutBMW";

const Home = () => {
  return (
    <div>
      <Hero />

      <AboutBMW />

      <FeaturedProducts />
    </div>
  );
};

export default Home;
