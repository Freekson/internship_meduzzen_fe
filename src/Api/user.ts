import { TUser, UsersResult } from "../Store/user/types";
import {
  ChangePasswordParams,
  CompaniesResponse,
  LoginFormData,
  LoginResponse,
  NotificationResponse,
  RegisterFormData,
  UserFullResponse,
  UserGlobalAnalyticResponse,
  UserLastPassResponse,
  UsersListResponse,
} from "../Types/api";
import { TCompany } from "../Types/types";
import api, { apiWithoutAuth } from "./api";

export const createUser = (formData: RegisterFormData): Promise<void> => {
  return apiWithoutAuth.post("/user", {
    user_email: formData.email,
    user_password: formData.password,
    user_password_repeat: formData.confirmPassword,
    user_firstname: formData.firstName,
    user_lastname: formData.lastName,
  });
};

export const loginUser = async (
  formData: LoginFormData
): Promise<LoginResponse> => {
  return apiWithoutAuth
    .post<LoginResponse>("/auth/login", {
      user_email: formData.email,
      user_password: formData.password,
    })
    .then((response) => response.data);
};

export const updateUser = (
  userId: number,
  userData: Partial<TUser>
): Promise<void> => {
  return api.put(`/user/${userId}/update_info/`, userData);
};

export const updatePassword = (
  userId: number,
  userData: ChangePasswordParams
): Promise<void> => {
  return api.put(`/user/${userId}/update_password/`, userData);
};

export const updateAvatar = (
  userId: number,
  avatarData: FormData
): Promise<void> => {
  return api.put(`/user/${userId}/update_avatar/`, avatarData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteUser = (userId: number): Promise<void> => {
  return api.delete(`/user/${userId}/`);
};

export const getUserInvitation = async (
  userId: number
): Promise<TCompany[]> => {
  return api
    .get(`/user/${userId}/invites_list/`)
    .then((res) => res.data.result.companies);
};

export const getUserRequests = async (userId: number): Promise<TCompany[]> => {
  return api
    .get(`/user/${userId}/requests_list`)
    .then((res) => res.data.result.companies);
};

export const getUserGlobalRating = async (userId: number): Promise<number> => {
  return api
    .get(`/user/${userId}/global_rating/`)
    .then((res) => res.data.result.rating);
};

export const getUserGlobalAnalytic = async (
  userId: number
): Promise<UserGlobalAnalyticResponse[]> => {
  return api
    .get(`/user/${userId}/global_rating_analytic/`)
    .then((res) => res.data.result.rating);
};

export const getUserLastPass = async (
  userId: number
): Promise<UserLastPassResponse[]> => {
  return api
    .get(`/user/${userId}/quizzes_last_pass/`)
    .then((res) => res.data.result.quizzes);
};

export const getUserNotifications = async (
  userId: number
): Promise<NotificationResponse[]> => {
  return api
    .get(`/user/${userId}/notifications_list/`)
    .then((res) => res.data.result.notifications);
};

export const readNotification = async (
  userId: number,
  notificationId: number
): Promise<void> => {
  return api.get(
    `/user/${userId}/mark_notification_as_read/${notificationId}/`
  );
};

export const fetchUserFromApi = async (): Promise<TUser> => {
  const { data } = await api.get<UserFullResponse>(`/auth/me/`);
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
  const { data } = await api.get<UserFullResponse>(`/user/${user_id}/`);
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
