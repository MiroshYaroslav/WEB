import { motion } from "framer-motion";
import Hero from "../components/Hero/Hero";
import FeaturedProducts from "../components/ProductCard/FeaturedProducts";
import AboutBMW from "../components/About/AboutBMW";

const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Hero />
      <AboutBMW />
      <FeaturedProducts />
    </motion.main>
  );
};

export default Home;
