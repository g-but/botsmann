export interface ContentItem {
  id: string;
  title: string;
  description: string;
  path: string;
}

export interface NavigationItem {
  label: string;
  path: string;
  children?: NavigationItem[];
}

export interface NavigationData {
  items: NavigationItem[];
}
