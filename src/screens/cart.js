import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalContext } from './components/globalContext';

function Cart() {
  const token = localStorage.getItem('token');
  const [basket, setBasket] = useState(null);
  const { isLogin, setCartNumber } = useContext(GlobalContext);

  const handleAddToCard = (event, dishId) => {
    event.preventDefault();
    if (token) {
      axios
        .post(
          `https://food-delivery.kreosoft.ru/api/basket/dish/${dishId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            getBasket();
          } else {
            console.log('error');
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            window.location.href = window.location.origin + '/login';
          }
        });
    } else {
      window.location.href = window.location.origin + '/login';
    }
  };

  const handleRemoveCard = (event, dishId) => {
    event.preventDefault();
    if (token) {
      axios
        .delete(
          `https://food-delivery.kreosoft.ru/api/basket/dish/${dishId}?increase=true`,
          {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status) {
            getBasket();
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log('user is not loged in');
            window.location.href = window.location.origin + '/login';
          }
          console.error(error);
        });
    } else {
      console.log('user is not loged in');
      window.location.href = window.location.origin + '/login';
    }
  };
  const handleDelete = (event, dishId) => {
    event.preventDefault();
    if (token) {
      axios
        .delete(
          `https://food-delivery.kreosoft.ru/api/basket/dish/${dishId}?increase=false`,
          {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          if (response.status) {
            getBasket();
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            console.log('user is not loged in');
            window.location.href = window.location.origin + '/login';
          }
          console.error(error);
        });
    } else {
      window.location.href = window.location.origin + '/login';
    }
  };

  useEffect(() => {
    getBasket();
  }, [isLogin]); // eslint-disable-line react-hooks/exhaustive-deps
  const getBasket = () => {
    if (token) {
      axios
        .get('https://food-delivery.kreosoft.ru/api/basket', {
          headers: {
            accept: 'text/plain',
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            setCartNumber(response.data.length);
            setBasket(response.data);
          }
        })
        .catch((error) => {
          // Handle the error here
          if (error.response) {
            if (error.response.status === 401) {
              console.log('user is not loged in');
              window.location.href = window.location.origin + '/login';
            }
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
        });
    } else {
      window.location.href = window.location.origin + '/login';
    }
  };
  return (
    <div
      className="container w-100"
      style={{
        maxWidth: '80%',
        padding: 10,
        boxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
        WebkitBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
        MozBoxShadow: '0px 4px 14px 9px rgba(0, 0, 0, 0.07)',
      }}
    >
      <div className="row justify-content-center p-3">
        <div className="col">
          <form id="cart-form">
            <div>
              <h1>Your Cart</h1>
              {basket && basket.length <= 0 && (
                <div className="row mb-3 border p-3 mx-0 align-items-center">
                  <div
                    className="col text-md-start text-center"
                    style={{ fontSize: 20 }}
                  >
                    Your cart is empy go add something
                  </div>
                  <div className="col-md-auto col-sm-12 text-center">
                    <a className="btn btn-success" href="/">
                      Menu
                    </a>
                  </div>
                </div>
              )}
            </div>
            {basket &&
              basket.length > 0 &&
              basket.map((d, index) => {
                return (
                  <div
                    key={index}
                    className="row border flex-sm-row flex-column h-100"
                    style={{ padding: 5 }}
                  >
                    <div className="col-sm-auto d-none d-sm-block">
                      {index + 1}.
                    </div>
                    <div
                      className=" col-lg-2 col-md-3 col-sm-4"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={d.image}
                        alt="Logo"
                        className="w-75 h-90 rounded-pill"
                      />
                    </div>
                    <div
                      className="col-sm-auto mt-2 "
                      style={{ paddingLeft: 30 }}
                    >
                      <h4 className="text-nowrap" style={{ fontSize: 20 }}>
                        {d.name}
                      </h4>
                      <p style={{ fontSize: 13 }}>Price/dish - {d.price} ₽</p>
                    </div>
                    <div
                      className="col my-2  pagination mx-4"
                      style={{ height: 30 }}
                    >
                      <span
                        className="page-link"
                        style={{
                          fontSize: 15,
                          textAlign: 'center',
                          alignSelf: 'center',
                        }}
                        onClick={(e) => {
                          handleRemoveCard(e, d.id);
                        }}
                      >
                        -
                      </span>
                      <span
                        className="page-link"
                        style={{
                          fontSize: 15,
                          textAlign: 'center',
                          alignSelf: 'center',
                        }}
                      >
                        {basket.find((item) => item.id === d.id).amount}
                      </span>
                      <span
                        className="page-link"
                        style={{
                          fontSize: 15,
                          textAlign: 'center',
                          alignSelf: 'center',
                        }}
                        onClick={(e) => {
                          handleAddToCard(e, d.id);
                        }}
                      >
                        +
                      </span>
                    </div>

                    <div
                      className="col d-none d-sm-block"
                      style={{ textAlign: 'right' }}
                    >
                      <button
                        className="btn btn-danger "
                        style={{ fontSize: 15, textAlign: 'center' }}
                        onClick={(e) => handleDelete(e, d.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div
                      className="col d-block d-sm-none"
                      style={{ textAlign: 'center' }}
                    >
                      <button
                        className=" row btn btn-danger w-100"
                        style={{ fontSize: 15, textAlign: 'center' }}
                        onClick={(e) => handleDelete(e, d.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cart;
