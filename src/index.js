import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NavBar from './screens/components/NavBar';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap Bundle JS
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

import {
  ErrorPage,
  LoginScreen,
  Menu,
  MenuId,
  OrderId,
  Orders, 
  Profile,
  Purchase,
  Register,
  Cart,
} from './screens';
import { GlobalContext } from './screens/components/globalContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Menu />,
  
  },
  {
    path: '/login',
    element: <LoginScreen />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/profile',
    element: <Profile />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/item/:id',
    element: <MenuId />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/cart',
    element: <Cart />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/orders',
    element: <Orders />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/orders/:id',
    element: <OrderId />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/purchase',
    element: <Purchase />,
    errorElement: <ErrorPage />,
  },
]);

function Root() {
  const [isLogin, setIsLogin] = useState(false);
  const [cartNumber, setCartNumber] = useState(0);

  return (
    <GlobalContext.Provider
      value={{ isLogin, setIsLogin, cartNumber, setCartNumber }}
    >
      <React.StrictMode>
        <NavBar />
        <RouterProvider router={router} />
      </React.StrictMode>
    </GlobalContext.Provider>
  ); 
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
