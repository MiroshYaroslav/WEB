import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadFavorites } from "./redux/actions";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog/Catalog.jsx";
import ProductPage from "./pages/ProductPage/ProductPage.jsx";
import Footer from "./components/Footer/Footer";
import Favorites from "./pages/Favorites/Favorites.jsx";
import Cart from "./pages/Cart/Cart.jsx";

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
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog/:category" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="*"
            element={
              <h2 style={{ textAlign: "center", margin: "2rem" }}>
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
