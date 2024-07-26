import { CompaniesResult, CompanyDetails } from "../Store/company/types";
import { TUser, UsersResult } from "../Store/user/types";
import { IFullQuiz, TCompany } from "./types";

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

export interface CompanyQuizzesResponse {
  quiz_id: number;
  quiz_name: string;
  quiz_title: string;
  quiz_description: string;
}

export interface QuizResponse {
  status_code: number;
  detail: string;
  result: IFullQuiz;
}

export interface TakeQuizResponse {
  status_code: number;
  detail: string;
  result: {
    result_id: number;
    result_score: number;
  };
}

export interface IQuizData {
  [question_id: string]: string;
}

export type TUserRating = {
  rating: number;
  user_id: number;
};

export type UserGlobalAnalyticResponse = {
  current_rating: number;
  average_rating: number;
  pass_at: string;
};

export interface Rating {
  current_rating: number;
  average_rating: number;
  pass_at: string;
}

export interface UserQuizDataResponse {
  rating: Rating[];
  user_id: number;
}

export type UserLastPassResponse = {
  quiz_id: number;
  last_quiz_pass_at: string;
};

export type CompanyLastPassResponse = {
  user_id: number;
  quizzes: UserLastPassResponse[];
};

export type CompanyUserStatResponse = {
  rating: Rating[];
  quiz_id: number;
};
