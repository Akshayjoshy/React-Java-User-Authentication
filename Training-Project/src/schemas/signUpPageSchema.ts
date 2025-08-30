import * as yup from 'yup';
import { validationRules } from '../lib/validations';

export const signUpPageSchema = yup.object({
  name: validationRules.requiredString,
  email: validationRules.email,
  password: validationRules.password,
  confirmPassword: yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref('password')], 'Both the passwords do not match'),
});