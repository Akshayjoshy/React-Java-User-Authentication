import * as yup from 'yup';
import { validationRules } from '../lib/validations';

export const loginPageSchema = yup.object({
  email: validationRules.email,
  password: validationRules.password,
});