import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';
import { getAssetUrl } from '../../../utils/assets';
import { useVisitCounter } from '../../../hooks/useVisitCounter';
import LazyImage from '../../ui/LazyImage/LazyImage';

const footerLogo = getAssetUrl('logo/footer_KMTI_logo.webp');
const mapsIcon = getAssetUrl('icons/maps-icon.webp');
const contactIcon = getAssetUrl('icons/contact.webp');
const emailIcon = getAssetUrl('icons/email-icon.webp');

const pad3 = (value: number) => String(Number(value) || 0).padStart(3, '0');

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const visitCounts = useVisitCounter();

  const handleFooterLinkClick = (path: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    // If it's a link with query parameters (like /services?service=...), we should let it navigate
    // to allow the page to handle the param change.
    if (path.includes('?')) {
      return;
    }

    const currentPathname = location.pathname;
    const targetPath = path.split('?')[0];

    if (targetPath === currentPathname) {
      const isNearBottom = window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 100;

      if (isNearBottom) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
            <LazyImage src={footerLogo} alt="KMTI footer logo" />
          </Link>
          <p className="footer__desc">
            {t('footer.description')}
          </p>
          <div className="footer__socials" aria-hidden>
            <a href="https://www.linkedin.com/company/kusakabe-maeno-tech-inc/" title="LinkedIn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">in</a>
            <a href="https://www.facebook.com/kmti.com.ph/" title="Facebook" aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>
          </div>
        </div>

        <div className="footer__links-wrapper">
          <div className="footer__links">
            <div className="footer__col">
              <div className="footer__col-title">{t('footer.cols.quick_links')}</div>
              <Link to="/" className="footer__link" onClick={(e) => handleFooterLinkClick('/', e)}>{t('footer.links.home')}</Link>
              <Link to="/about" className="footer__link" onClick={(e) => handleFooterLinkClick('/about', e)}>{t('footer.links.about')}</Link>
              <Link to="/services" className="footer__link" onClick={(e) => handleFooterLinkClick('/services', e)}>{t('footer.links.services')}</Link>
              <Link to="/projects" className="footer__link" onClick={(e) => handleFooterLinkClick('/projects', e)}>{t('footer.links.projects')}</Link>
              <Link to="/careers" className="footer__link" onClick={(e) => handleFooterLinkClick('/careers', e)}>{t('footer.links.careers')}</Link>
              <Link to="/contact" className="footer__link" onClick={(e) => handleFooterLinkClick('/contact', e)}>{t('footer.links.contact')}</Link>

            </div>
          </div>

          <div className="footer__links">
            <div className="footer__col">
              <div className="footer__col-title">{t('footer.cols.services')}</div>
              <Link to="/services/3d-modeling" className="footer__link" onClick={(e) => handleFooterLinkClick('/services/3d-modeling', e)}>{t('footer.service_items.modeling')}</Link>
              <Link to="/services/2d-detailing" className="footer__link" onClick={(e) => handleFooterLinkClick('/services/2d-detailing', e)}>{t('footer.service_items.detailing')}</Link>
              <Link to="/services/parts-inspection" className="footer__link" onClick={(e) => handleFooterLinkClick('/services/parts-inspection', e)}>{t('footer.service_items.inspection')}</Link>
              <Link to="/services/machine-assembly" className="footer__link" onClick={(e) => handleFooterLinkClick('/services/machine-assembly', e)}>{t('footer.service_items.assembly')}</Link>
            </div>
          </div>
        </div>

        <div className="footer__contact">
          <div className="footer__col-title">{t('footer.cols.contact')}</div>
          <div className="footer__contact-item">
            <LazyImage src={mapsIcon} alt="Location" wrapperClassName="footer__contact-icon" />
            <a
              href="https://maps.app.goo.gl/CyS8xB8sLNPaSYoc8"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__contact-link"
            >
              {t('footer.contact_info.address')}
            </a>
          </div>
          <div className="footer__contact-item">
            <LazyImage src={contactIcon} alt="Contact" wrapperClassName="footer__contact-icon" />
            <span>(046) 413-4509</span>
          </div>
          <div className="footer__contact-item">
            <LazyImage src={emailIcon} alt="Email" wrapperClassName="footer__contact-icon" />
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
        <div>
          {t('footer.bottom.version')} | © {new Date().getFullYear()} {t('footer.bottom.rights')}
        </div>
        <div id="visit-tracker" style={{ textAlign: 'center' }}>
          <div className="tracker-date">
            {t('footer.bottom.since')} {t('footer.bottom.publication_date')}
          </div>
          <div className="tracker-stats">
            {t('footer.bottom.total_visit')}{' '}
            <span className="visit-counter-digits">{pad3(visitCounts.total)}</span>
            &nbsp;&nbsp;&nbsp;
            {t('footer.bottom.today_visit')}{' '}
            <span className="visit-counter-digits">{pad3(visitCounts.today)}</span>
            &nbsp;&nbsp;&nbsp;
            {t('footer.bottom.yesterday_visit')}{' '}
            <span className="visit-counter-digits">{pad3(visitCounts.yesterday)}</span>
          </div>
        </div>
        <div className="footer__bottom-links">
          <Link className="footer__bottom-link" to="/legal-and-compliance">{t('footer.links.legal')}</Link>
          <Link className="footer__bottom-link" to="/careers">{t('footer.links.careers')}</Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
