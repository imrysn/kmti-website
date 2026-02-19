import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Sitemap.css';
import type { SitemapPageProps, SitemapSection } from './Sitemap.types';

const Sitemap: React.FC<SitemapPageProps> = () => {
  const { t } = useTranslation();

  const sitemapSections: SitemapSection[] = [
    {
      title: t('sitemap.sections.main_pages'),
      links: [
        {
          path: '/',
          label: t('nav.home'),
          description: t('sitemap.descriptions.home')
        },
        {
          path: '/about',
          label: t('nav.about'),
          description: t('sitemap.descriptions.about')
        },
        {
          path: '/contact',
          label: t('nav.contact'),
          description: t('sitemap.descriptions.contact')
        }
      ]
    },
    {
      title: t('sitemap.sections.services'),
      links: [
        {
          path: '/services',
          label: t('nav.services'),
          description: t('sitemap.descriptions.services')
        },
        {
          path: '/services/3d-modeling',
          label: t('home.services.items.3d.title'),
          description: t('home.services.items.3d.desc')
        },
        {
          path: '/services/2d-detailing',
          label: t('home.services.items.2d.title'),
          description: t('home.services.items.2d.desc')
        },
        {
          path: '/services/parts-inspection',
          label: t('home.services.items.inspection.title'),
          description: t('home.services.items.inspection.desc')
        },
        {
          path: '/services/machine-assembly',
          label: t('home.services.items.assembly.title'),
          description: t('home.services.items.assembly.desc')
        }
      ]
    },
    {
      title: t('sitemap.sections.projects'),
      links: [
        {
          path: '/projects',
          label: t('nav.projects'),
          description: t('sitemap.descriptions.projects')
        }
      ]
    },
    {
      title: t('sitemap.sections.company'),
      links: [
        {
          path: '/careers',
          label: t('nav.careers'),
          description: t('sitemap.descriptions.careers')
        },
        {
          path: '/legal-and-compliance',
          label: t('sitemap.legal_compliance'),
          description: t('sitemap.descriptions.legal')
        }
      ]
    }
  ];

  return (
    <div className="sitemap-page">
      <section className="hero-section">
        <div className="sitemap-hero-container">
          <h1 className="sitemap-title">{t('sitemap.title')}</h1>
          <p className="sitemap-subtitle">{t('sitemap.subtitle')}</p>
        </div>
      </section>

      <div className="sitemap-content">
        {sitemapSections.map((section, index) => (
          <div key={index} className="sitemap-section" data-aos="fade-up">
            <h2 className="sitemap-section-title">{section.title}</h2>
            <div className="sitemap-links-grid">
              {section.links.map((link, linkIndex) => (
                <Link
                  key={linkIndex}
                  to={link.path}
                  className="sitemap-link-card"
                >
                  <div className="sitemap-link-title">
                    {link.label}
                    <span className="sitemap-link-arrow">→</span>
                  </div>
                  {link.description && (
                    <p className="sitemap-link-description">{link.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sitemap;
