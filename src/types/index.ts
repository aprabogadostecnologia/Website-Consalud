export interface SceneProps {
  className?: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SectionProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}
