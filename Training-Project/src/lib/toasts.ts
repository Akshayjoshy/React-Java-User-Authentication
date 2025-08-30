import { toast, type ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toast styles configuration
const toastStyles: Record<string, ToastOptions> = {
  success: {
    position: 'top-center',
    autoClose: 5000,
  },
  error: {
    position: 'top-center',
    autoClose: 5000,
  },
  info: {
    position: 'top-center',
    autoClose: 5000,
  },
  warning: {
    position: 'top-center',
    autoClose: 5000,
  },
};

// Toast function using react-toastify
export const showToast = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'success',
  duration: number = 5000,
) => {
  toast[type](message, { ...toastStyles[type], autoClose: duration });
};
