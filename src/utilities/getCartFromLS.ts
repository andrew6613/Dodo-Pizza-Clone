import { calcTotalPrice } from './calcTotalPrice';
export const getCartFromLS = () => {
  const data = localStorage.getItem('cart');
  const items = data ? JSON.parse(data) : [];
  const totalPrice = calcTotalPrice(items);
  if (items.length) {
    return { items, totalPrice };
  }
  return data ? JSON.parse(data) : [];
};
