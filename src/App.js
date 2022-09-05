import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './page/user/Home';
import Register from './page/auth/Register';
import store from './redux/store';
import Page from './page/user/Page';
import { Provider } from 'react-redux'
import { SnackbarProvider } from 'notistack';
import { useEffect, useState } from 'react';
import AdminPage from './page/admin/AdminPage';
import ViewCustomer from './page/admin/ViewCustomer';
import AddProduct from './page/admin/AddProduct';
import AddCustomer from './page/admin/AddCustomer';
import ProductsView from './page/admin/ProductsView';
import ViewBrand from './page/admin/ViewBrand';
import ViewCategory from './page/admin/ViewCategory';
import OrdersView from './page/admin/OrdersView';
import PlaceOrder from './page/admin/PlaceOrder';
import VerifyEmail from './page/auth/VerifyEmail';

function App() {

  const [role, setRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      setRole(JSON.parse(sessionStorage.getItem("token")).role)
      setLoggedIn(sessionStorage.getItem("token") !== null && sessionStorage.getItem("token") !== undefined)
    } else {
      if (window.location.href !== "http://127.0.0.1:3000/" && window.location.href !== "http://127.0.0.1:3000/register" && !window.location.href.includes("http://127.0.0.1:3000/verify/mail"))
        window.location.replace("http://127.0.0.1:3000")
    }
    // eslint-disable-next-line
  }, [sessionStorage.getItem("token")])

  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={1} anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}>
        <BrowserRouter>
          <Routes>
            {
              (role === "" || role === "CUSTOMER") &&
              <>
                <Route element={<Home />} index />
                <Route path="verify/mail/:token" element={<VerifyEmail />} />
              </>
            }
            {
              role === "CUSTOMER" || role === "" ?
                <Route element={<Page />} path="/" >
                  {
                    !loggedIn &&
                    <Route element={<Register />} path="/register" />
                  }
                </Route>
                :
                <Route path="/admin" element={<AdminPage />} >
                  <Route path="add">
                    <Route path="product" element={<AddProduct type="Add" />} />
                    <Route path="order" element={<PlaceOrder type="Place" />} />
                    <Route path="customer" element={<AddCustomer type="Add" />} />
                  </Route>
                  <Route path="edit">
                    <Route path="customer/:customerId" element={<AddCustomer type="Update" edit={true} />} />
                    <Route path="order/:orderId" element={<PlaceOrder type="Update" edit={true} />} />
                    <Route path="product/:productId" element={<AddProduct type="Update" edit={true} />} />
                  </Route>
                  <Route path="orders" element={<OrdersView />} />
                  <Route path="customers" element={<ViewCustomer />} />
                  <Route path="products" element={<ProductsView />} />
                  <Route path="brands" element={<ViewBrand />} />
                  <Route path="category" element={<ViewCategory />} />
                </Route>
            }
            {
              role && role !== "" &&
              <Route path="*" element={role === "CUSTOMER" || role === "" ? <Navigate to="/" /> : <Navigate to="/admin" />} />
            }
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </Provider>
  );
}

export default App;
