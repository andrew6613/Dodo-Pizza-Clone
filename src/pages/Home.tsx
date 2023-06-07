import React from 'react';
import { useSelector } from 'react-redux';
import '../scss/app.scss';
import Categories from '../components/Categories';
import Sort from '../components/Sort';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/Skeleton';
import Pagination from '../components/Pagination';
import { setCategoryId, setCurrentPage } from '../redux/slices/filterSlice';
import { fetchPizzas } from '../redux/slices/pizzaSlice';
import { RootState, useAppDispatch } from '../redux/store';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { categoryId, sort, currentPage, searchValue } = useSelector(
    (state: RootState) => state.filter,
  );
  const { items, status } = useSelector((state: RootState) => state.pizza); // вытаскиваем items из стора нашего слайса, чтобы прямо здесь пихать в него результаты запроса на бэкэнд
  const sortType = sort.sortProperty;
  const [orderOfSorting, setOrderOfSorting] = React.useState(true);
  const onChangeCategory = React.useCallback((id: number) => {
    dispatch(setCategoryId(id));
  }, []);
  const onChangePage = (page: number) => {
    dispatch(setCurrentPage(page));
  };
  let getPizzas = async () => {
    // сделали функцию асинхронной
    const order = orderOfSorting === true ? 'asc' : 'desc'; // треугольник вверх-вниз = по возрастанию-убыванию
    const categoryParams = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';
    dispatch(
      fetchPizzas({
        search,
        sortType,
        order,
        currentPage: String(currentPage),
        categoryParams,
      }),
    ); // Диспатчим функцию не через метод в редьюсере, а через отдельную асинхронную функцию
    window.scrollTo(0, 0);
  };

  const pizzas = items.map((obj: any) => <PizzaBlock key={obj.id} {...obj} />); // рисуем пиццы
  const skeleton = [...new Array(6)].map((_, index) => <Skeleton key={index} />); // рисуем скелетоны, пока не пришел ответ
  React.useEffect(() => {
    getPizzas();
  }, [categoryId, sortType, orderOfSorting, searchValue, currentPage]); // прописали, за изменениями в каких переменых мы наблюдаем

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onClickCategory={onChangeCategory} />
        <Sort value={sort} orderOfSorting={orderOfSorting} setOrderOfSorting={setOrderOfSorting} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>
            Произошла ошибка <span>😕</span>
          </h2>
          <p>Не удалось получить пиццы. Попробуйте ещё раз </p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeleton : pizzas}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
