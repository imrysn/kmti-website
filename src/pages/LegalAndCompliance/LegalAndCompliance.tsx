import { useTranslation } from 'react-i18next';
import SEO from '../../components/common/SEO';
import './LegalAndCompliance.css';

const LegalAndCompliance: React.FC = () => {
  const { t, i18n } = useTranslation();
  const tEn = i18n.getFixedT('en');

  return (
    <div className="legal-page">
      <SEO 
        title={tEn('legal.page_title')} 
        description={tEn('legal.privacy.intro')} 
      />
      <div className="legal-container">
        <h1 className="legal-title">{t('legal.page_title')}</h1>

        <div className="legal-section" id="privacy">
          <h2 className="legal-section-title">{t('legal.privacy.title')}</h2>
          <div className="legal-content">
            <p>{t('legal.privacy.intro')}</p>
            <p>{t('legal.privacy.collection')}</p>
            <p>{t('legal.privacy.usage')}</p>
          </div>
        </div>

        <div className="legal-section" id="terms">
          <h2 className="legal-section-title">{t('legal.terms.title')}</h2>
          <div className="legal-content">
            <p>{t('legal.terms.intro')}</p>
            <p>{t('legal.terms.use_license')}</p>
            <p>{t('legal.terms.disclaimer')}</p>
          </div>
        </div>

        <div className="legal-section" id="compliance">
          <h2 className="legal-section-title">{t('legal.compliance.title')}</h2>
          <div className="legal-content">
            <p>{t('legal.compliance.intro')}</p>
            <p>{t('legal.compliance.certifications')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalAndCompliance;
