import * as yup from "yup";

export const signupSchema = yup.object().shape({

  name: yup
    .string()
    .required("First Name is mandatory")
    .matches(/^[A-Za-z. ]+$/, "First Name should contain only alphabets"),

  lastName: yup
    .string()
    .required("Last Name is mandatory")
    .matches(/^[A-Za-z. ]+$/, "Last Name should contain only alphabets"),

  contactNo: yup
    .string()
    .required("Phone number is mandatory")
    .matches(/^\+?\d{6,15}$/, "Phone Number should be between 6 to 15 digits"),

  email: yup
    .string()
    .required("Email address is mandatory")
    // .email("Enter a valid email address"),
    .matches( /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,"Enter a valid email address"),

  billAddress: yup.object().shape({

    addressLine1: yup
      .string()
      .required("Address Line 1 is mandatory")
      .max(49, "Address Line 1 must be less than 50 characters"),
    
    addressLine2: yup
    .string()
    .nullable()
    .notRequired()
    .max(49, "Address Line 2 must be 50 characters or less"),

    city: yup
      .string()
      .required("City is mandatory")
      .max(19, "City name must be less than 20 characters"),

    state: yup
      .string()
      .required("State is mandatory"),

    zipCode: yup
      .string()
      .required("Postal Code is mandatory")
      .matches(
        /^[A-Za-z0-9- ]+$/,
        "Postal Code should contain only alphabets,number,space or hyphen (-)  "
      ),

    countryId: yup
      .number()
      .required("Country is mandatory"),

  }),

  findUsId: yup
    .number()
    .required("Where did you find us is mandatory"),

  customerTypeId: yup
    .number()
    .required("Customer Type is mandatory"),

  findUsOtherText: yup
  .string()
  .when("findUsId", {
    is: (value: number) => value === 903,
    then: (schema) =>
      schema
        .required("Referral/Others field is mandatory")
        .trim()
        .min(1, "Referral/Others field is mandatory"),
    otherwise: (schema) =>
      schema.notRequired(),
  }),


  companyName: yup
  .string()
  .when("customerTypeId", {
    is: (value: number) => value === 591,
    then: (schema) =>
      schema
        .required("Company Name is mandatory")
        .trim()
        .min(1, "Company Name is mandatory"),
    otherwise: (schema) =>
      schema.notRequired(),
  }),


  industryTypeId: yup
  .number()
  .when("customerTypeId", {
    is: (value: number) => value === 591,
    then: (schema) =>
      schema.required("Industry Type is mandatory"),
    otherwise: (schema) =>
      schema.notRequired(),
  }),
  
  captcha: yup
    .boolean()
    .oneOf([true], "Please verify captcha"),

});
