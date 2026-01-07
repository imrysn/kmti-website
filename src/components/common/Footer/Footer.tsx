import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';
import footerLogo from '../../../assets/footerKMTIlogo.png';
import mapsIcon from '../../../assets/icons/maps-icon.png';
import contactIcon from '../../../assets/icons/contact.png';
import emailIcon from '../../../assets/icons/email-icon.png';

const publicationDate = 'December 1, 2025';

type VisitCounts = {
  total: number;
  today: number;
  yesterday: number;
};

const getSafeStorage = () => {
  try {
    const testKey = '__visit_tracker_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return window.localStorage;
  } catch (e) {
    return {
      _data: {} as Record<string, string>,
      getItem(key: string) {
        return this._data[key] ?? null;
      },
      setItem(key: string, value: string) {
        this._data[key] = String(value);
      },
      removeItem(key: string) {
        delete this._data[key];
      },
    };
  }
};

const getTodayKey = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const pad3 = (value: number) => String(Number(value) || 0).padStart(3, '0');

let hasCountedThisLoad = false;

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [visitCounts, setVisitCounts] = useState<VisitCounts>({
    total: 0,
    today: 0,
    yesterday: 0,
  });

  useEffect(() => {
    const storage = getSafeStorage();

    const totalKey = 'visitTrackerTotal';
    const todayKey = 'visitTrackerToday';
    const yesterdayKey = 'visitTrackerYesterday';
    const dateKey = 'visitTrackerDate';

    const storedTotal = Number(storage.getItem(totalKey)) || 0;
    const storedToday = Number(storage.getItem(todayKey)) || 0;
    const storedYesterday = Number(storage.getItem(yesterdayKey)) || 0;
    const storedDate = storage.getItem(dateKey);

    const todayStr = getTodayKey();

    let total = storedTotal;
    let today = storedToday;
    let yesterday = storedYesterday;

    if (storedDate !== todayStr) {
      yesterday = storedDate !== null ? storedToday : 0;
      today = 0;
      storage.setItem(yesterdayKey, String(yesterday));
      storage.setItem(dateKey, todayStr);
    }

    if (!hasCountedThisLoad) {
      total += 1;
      today += 1;
      storage.setItem(totalKey, String(total));
      storage.setItem(todayKey, String(today));
      hasCountedThisLoad = true;
    }

    setVisitCounts({
      total,
      today,
      yesterday,
    });
  }, []);

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
            <img src={footerLogo} alt="KMTI footer logo" />
          </Link>
          <p className="footer__desc">
            {t('footer.description')}
          </p>
          <div className="footer__socials" aria-hidden>
            <a href="https://www.linkedin.com/company/kusakabe-maeno-tech-inc/" title="LinkedIn" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">in</a>
            <a href="https://www.facebook.com/kmti.com.ph/" title="Facebook" aria-label="Facebook" target="_blank" rel="noopener noreferrer">f</a>
          </div>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <div className="footer__col-title">{t('footer.cols.quick_links')}</div>
            <Link to="/" className="footer__link" onClick={(e) => handleFooterLinkClick('/', e)}>{t('footer.links.home')}</Link>
            <Link to="/services" className="footer__link" onClick={(e) => handleFooterLinkClick('/services', e)}>{t('footer.links.services')}</Link>
            <Link to="/projects" className="footer__link" onClick={(e) => handleFooterLinkClick('/projects', e)}>{t('footer.links.projects')}</Link>
            <Link to="/about" className="footer__link" onClick={(e) => handleFooterLinkClick('/about', e)}>{t('footer.links.about')}</Link>
            <Link to="/contact" className="footer__link" onClick={(e) => handleFooterLinkClick('/contact', e)}>{t('footer.links.contact')}</Link>
            <Link to="/careers" className="footer__link" onClick={(e) => handleFooterLinkClick('/careers', e)}>{t('footer.links.careers')}</Link>
          </div>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <div className="footer__col-title">{t('footer.cols.services')}</div>
            <Link to="/services?service=3d-modeling" className="footer__link" onClick={(e) => handleFooterLinkClick('/services?service=3d-modeling', e)}>{t('footer.service_items.modeling')}</Link>
            <Link to="/services?service=2d-detailing" className="footer__link" onClick={(e) => handleFooterLinkClick('/services?service=2d-detailing', e)}>{t('footer.service_items.detailing')}</Link>
            <Link to="/services?service=parts-inspection" className="footer__link" onClick={(e) => handleFooterLinkClick('/services?service=parts-inspection', e)}>{t('footer.service_items.inspection')}</Link>
            <Link to="/services?service=machine-assembly" className="footer__link" onClick={(e) => handleFooterLinkClick('/services?service=machine-assembly', e)}>{t('footer.service_items.assembly')}</Link>
          </div>
        </div>

        <div className="footer__contact">
          <div className="footer__col-title">{t('footer.cols.contact')}</div>
          <div className="footer__contact-item">
            <img src={mapsIcon} alt="Location" className="footer__contact-icon" />
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
        <div>© {new Date().getFullYear()} {t('footer.bottom.rights')}</div>
        <div id="visit-tracker" style={{ textAlign: 'center' }}>
          {t('footer.bottom.since')} {publicationDate} &nbsp;&nbsp;&nbsp;
          {t('footer.bottom.total_visit')}{' '}
          <span className="visit-counter-digits">{pad3(visitCounts.total)}</span>
          &nbsp;&nbsp;&nbsp;
          {t('footer.bottom.today_visit')}{' '}
          <span className="visit-counter-digits">{pad3(visitCounts.today)}</span>
          &nbsp;&nbsp;&nbsp;
          {t('footer.bottom.yesterday_visit')}{' '}
          <span className="visit-counter-digits">{pad3(visitCounts.yesterday)}</span>
        </div>
        <div className="footer__bottom-links">
          <a className="footer__bottom-link" href="/privacy">{t('footer.links.privacy')}</a>
          <a className="footer__bottom-link" href="/terms">{t('footer.links.terms')}</a>
          <a className="footer__bottom-link" href="/careers">{t('footer.links.careers')}</a>
        </div>


      </div>
    </footer>
  );
};

export default Footer;
