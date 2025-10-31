import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Hero from "./components/Hero/Hero.jsx";
import AboutBMW from "./components/About/AboutBMW.jsx";
import FeaturedProducts from "./components/ProductCard/FeaturedProducts.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "./styles/responsive.css";

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <AboutBMW />
                <FeaturedProducts />
              </>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
