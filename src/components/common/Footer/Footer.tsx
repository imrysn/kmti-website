import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';
import footerLogo from '../../../assets/footerKMTIlogo.png';
import mapsIcon from '../../../assets/icons/maps-icon.png';
import contactIcon from '../../../assets/icons/contact.png';
import emailIcon from '../../../assets/icons/email-icon.png';

const Footer: React.FC = () => {
  const location = useLocation();

  const handleFooterLinkClick = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    const currentPathname = location.pathname;
    const targetPath = path.split('?')[0];
    const isNearBottom = window.scrollY + window.innerHeight >=
                         document.documentElement.scrollHeight - 100;

    if (targetPath === currentPathname && isNearBottom) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const isNearBottom = window.scrollY + window.innerHeight >=
                         document.documentElement.scrollHeight - 100;
    if (location.pathname === '/' && isNearBottom) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo" onClick={handleLogoClick}>
            <img src={footerLogo} alt="KMTI footer logo" />
          </Link>
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
            <Link to="/" className="footer__link" onClick={(e) => handleFooterLinkClick('/', e)}>Home</Link>
            <Link to="/services" className="footer__link" onClick={(e) => handleFooterLinkClick('/services', e)}>Services</Link>
            <Link to="/projects" className="footer__link" onClick={(e) => handleFooterLinkClick('/projects', e)}>Projects</Link>
            <Link to="/about" className="footer__link" onClick={(e) => handleFooterLinkClick('/about', e)}>About Us</Link>
            <Link to="/contact" className="footer__link" onClick={(e) => handleFooterLinkClick('/contact', e)}>Contact Us</Link>
            <Link to="/careers" className="footer__link" onClick={(e) => handleFooterLinkClick('/careers', e)}>Careers</Link>
          </div>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <div className="footer__col-title">SERVICES</div>
            <Link to="/services?service=3d-modeling" className="footer__link" onClick={(e) => handleFooterLinkClick('/services?service=3d-modeling', e)}>3D Modeling</Link>
            <Link to="/services?service=2d-detailing" className="footer__link" onClick={(e) => handleFooterLinkClick('/services?service=2d-detailing', e)}>2D Detailing</Link>
            <Link to="/services?service=parts-inspection" className="footer__link" onClick={(e) => handleFooterLinkClick('/services?service=parts-inspection', e)}>Parts Inspections</Link>
            <Link to="/services?service=machine-assembly" className="footer__link" onClick={(e) => handleFooterLinkClick('/services?service=machine-assembly', e)}>Machine Assembly</Link>
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
