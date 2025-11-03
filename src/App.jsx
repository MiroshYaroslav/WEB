import { Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog/Catalog.jsx";
import ProductPage from "./pages/ProductPage/ProductPage.jsx";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog/:category" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductPage />} />

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
