import { motion } from "framer-motion";
import ProductCard from "./ProductCard.jsx";

import sport from "../../data/sport.json";
import luxury from "../../data/luxury.json";
import suv from "../../data/suv.json";
import electric from "../../data/electric.json";
import { useMemo } from "react";

const FeaturedProducts = () => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allProducts = [...sport, ...luxury, ...suv, ...electric];

  const randomProducts = useMemo(() => {
    return allProducts
      .slice()
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [allProducts]);

  return (
    <motion.section
      className="featured container"
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <h2 className="featured-title">Models</h2>

      <motion.div
        className="products-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            },
          },
        }}
      >
        {randomProducts.map((product) => (
          <motion.div
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default FeaturedProducts;
