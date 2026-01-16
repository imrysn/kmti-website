export type SitemapPageProps = Record<string, never>;

export interface SitemapSection {
  title: string;
  links: SitemapLink[];
}

export interface SitemapLink {
  path: string;
  label: string;
  description?: string;
}
