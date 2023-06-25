import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { GlobalContext } from './components/globalContext';
function Orders() {
  const [orders, setOrders] = useState(null);
  const token = localStorage.getItem('token');
  const { isLogin, cartNumber } = useContext(GlobalContext);

  function FromatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;
    return formattedDate; // Output: 12-03-2023
  }
  function FormateDataHrs(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}`;
    return formattedDate;
  }
  function getOrders() {
    if (token) {
      axios
        .get('https://food-delivery.kreosoft.ru/api/order', {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data) {
            let orders = response.data;
            let sortedOrders = orders.sort(
              (a, b) => new Date(b.orderTime) - new Date(a.orderTime)
            );
            setOrders(sortedOrders);
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
  }
  const handleConfirmOrder = (event, id) => {
    event.preventDefault();
    if (token) {
      axios
        .post(
          `https://food-delivery.kreosoft.ru/api/order/${id}/status`,
          {},
          {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          // handle success
          if (response.status === 200) {
            getOrders();
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

  useEffect(() => {
    getOrders();
  }, [isLogin]); // eslint-disable-line react-hooks/exhaustive-deps
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
          <div id="order-form">
            {cartNumber > 0 && (
              <div className="row mb-3 border p-3 mx-0 align-items-center">
                <div
                  className="col text-md-start text-center"
                  style={{ fontSize: 14 }}
                >
                  An order can be created with the items in the cart
                </div>
                <div className="col-md-auto col-sm-12 text-center">
                  <a className="btn btn-success" href="/purchase">
                    Create order
                  </a>
                </div>
              </div>
            )}
            <div className="mb-3">
              <h1>Previus orders</h1>
            </div>
            <form className="m-2">
              {orders &&
                orders.map((d, index) => {
                  return (
                    <div
                      key={index}
                      className="row border"
                      style={{ padding: 5 }}
                    >
                      <div className="col-sm-auto mt-2 ">
                        <a
                          className="text-nowrap"
                          style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: 'black',
                            lineHeight: '3',
                          }}
                          href={'/orders/' + d.id}
                        >
                          Order from {FromatDate(d.orderTime)}
                        </a>
                        <p
                          style={{
                            fontSize: 13,
                            lineHeight: '1',
                            wordSpacing: 0.5,
                          }}
                        >
                          Order Status -{' '}
                          {d.status === 'InProcess' ? 'In Process' : d.status}
                          <br />
                          <br />
                          Delivery Time: {FormateDataHrs(d.deliveryTime)}
                        </p>
                      </div>

                      <div
                        className="col"
                        style={{
                          position: 'relative',
                          textAlign: 'end',
                        }}
                      >
                        {d.status === 'InProcess' && (
                          <button
                            className="col-12 col-sm-auto btn btn btn-outline-success m-sm-3 m-1"
                            style={{
                              fontSize: 13,
                            }}
                            onClick={(e) => handleConfirmOrder(e, d.id)}
                          >
                            Confirm Order
                          </button>
                        )}
                        <p className="col-md-0 col-sm text-start text-sm-end">
                          <span style={{ fontWeight: 'bold' }}>
                            Total order cost:{' '}
                          </span>
                          {d.price} ₽
                        </p>
                      </div>
                    </div>
                  );
                })}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Orders;
