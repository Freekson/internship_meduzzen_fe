import { TUser, UsersResult } from "../Store/user/types";
import {
  ChangePasswordParams,
  CompaniesResponse,
  LoginFormData,
  LoginResponse,
  RegisterFormData,
  UserResponse,
  UsersListResponse,
} from "../Types/api";
import { TCompany } from "../Types/types";
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

export const fetchUserFromApi = async (): Promise<TUser> => {
  const { data } = await api.get<UserResponse>(`/auth/me/`);
  return data.result;
};

export const fetchUsersListFromApi = async (
  page: number,
  page_size: number
): Promise<UsersResult> => {
  const { data } = await api.get<UsersListResponse>(`/users/`, {
    params: { page, page_size },
  });
  return data.result;
};

export const fetchUserByIdFromApi = async (user_id: number): Promise<TUser> => {
  const { data } = await api.get<UserResponse>(`/user/${user_id}/`);
  return data.result;
};

export const fetchCompaniesFromApi = async (
  user_id: number
): Promise<TCompany[]> => {
  const { data } = await api.get<CompaniesResponse>(
    `/user/${user_id}/companies_list/`
  );
  return data.result.companies;
};
