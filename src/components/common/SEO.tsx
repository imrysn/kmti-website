import React, { useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url 
}) => {
  // Brand name is strictly English for SEO
  const siteTitle = 'Kusakabe & Maeno Tech., Inc.';
  
  const defaultDescription = 'Precision Manufacturing and Innovative Solutions.';
  const defaultKeywords = 'KMTI, Kusakabe & Maeno Tech, manufacturing, 3D modeling, engineering, precision';
  
  const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  
  const location = useLocation();

  // Robust fallback to ensure the title resets even if react-helmet-async 
  // misses a transition update on the Home page.
  useLayoutEffect(() => {
    if (!title) {
      document.title = siteTitle;
    }
  }, [title]);
  
  return (
    <Helmet key={location.pathname}>
      {/* Standard metadata tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
};

export default SEO;
