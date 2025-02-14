export interface NavigationItem {
  label: string;
  path: string;
  children?: NavigationItem[];
}

export interface NavigationData {
  items: NavigationItem[];
}
