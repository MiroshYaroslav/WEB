import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadFavorites } from "./redux/actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import PublicRoute from "./components/Routes/PublicRoute";

import Loader from "./components/Loader/Loader.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Catalog = lazy(() => import("./pages/Catalog/Catalog.jsx"));
const ProductPage = lazy(() => import("./pages/ProductPage/ProductPage.jsx"));
const Favorites = lazy(() => import("./pages/Favorites/Favorites.jsx"));
const Cart = lazy(() => import("./pages/Cart/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout.jsx"));
const Success = lazy(() => import("./pages/Success/Success.jsx"));
const Orders = lazy(() => import("./pages/Orders/Orders.jsx"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage.jsx"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage.jsx"));

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.auth.currentUser);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(loadFavorites(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  return (
    <div className="app">
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />

      <Header />

      <main className="main-content">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/catalog/:category" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/orders" element={<Orders />} />
            </Route>

            <Route
              path="*"
              element={
                <Navigate to="/" replace />
              }
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
