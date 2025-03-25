// use-toast.jsx
import { toast } from 'sonner'; // Internal use of Sonner

export function useToast() {
  return {
    toast: ({ title, description, variant = 'default' }) => {
      switch (variant) {
        case 'destructive':
          return toast.error(title, { description });
        case 'success':
          return toast.success(title, { description });
        default:
          return toast(title, { description });
      }
    }
  };
}