export const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export const discount = (orig: number, price: number) =>
  Math.round(((orig - price) / orig) * 100);
