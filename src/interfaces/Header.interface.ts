export interface HeaderProps {
  className?: string;
  onMenuToggle?: () => void;
  showMobileMenuButton?: boolean;
}

export interface UserMenuProps {
  className?: string;
}

export interface UserMenuItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  className?: string;
}
