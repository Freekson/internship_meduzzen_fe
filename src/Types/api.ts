import { CompaniesResult, CompanyDetails } from "../Store/company/types";
import { TUser, UsersResult } from "../Store/user/types";
import { TCompany } from "./types";

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  status_code: number;
  detail: string;
  result: LoginResult;
}

interface LoginResult {
  access_token: string;
  token_type: string;
}

export interface ChangePasswordParams {
  user_password: string;
  user_password_repeat: string;
}

export interface CreateCompanyFormData {
  company_name: string;
  is_visible: boolean;
}

export type UserFullResponse = {
  status_code: number;
  detail: string;
  result: TUser;
};

export type CompaniesResponse = {
  status_code: number;
  detail: string;
  result: {
    companies: TCompany[];
  };
};

export type UsersListResponse = {
  status_code: number;
  detail: string;
  result: UsersResult;
};

export type CompaniesAllResponse = {
  result: CompaniesResult;
};

export type CompanyResponse = {
  status_code: number;
  detail: string;
  result: CompanyDetails;
};

export interface UserResponse {
  user_id: number;
  user_email: string;
  user_firstname: string;
  user_lastname: string;
  user_avatar: string;
  action_id: number;
  action: "owner" | "member" | "admin";
}

export type ActionResponse = {
  status_code: number;
  detail: string;
  result: {
    action_id: number;
  };
};

export interface CompanyQuizzesResponse {
  quiz_id: number;
  quiz_name: string;
  quiz_title: string;
  quiz_description: string;
}
