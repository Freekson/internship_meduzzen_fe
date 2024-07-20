import { TUser } from "../Store/user/types";
import {
  ChangePasswordParams,
  LoginFormData,
  LoginResponse,
  RegisterFormData,
} from "../Types/api";
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

export const updateUser = (
  userId: number,
  userData: Partial<TUser>,
  token: string
) => {
  return api.put(`/user/${userId}/update_info/`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updatePassword = (
  userId: number,
  userData: ChangePasswordParams,
  token: string
) => {
  return api.put(`/user/${userId}/update_password/`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateAvatar = (
  userId: number,
  avatarData: FormData,
  token: string
) => {
  return api.put(`/user/${userId}/update_avatar/`, avatarData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteUser = (userId: number, token: string) => {
  return api.delete(`/user/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
