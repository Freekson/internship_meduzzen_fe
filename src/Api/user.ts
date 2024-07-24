import { TUser } from "../Store/user/types";
import {
  ChangePasswordParams,
  LoginFormData,
  LoginResponse,
  RegisterFormData,
} from "../Types/api";
import api, { apiWithoutAuth } from "./api";

export const createUser = (formData: RegisterFormData) => {
  return apiWithoutAuth.post("/user", {
    user_email: formData.email,
    user_password: formData.password,
    user_password_repeat: formData.confirmPassword,
    user_firstname: formData.firstName,
    user_lastname: formData.lastName,
  });
};

export const loginUser = (formData: LoginFormData): Promise<LoginResponse> => {
  return apiWithoutAuth
    .post<LoginResponse>("/auth/login", {
      user_email: formData.email,
      user_password: formData.password,
    })
    .then((response) => response.data);
};
export const updateUser = (userId: number, userData: Partial<TUser>) => {
  return api.put(`/user/${userId}/update_info/`, userData);
};

export const updatePassword = (
  userId: number,
  userData: ChangePasswordParams
) => {
  return api.put(`/user/${userId}/update_password/`, userData);
};

export const updateAvatar = (userId: number, avatarData: FormData) => {
  return api.put(`/user/${userId}/update_avatar/`, avatarData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteUser = (userId: number) => {
  return api.delete(`/user/${userId}/`);
};
