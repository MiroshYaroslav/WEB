import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import NavMenu from "../NavMenu/NavMenu";
import "./Header.css";

const Header = () => {
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsSpinning(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const handleHover = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 700);
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <div
          className={`logo ${isSpinning ? "spin-once" : ""}`}
          onMouseEnter={handleHover}
        >
          <Link to="/">
            <img src={logo} alt="BMW Logo" />
          </Link>
        </div>

        <NavMenu />
      </div>
    </header>
  );
};

export default Header;
