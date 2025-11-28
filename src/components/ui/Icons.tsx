import {
  X,
  Send,
  Edit,
  Trash,
  MoreVertical,
  LogOut,
  User as UserIcon,
  LogIn,
  MessageSquarePlus,
} from "lucide-react";

interface IconProps {
  className?: string;
  size?: number;
}

export const Icons = {
  Close: ({ className = "h-6 w-6", size }: IconProps) => (
    <X className={className} size={size} />
  ),
  Send: ({ className = "h-5 w-5", size }: IconProps) => (
    <Send className={className} size={size} />
  ),
  Edit: ({ className = "h-5 w-5", size }: IconProps) => (
    <Edit className={className} size={size} />
  ),
  Trash: ({ className = "h-5 w-5", size }: IconProps) => (
    <Trash className={className} size={size} />
  ),
  MoreVertical: ({ className = "h-5 w-5", size }: IconProps) => (
    <MoreVertical className={className} size={size} />
  ),
  LogOut: ({ className = "h-5 w-5", size }: IconProps) => (
    <LogOut className={className} size={size} />
  ),
  User: ({ className = "h-5 w-5", size }: IconProps) => (
    <UserIcon className={className} size={size} />
  ),
  LogIn: ({ className = "h-5 w-5", size }: IconProps) => (
    <LogIn className={className} size={size} />
  ),
  MessageSquarePlus: ({ className = "h-5 w-5", size }: IconProps) => (
    <MessageSquarePlus className={className} size={size} />
  ),
};
