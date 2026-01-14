export interface SitemapPageProps {
  // Empty for now, can be extended later
}

export interface SitemapSection {
  title: string;
  links: SitemapLink[];
}

export interface SitemapLink {
  path: string;
  label: string;
  description?: string;
}
