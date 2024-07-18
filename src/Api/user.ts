import { LoginFormData, LoginResponse, RegisterFormData } from "../Types/api";
import api from "./api";

export const createUser = (formData: RegisterFormData) => {
  return api.post("/user", {
    user_email: formData.email,
    user_password: formData.password,
    user_password_repeat: formData.confirmPassword,
    user_firstname: formData.firstName,
    user_lastname: formData.lastName,
  });
};

export const loginUser = (formData: LoginFormData): Promise<LoginResponse> => {
  return api
    .post<LoginResponse>("/auth/login", {
      user_email: formData.email,
      user_password: formData.password,
    })
    .then((response) => response.data);
};
