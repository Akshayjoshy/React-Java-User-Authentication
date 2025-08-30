import * as yup from "yup";

export const validationRules = {
  email: yup
    .string()
    .email("Enter Email")
    .max(70, "Email must be at most 70 characters")
    .required("Email is required")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, {
      message: "Email is required",
    }),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .max(10, "Password must be at most 10 characters long.")
    .required("Password is required"),
  phonenumber: yup
    .string()
    .required("Phone_Number_Is_Required")
    .matches(/^[0-9]{10,15}$/, {
      message: "Please_Enter_Valid_Phone_Number",
      excludeEmptyString: true,
    }),
  requiredString: yup.string().required("Field is required."),
  boolean: yup.boolean(),
  positiveNumber: yup
    .number()
    .required("Field is required.")
    .positive("The_Number_Must_Be_Greater_Than_0")
    .integer("Should_Be_An_Integer_Value")
    .test(
      "Is_Positive",
      "The_Number_Must_Be_Greater_Than_0",
      (value) => value > 0
    )
    .typeError("Field is required."),
  requiredPositiveNumber: yup
    .number()
    .required("Field is required.")
    .positive("The_Number_Must_Be_Greater_Than_0")
    .test(
      "Is_Positive",
      "The_Number_Must_Be_Greater_Than_0",
      (value) => value > 0
    )
    .typeError("Field_Required"),
  optionalString: yup
    .string()
    .max(250, "This_Field_Must_Be_At_Most_250_Characters"),
  arrayOfStrings: yup.array().of(yup.string()),
  requiredArrayOfStrings: yup
    .array()
    .of(yup.string())
    .min(1, "Select_Atleast_One_Option")
    .required("Field_Required"),
  arrayOfSelectValues: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string(),
        value: yup.string(),
      })
    )
    .min(1, "You_Have_To_Select_At_Least_One_Option")
    .required("Field_Required"),
  optionalPositiveNumber: yup
    .number()
    .positive("The_Number_Must_Be_Greater_Than_0")
    .integer("Should_Be_An_Integer_Value")
    .test(
      "Is_Positive",
      "The_Number_Must_Be_Greater_Than_0",
      (value) => !!value && value >= 0
    ),
  requiredNumber: yup
    .number()
    .required("Field_Required")
    .typeError("Field_Required"),
};
