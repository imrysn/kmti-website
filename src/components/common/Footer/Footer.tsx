import React from "react";
import "./Footer.css";
import footerLogo from "../../../assets/footerKMTIlogo.png";
import mapsIcon from "../../../assets/icons/maps-icon.png";
import contactIcon from '../../../assets/icons/contact.png';
import emailIcon from '../../../assets/icons/email-icon.png';

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
            <a href="https://www.linkedin.com/company/kusakabe-maeno-tech-inc/" title="LinkedIn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">in</a>
            <a href="https://www.facebook.com/kmti.com.ph/" title="Facebook" aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>
            <a href="https://line.me/ti/p/~emji000" title="LINE" aria-label="LINE" target="_blank" rel="noopener noreferrer">LINE</a>
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
            <img src={mapsIcon} alt="Location" className="footer__contact-icon" />
            <a
              href="https://maps.app.goo.gl/CyS8xB8sLNPaSYoc8"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__contact-link"
            >
              Vital Industrial Prop. Inc. Bldg. B. Unit 2-B. First Cavite Industrial Estate
              Langkaan 1, Dasmariñas City, Cavite 4126 Philiippines
            </a>
          </div>
          <div className="footer__contact-item">
            <img src={contactIcon} alt="Contact" className="footer__contact-icon" />
            <span>(046) 413-4509</span>
          </div>
          <div className="footer__contact-item">
            <img src={emailIcon} alt="Email" className="footer__contact-icon" />
            <a
              href="https://mail.google.com/mail/?view=cm&to=info@kmti.com.ph&su=Inquiry&body=Hello%20KMTI%20Team,%0A%0AI%20would%20like%20to%20inquire%20about%20your%20services.%0A%0AThank%20you!"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__contact-link"
            >
              info@kmti.com.ph
            </a>
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
