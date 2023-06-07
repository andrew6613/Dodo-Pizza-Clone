import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom'; // хук позволяет перенапрвлять пользователя на другую страницу автоматически
import { useParams, Link } from 'react-router-dom';

const PizzaFull: React.FC = () => {
  const navigate = useNavigate(); // юзаем хук через переменную
  const [pizza, setPizza] = React.useState<{
    imageUrl: string;
    title: string;
    price: number;
  }>();
  let { id } = useParams(); // специальный хук из реакт-роутера, который позволяет вытаскивать прокинутый в app.js параметр id (по нашему замыслу он может быть любым и будет соответствовать id пиццы)

  React.useEffect(() => {
    async function getPizzaData() {
      try {
        // так мы можем запускать асинхронные функции внутри useEffect'а
        const { data } = await axios.get('https://6309f6f432499100327e5116.mockapi.io/Items/' + id); // ждем получения данных от бэкенда
        setPizza(data); // объект pizza передаём в стэйт выше, а оттуда будем выцеплять всякие ключи
      } catch (error) {
        alert('Ошибка получения данных');
        navigate('/'); // хук из реакт роутера, который переправляет нас на нужную страницу автоматически
      }
    }
    getPizzaData(); // чтобы сделать запрос надо запустить функцию
  }, []);

  if (!pizza) {
    // пока пицца не загрузится будет undefined , и это вызовет ошибку. А так мы проверяем, нужно ли вообще из объекта pizza что-то доставать, если он ещё пока не прогрузился
    return <>'Загрузка...'</>;
  }
  return (
    <div className="container">
      <img src={pizza.imageUrl} />
      <h2> {pizza.title} </h2>
      <h2> {pizza.price} Р</h2>
      <Link to="/">
        <button className="button button--outline button--add">
          <span>Назад</span>
        </button>
      </Link>
    </div>
  );
};

export default PizzaFull;
