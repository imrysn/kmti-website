export interface CareersPageProps {}

export interface JobPosition {
  id: number;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary?: string;
}

export interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: string;
}