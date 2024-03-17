
import { Counter } from './features/counter/Counter';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Home from './pages/Home'
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import ProductDetail from './features/product/components/ProductDetail';
import Protected from './features/auth/Protected';
import {  checkAuthAsync, selectLoggedInUser, selectUserChecked } from './features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchItemsByUserIdAsync } from './features/cart/cartSlice';
import PageNotFound from './pages/404';
import OrderSuccessPage from './pages/OrderSuccessPage';
import UserOrdersPage from './pages/UserOrdersPage';
import NavBar from './features/navbar/Navbar';
import UserProfilePage from './pages/UserProfilePage';
import { fetchLoggedInUserAsync } from './features/user/userSlice';
import Logout from './features/auth/components/Logout';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StripePayment from './features/payment/StripePayment';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Home></Home>
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  {
    path: "/signup",
    element: <SignUpPage/>,
  },
  {
    path: "/cart",
    element: (
      <Protected>
        <CartPage></CartPage>
      </Protected>
    ) ,
  },
  {
    path: "/stripe-checkout",
    element: (
      <Protected>
        <StripePayment/>
      </Protected>
    ) ,
  },
  
  {
    path: "/checkout",
    element: (
      <Protected>
        <Checkout></Checkout>
      </Protected>
    ) ,
  },
  {
    path: "/product-detail/:id",
    element: (
    <Protected>
      <NavBar>
        <ProductDetail></ProductDetail>
        </NavBar>
      </Protected>
    ) ,
    
  },
  {
    path: '/order-success/:id',
    element: (
      <Protected>
     <OrderSuccessPage></OrderSuccessPage>
     </Protected>
    ),
  },
  {
    path: '/my-orders',
    element: (
      <Protected>
         <UserOrdersPage></UserOrdersPage>
      </Protected>
     
    ),
    },
    {
      path: '/profile',
      element: (
        <Protected>
        <UserProfilePage></UserProfilePage>
        </Protected>
     ),
   },
   {
    path: '/logout',
    element: (
      <Logout></Logout>
    ),
    },
    {
      path: '/forgot-password',
      element: (
        <ForgotPasswordPage></ForgotPasswordPage>
      ),
      },
  {
  path: '*',
  element: (
    <PageNotFound></PageNotFound>
  ),
  },

]);


function App() {

  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const userChecked = useSelector(selectUserChecked);


  useEffect(()=>{
    dispatch(checkAuthAsync())
  },[dispatch])

  useEffect(()=>{
    if(user){
      dispatch(fetchItemsByUserIdAsync())
      dispatch(fetchLoggedInUserAsync())
    }
  },[dispatch, user])

  return (
    <div className="App">
   {userChecked && <RouterProvider router={router} />}
    </div>
    
  );
}

export default App;
