// Toggle component interface
export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "warning" | "error";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}
