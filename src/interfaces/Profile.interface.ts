export interface ProfileFormData {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void;
  loading?: boolean;
  className?: string;
  initialData?: Partial<ProfileFormData>;
}

export interface CompanyProfileFormData {
  name: string;
  email: string;
  slug?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export interface CompanyProfileFormProps {
  onSubmit: (data: CompanyProfileFormData) => void;
  loading?: boolean;
  className?: string;
  initialData?: Partial<CompanyProfileFormData>;
}

export interface ProfileSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}
