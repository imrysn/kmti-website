import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NotFound.css';

const NotFound: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found-page">
      <div className="not-found-code">404</div>
      <h1 className="not-found-title">{t('not_found.title')}</h1>
      <p className="not-found-text">{t('not_found.message')}</p>
      <Link to="/" className="not-found-btn">
        {t('not_found.back_home')}
      </Link>
    </div>
  );
};

export default NotFound;
