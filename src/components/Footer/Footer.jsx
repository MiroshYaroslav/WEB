import { HashLink } from "react-router-hash-link";
import "./Footer.css";

const scrollWithOffset = (el) => {
  const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
  const yOffset = -110;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: "smooth" });
};

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div>
        © {new Date().getFullYear()} BMW Official. All rights reserved.
      </div>
      <div className="footer-links">
        <HashLink smooth to="#about" scroll={(el) => scrollWithOffset(el)}>
          About Us
        </HashLink>
        <HashLink smooth to="#contact" scroll={(el) => scrollWithOffset(el)}>
          Contact
        </HashLink>
        <HashLink smooth to="#privacy" scroll={(el) => scrollWithOffset(el)}>
          Privacy Policy
        </HashLink>
      </div>
    </div>
  </footer>
);

export default Footer;
