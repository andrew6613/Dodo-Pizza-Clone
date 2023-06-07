import React from 'react';
import { useDispatch } from 'react-redux';
import { setSort, Sort } from '../redux/slices/filterSlice';

type SortItem = {
  // здес мы прописали отдельный тип, чтобы массив list ниже понимал, из каких объектов с какими свойствами он должен состоять. Если мы попытаемся добавить объект без этих свойств, то будет ошибка
  name: string;
  sortProperty: string;
};

type SortProps = {
  orderOfSorting: boolean;
  setOrderOfSorting: any;
  value: Sort;
};

type PopupProp = MouseEvent & {
  // Так мы делаем, если хотим добавить дополнительные свойства к уже готовому типу (то есть здесь мы добавили свойство к уже существующему типу React.MouseEvent<HTMLBodyElement>)
  path: Node[];
};

const list: SortItem[] = [
  { name: 'популярности', sortProperty: 'rating' },
  { name: 'цене', sortProperty: 'price' },
  { name: 'алфавиту', sortProperty: 'title' },
];

const SortPopUp: React.FC<SortProps> = React.memo(
  ({ orderOfSorting, setOrderOfSorting, value }) => {
    const dispatch = useDispatch();
    const sortRef = React.useRef<HTMLDivElement>(null); // получаем ДОМ-элемент поп-апа
    const [open, setOpen] = React.useState(false); // регулируем открытие/закрытие окна попапа
    const onClickSelectedItem = (obj: SortItem) => {
      //@ts-ignore
      dispatch(setSort(obj));
      setOpen(false);
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const _event = event as PopupProp; // Здесь мы типа обманули TS, сказав, что _event это тот же event, но с дополнениями как PopupProp выше
        if (sortRef.current && !_event.composedPath().includes(sortRef.current)) {
          // проверяем, не было ли клика на компонент sort
          setOpen(false); // если клика не было, то мы скрываем окно
        }
      };
      // document.body.addEventListener('click', (event) => {
      //   if (!event.composedPath().includes(sortRef.current)) {
      //     // проверяем, не было ли клика на компонент sort
      //     setOpen(false); // если клика не было, то мы скрываем окно
      //   }
      // }); старый вариант: см ниже какая проблема при этом возникла
      document.body.addEventListener('click', handleClickOutside);
      return () => {
        // одна из фишек useEffect'а: мы делаем возврат функции, если наш компонент удаляется (unmount)
        document.body.removeEventListener('click', handleClickOutside); // снимаем обработчик, если наш компонент пропал
      };
    });

    // Здесь возникает следующая проблема: после возврата на основную страницу количество обработчиков возрастает.
    // Так происходит потому, что после возврата в Home React.useEffect рендерится заново и заново создаёт обработчик
    // Чтобы решить проблему, нужно сделать так, чтобы при исчезании sort-блока обработчик удалялся

    let styleSvg = orderOfSorting === true ? 'svg__toggle__asc' : 'svg__toggle__desc';
    return (
      // useRef вешаем на див ниже
      <div ref={sortRef} className="sort">
        <div className="sort__label">
          <svg
            className={styleSvg}
            onClick={() => setOrderOfSorting(!orderOfSorting)}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 5C10 5.16927 9.93815 5.31576 9.81445 5.43945C9.69075 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309245 5.56315 0.185547 5.43945C0.061849 5.31576 0 5.16927 0 5C0 4.83073 0.061849 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.061849 4.83073 0 5 0C5.16927 0 5.31576 0.061849 5.43945 0.185547L9.81445 4.56055C9.93815 4.68424 10 4.83073 10 5Z"
              fill="#2C2C2C"
            />
          </svg>
          <b>Сортировка по:</b>
          <span onClick={() => setOpen(!open)}>{value.name}</span>
        </div>
        {open && (
          <div className="sort__popup">
            <ul>
              {list.map((obj, i) => (
                <li
                  key={i}
                  onClick={() => onClickSelectedItem(obj)}
                  className={value.sortProperty === obj.sortProperty ? 'active' : ''}>
                  {obj.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
);

export default SortPopUp;
