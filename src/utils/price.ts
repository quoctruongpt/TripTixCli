const formatPrice = (price: number) => {
  return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
};

export { formatPrice };
