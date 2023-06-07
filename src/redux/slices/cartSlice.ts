import { calcTotalPrice } from './../../utilities/calcTotalPrice';
import { getCartFromLS } from '../../utilities/getCartFromLS';
// здесь будет slice для корзины
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type CartItem = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  type: string;
  size: number;
  count: number;
};

interface CartSliceState {
  totalPrice: number;
  items: CartItem[];
}

const cartData = getCartFromLS();

const initialState: CartSliceState = {
  totalPrice: cartData.totalPrice ? cartData.totalPrice : 0,
  items: cartData.items, // сюда будут пушиться добавленные пиццы
};

const cartSlice = createSlice({
  name: 'cart', // назвать слайс придется по-другому
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      if (state.items) {
        const findItem = state.items.find((obj) => obj.id === action.payload.id); // Проверяем, есть ли такой объект в нашем массиве объектов
        findItem ? findItem.count++ : state.items.push({ ...action.payload, count: 1 }); // Если есть, то увеличиваем ему счётчик, если нет, то добавляем его в наш массив и задаем счетчик 1
      } else if ((state.items = [])) {
        state.items.push({ ...action.payload, count: 1 });
      }
      state.totalPrice = calcTotalPrice(state.items);
      // state.items.reduce((sum, obj) => {
      // вычисляем общую сумму заказа автоматически при нажатии на клавишу "Добавить"
      // return obj.price + sum; здесь мы просто считали сумму каждого объекта (добавленной пиццы) без учета количества каждого вида пицц
      // return obj.price * obj.count + sum; // теперь мы узнаём общую сумму
    },
    removeItem(state, action: PayloadAction<string>) {
      // удаляем пиццу из items
      state.items = state.items.filter((obj) => obj.id !== action.payload);
      state.totalPrice = calcTotalPrice(state.items);
    },
    minusItem(state, action: PayloadAction<string>) {
      //Метод для того, чтобы сделать меньшее колчиество пицц определенного вида в корзине
      const findItem = state.items.find((obj) => obj.id === action.payload);
      if (findItem && findItem.count > 1) {
        findItem.count--;
        state.totalPrice = calcTotalPrice(state.items);
      }
    },
    clearItems(state) {
      // очищаем корзину совсем
      state.items = [];
      state.totalPrice = 0; // очищаем цену, так как если мы удаляем всю корзину, то цена должна быть 0
    },
  },
});

export const selectCart = (state: RootState) => state.cart; // часто достаём корзину при помощи useSelector поэтому делаем для этого отедельную функцию
// это называется селектором в Редакс-Тулките
export const selectCartItemById = (id: string) => (state: RootState) => {
  if (state.cart.items) {
    return state.cart.items.find((obj) => obj.id === id);
  }
};

export const { addItem, removeItem, clearItems, minusItem } = cartSlice.actions;
export default cartSlice.reducer;
