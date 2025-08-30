import * as yup from "yup";
import { validationRules } from "../lib/validations";

export const resetPasswordSchema = yup.object({
  email: validationRules.email,
});

export const updatePasswordSchema = yup.object({
  newPassword: validationRules.password,
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "Both the passwords do not match"),
});
