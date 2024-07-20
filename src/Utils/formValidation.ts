// utils/formValidation.ts

import {
  CreateCompanyFormData,
  LoginFormData,
  RegisterFormData,
} from "../Types/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterFormData = (
  formData: RegisterFormData
): { errors: RegisterFormData; isValid: boolean } => {
  const errors: RegisterFormData = {
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  };
  let isValid = true;

  if (!formData.email) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Invalid email format";
    isValid = false;
  }

  if (!formData.password) {
    errors.password = "Password is required";
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
    isValid = false;
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
    isValid = false;
  }

  if (!formData.firstName) {
    errors.firstName = "First name is required";
    isValid = false;
  } else if (formData.firstName.length < 2) {
    errors.firstName = "First name must be at least 2 characters long";
    isValid = false;
  }

  if (!formData.lastName) {
    errors.lastName = "Last name is required";
    isValid = false;
  } else if (formData.lastName.length < 2) {
    errors.lastName = "Last name must be at least 2 characters long";
    isValid = false;
  }

  return { errors: errors, isValid };
};

export const validateLoginFormData = (
  formData: LoginFormData
): { errors: LoginFormData; isValid: boolean } => {
  const errors: LoginFormData = {
    email: "",
    password: "",
  };
  let isValid = true;

  if (!formData.email) {
    errors.email = "Email is required";
    isValid = false;
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Invalid email format";
    isValid = false;
  }

  if (!formData.password) {
    errors.password = "Password is required";
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
    isValid = false;
  }

  return { errors: errors, isValid };
};

export const validateCreateCompanyFormData = (
  formData: CreateCompanyFormData
) => {
  let errors: Partial<CreateCompanyFormData> = {};
  let isValid = true;

  if (!formData.company_name) {
    isValid = false;
    errors.company_name = "Company name is required.";
  }

  return { errors, isValid };
};
