import React from 'react';
import { useSelector, useDispatch } from 'react-redux'; // чтобы вытащить из store данные
import { Link } from 'react-router-dom';
import { addItem, CartItem, selectCartItemById } from '../redux/slices/cartSlice'; // вытаскиваем методы из слайса, чтобы потом диспатчить через эти методы информацию в store
import { RootState } from '../redux/store';
const typeNames = ['тонкое', 'традиционное'];

type PizzaBlockProps = {
  id: string;
  imageUrl: string;
  price: number;
  title: string;
  types: number[];
  sizes: number[];
};

const PizzaBlock: React.FC<PizzaBlockProps> = ({ id, title, price, imageUrl, sizes, types }) => {
  const dispatch = useDispatch();
  const [activeType, setActiveType] = React.useState(0);
  const [activeSize, setActiveSize] = React.useState(0);
  const cartItem = useSelector(selectCartItemById(id)); // (вернет true/false) Вытаскиваем с помощью юзселектора добавленную пиццу. В пропсах выше мы прописали, что вытаскиваем id отрендеренной пиццы
  const addedItem = cartItem ? cartItem.count : 0; // Если тру т.е. объект нашелся, то мы из него вытаскиваем count и передаём вниз в кнопку "Добавить"

  const onClickAdd = () => {
    // создаём функцию, которая будет передавать в state данные о том, что натыкал пользователь
    const item: CartItem = {
      id,
      title,
      price,
      imageUrl,
      type: typeNames[activeType], // не просто данные о типах теста и размере, а
      size: sizes[activeSize], // конкретно те, что выбрал пользователь
      count: 0,
    };
    dispatch(addItem(item)); // прокидываем выбранную пользователем пиццу в store через метод, который есть в слайсе
  };

  return (
    <div className="pizza-block__wrapper">
      <div className="pizza-block">
        <Link key={id} to={`/pizza/${id}`}>
          <img className="pizza-block__image" src={imageUrl} alt="Pizza" />
          <h4 className="pizza-block__title">{title}</h4>
        </Link>
        <div className="pizza-block__selector">
          <ul>
            {types.map((type) => (
              <li
                key={type}
                onClick={() => setActiveType(type)}
                className={activeType === type ? 'active' : ''}>
                {typeNames[type]}
              </li>
            ))}
          </ul>
          <ul>
            {sizes.map((size, i) => (
              <li
                key={size}
                onClick={() => setActiveSize(i)}
                className={activeSize === i ? 'active' : ''}>
                {' '}
                {size} см{' '}
              </li>
            ))}
          </ul>
        </div>
        <div className="pizza-block__bottom">
          <div className="pizza-block__price">от {price} ₽</div>
          <button onClick={onClickAdd} className="button button--outline button--add">
            {/* повесили выше функцию  onClickAdd на кнопку "Добавить". Теперь она будет передавать пиццы в store*/}
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.8 4.8H7.2V1.2C7.2 0.5373 6.6627 0 6 0C5.3373 0 4.8 0.5373 4.8 1.2V4.8H1.2C0.5373 4.8 0 5.3373 0 6C0 6.6627 0.5373 7.2 1.2 7.2H4.8V10.8C4.8 11.4627 5.3373 12 6 12C6.6627 12 7.2 11.4627 7.2 10.8V7.2H10.8C11.4627 7.2 12 6.6627 12 6C12 5.3373 11.4627 4.8 10.8 4.8Z"
                fill="white"
              />
            </svg>
            <span>Добавить</span>
            {addedItem > 0 && <i>{addedItem}</i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaBlock;
