import React from 'react';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export interface DropdownProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  className?: string;
  position?: 'left' | 'right';
  width?: string;
}
