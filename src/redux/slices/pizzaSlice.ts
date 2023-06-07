// Сюда нужно будет вынести бизнес-логику то есть наш асинхронный экшн
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

type FetchPizzasArg = Record<string, string>;

export const fetchPizzas = createAsyncThunk(
  'pizza/fetchPizzasStatus',
  async ({ search, sortType, order, currentPage, categoryParams }: FetchPizzasArg) => {
    // в префиксе перед слэш нужно будет указать название слайса, с которым связана асинхронная функция
    const { data } = await axios.get<Pizza[]>(
      `https://6309f6f432499100327e5116.mockapi.io/Items?${categoryParams}${search}&sortBy=${sortType}&order=${order}&page=${currentPage}&limit=4`,
    );
    return data as Pizza[]; // функция возращает данные, которые пришли от бэкенда
  },
); // это мы импортировали из документации редакс-тулкита называется асинхронный экшн

export enum Status {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

interface PizzaSliceState {
  items: Pizza[];
  status: Status;
}

type Pizza = {
  id: string;
  imageUrl: string;
  price: number;
  title: string;
  types: number[];
  sizes: number[];
};

export const initialState: PizzaSliceState = {
  items: [], // сюда будут пушиться добавленные пиццы
  status: Status.LOADING, // начальное состояние загрузки
};

const pizzasSlice = createSlice({
  name: 'pizza', // назвать слайс придется по-другому
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Pizza[]>) {
      state.items = action.payload;
    },
  },

  extraReducers: (builder) => {
    // экстраредьюсеры отвечают за логику именно createAsyncThunk
    builder
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.items = action.payload; // передадим в items результат, который вернула нам функция
        state.status = Status.SUCCESS;
      })
      .addCase(fetchPizzas.pending, (state) => {
        state.status = Status.LOADING;
        state.items = [];
      })
      .addCase(fetchPizzas.rejected, (state) => {
        state.status = Status.ERROR;
        state.items = [];
      });
  },
});

export const { setItems } = pizzasSlice.actions;
export default pizzasSlice.reducer;
