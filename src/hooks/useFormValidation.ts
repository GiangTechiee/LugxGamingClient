import { useState } from 'react';
import { validateEmail, validatePassword, validateUsername, validateConfirmPassword } from '@/lib/validation';

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormData {
  email?: string;
  password?: string;
  username?: string;
  confirmPassword?: string;
}

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = (field: string, value: string, formData?: FormData) => {
    let error: string | undefined;

    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'username':
        error = validateUsername(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(formData?.password || '', value);
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return !error;
  };

  const validateForm = (formData: FormData, type: 'login' | 'register'): boolean => {
    const newErrors: FormErrors = {};

    // Common validations
    newErrors.email = validateEmail(formData.email || '');
    newErrors.password = validatePassword(formData.password || '');

    // Register-specific validations
    if (type === 'register') {
      newErrors.username = validateUsername(formData.username ?? '');
      newErrors.confirmPassword = validateConfirmPassword(formData.password || '', formData.confirmPassword || '');
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateField,
    validateForm,
    clearErrors
  };
}