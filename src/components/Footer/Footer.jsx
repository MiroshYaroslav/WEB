import { useState } from "react";
import { HashLink } from "react-router-hash-link";
import ContactModal from "../ContactModal/ContactModal.jsx";
import "./Footer.css";

const scrollWithOffset = (el) => {
  const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
  const yOffset = -110;
  window.scrollTo({ top: yCoordinate + yOffset, behavior: "smooth" });
};

const Footer = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  return (
    <footer className="footer">
      <div className="container">
        <div>
          © {new Date().getFullYear()} BMW Official. All rights reserved.
        </div>
        <div className="footer-links">
          <HashLink smooth to="#about" scroll={(el) => scrollWithOffset(el)}>
            About Us
          </HashLink>
          <HashLink
            smooth
            to="#contact"
            scroll={(el) => scrollWithOffset(el)}
            onClick={(e) => {
              e.preventDefault();
              setIsContactOpen(true);
            }}
          >
            Contact
          </HashLink>
          <HashLink smooth to="#privacy" scroll={(el) => scrollWithOffset(el)}>
            Privacy Policy
          </HashLink>
        </div>
      </div>
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </footer>
  );
};

export default Footer;
