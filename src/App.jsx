import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadFavorites } from "./redux/actions";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog/Catalog.jsx";
import ProductPage from "./pages/ProductPage/ProductPage.jsx";
import Favorites from "./pages/Favorites/Favorites.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import Success from "./pages/Success/Success.jsx";
import Orders from "./pages/Orders/Orders.jsx";

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
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog/:category" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/orders" element={<Orders />} />

          <Route
            path="*"
            element={
              <h2 style={{ textAlign: "center", margin: "4rem" }}>
                Page not found
              </h2>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
