export interface ProjectFeature {
  title: string;
  description: string;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  overview: string;
  features: ProjectFeature[];
  details: string;
  image?: string;
  path: string;
}

export interface ProjectPageProps {
  title: string;
  overview: string;
  features: ProjectFeature[];
  details: string;
  image?: string;
}
