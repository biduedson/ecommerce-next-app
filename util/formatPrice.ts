export const formatCurrency = (price: number) => {
  const priceFormated = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price / 100);
  return priceFormated;
};
