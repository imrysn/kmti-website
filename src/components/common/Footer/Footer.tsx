import React from "react";
import "./Footer.css";
import footerLogo from "../../../assets/footerKMTIlogo.png";

const Footer: React.FC = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <div className="footer__logo">
            <img src={footerLogo} alt="KMTI footer logo" />
          </div>
          <p className="footer__desc">
            Leading innovation in 3D modeling, 2D detailing, parts inspections <br />and  machine assembly design with precision and purpose.
          </p>
          <div className="footer__socials" aria-hidden>
            <a href="#" title="LinkedIn" aria-label="LinkedIn">in</a>
            <a href="#" title="Facebook" aria-label="Facebook">f</a>
            <a href="#" title="LINE" aria-label="LINE">LINE</a>
          </div>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <div className="footer__col-title">QUICK LINKS</div>
            <a className="footer__link" href="/">Home</a>
            <a className="footer__link" href="/services">Services</a>
            <a className="footer__link" href="/projects">Projects</a>
            <a className="footer__link" href="/about">About Us</a>
            <a className="footer__link" href="/contact">Contact Us</a>
            <a className="footer__link" href="/careers">Careers</a>
          </div>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <div className="footer__col-title">SERVICES</div>
            <a className="footer__link" href="/services#3d">3D Modeling</a>
            <a className="footer__link" href="/services#2d">2D Detailing</a>
            <a className="footer__link" href="/services#inspections">Parts Inspections</a>
            <a className="footer__link" href="/services#assembly">Machine Assembly</a>
          </div>
        </div>

        <div className="footer__contact">
          <div className="footer__col-title">CONTACT US</div>
          <div className="footer__contact-item">
            <span className="footer__contact-icon">📍</span>
            <span>
              Vital Industrial Prop., Inc. Bldg. B Unit 2B, First Cavite Industrial Estate
              Langkaan, Dasmariñas, Cavite
            </span>
          </div>
          <div className="footer__contact-item">
            <span className="footer__contact-icon">📞</span>
            <span>(046) 413-4509</span>
          </div>
          <div className="footer__contact-item">
            <span className="footer__contact-icon">✉️</span>
            <span>info@kmti.com.ph</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div>© {new Date().getFullYear()} Kusakabe & Maeno Tech, Inc. All rights reserved.</div>
        <div className="footer__bottom-links">
          <a className="footer__bottom-link" href="/privacy">Privacy Policy</a>
          <a className="footer__bottom-link" href="/terms">Terms of Services</a>
          <a className="footer__bottom-link" href="/careers">Careers</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
