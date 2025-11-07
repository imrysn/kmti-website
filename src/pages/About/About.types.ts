export interface AboutPageProps {}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image?: string;
}

export interface Milestone {
  year: string;
  title: string;
  description: string;
}