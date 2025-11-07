export interface ProjectsPageProps {}

export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image?: string;
  link?: string;
}