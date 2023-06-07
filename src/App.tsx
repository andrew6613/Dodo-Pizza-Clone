import { Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import './scss/app.scss';
import Header from './components/Header';
import Home from './pages/Home';

const Cart = React.lazy(() => import(/*webpackChumkName:'Cart'*/ './pages/Cart'));
const NotFound = React.lazy(() => import(/*webpackChumkName:'NotFound'*/ './pages/NotFound'));
const PizzaFull = React.lazy(() => import(/*webpackChumkName:'PizzaFull'*/ './pages/PizzaFull'));

function App() {
  return (
    <div>
      <div className="wrapper">
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/cart"
              element={
                <Suspense fallback={<div>Загрузка Корзины</div>}>
                  <Cart />
                </Suspense>
              }
            />
            <Route
              path="/pizza/:id"
              element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <PizzaFull />
                </Suspense>
              }
            />
            <Route
              path="*"
              element={
                <Suspense fallback={<div>Загрузка...</div>}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
