import products from "../data/products.json";

// Повертаємо масив об'єктів { name, slug }
export const getCategories = () => {
  const unique = [...new Set(products.map((p) => p.category))];
  return unique.map((cat) => ({
    name: cat,
    slug: cat.toLowerCase().replace(/\s+/g, "-"), // створюємо slug
  }));
};
