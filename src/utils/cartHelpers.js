export const calculateItemPrice = (item) => {
  const base = Number(item.product?.base_price) || 0;
  const enginePrice = Number(item.engine?.price_modifier) || 0;
  const colorPrice = Number(item.color?.price_modifier) || 0;
  const trimPrice = Number(item.trim?.price_modifier) || 0;
  return base + enginePrice + colorPrice + trimPrice;
};

export const calculateGrandTotal = (items) => {
  return items.reduce(
    (sum, item) => sum + calculateItemPrice(item) * (item.quantity || 1),
    0,
  );
};
